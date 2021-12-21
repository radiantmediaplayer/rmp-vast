/**
 * @license Copyright (c) 2015-2021 Radiant Media Player | https://www.radiantmediaplayer.com
 * rmp-vast 5.1.0
 * GitHub: https://github.com/radiantmediaplayer/rmp-vast
 * MIT License: https://github.com/radiantmediaplayer/rmp-vast/blob/master/LICENSE
 */

import FW from './fw/fw';
import ENV from './fw/env';
import HELPERS from './utils/helpers';
import LINEAR from './creatives/linear';
import NON_LINEAR from './creatives/non-linear';
import COMPANION from './creatives/companion';
import VPAID from './players/vpaid';
import VAST_PLAYER from './players/vast-player';
import CONTENT_PLAYER from './players/content-player';
import DEFAULT from './utils/default';
import VAST_ERRORS from './utils/vast-errors';
import VIEWABLE_IMPRESSION from './tracking/viewable-impression';
import TRACKING_EVENTS from './tracking/tracking-events';
import OmSdkManager from './verification/omsdk';
import { VASTClient } from '../../vast-client-js/src/vast_client';

/**
 * The class to instantiate RmpVast
 * @export
 * @class RmpVast
*/
export default class RmpVast {
  /**
   * @constructor
   * @param {string}  id - the id for the player container. Required parameter.
   * @typedef {object} VpaidSettings
   * @property {number} [width]
   * @property {number} [height]
   * @property {string} [viewMode]
   * @property {number} [desiredBitrate]
   * @typedef {object} Labels
   * @property {string} [skipMessage]
   * @property {string} [closeAd]
   * @property {string} [textForClickUIOnMobile] 
   * @typedef {object} RmpVastParams
   * @property {number} [ajaxTimeout] - timeout in ms for an AJAX request to load a VAST tag from the ad server. Default 8000.
   * @property {number} [creativeLoadTimeout] - timeout in ms to load linear media creative from the server. Default 10000.
   * @property {boolean} [ajaxWithCredentials] - AJAX request to load VAST tag from ad server should or should not be made with credentials. Default: false.
   * @property {number} [maxNumRedirects] - the number of VAST wrappers the player should follow before triggering an error. Default: 4. Capped at 30 to avoid infinite wrapper loops.
   * @property {boolean} [outstream] - Enables outstream ad mode. Default: false.
   * @property {boolean} [showControlsForVastPlayer] - Shows VAST player HTML5 default video controls. Only works when debug setting is true. Default: true.
   * @property {boolean} [enableVpaid] - Enables VPAID support or not. Default: true.
   * @property {boolean} [omidSupport] - Enables OMID (OM Web SDK) support in rmp-vast. Default: true.
   * @property {string[]} [omidAllowedVendors] - List of allowed vendors for ad verification. Vendors not listed will be rejected. Default: [].
   * @property {string} [omidPathTo] - Path to OM Web SDK script. Default: '../externals/omweb-v1.js'.
   * @property {boolean} [autoplay] - The content player will autoplay or not. The possibility of autoplay is not determined by rmp-vast, this information needs to be passed to rmp-vast (see this script for example). Default: false (means a click to play is required).
   * @property {string} [partnerName] - partnerName for OMID. Default: 'Radiantmediaplayer'.
   * @property {string} [partnerVersion] - partnerVersion for OMID. Default: '3.2.0'.
   * @property {VpaidSettings} [vpaidSettings] - information required to properly display VPAID creatives - note that it is up to the parent application of rmp-vast to provide those informations
   * @property {Labels} [labels] - information required to properly display VPAID creatives - note that it is up to the parent application of rmp-vast to provide those informations
   * @param {RmpVastParams} [params] - an object representing various parameters that can be passed to a rmp-vast instance and that will affect the player inner-workings. Optional parameter.
   * @param {boolean} [debug] - display debug console logs in browser dev tools. Default: false. Optional parameter.
   */
  constructor(id, params, debug) {
    // reset instance variables - once per session
    DEFAULT.instanceVariables.call(this);
    this.debug = debug || false;
    if (typeof id !== 'string' || id === '') {
      if (this.debug) {
        FW.log('invalid id to create new instance - exit');
      }
      return;
    }
    this.id = id;
    this.container = document.getElementById(this.id);
    if (this.container === null) {
      if (this.debug) {
        FW.log('invalid DOM layout - exit');
      }
      return;
    }
    this.contentWrapper = this.container.querySelector('.rmp-content');
    this.contentPlayer = this.container.querySelector('.rmp-video');
    if (this.contentWrapper === null || this.contentPlayer === null) {
      if (this.debug) {
        FW.log('invalid DOM layout - exit');
      }
      return;
    }
    if (this.debug) {
      FW.log('creating new RmpVast instance');
      FW.log('environment follows');
      FW.log(null, ENV);
      FW.logVideoEvents(this.contentPlayer, 'content');
    }
    // reset loadAds variables - this is reset at addestroyed 
    // so that next loadAds is cleared
    DEFAULT.resetLoadAds.call(this);
    // handle fullscreen events
    DEFAULT.fullscreen.call(this);
    // filter input params
    HELPERS.filterParams.call(this, params);
    if (this.debug) {
      FW.log('filtered params follow', this.params);
    }
  }

