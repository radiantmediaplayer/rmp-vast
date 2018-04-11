import 'core-js/fn/object/keys';

import 'core-js/fn/function/bind';

import 'core-js/fn/array/is-array';
import 'core-js/fn/array/index-of';
import 'core-js/fn/array/for-each';
import 'core-js/fn/array/filter';
import 'core-js/fn/array/sort';

import 'core-js/fn/string/trim';

import 'core-js/fn/number/is-finite';

import 'core-js/es6/promise';

import 'core-js/fn/parse-float';
import 'core-js/fn/parse-int';

import { FW } from './fw/fw';
import { ENV } from './fw/env';
import { FWVAST } from './fw/fw-vast';
import { PING } from './tracking/ping';
import { LINEAR } from './creatives/linear';
import { NONLINEAR } from './creatives/non-linear';
import { TRACKINGEVENTS } from './tracking/tracking-events';
import { API } from './api/api';
import { CONTENTPLAYER } from './players/content-player';
import { RESET } from './utils/reset';
import { VASTERRORS } from './utils/vast-errors';
import { ICONS } from './creatives/icons';

window.DEBUG = true;

window.RmpVast = function (id, params) {
  if (typeof id !== 'string' || id === '') {
    FW.log('RMP-VAST: invalid id to create new instance - exit');
    return;
  }
  this.id = id;
  this.container = document.getElementById(this.id);
  this.content = this.container.getElementsByClassName('rmp-content')[0];
  this.contentPlayer = this.container.getElementsByClassName('rmp-video')[0];
  if (DEBUG) {
    FWVAST.logVideoEvents(this.contentPlayer);
  }
  this.adContainer = null;
  this.rmpVastInitialized = false;
  this.useContentPlayerForAds = false;
  this.contentPlayerCompleted = false;
  this.currentContentCurrentTime = -1;
  this.needsSeekAdjust = false;
  this.seekAdjustAttached = false;
  this.onDestroyLoadAds = null;
  this.firstVastPlayerPlayRequest = true;
  this.firstContentPlayerPlayRequest = true;
  if (ENV.isIos[0] || (ENV.isMacOSX && ENV.isSafari[0])) {
    // on iOS and macOS Safari we use content player to play ads
    // to avoid issues related to fullscreen management and autoplay
    // as fullscreen on iOS is handled by the default OS player
    this.useContentPlayerForAds = true;
    if (DEBUG) {
      FW.log('RMP-VAST: vast player will be content player');
    }
  }
  // filter input params
  FWVAST.filterParams.call(this, params);
  // reset internal variables
  RESET.internalVariables.call(this);
  // attach fullscreen states
  // this assumes we have a polyfill for fullscreenchange event 
  // see app/js/app.js
  // we need this to handle VAST fullscreen events
  let isInFullscreen = false;
  let onFullscreenchange = null;
  let _onFullscreenchange = function (event) {
    if (event && event.type) {
      if (DEBUG) {
        FW.log('RMP-VAST: event is ' + event.type);
      }
      if (event.type === 'fullscreenchange') {
        if (isInFullscreen) {
          isInFullscreen = false;
          if (this.adOnStage && this.adIsLinear) {
            FWVAST.dispatchPingEvent.call(this, 'exitFullscreen');
          }
        } else {
          isInFullscreen = true;
          if (this.adOnStage && this.adIsLinear) {
            FWVAST.dispatchPingEvent.call(this, 'fullscreen');
          }
        }
      } else if (event.type === 'webkitbeginfullscreen') {
        // iOS uses webkitbeginfullscreen
        if (this.adOnStage && this.adIsLinear) {
          FWVAST.dispatchPingEvent.call(this, 'fullscreen');
        }
      } else if (event.type === 'webkitendfullscreen') {
        // iOS uses webkitendfullscreen
        if (this.adOnStage && this.adIsLinear) {
          FWVAST.dispatchPingEvent.call(this, 'exitFullscreen');
        }
      }
    }
  };
  // if we have native fullscreen support we handle fullscreen events
  if (ENV.hasNativeFullscreenSupport) {
    onFullscreenchange = _onFullscreenchange.bind(this);
    // for our beloved iOS 
    if (ENV.isIos[0]) {
      this.contentPlayer.addEventListener('webkitbeginfullscreen', onFullscreenchange);
      this.contentPlayer.addEventListener('webkitendfullscreen', onFullscreenchange);
    } else {
      document.addEventListener('fullscreenchange', onFullscreenchange);
    }
  }
};

// enrich RmpVast prototype with API methods
var apiKeys = Object.keys(API);
for (let i = 0, len = apiKeys.length; i < len; i++) {
  let currentKey = apiKeys[i];
  window.RmpVast.prototype[currentKey] = API[currentKey];
}

