import FW from './fw/fw';
import ENV from './fw/env';
import HELPERS from './utils/helpers';
import PING from './tracking/ping';
import LINEAR from './creatives/linear';
import NONLINEAR from './creatives/non-linear';
import TRACKINGEVENTS from './tracking/tracking-events';
import API from './api/api';
import CONTENTPLAYER from './players/content-player';
import DEFAULT from './utils/default';
import VASTERRORS from './utils/vast-errors';
import ICONS from './creatives/icons';

/* module:begins */
(() => {

  'use strict';

  window.DEBUG = true;

  if (typeof window === 'undefined' || typeof window.document === 'undefined') {
    if (DEBUG) {
      FW.log('cannot use rmp-vast in this environment - missing window or document object');
    }
    return;
  }

  if (typeof window.RmpVast !== 'undefined') {
    if (DEBUG) {
      FW.log('RmpVast constructor already exists - no need to load it twice - exiting');
    }
    return;
  }
  /* module:ends */

  window.RmpVast = function (id, params) {
    if (typeof id !== 'string' || id === '') {
      if (DEBUG) {
        FW.log('invalid id to create new instance - exit');
      }
      return;
    }
    this.id = id;
    this.container = document.getElementById(this.id);
    this.contentWrapper = this.container.querySelector('.rmp-content');
    this.contentPlayer = this.container.querySelector('.rmp-video');
    if (this.container === null || this.contentWrapper === null || this.contentPlayer === null) {
      if (DEBUG) {
        FW.log('invalid DOM layout - exit');
      }
      return;
    }
    if (DEBUG) {
      FW.log('creating new RmpVast instance');
      FW.logVideoEvents(this.contentPlayer, 'content');
    }
    // reset instance variables - once per session
    DEFAULT.instanceVariables.call(this);
    // reset loadAds variables - this is reset at addestroyed 
    // so that next loadAds is cleared
    DEFAULT.loadAdsVariables.call(this);
    // handle fullscreen events
    DEFAULT.fullscreen.call(this);
    // filter input params
    HELPERS.filterParams.call(this, params);
    if (DEBUG) {
      FW.log('filtered params follow');
      FW.log(this.params);
      FW.log('detected environment follows');
      const keys = Object.keys(ENV);
      const filteredEnv = {};
      for (let i = 0, len = keys.length; i < len; i++) {
        const currentEnvItem = ENV[keys[i]];
        if (typeof currentEnvItem !== 'undefined' && typeof currentEnvItem !== 'function' && currentEnvItem !== null) {
          filteredEnv[keys[i]] = currentEnvItem;
        }
      }
      FW.log(filteredEnv);
    }
  };

  // enrich RmpVast prototype with API methods
  API.attach(window.RmpVast);

  const _execRedirect = function () {
    if (DEBUG) {
      FW.log('adfollowingredirect');
    }
    HELPERS.createApiEvent.call(this, 'adfollowingredirect');
    const redirectUrl = FW.getNodeValue(this.vastAdTagURI[0], true);
    if (DEBUG) {
      FW.log('redirect URL is ' + redirectUrl);
    }
    if (redirectUrl !== null) {
      if (this.params.maxNumRedirects > this.redirectsFollowed) {
        this.redirectsFollowed++;
        if (this.runningAdPod) {
          this.adPodItemWrapper = true;
        }
        this.loadAds(redirectUrl);
      } else {
        // Wrapper limit reached, as defined by maxNumRedirects
        PING.error.call(this, 302);
        VASTERRORS.process.call(this, 302);
      }
    } else {
      // not a valid redirect URI - ping for error
      PING.error.call(this, 300);
      VASTERRORS.process.call(this, 300);
    }
  };

  const _parseCreatives = function (creative) {
    if (DEBUG) {
      FW.log('_parseCreatives');
      FW.log(creative);
    }
    for (let i = 0, len = creative.length; i < len; i++) {
      const currentCreative = creative[i];
      // we only pick the first creative that is either Linear or NonLinearAds
      const nonLinearAds = currentCreative.getElementsByTagName('NonLinearAds');
      const linear = currentCreative.getElementsByTagName('Linear');
      // for now we ignore CreativeExtensions tag
      //let creativeExtensions = currentCreative.getElementsByTagName('CreativeExtensions');
      const companionAds = currentCreative.getElementsByTagName('CompanionAds');
      if (companionAds.length > 0) {
        continue;
      }
      // we expect 1 Linear or NonLinearAds tag 
      if (nonLinearAds.length === 0 && linear.length === 0) {
        PING.error.call(this, 101);
        VASTERRORS.process.call(this, 101);
        return;
      }
      if (nonLinearAds.length > 0) {
        const trackingEvents = nonLinearAds[0].getElementsByTagName('TrackingEvents');
        // if TrackingEvents tag
        if (trackingEvents.length > 0) {
          TRACKINGEVENTS.filterPush.call(this, trackingEvents);
        }
        if (this.isWrapper) {
          _execRedirect.call(this);
          return;
        }
        NONLINEAR.parse.call(this, nonLinearAds);
        return;
      } else if (linear.length > 0) {
        // check for skippable ads (Linear skipoffset)
        const skipoffset = linear[0].getAttribute('skipoffset');
        // if we have a wrapper we ignore skipoffset in case it is present
        if (!this.isWrapper && this.params.skipMessage !== '' && skipoffset !== null && skipoffset !== '' &&
          FW.isValidOffset(skipoffset)) {
          if (DEBUG) {
            FW.log('skippable ad detected with offset ' + skipoffset);
          }
          this.isSkippableAd = true;
          this.skipoffset = skipoffset;
          // we  do not display skippable ads when on is iOS < 10
          if (ENV.isIos[0] && ENV.isIos[1] < 10) {
            PING.error.call(this, 200);
            VASTERRORS.process.call(this, 200);
            return;
          }
        }

        // TrackingEvents
        const trackingEvents = linear[0].getElementsByTagName('TrackingEvents');
        // if present TrackingEvents
        if (trackingEvents.length > 0) {
          TRACKINGEVENTS.filterPush.call(this, trackingEvents);
        }

        // VideoClicks for linear
        const videoClicks = linear[0].getElementsByTagName('VideoClicks');
        if (videoClicks.length > 0) {
          const clickThrough = videoClicks[0].getElementsByTagName('ClickThrough');
          const clickTracking = videoClicks[0].getElementsByTagName('ClickTracking');
          if (clickThrough.length > 0) {
            this.clickThroughUrl = FW.getNodeValue(clickThrough[0], true);
          }
          if (clickTracking.length > 0) {
            for (let i = 0, len = clickTracking.length; i < len; i++) {
              const clickTrackingUrl = FW.getNodeValue(clickTracking[i], true);
              if (clickTrackingUrl !== null) {
                this.trackingTags.push({
                  event: 'clickthrough',
                  url: clickTrackingUrl
                });
              }
            }
          }
        }

        // return on wrapper
        if (this.isWrapper) {
          // if icons are presents then we push valid icons
          const icons = linear[0].getElementsByTagName('Icons');
          if (icons.length > 0) {
            ICONS.parse.call(this, icons);
          }
          _execRedirect.call(this);
          return;
        }
        LINEAR.parse.call(this, linear);
        return;
      }
    }
    // in case wrapper with creative CompanionAds we still need to _execRedirect
    if (this.isWrapper) {
      _execRedirect.call(this);
      return;
    }
  };

  const _filterAdPod = function (ad) {
    if (DEBUG) {
      FW.log('_filterAdPod');
    }
    // filter Ad and AdPod
    let retainedAd;
    // a pod already exists and is being processed - the current Ad item is InLine
    if (this.adPod.length > 0 && !this.adPodItemWrapper) {
      if (DEBUG) {
        FW.log('loading next ad in pod');
      }
      retainedAd = ad[0];
      this.adPodCurrentIndex++;
      this.adPod.shift();
    } else if (this.adPod.length > 0 && this.adPodItemWrapper) {
      if (DEBUG) {
        FW.log('running ad pod Ad is a wrapper');
      }
      // we are in a pod but the running Ad item is a wrapper
      this.adPodItemWrapper = false;
      for (let i = 0, len = ad.length; i < len; i++) {
        const sequence = ad[i].getAttribute('sequence');
        if (sequence === '' || sequence === null) {
          retainedAd = ad[i];
          break;
        }
      }
    } else {
      // we are not in a pod yet ... see if one exists or not
      const standaloneAds = [];
      for (let i = 0, len = ad.length; i < len; i++) {
        const sequence = ad[i].getAttribute('sequence');
        if (sequence === '' || sequence === null) {
          // standalone ads
          standaloneAds.push(ad[i]);
        } else {
          // if it has sequence attribute then push to adPod array
          this.adPod.push(ad[i]);
        }
      }
      if (this.adPod.length === 0 && standaloneAds.length > 0) {
        // we are not in an ad pod - we only load the first standalone ad
        retainedAd = standaloneAds[0];
      } else if (this.adPod.length > 0) {
        if (DEBUG) {
          FW.log('ad pod detected');
        }
        this.runningAdPod = true;
        // clone array for purpose of API exposure
        this.adPodApiInfo = [...this.adPod];
        // so we are in a pod but it may come from a wrapper so we need to ping 
        // wrapper trackings for each Ad of the pod
        this.adPodWrapperTrackings = [...this.trackingTags];
        // reduced adPod length to maxNumItemsInAdPod
        if (this.adPod.length > this.params.maxNumItemsInAdPod) {
          this.adPod.length = this.params.maxNumItemsInAdPod;
        }
        this.standaloneAdsInPod = standaloneAds;
        // sort adPod in case sequence attr are unordered
        this.adPod.sort((a, b) => {
          const sequence1 = parseInt(a.getAttribute('sequence'));
          const sequence2 = parseInt(b.getAttribute('sequence'));
          return sequence1 - sequence2;
        });
        retainedAd = this.adPod[0];
        this.adPod.shift();
        const __onAdDestroyLoadNextAdInPod = function () {
          if (DEBUG) {
            FW.log('addestroyed - checking for ads left in pod');
            if (this.adPod.length > 0) {
              FW.log(this.adPod);
            } else {
              FW.log('no ad left in pod');
            }
          }
          this.adPodItemWrapper = false;
          if (this.adPod.length > 0) {
            _filterAdPod.call(this, this.adPod);
          } else {
            this.container.removeEventListener('addestroyed', this.onAdDestroyLoadNextAdInPod);
            this.adPod = [];
            this.standaloneAdsInPod = [];
            this.runningAdPod = false;
            this.adPodCurrentIndex = 0;
            this.adPodApiInfo = [];
            this.adPodWrapperTrackings = [];
            HELPERS.createApiEvent.call(this, 'adpodcompleted');
          }
        };
        this.onAdDestroyLoadNextAdInPod = __onAdDestroyLoadNextAdInPod.bind(this);
        this.container.addEventListener('addestroyed', this.onAdDestroyLoadNextAdInPod);
      }
    }

    if (!retainedAd) {
      // in case this is a wrapper we need to ping for errors on originating tags
      PING.error.call(this, 200);
      VASTERRORS.process.call(this, 200);
      return;
    }

    const inline = retainedAd.getElementsByTagName('InLine');
    const wrapper = retainedAd.getElementsByTagName('Wrapper');
    // 1 InLine or Wrapper element must be present 
    if (inline.length === 0 && wrapper.length === 0) {
      // in case this is a wrapper we need to ping for errors on originating tags
      PING.error.call(this, 101);
      VASTERRORS.process.call(this, 101);
      return;
    }
    let inlineOrWrapper;
    if (wrapper.length > 0) {
      this.isWrapper = true;
      inlineOrWrapper = wrapper;
      this.vastAdTagURI = inlineOrWrapper[0].getElementsByTagName('VASTAdTagURI');
    } else {
      inlineOrWrapper = inline;
    }
    const adSystem = inlineOrWrapper[0].getElementsByTagName('AdSystem');
    const impression = inlineOrWrapper[0].getElementsByTagName('Impression');
    // VAST/Ad/InLine/Error node
    const errorNode = inlineOrWrapper[0].getElementsByTagName('Error');
    if (errorNode.length > 0) {
      const errorUrl = FW.getNodeValue(errorNode[0], true);
      if (errorUrl !== null) {
        this.inlineOrWrapperErrorTags.push({
          event: 'error',
          url: errorUrl
        });
      }
    }
    const adTitle = inlineOrWrapper[0].getElementsByTagName('AdTitle');
    const adDescription = inlineOrWrapper[0].getElementsByTagName('Description');
    const creatives = inlineOrWrapper[0].getElementsByTagName('Creatives');

    // Required InLine Elements are AdSystem, AdTitle, Impression, Creatives
    // Required Wrapper Elements are AdSystem, vastAdTagURI, Impression
    // however in real word some adTag do not have impression or adSystem/adTitle tags 
    // especially in the context of multiple redirects - since the IMA SDK allows those tags 
    // to render we should do the same even if those adTags are not VAST-compliant
    // so we only check and exit if missing required information to display ads 
    if (this.isWrapper) {
      if (this.vastAdTagURI.length === 0) {
        PING.error.call(this, 101);
        VASTERRORS.process.call(this, 101);
        return;
      }
    } else {
      if (creatives.length === 0) {
        PING.error.call(this, 101);
        VASTERRORS.process.call(this, 101);
        return;
      }
    }

    let creative;
    if (creatives.length > 0) {
      creative = creatives[0].getElementsByTagName('Creative');
      // at least one creative tag is expected for InLine
      if (!this.isWrapper && creative.length === 0) {
        PING.error.call(this, 101);
        VASTERRORS.process.call(this, 101);
        return;
      }
    }
    if (adTitle.length > 0) {
      this.adSystem = FW.getNodeValue(adSystem[0], false);
    }
    if (impression.length > 0) {
      for (let i = 0, len = impression.length; i < len; i++) {
        const impressionUrl = FW.getNodeValue(impression[i], true);
        if (impressionUrl !== null) {
          this.trackingTags.push({
            event: 'impression',
            url: impressionUrl
          });
        }
      }
    }
    if (!this.isWrapper) {
      if (adTitle.length > 0) {
        this.adTitle = FW.getNodeValue(adTitle[0], false);
      }
      if (adDescription.length > 0) {
        this.adDescription = FW.getNodeValue(adDescription[0], false);
      }
    }
    // in case no Creative with Wrapper we make our redirect call here
    if (this.isWrapper && !creative) {
      _execRedirect.call(this);
      return;
    }
    _parseCreatives.call(this, creative);
  };

  const _onXmlAvailable = function (xml) {
    // if VMAP we abort
    const vmap = xml.getElementsByTagName('vmap:VMAP');
    if (vmap.length > 0) {
      VASTERRORS.process.call(this, 200);
      return;
    }
    // check for VAST node
    const vastTag = xml.getElementsByTagName('VAST');
    if (vastTag.length === 0) {
      // in case this is a wrapper we need to ping for errors on originating tags
      PING.error.call(this, 100);
      VASTERRORS.process.call(this, 100);
      return;
    }
    const vastDocument = vastTag[0];
    // VAST/Error node
    const errorNode = vastDocument.getElementsByTagName('Error');
    if (errorNode.length > 0) {
      for (let i = 0, len = errorNode.length; i < len; i++) {
        // we need to make sure those Error tags are directly beneath VAST tag. See 2.2.5.1 VAST 3 spec
        if (errorNode[i].parentNode === vastDocument) {
          const errorUrl = FW.getNodeValue(errorNode[i], true);
          if (errorUrl !== null) {
            // we use an array here for vastErrorTags but we only have item in it
            // this is to be able to use PING.error for both vastErrorTags and inlineOrWrapperErrorTags
            this.vastErrorTags.push({
              event: 'error',
              url: errorUrl
            });
          }
        }
      }
    }
    //check for VAST version 2, 3 or 4 (we support VAST 4 in the limit of what is supported in VAST 3)
    const pattern = /^(2|3|4)\./i;
    const version = vastDocument.getAttribute('version');
    if (!pattern.test(version)) {
      // in case this is a wrapper we need to ping for errors on originating tags
      PING.error.call(this, 102);
      VASTERRORS.process.call(this, 102);
      return;
    }
    // if empty VAST return
    const ad = vastDocument.getElementsByTagName('Ad');
    if (ad.length === 0) {
      PING.error.call(this, 303);
      VASTERRORS.process.call(this, 303);
      return;
    }
    _filterAdPod.call(this, ad);
  };

  const _makeAjaxRequest = function (vastUrl) {
    // we check for required VAST URL and API here
    // as we need to have this.currentContentSrc available for iOS
    if (typeof vastUrl !== 'string' || vastUrl === '') {
      VASTERRORS.process.call(this, 1001);
      return;
    }
    if (!FW.hasDOMParser()) {
      VASTERRORS.process.call(this, 1002);
      return;
    }
    HELPERS.createApiEvent.call(this, 'adtagstartloading');
    this.isWrapper = false;
    this.vastAdTagURI = null;
    this.adTagUrl = vastUrl;
    if (DEBUG) {
      FW.log('try to load VAST tag at ' + this.adTagUrl);
    }
    FW.ajax(this.adTagUrl, this.params.ajaxTimeout, true, this.params.ajaxWithCredentials).then((data) => {
      if (DEBUG) {
        FW.log('VAST loaded from ' + this.adTagUrl);
      }
      HELPERS.createApiEvent.call(this, 'adtagloaded');
      let xml;
      try {
        // Parse XML
        const parser = new DOMParser();
        xml = parser.parseFromString(data, 'text/xml');
        if (DEBUG) {
          FW.log('parsed XML document follows');
          FW.log(xml);
        }
      } catch (e) {
        FW.trace(e);
        // in case this is a wrapper we need to ping for errors on originating tags
        PING.error.call(this, 100);
        VASTERRORS.process.call(this, 100);
        return;
      }
      _onXmlAvailable.call(this, xml);
    }).catch((e) => {
      FW.trace(e);
      // in case this is a wrapper we need to ping for errors on originating tags
      PING.error.call(this, 1000);
      VASTERRORS.process.call(this, 1000);
    });
  };

  const _onDestroyLoadAds = function (vastUrl) {
    this.container.removeEventListener('addestroyed', this.onDestroyLoadAds);
    this.loadAds(vastUrl);
  };

  window.RmpVast.prototype.loadAds = function (vastUrl) {
    if (DEBUG) {
      FW.log('loadAds starts');
    }
    // if player is not initialized - this must be done now
    if (!this.rmpVastInitialized) {
      this.initialize();
    }
    // if an ad is already on stage we need to clear it first before we can accept another ad request
    if (this.getAdOnStage()) {
      this.onDestroyLoadAds = _onDestroyLoadAds.bind(this, vastUrl);
      this.container.addEventListener('addestroyed', this.onDestroyLoadAds);
      this.stopAds();
      return;
    }
    // for useContentPlayerForAds we need to know early what is the content src
    // so that we can resume content when ad finishes or on aderror
    const contentCurrentTime = CONTENTPLAYER.getCurrentTime.call(this);
    if (this.useContentPlayerForAds) {
      this.currentContentSrc = this.contentPlayer.src;
      if (DEBUG) {
        FW.log('currentContentSrc is ' + this.currentContentSrc);
      }
      this.currentContentCurrentTime = contentCurrentTime;
      if (DEBUG) {
        FW.log('currentContentCurrentTime is ' + this.currentContentCurrentTime);
      }
      // on iOS we need to prevent seeking when linear ad is on stage
      CONTENTPLAYER.preventSeekingForCustomPlayback.call(this);
    }
    _makeAjaxRequest.call(this, vastUrl);
  };
  /* module:begins */
})();
/* module:ends */
/* module:export */