  /** 
   * @private
   */
  addTrackingEvents_(trackingEvents) {
    const keys = Object.keys(trackingEvents);
    for (let k = 0, len = keys.length; k < len; k++) {
      const trackingUrls = trackingEvents[keys[k]];
      trackingUrls.forEach(url => {
        this.trackingTags.push({
          event: keys[k],
          url: url
        });
      });
    }
  }

  /** 
   * @private
   */
  async loopAds_(ads) {
    for (let i = 0, len = ads.length; i < len; i++) {
      await new Promise(resolve => {
        const currentAd = ads[i];
        if (this.debug) {
          FW.log('currentAd is: ', currentAd);
        }
        this.ad.id = currentAd.id;
        this.ad.adServingId = currentAd.adServingId;
        this.ad.categories = currentAd.categories;
        if (this.requireCategory) {
          if (this.ad.categories.length === 0 || !this.ad.categories[0].authority) {
            VAST_ERRORS.process.call(this, 204, true);
            resolve();
          }
        }
        this.ad.blockedAdCategories = currentAd.blockedAdCategories;
        if (this.requireCategory) {
          let haltDueToBlockedAdCategories = false;
          this.ad.blockedAdCategories.forEach(blockedAdCategory => {
            const blockedAdCategoryAuthority = blockedAdCategory.authority;
            const blockedAdCategoryValue = blockedAdCategory.value;
            this.ad.categories.forEach(category => {
              const categoriesAuthority = category.authority;
              const categoriesValue = category.value;
              if (blockedAdCategoryAuthority === categoriesAuthority && blockedAdCategoryValue === categoriesValue) {
                VAST_ERRORS.process.call(this, 205, true);
                haltDueToBlockedAdCategories = true;
              }
            });
          });
          if (haltDueToBlockedAdCategories) {
            resolve();
          }
        }
        this.ad.adType = currentAd.adType;
        this.ad.title = currentAd.title;
        this.ad.description = currentAd.description;
        this.ad.system = currentAd.system;
        this.ad.advertiser = currentAd.advertiser;
        this.ad.pricing = currentAd.pricing;
        this.ad.survey = currentAd.survey;
        this.ad.sequence = currentAd.sequence;
        for (let j = 0, len = ads.length; j < len; j++) {
          const sequence = ads[j].sequence;
          this.adPod = false;
          if (sequence && sequence > 1) {
            this.adPod = true;
            break;
          }
        }
        if (this.adPod) {
          this.adSequence++;
          if (this.adPodLength === 0) {
            let adPodLength = 0;
            for (let j = 0, len = ads.length; j < len; j++) {
              const ad = ads[j];
              if (ad.sequence) {
                adPodLength++;
              }
            }
            this.adPodLength = adPodLength;
            if (this.debug) {
              FW.log('AdPod detected with length ' + this.adPodLength);
            }
          }
        }
        this.ad.viewableImpression = currentAd.viewableImpression;
        if (!FW.isEmptyObject(this.ad.viewableImpression)) {
          VIEWABLE_IMPRESSION.init.call(this);
        }
        for (let j = 0, len = currentAd.errorURLTemplates.length; j < len; j++) {
          this.adErrorTags.push({
            event: 'error',
            url: currentAd.errorURLTemplates[j]
          });
        }
        currentAd.impressionURLTemplates.forEach(impression => {
          if (impression.url) {
            this.trackingTags.push({
              event: 'impression',
              url: impression.url
            });
          }
        });
        this.container.addEventListener('addestroyed', () => {
          if (this.adPod && this.adSequence === this.adPodLength) {
            this.adPodLength = 0;
            this.adSequence = 0;
            this.adPod = false;
            HELPERS.createApiEvent.call(this, 'adpodcompleted');
          }
          resolve();
        }, { once: true });
        // parse companion
        const creatives = currentAd.creatives;
        if (this.debug) {
          FW.log('parsed creatives follow', creatives);
        }
        for (let j = 0, len = creatives.length; j < len; j++) {
          const creative = creatives[j];
          if (creative.type === 'companion') {
            if (this.debug) {
              FW.log('creative type companion detected');
            }
            COMPANION.parse.call(this, creative);
            break;
          }
        }
        for (let j = 0, len = creatives.length; j < len; j++) {
          const creative = creatives[j];
          // companion >> continue
          if (creative.type === 'companion') {
            continue;
          }
          this.creative.id = creative.id;
          this.creative.universalAdId = creative.universalAdId;
          this.creative.adId = creative.adId;
          this.creative.trackingEvents = creative.trackingEvents;
          switch (creative.type) {
            case 'linear':
              this.creative.duration = creative.duration;
              this.creative.skipDelay = creative.skipDelay;
              if (this.creative.skipDelay) {
                this.creative.skipoffset = creative.skipDelay;
                this.creative.isSkippableAd = true;
              }
              if (creative.videoClickThroughURLTemplate && creative.videoClickThroughURLTemplate.url) {
                this.creative.clickThroughUrl = creative.videoClickThroughURLTemplate.url;
              }
              if (creative.videoClickTrackingURLTemplates.length > 0) {
                for (let k = 0, len = creative.videoClickTrackingURLTemplates.length; k < len; k++) {
                  if (creative.videoClickTrackingURLTemplates[k].url) {
                    this.trackingTags.push({
                      event: 'clickthrough',
                      url: creative.videoClickTrackingURLTemplates[k].url
                    });
                  }
                }
              }
              this.creative.isLinear = true;
              this.addTrackingEvents_(creative.trackingEvents);
              LINEAR.parse.call(this, creative.icons, creative.adParameters, creative.mediaFiles);
              if (this.params.omidSupport && currentAd.adVerifications.length > 0) {
                const omSdkManager = new OmSdkManager(
                  currentAd.adVerifications,
                  this.vastPlayer,
                  this.params,
                  this.getIsSkippableAd(),
                  this.getSkipTimeOffset(),
                  this.debug
                );
                omSdkManager.init();
              }
              break;
            case 'nonlinear':
              this.creative.isLinear = false;
              this.addTrackingEvents_(creative.trackingEvents);
              NON_LINEAR.parse.call(this, creative.variations);
              break;
            default:
              break;
          }
        }
      });
    }
  }