var _execRedirect = function () {
  API.createEvent.call(this, 'adfollowingredirect');
  let redirectUrl = FWVAST.getNodeValue(this.vastAdTagURI[0], true);
  if (DEBUG) {
    FW.log('RMP-VAST: redirect URL is ' + redirectUrl);
  }
  if (redirectUrl !== null) {
    if (this.params.maxNumRedirects > this.redirectsFollowed) {
      this.redirectsFollowed++;
      this.loadAds(redirectUrl);
    } else {
      // Wrapper limit reached, as defined by maxNumRedirects
      PING.error.call(this, 302, this.inlineOrWrapperErrorTags);
      VASTERRORS.process.call(this, 302);
    }
  } else {
    // not a valid redirect URI - ping for error
    PING.error.call(this, 300, this.inlineOrWrapperErrorTags);
    VASTERRORS.process.call(this, 300);
  }
};

var _parseCreatives = function (creative) {
  if (DEBUG) {
    FW.log('RMP-VAST: _parseCreatives');
    FW.log(creative);
  }
  for (let i = 0, len = creative.length; i < len; i++) {
    let currentCreative = creative[i];
    //let creativeID = currentCreative[0].getAttribute('id');
    //let creativeSequence = currentCreative[0].getAttribute('sequence');
    //let creativeAdId = currentCreative[0].getAttribute('adId');
    //let creativeApiFramework = currentCreative[0].getAttribute('apiFramework');
    // we only pick the first creative that is either Linear or NonLinearAds
    let nonLinearAds = currentCreative.getElementsByTagName('NonLinearAds');
    let linear = currentCreative.getElementsByTagName('Linear');
    // for now we ignore CreativeExtensions tag
    //let creativeExtensions = currentCreative.getElementsByTagName('CreativeExtensions');
    let companionAds = currentCreative.getElementsByTagName('CompanionAds');
    if (companionAds.length > 0) {
      continue;
    }
    // we expect 1 Linear or NonLinearAds tag 
    if (nonLinearAds.length === 0 && linear.length === 0) {
      PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
      VASTERRORS.process.call(this, 101);
      return;
    }
    if (nonLinearAds.length > 0) {
      let trackingEvents = nonLinearAds[0].getElementsByTagName('TrackingEvents');
      // if TrackingEvents tag
      if (trackingEvents.length > 0) {
        TRACKINGEVENTS.filter.call(this, trackingEvents);
      }
      if (this.isWrapper) {
        _execRedirect.call(this);
        return;
      }
      NONLINEAR.parse.call(this, nonLinearAds);
      return;
    } else if (linear.length > 0) {
      // check for skippable ads (Linear skipoffset)
      let skipoffset = linear[0].getAttribute('skipoffset');
      // if we have a wrapper we ignore skipoffset in case it is present
      if (!this.isWrapper && this.params.skipMessage !== '' && skipoffset !== null && skipoffset !== '' &&
        FWVAST.isValidOffset(skipoffset)) {
        if (DEBUG) {
          FW.log('RMP-VAST: skippable ad detected with offset ' + skipoffset);
        }
        this.isSkippableAd = true;
        this.skipoffset = skipoffset;
        // we  do not display skippable ads when on is iOS < 10
        if (ENV.isIos[0] && ENV.isIos[1] < 10) {
          PING.error.call(this, 200, this.inlineOrWrapperErrorTags);
          VASTERRORS.process.call(this, 200);
          return;
        }
      }

      // TrackingEvents
      let trackingEvents = linear[0].getElementsByTagName('TrackingEvents');
      // if present TrackingEvents
      if (trackingEvents.length > 0) {
        TRACKINGEVENTS.filter.call(this, trackingEvents);
      }

      // VideoClicks for linear
      let videoClicks = linear[0].getElementsByTagName('VideoClicks');
      if (videoClicks.length > 0) {
        let clickThrough = videoClicks[0].getElementsByTagName('ClickThrough');
        let clickTracking = videoClicks[0].getElementsByTagName('ClickTracking');
        if (clickThrough.length > 0) {
          this.clickThroughUrl = FWVAST.getNodeValue(clickThrough[0], true);
        }
        if (clickTracking.length > 0) {
          for (let i = 0, len = clickTracking.length; i < len; i++) {
            let clickTrackingUrl = FWVAST.getNodeValue(clickTracking[i], true);
            if (clickTrackingUrl !== null) {
              this.trackingTags.push({ event: 'clickthrough', url: clickTrackingUrl });
            }
          }
        }
      }

      // return on wrapper
      if (this.isWrapper) {
        // if icons are presents then we push valid icons to this.icons
        let icons = linear[0].getElementsByTagName('Icons');
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

var _onXmlAvailable = function (xml) {
  // if VMAP we abort
  let vmap = xml.getElementsByTagName('vmap:VMAP');
  if (vmap.length > 0) {
    VASTERRORS.process.call(this, 200);
    return;
  }
  // check for VAST node
  this.vastDocument = xml.getElementsByTagName('VAST');
  if (this.vastDocument.length === 0) {
    // in case this is a wrapper we need to ping for errors on originating tags
    PING.error.call(this, 100, this.inlineOrWrapperErrorTags);
    VASTERRORS.process.call(this, 100);
    return;
  }
  // VAST/Error node
  let errorNode = this.vastDocument[0].getElementsByTagName('Error');
  if (errorNode.length > 0) {
    let errorUrl = FWVAST.getNodeValue(errorNode[0], true);
    if (errorUrl !== null) {
      // we use an array here for vastErrorTags but we only have item in it
      // this is to be able to use PING.error for both vastErrorTags and inlineOrWrapperErrorTags
      this.vastErrorTags.push({ event: 'error', url: errorUrl });
    }
  }
  //check for VAST version 2, 3 or 4 (we support VAST 4 in the limit of what is supported in VAST 3)
  let pattern = /^(2|3|4)\./i;
  let version = this.vastDocument[0].getAttribute('version');
  if (!pattern.test(version)) {
    // in case this is a wrapper we need to ping for errors on originating tags
    PING.error.call(this, 102, this.inlineOrWrapperErrorTags);
    VASTERRORS.process.call(this, 102);
    return;
  }
  // if empty VAST return
  let ad = this.vastDocument[0].getElementsByTagName('Ad');
  if (ad.length === 0) {
    // here we ping vastErrorTags with error code 303 according to spec
    PING.error.call(this, 303, this.vastErrorTags);
    // in case this is a wrapper we also need to ping for errors on originating tags
    PING.error.call(this, 303, this.inlineOrWrapperErrorTags);
    VASTERRORS.process.call(this, 303);
    return;
  }
  // filter Ad and AdPod
  let retainedAd;
  let adPod = [];
  for (let i = 0, len = ad.length; i < len; i++) {
    let sequence = ad[i].getAttribute('sequence');
    if ((sequence === '' || sequence === null) && !retainedAd) {
      // the first standalone ad (without sequence attribute) is the good one
      retainedAd = ad[i];
    } else {
      // if it has sequence attribute then push to adPod array (ad pod will be skipped)
      adPod.push(ad[i]);
    }
  }
  if (!retainedAd) {
    // in case this is a wrapper we need to ping for errors on originating tags
    PING.error.call(this, 200, this.inlineOrWrapperErrorTags);
    VASTERRORS.process.call(this, 200);
    return;
  }
  //let adId = retainedAd[0].getAttribute('id');
  let inline = retainedAd.getElementsByTagName('InLine');
  let wrapper = retainedAd.getElementsByTagName('Wrapper');
  // 1 InLine or Wrapper element must be present 
  if (inline.length === 0 && wrapper.length === 0) {
    // in case this is a wrapper we need to ping for errors on originating tags
    PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
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
  let adSystem = inlineOrWrapper[0].getElementsByTagName('AdSystem');
  let impression = inlineOrWrapper[0].getElementsByTagName('Impression');
  // VAST/Ad/InLine/Error node
  errorNode = inlineOrWrapper[0].getElementsByTagName('Error');
  if (errorNode.length > 0) {
    let errorUrl = FWVAST.getNodeValue(errorNode[0], true);
    if (errorUrl !== null) {
      this.inlineOrWrapperErrorTags.push({ event: 'error', url: errorUrl });
    }
  }
  let adTitle = inlineOrWrapper[0].getElementsByTagName('AdTitle');
  let adDescription = inlineOrWrapper[0].getElementsByTagName('Description');
  let creatives = inlineOrWrapper[0].getElementsByTagName('Creatives');
  //let extensions = inline[0].getElementsByTagName('Extensions');

  // Required InLine Elements are AdSystem, AdTitle, Impression, Creatives
  // Required Wrapper Elements are AdSystem, vastAdTagURI, Impression
  // however in real word some adTag do not have impression or adSystem/adTitle tags 
  // especially in the context of multiple redirects - since the IMA SDK allows those tags 
  // to render we should do the same even if those adTags are not VAST-compliant
  // so we only check and exit if missing required information to display ads 
  if (this.isWrapper) {
    if (this.vastAdTagURI.length === 0) {
      PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
      VASTERRORS.process.call(this, 101);
      return;
    }
  } else {
    if (creatives.length === 0) {
      PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
      VASTERRORS.process.call(this, 101);
      return;
    }
  }

  let creative;
  if (creatives.length > 0) {
    creative = creatives[0].getElementsByTagName('Creative');
    // at least one creative tag is expected for InLine
    if (!this.isWrapper && creative.length === 0) {
      PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
      VASTERRORS.process.call(this, 101);
      return;
    }
  }
  if (adTitle.length > 0) {
    this.adSystem = FWVAST.getNodeValue(adSystem[0], false);
  }
  if (impression.length > 0) {
    let impressionUrl = FWVAST.getNodeValue(impression[0], true);
    if (impressionUrl !== null) {
      this.trackingTags.push({ event: 'impression', url: impressionUrl });
    }
  }
  if (!this.isWrapper) {
    if (adTitle.length > 0) {
      this.adTitle = FWVAST.getNodeValue(adTitle[0], false);
    }
    if (adDescription.length > 0) {
      this.adDescription = FWVAST.getNodeValue(adDescription[0], false);
    }
  }
  // in case no Creative with Wrapper we make our redirect call here
  if (this.isWrapper && !creative) {
    _execRedirect.call(this);
    return;
  }
  _parseCreatives.call(this, creative);
};

var _makeAjaxRequest = function (vastUrl) {
  // we check for required VAST URL and API here
  // as we need to have this.currentContentSrc available for iOS
  if (typeof vastUrl !== 'string' || vastUrl === '') {
    VASTERRORS.process.call(this, 1001);
    return;
  }
  if (!FWVAST.hasDOMParser()) {
    VASTERRORS.process.call(this, 1002);
    return;
  }
  // if we already have an ad on stage - we need to destroy it first 
  if (this.adOnStage) {
    API.stopAds.call(this);
  }
  API.createEvent.call(this, 'adtagstartloading');
  this.isWrapper = false;
  this.vastAdTagURI = null;
  this.adTagUrl = vastUrl;
  if (DEBUG) {
    FW.log('RMP-VAST: try to load VAST tag at ' + this.adTagUrl);
  }
  FW.ajax(this.adTagUrl, this.params.ajaxTimeout, true, this.params.ajaxWithCredentials).then((data) => {
    if (DEBUG) {
      FW.log('RMP-VAST: VAST loaded from ' + this.adTagUrl);
    }
    API.createEvent.call(this, 'adtagloaded');
    let xml;
    try {
      // Parse XML
      let parser = new DOMParser();
      xml = parser.parseFromString(data, 'text/xml');
      if (DEBUG) {
        FW.log('RMP-VAST: parsed XML document follows');
        FW.log(xml);
      }
    } catch (e) {
      FW.trace(e);
      // in case this is a wrapper we need to ping for errors on originating tags
      PING.error.call(this, 100, this.inlineOrWrapperErrorTags);
      VASTERRORS.process.call(this, 100);
      return;
    }
    _onXmlAvailable.call(this, xml);
  }).catch((e) => {
    FW.trace(e);
    // in case this is a wrapper we need to ping for errors on originating tags
    PING.error.call(this, 1000, this.inlineOrWrapperErrorTags);
    VASTERRORS.process.call(this, 1000);
  });
};

var _onDestroyLoadAds = function (vastUrl) {
  this.container.removeEventListener('addestroyed', this.onDestroyLoadAds);
  this.loadAds(vastUrl);
};

RmpVast.prototype.loadAds = function (vastUrl) {
  if (DEBUG) {
    FW.log('RMP-VAST: loadAds starts');
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
  // if we try to load ads when currentTime < 200 ms - be it linear or non-linear - we pause CONTENTPLAYER
  // CONTENTPLAYER (non-linear) or VASTPLAYER (linear) will resume later when VAST has finished loading/parsing
  // this is to avoid bad user experience where content may start for a few ms before ad starts
  let contentCurrentTime = CONTENTPLAYER.getCurrentTime.call(this);
  // for useContentPlayerForAds we need to know early what is the content src
  // so that we can resume content when ad finishes or on aderror
  if (this.useContentPlayerForAds) {
    this.currentContentSrc = this.contentPlayer.src;
    this.currentContentCurrentTime = contentCurrentTime;
    if (DEBUG) {
      FW.log('RMP-VAST: currentContentCurrentTime ' + contentCurrentTime);
    }
    // on iOS we need to prevent seeking when linear ad is on stage
    CONTENTPLAYER.preventSeekingForCustomPlayback.call(this);
  }
  _makeAjaxRequest.call(this, vastUrl);
};