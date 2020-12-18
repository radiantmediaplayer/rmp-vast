/**
 * @license Copyright (c) 2017-2020 Radiant Media Player | https://www.radiantmediaplayer.com
 * rmp-vast 3.0.3
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
import { VASTClient } from '../../vast-client-js/src/vast_client';

export class RmpVast {

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

  _addTrackingEvents(trackingEvents) {
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

  async _loopAds(ads) {
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
        this.ad.adVerifications = currentAd.adVerifications;
        const that = this;
        this.container.addEventListener('addestroyed', function onAdDestroyResolve() {
          that.container.removeEventListener('addestroyed', onAdDestroyResolve);
          if (that.adPod && that.adSequence === that.adPodLength) {
            that.adPodLength = 0;
            that.adSequence = 0;
            that.adPod = false;
            HELPERS.createApiEvent.call(that, 'adpodcompleted');
          }
          resolve();
        });
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
              this._addTrackingEvents(creative.trackingEvents);
              LINEAR.parse.call(this, creative.icons, creative.adParameters, creative.mediaFiles);
              break;
            case 'nonlinear':
              this.creative.isLinear = false;
              this._addTrackingEvents(creative.trackingEvents);
              NON_LINEAR.parse.call(this, creative.variations);
              break;
            default:
              break;
          }
        }
      });
    }
  }

  _getVastTag(vastUrl) {
    // we check for required VAST URL and API here
    // as we need to have this.currentContentSrc available for iOS
    if (typeof vastUrl !== 'string' || vastUrl === '') {
      VAST_ERRORS.process.call(this, 1001, false);
      return;
    }
    if (!FW.hasDOMParser()) {
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
        this._loopAds(response.ads);
      }
    }).catch(error => {
      FW.trace(error);
      // PING 900 Undefined Error.
      VAST_ERRORS.process.call(this, 900, true);
    });
  }

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
      const _onDestroyLoadAds = function (url) {
        this.container.removeEventListener('addestroyed', this.onDestroyLoadAds);
        this.loadAds(url);
      };
      this.onDestroyLoadAds = _onDestroyLoadAds.bind(this, finalUrl);
      this.container.addEventListener('addestroyed', this.onDestroyLoadAds);
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
    this._getVastTag(finalUrl);
  }

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

  getFullscreen() {
    return this.isInFullscreen;
  }

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

  getAdTagUrl() {
    return this.adTagUrl;
  }

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

  getAdLinear() {
    if (this.creative && this.creative.isLinear) {
      return this.creative.isLinear;
    }
    return true;
  }

  getEnvironment() {
    return ENV;
  }

  getFramework() {
    return FW;
  }

  getAdSystem() {
    // <AdSystem version="2.0" ><![CDATA[AdServer]]></AdSystem>
    // {value: String, version: String}
    if (this.ad && this.ad.system) {
      return this.ad.system;
    }
    return null;
  }

  getAdUniversalAdId() {
    // <UniversalAdId idRegistry="daily-motion-L">Linear-12345</UniversalAdId>
    // {idRegistry: String, value: String}
    if (this.creative && this.creative.universalAdId) {
      return this.creative.universalAdId;
    }
    return null;
  }

  getAdContentType() {
    if (this.creative && this.creative.type) {
      return this.creative.type;
    }
    return '';
  }

  getAdTitle() {
    if (this.ad && this.ad.title) {
      return this.ad.title;
    }
    return '';
  }

  getAdDescription() {
    if (this.ad && this.ad.description) {
      return this.ad.description;
    }
    return '';
  }

  getAdAdvertiser() {
    // <Advertiser id='advertiser-desc'><![CDATA[Advertiser name]]></Advertiser>
    // {id: String, value: String}
    if (this.ad && !FW.isEmptyObject(this.ad.advertiser)) {
      return this.ad.advertiser;
    }
    return null;
  }

  getAdPricing() {
    // <Pricing model="CPM" currency="USD" ><![CDATA[1.09]]></Pricing>
    // {value: String, model: String, currency: String}
    if (this.ad && !FW.isEmptyObject(this.ad.pricing)) {
      return this.ad.pricing;
    }
    return null;
  }

  getAdSurvey() {
    if (this.ad && this.ad.survey) {
      return this.ad.survey;
    }
    return '';
  }

  getAdAdServingId() {
    if (this.ad && this.ad.adServingId) {
      return this.ad.adServingId;
    }
    return '';
  }

  getAdCategories() {
    // <Category authority=”iabtechlab.com”>232</Category> 
    // Array<Object>
    // {authority: String, value: String}
    if (this.ad && this.ad.categories && this.ad.categories.length > 0) {
      return this.ad.categories;
    }
    return null;
  }

  getAdBlockedAdCategories() {
    // <BlockedAdCategories authority=”iabtechlab.com”>232</BlockedAdCategories> 
    // Array<Object>
    // {authority: String, value: String}
    if (this.ad && this.ad.blockedAdCategories && this.ad.blockedAdCategories.length > 0) {
      return this.ad.blockedAdCategories;
    }
    return null;
  }

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

  getAdOnStage() {
    return this.adOnStage;
  }

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

  getClickThroughUrl() {
    if (this.creative && this.creative.clickThroughUrl) {
      return this.creative.clickThroughUrl;
    }
    return '';
  }

  getSkipTimeOffset() {
    if (this.creative && this.creative.skipoffset) {
      return this.creative.skipoffset;
    }
    return -1;
  }

  getIsSkippableAd() {
    if (this.creative && this.creative.isSkippableAd) {
      return true;
    }
    return false;
  }

  getContentPlayerCompleted() {
    return this.contentPlayerCompleted;
  }

  setContentPlayerCompleted(value) {
    if (typeof value === 'boolean') {
      this.contentPlayerCompleted = value;
    }
  }

  getAdErrorMessage() {
    return this.vastErrorMessage;
  }

  getAdVastErrorCode() {
    return this.vastErrorCode;
  }

  getAdErrorType() {
    return this.adErrorType;
  }

  getVpaidCreative() {
    if (this.adOnStage && this.isVPAID) {
      return VPAID.getVpaidCreative.call(this);
    }
    return null;
  }

  getIsUsingContentPlayerForAds() {
    return this.useContentPlayerForAds;
  }

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

  getVastPlayer() {
    return this.vastPlayer;
  }

  getContentPlayer() {
    return this.contentPlayer;
  }

  // companion ads
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
    return null;
  }

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
        html.addEventListener('load', () => {
          for (let j = 0, len = trackingEventsUrls.length; j < len; j++) {
            TRACKING_EVENTS.pingURI.call(this, trackingEventsUrls[j]);
          }
        });
        html.addEventListener('error', () => {
          TRACKING_EVENTS.error.call(this, 603);
        });
      }
      let companionClickTrackingUrls = null;
      if (companionAd.companionClickTrackingUrls) {
        if (this.debug) {
          FW.log('companion click tracking URIs', companionClickTrackingUrls);
        }
        companionClickTrackingUrls = companionAd.companionClickTrackingUrls;
      }
      const _onImgClickThrough = function (companionClickThroughUrl, companionClickTrackingUrls, event) {
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
        html.addEventListener('touchend',
          _onImgClickThrough.bind(this, companionAd.companionClickThroughUrl, companionClickTrackingUrls));
        html.addEventListener('click',
          _onImgClickThrough.bind(this, companionAd.companionClickThroughUrl, companionClickTrackingUrls));
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

  getCompanionAdsRequiredAttribute() {
    if (this.adOnStage) {
      return this.companionAdsRequiredAttribute;
    }
    return '';
  }

  initialize() {
    if (!this.rmpVastInitialized) {
      if (this.debug) {
        FW.log('on user interaction - player needs to be initialized');
      }
      VAST_PLAYER.init.call(this);
    }
  }

  getInitialized() {
    return this.rmpVastInitialized;
  }

  destroy() {
    if (ENV.hasNativeFullscreenSupport) {
      if (ENV.isIos[0]) {
        this.contentPlayer.removeEventListener('webkitbeginfullscreen', this.onFullscreenchange);
        this.contentPlayer.removeEventListener('webkitendfullscreen', this.onFullscreenchange);
      } else {
        document.removeEventListener('fullscreenchange', this.onFullscreenchange);
      }
    }
    VAST_PLAYER.destroy.call(this);
    DEFAULT.instanceVariables.call(this);
  }

  // adpod 
  getAdPodInfo() {
    if (this.adPod && this.adPodLength) {
      const result = {};
      result.adPodCurrentIndex = this.adSequence;
      result.adPodLength = this.adPodLength;
      return result;
    }
    return null;
  }

  // VPAID methods
  resizeAd(width, height, viewMode) {
    if (this.adOnStage && this.isVPAID) {
      VPAID.resizeAd.call(this, width, height, viewMode);
    }
  }

  expandAd() {
    if (this.adOnStage && this.isVPAID) {
      VPAID.expandAd.call(this);
    }
  }

  collapseAd() {
    if (this.adOnStage && this.isVPAID) {
      VPAID.collapseAd.call(this);
    }
  }

  getAdExpanded() {
    if (this.adOnStage && this.isVPAID) {
      VPAID.getAdExpanded.call(this);
    }
    return false;
  }

  getVPAIDCompanionAds() {
    if (this.adOnStage && this.isVPAID) {
      VPAID.getAdCompanions.call(this);
    }
    return '';
  }
} 