  /** 
   * @private
   */
  getVastTag_(vastUrl) {
    // we check for required VAST URL and API here
    // as we need to have this.currentContentSrc available for iOS
    if (typeof vastUrl !== 'string' || vastUrl === '') {
      VAST_ERRORS.process.call(this, 1001, false);
      return;
    }
    if (typeof DOMParser === 'undefined') {
      VAST_ERRORS.process.call(this, 1002, false);
      return;
    }
    HELPERS.createApiEvent.call(this, 'adtagstartloading');
    const vastClient = new VASTClient();
    const options = {
      timeout: this.params.ajaxTimeout,
      withCredentials: this.params.ajaxWithCredentials,
      wrapperLimit: this.params.maxNumRedirects,
      resolveAll: false
    };
    this.adTagUrl = vastUrl;
    if (this.debug) {
      FW.log('try to load VAST tag at: ' + this.adTagUrl);
    }
    vastClient.get(this.adTagUrl, options).then(response => {
      if (this.debug) {
        FW.log('VAST response follows', response);
      }
      HELPERS.createApiEvent.call(this, 'adtagloaded');
      // error at VAST/Error level
      const errorTags = response.errorURLTemplates;
      if (errorTags.length > 0) {
        for (let i = 0, len = errorTags.length; i < len; i++) {
          this.vastErrorTags.push({
            event: 'error',
            url: errorTags[i]
          });
        }
      }
      // VAST/Ad 
      if (response.ads.length === 0) {
        VAST_ERRORS.process.call(this, 303, true);
        return;
      } else {
        this.loopAds_(response.ads);
      }
    }).catch(error => {
      FW.trace(error);
      // PING 900 Undefined Error.
      VAST_ERRORS.process.call(this, 900, true);
    });
  }

  /** 
   * @param {string} vastUrl - the URI to the VAST resource to be loaded
   * @param {object} [regulationsInfo] - data for regulations as
   * @param {string} [regulationsInfo.regulations] - coppa|gdpr for REGULATIONS macro
   * @param {string} [regulationsInfo.limitAdTracking] - 0|1 for LIMITADTRACKING macro
   * @param {string} [regulationsInfo.gdprConsent] - Base64-encoded Cookie Value of IAB GDPR consent info for GDPRCONSENT macro
   * @param {boolean} [requireCategory] - for enforcement of VAST 4 Ad Categories
   * @return {void}
   */
  loadAds(vastUrl, regulationsInfo, requireCategory) {
    if (this.debug) {
      FW.log('loadAds starts');
    }
    // if player is not initialized - this must be done now
    if (!this.rmpVastInitialized) {
      this.initialize();
    }
    if (typeof regulationsInfo === 'object') {
      const regulationRegExp = /coppa|gdpr/ig;
      if (regulationsInfo.regulations && regulationRegExp.test(regulationsInfo.regulations)) {
        this.regulationsInfo.regulations = regulationsInfo.regulations;
      }
      const limitAdTrackingRegExp = /0|1/ig;
      if (regulationsInfo.limitAdTracking && limitAdTrackingRegExp.test(regulationsInfo.limitAdTracking)) {
        this.regulationsInfo.limitAdTracking = regulationsInfo.limitAdTracking;
      }
      // Base64-encoded Cookie Value of IAB GDPR consent info
      if (regulationsInfo.gdprConsent) {
        this.regulationsInfo.gdprConsent = regulationsInfo.gdprConsent;
      }
    }
    if (requireCategory) {
      this.requireCategory = true;
    }
    const finalUrl = TRACKING_EVENTS.replaceMacros.call(this, vastUrl, false);
    // if an ad is already on stage we need to clear it first before we can accept another ad request
    if (this.getAdOnStage()) {
      if (this.debug) {
        FW.log('creative alreadt on stage calling stopAds before loading new ad');
      }
      const onDestroyLoadAds_ = function (url) {
        this.loadAds(url);
      };
      this.container.addEventListener('addestroyed', onDestroyLoadAds_.bind(this, finalUrl), { once: true });
      this.stopAds();
      return;
    }
    // for useContentPlayerForAds we need to know early what is the content src
    // so that we can resume content when ad finishes or on aderror
    const contentCurrentTime = CONTENT_PLAYER.getCurrentTime.call(this);
    if (this.useContentPlayerForAds) {
      this.currentContentSrc = this.contentPlayer.src;
      if (this.debug) {
        FW.log('currentContentSrc is: ' + this.currentContentSrc);
      }
      this.currentContentCurrentTime = contentCurrentTime;
      if (this.debug) {
        FW.log('currentContentCurrentTime is: ' + this.currentContentCurrentTime);
      }
      // on iOS we need to prevent seeking when linear ad is on stage
      CONTENT_PLAYER.preventSeekingForCustomPlayback.call(this);
    }
    this.getVastTag_(finalUrl);
  }

  /** 
   * @type {() => void} 
   */
  play() {
    if (this.adOnStage && this.creative && this.creative.isLinear) {
      if (this.isVPAID) {
        VPAID.resumeAd.call(this);
      } else {
        VAST_PLAYER.play.call(this);
      }
    } else {
      CONTENT_PLAYER.play.call(this);
    }
  }

  /** 
   * @type {() => void} 
   */
  pause() {
    if (this.adOnStage && this.creative && this.creative.isLinear) {
      if (this.isVPAID) {
        VPAID.pauseAd.call(this);
      } else {
        VAST_PLAYER.pause.call(this);
      }
    } else {
      CONTENT_PLAYER.pause.call(this);
    }
  }

  /** 
   * @type {() => boolean} 
   */
  getAdPaused() {
    if (this.adOnStage && this.creative && this.creative.isLinear) {
      if (this.isVPAID) {
        return VPAID.getAdPaused.call(this);
      } else {
        return this.vastPlayerPaused;
      }
    }
    return false;
  }

  /** 
   * @type {(level: number) => void} 
   */
  setVolume(level) {
    if (!FW.isNumber(level)) {
      return;
    }
    let validatedLevel = 0;
    if (level < 0) {
      validatedLevel = 0;
    } else if (level > 1) {
      validatedLevel = 1;
    } else {
      validatedLevel = level;
    }
    if (this.adOnStage && this.creative && this.creative.isLinear) {
      if (this.isVPAID) {
        VPAID.setAdVolume.call(this, validatedLevel);
      }
      VAST_PLAYER.setVolume.call(this, validatedLevel);
    }
    CONTENT_PLAYER.setVolume.call(this, validatedLevel);
  }

  /** 
   * @type {() => number} 
   */
  getVolume() {
    if (this.adOnStage && this.creative && this.creative.isLinear) {
      if (this.isVPAID) {
        return VPAID.getAdVolume.call(this);
      } else {
        return VAST_PLAYER.getVolume.call(this);
      }
    }
    return CONTENT_PLAYER.getVolume.call(this);
  }

  /** 
   * @type {(muted: boolean) => void} 
   */
  setMute(muted) {
    if (typeof muted !== 'boolean') {
      return;
    }
    if (this.adOnStage && this.creative && this.creative.isLinear) {
      if (this.isVPAID) {
        if (muted) {
          VPAID.setAdVolume.call(this, 0);
        } else {
          VPAID.setAdVolume.call(this, 1);
        }
      } else {
        VAST_PLAYER.setMute.call(this, muted);
      }
    }
    CONTENT_PLAYER.setMute.call(this, muted);
  }

  /** 
   * @type {() => boolean} 
   */
  getMute() {
    if (this.adOnStage && this.creative && this.creative.isLinear) {
      if (this.isVPAID) {
        if (VPAID.getAdVolume.call(this) === 0) {
          return true;
        }
        return false;
      } else {
        return VAST_PLAYER.getMute.call(this);
      }
    }
    return CONTENT_PLAYER.getMute.call(this);
  }

  /** 
   * @type {() => boolean} 
   */
  getFullscreen() {
    return this.isInFullscreen;
  }

  /** 
   * @type {() => void} 
   */
  stopAds() {
    if (this.adOnStage) {
      if (this.isVPAID) {
        VPAID.stopAd.call(this);
      } else {
        // this will destroy ad
        VAST_PLAYER.resumeContent.call(this);
      }
    }
  }

  /** 
   * @type {() => void} 
   */
  skipAd() {
    if (this.adOnStage && this.getAdSkippableState()) {
      if (this.isVPAID) {
        VPAID.skipAd.call(this);
      } else {
        // this will destroy ad
        VAST_PLAYER.resumeContent.call(this);
      }
    }
  }

  /** 
   * @type {() => string} 
   */
  getAdTagUrl() {
    return this.adTagUrl;
  }

  /** 
   * @type {() => string} 
   */
  getAdMediaUrl() {
    if (this.adOnStage) {
      if (this.isVPAID) {
        return VPAID.getCreativeUrl.call(this);
      } else {
        if (this.creative && this.creative.mediaUrl) {
          return this.creative.mediaUrl;
        }
      }
    }
    return null;
  }

  /** 
   * @typedef {object} Environment
   * @property {number} devicePixelRatio
   * @property {number} maxTouchPoints
   * @property {boolean} isIpadOS
   * @property {array} isIos
   * @property {array} isAndroid
   * @property {boolean} isMacOSSafari
   * @property {boolean} isFirefox
   * @property {boolean} isMobile
   * @property {boolean} hasNativeFullscreenSupport
   * @return {Environment}
   */
  getEnvironment() {
    return ENV;
  }

  /** 
   * @type {() => boolean} 
   */
  getAdLinear() {
    if (this.creative && this.creative.isLinear) {
      return this.creative.isLinear;
    }
    return true;
  }

  /** 
   * @typedef {object} AdSystem
   * @property {string} value
   * @property {string} version
   * @return {AdSystem}
   */
  getAdSystem() {
    // <AdSystem version="2.0" ><![CDATA[AdServer]]></AdSystem>
    // {value: String, version: String}
    if (this.ad && this.ad.system) {
      return this.ad.system;
    }
    return {
      value: '',
      version: ''
    };
  }

  /** 
   * @typedef {object} UniversalAdId
   * @property {string} idRegistry
   * @property {string} value
   * @return {UniversalAdId}
   */
  getAdUniversalAdId() {
    // <UniversalAdId idRegistry="daily-motion-L">Linear-12345</UniversalAdId>
    // {idRegistry: String, value: String}
    if (this.creative && this.creative.universalAdId) {
      return this.creative.universalAdId;
    }
    return {
      idRegistry: '',
      value: ''
    };
  }

  /** 
   * @type {() => string} 
   */
  getAdContentType() {
    if (this.creative && this.creative.type) {
      return this.creative.type;
    }
    return '';
  }

  /** 
   * @type {() => string} 
   */
  getAdTitle() {
    if (this.ad && this.ad.title) {
      return this.ad.title;
    }
    return '';
  }

  /** 
   * @type {() => string} 
   */
  getAdDescription() {
    if (this.ad && this.ad.description) {
      return this.ad.description;
    }
    return '';
  }

  /** 
   * @typedef {object} Advertiser
   * @property {string} id
   * @property {string} value
   * @return {Advertiser}
   */
  getAdAdvertiser() {
    // <Advertiser id='advertiser-desc'><![CDATA[Advertiser name]]></Advertiser>
    // {id: String, value: String}
    if (this.ad && !FW.isEmptyObject(this.ad.advertiser)) {
      return this.ad.advertiser;
    }
    return {
      id: '',
      value: ''
    };
  }

  /** 
   * @typedef {object} Pricing
   * @property {string} value
   * @property {string} model
   * @property {string} currency
   * @return {Pricing}
   */
  getAdPricing() {
    // <Pricing model="CPM" currency="USD" ><![CDATA[1.09]]></Pricing>
    // {value: String, model: String, currency: String}
    if (this.ad && !FW.isEmptyObject(this.ad.pricing)) {
      return this.ad.pricing;
    }
    return {
      value: '',
      model: '',
      currency: ''
    };
  }

  /** 
   * @type {() => string} 
   */
  getAdSurvey() {
    if (this.ad && this.ad.survey) {
      return this.ad.survey;
    }
    return '';
  }

  /** 
   * @type {() => string} 
   */
  getAdAdServingId() {
    if (this.ad && this.ad.adServingId) {
      return this.ad.adServingId;
    }
    return '';
  }

  /** 
   * @typedef {object} Category
   * @property {string} authority
   * @property {string} value
   * @return {Category[]}
   */
  getAdCategories() {
    // <Category authority=”iabtechlab.com”>232</Category> 
    if (this.ad && this.ad.categories && this.ad.categories.length > 0) {
      return this.ad.categories;
    }
    return [];
  }

  /** 
   * @typedef {object} BlockedAdCategory
   * @property {string} authority
   * @property {string} value
   * @return {BlockedAdCategory[]}
   */
  getAdBlockedAdCategories() {
    // <BlockedAdCategories authority=”iabtechlab.com”>232</BlockedAdCategories> 
    if (this.ad && this.ad.blockedAdCategories && this.ad.blockedAdCategories.length > 0) {
      return this.ad.blockedAdCategories;
    }
    return [];
  }

  /** 
   * @type {() => number} 
   */
  getAdDuration() {
    if (this.adOnStage && this.creative && this.creative.isLinear) {
      if (this.isVPAID) {
        let duration = VPAID.getAdDuration.call(this);
        if (duration > 0) {
          duration = duration * 1000;
        }
        return duration;
      } else {
        return VAST_PLAYER.getDuration.call(this);
      }
    }
    return -1;
  }

  /** 
   * @type {() => number} 
   */
  getAdCurrentTime() {
    if (this.adOnStage && this.creative && this.creative.isLinear) {
      if (this.isVPAID) {
        const remainingTime = VPAID.getAdRemainingTime.call(this);
        const duration = VPAID.getAdDuration.call(this);
        if (remainingTime === -1 || duration === -1 || remainingTime > duration) {
          return -1;
        }
        return (duration - remainingTime) * 1000;
      } else {
        return VAST_PLAYER.getCurrentTime.call(this);
      }
    }
    return -1;
  }

  /** 
   * @type {() => number} 
   */
  getAdRemainingTime() {
    if (this.adOnStage && this.creative && this.creative.isLinear) {
      if (this.isVPAID) {
        return VPAID.getAdRemainingTime.call(this);
      } else {
        const currentTime = VAST_PLAYER.getCurrentTime.call(this);
        const duration = VAST_PLAYER.getDuration.call(this);
        if (currentTime === -1 || duration === -1 || currentTime > duration) {
          return -1;
        }
        return (duration - currentTime) * 1000;
      }
    }
    return -1;
  }

  /** 
   * @type {() => boolean} 
   */
  getAdOnStage() {
    return this.adOnStage;
  }

  /** 
   * @type {() => number} 
   */
  getAdMediaWidth() {
    if (this.adOnStage) {
      if (this.isVPAID) {
        return VPAID.getAdWidth.call(this);
      } else if (this.creative && this.creative.width) {
        return this.creative.width;
      }
    }
    return -1;
  }

  /** 
   * @type {() => number} 
   */
  getAdMediaHeight() {
    if (this.adOnStage) {
      if (this.isVPAID) {
        return VPAID.getAdHeight.call(this);
      } else if (this.creative && this.creative.height) {
        return this.creative.height;
      }
    }
    return -1;
  }

  /** 
   * @type {() => string} 
   */
  getClickThroughUrl() {
    if (this.creative && this.creative.clickThroughUrl) {
      return this.creative.clickThroughUrl;
    }
    return '';
  }

  /** 
   * @type {() => number} 
   */
  getSkipTimeOffset() {
    if (this.creative && this.creative.skipoffset) {
      return this.creative.skipoffset;
    }
    return -1;
  }

  /** 
   * @type {() => boolean} 
   */
  getIsSkippableAd() {
    if (this.creative && this.creative.isSkippableAd) {
      return true;
    }
    return false;
  }

  /** 
   * @type {() => boolean} 
   */
  getContentPlayerCompleted() {
    return this.contentPlayerCompleted;
  }

  /** 
   * @param {boolean} value
   * @return {void}
   */
  setContentPlayerCompleted(value) {
    if (typeof value === 'boolean') {
      this.contentPlayerCompleted = value;
    }
  }

  /** 
   * @type {() => string} 
   */
  getAdErrorMessage() {
    return this.vastErrorMessage;
  }

  /** 
   * @type {() => number} 
   */
  getAdVastErrorCode() {
    return this.vastErrorCode;
  }

  /** 
   * @type {() => string} 
   */
  getAdErrorType() {
    return this.adErrorType;
  }

  /** 
   * @type {() => boolean} 
   */
  getIsUsingContentPlayerForAds() {
    return this.useContentPlayerForAds;
  }

  /** 
   * @type {() => boolean} 
   */
  getAdSkippableState() {
    if (this.adOnStage) {
      if (this.isVPAID) {
        return VPAID.getAdSkippableState.call(this);
      } else {
        if (this.getIsSkippableAd()) {
          return this.skippableAdCanBeSkipped;
        }
      }
    }
    return false;
  }

  /** 
   * @return {HTMLMediaElement|null}
   */
  getVastPlayer() {
    return this.vastPlayer;
  }

  /** 
   * @return {HTMLMediaElement|null}
   */
  getContentPlayer() {
    return this.contentPlayer;
  }

  /** 
   * @param {number} inputWidth
   * @param {number} inputHeight
   * @typedef {object} Companion
   * @property {string} adSlotID
   * @property {string} altText
   * @property {string} companionClickThroughUrl
   * @property {string} companionClickTrackingUrl
   * @property {number} height
   * @property {number} width
   * @property {string} imageUrl
   * @property {string[]} trackingEventsUri
   * @return {Companion[]}
   */
  getCompanionAdsList(inputWidth, inputHeight) {
    if (this.validCompanionAds.length > 0) {
      let availableCompanionAds;
      if (typeof inputWidth === 'number' && inputWidth > 0 && typeof inputHeight === 'number' && inputHeight > 0) {
        availableCompanionAds = this.validCompanionAds.filter((companionAds) => {
          return inputWidth >= companionAds.width && inputHeight >= companionAds.height;
        });
      } else {
        availableCompanionAds = this.validCompanionAds;
      }
      if (availableCompanionAds.length > 0) {
        const result = [];
        for (let i = 0, len = availableCompanionAds.length; i < len; i++) {
          result.push(availableCompanionAds[i]);
        }
        this.companionAdsList = result;
        return result;
      }
    }
    return [];
  }

  /** 
   * @param {number} index
   * @return {HTMLElement|null}
   */
  getCompanionAd(index) {
    if (typeof this.companionAdsList[index] === 'undefined') {
      return null;
    }
    const companionAd = this.companionAdsList[index];
    let html;
    if (companionAd.imageUrl || companionAd.iframeUrl) {
      if (companionAd.imageUrl) {
        html = document.createElement('img');
      } else {
        html = document.createElement('iframe');
        html.sandbox = 'allow-scripts allow-same-origin';
      }
      if (companionAd.altText) {
        html.alt = companionAd.altText;
      }
      html.width = companionAd.width;
      html.height = companionAd.height;
      html.style.cursor = 'pointer';
    } else if (companionAd.htmlContent) {
      html = companionAd.htmlContent;
    }
    if (companionAd.imageUrl || companionAd.iframeUrl) {
      const trackingEventsUrls = companionAd.trackingEventsUrls;
      if (trackingEventsUrls.length > 0) {
        html.onload = () => {
          for (let j = 0, len = trackingEventsUrls.length; j < len; j++) {
            TRACKING_EVENTS.pingURI.call(this, trackingEventsUrls[j]);
          }
        };
        html.onerror = () => {
          TRACKING_EVENTS.error.call(this, 603);
        };
      }
      let companionClickTrackingUrls = null;
      if (companionAd.companionClickTrackingUrls) {
        if (this.debug) {
          FW.log('companion click tracking URIs', companionClickTrackingUrls);
        }
        companionClickTrackingUrls = companionAd.companionClickTrackingUrls;
      }
      const onImgClickThrough_ = function (companionClickThroughUrl, companionClickTrackingUrls, event) {
        if (event) {
          event.stopPropagation();
          if (event.type === 'touchend') {
            event.preventDefault();
          }
        }
        if (companionClickTrackingUrls) {
          companionClickTrackingUrls.forEach(companionClickTrackingUrl => {
            if (companionClickTrackingUrl.url) {
              TRACKING_EVENTS.pingURI.call(this, companionClickTrackingUrl.url);
            }
          });
        }
        FW.openWindow(companionClickThroughUrl);
      };
      if (companionAd.companionClickThroughUrl) {
        html.addEventListener(
          'touchend',
          onImgClickThrough_.bind(this, companionAd.companionClickThroughUrl, companionClickTrackingUrls)
        );
        html.addEventListener(
          'click',
          onImgClickThrough_.bind(this, companionAd.companionClickThroughUrl, companionClickTrackingUrls)
        );
      }
    }
    if (companionAd.imageUrl) {
      html.src = companionAd.imageUrl;
    } else if (companionAd.iframeUrl) {
      html.src = companionAd.iframeUrl;
    } else if (companionAd.htmlContent) {
      try {
        const parser = new DOMParser();
        html = parser.parseFromString(companionAd.htmlContent, 'text/html');
      } catch (e) {
        return null;
      }
    }
    return html;
  }

  /** 
   * @type {() => string} 
   */
  getCompanionAdsRequiredAttribute() {
    if (this.adOnStage) {
      return this.companionAdsRequiredAttribute;
    }
    return '';
  }

  /** 
   * @type {() => void} 
   */
  initialize() {
    if (!this.rmpVastInitialized) {
      if (this.debug) {
        FW.log('on user interaction - player needs to be initialized');
      }
      VAST_PLAYER.init.call(this);
    }
  }

  /** 
   * @type {() => boolean} 
   */
  getInitialized() {
    return this.rmpVastInitialized;
  }

  /** 
   * @type {() => void} 
   */
  destroy() {
    if (this.contentPlayer) {
      this.contentPlayer.removeEventListener('webkitbeginfullscreen', this.onFullscreenchange);
      this.contentPlayer.removeEventListener('webkitendfullscreen', this.onFullscreenchange);
    } else {
      document.removeEventListener('fullscreenchange', this.onFullscreenchange);
    }
    VAST_PLAYER.destroy.call(this);
    DEFAULT.instanceVariables.call(this);
  }

  /** 
   * @typedef {object} AdPod
   * @property {number} adPodCurrentIndex
   * @property {number} adPodLength
   * @return {AdPod}
   */
  getAdPodInfo() {
    if (this.adPod && this.adPodLength) {
      const result = {};
      result.adPodCurrentIndex = this.adSequence;
      result.adPodLength = this.adPodLength;
      return result;
    }
    return {
      adPodCurrentIndex: -1,
      adPodLength: 0
    };
  }

  // VPAID methods
  /** 
   * @type {(width: number, height: number, viewMode: string) => void} 
   */
  resizeAd(width, height, viewMode) {
    if (this.adOnStage && this.isVPAID) {
      VPAID.resizeAd.call(this, width, height, viewMode);
    }
  }

  /** 
   * @type {() => void} 
   */
  expandAd() {
    if (this.adOnStage && this.isVPAID) {
      VPAID.expandAd.call(this);
    }
  }

  /** 
   * @type {() => void} 
   */
  collapseAd() {
    if (this.adOnStage && this.isVPAID) {
      VPAID.collapseAd.call(this);
    }
  }

  /** 
   * @type {() => boolean} 
   */
  getAdExpanded() {
    if (this.adOnStage && this.isVPAID) {
      VPAID.getAdExpanded.call(this);
    }
    return false;
  }

  /** 
   * @type {() => string} 
   */
  getVPAIDCompanionAds() {
    if (this.adOnStage && this.isVPAID) {
      VPAID.getAdCompanions.call(this);
    }
    return '';
  }
}
