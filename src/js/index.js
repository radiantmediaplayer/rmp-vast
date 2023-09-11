/**
 * @license Copyright (c) 2015-2022 Radiant Media Player | https://www.radiantmediaplayer.com
 * rmp-vast
 * GitHub: https://github.com/radiantmediaplayer/rmp-vast
 * MIT License: https://github.com/radiantmediaplayer/rmp-vast/blob/master/LICENSE
 */

import FW from './framework/fw';
import ENV from './framework/env';
import Utils from './framework/utils';
import LINEAR from './creatives/linear';
import NON_LINEAR from './creatives/non-linear';
import VPAID from './players/vpaid';
import VAST_PLAYER from './players/vast-player';
import CONTENT_PLAYER from './players/content-player';
import TRACKING_EVENTS from './tracking/tracking-events';
import OmSdkManager from './verification/omsdk';
import DispatcherEvent from './framework/dispatcher-event';
import { VASTClient } from '../assets/@dailymotion/vast-client/src/vast_client';
import { VASTParser } from '../assets/@dailymotion/vast-client/src/parser/vast_parser';
import '../less/rmp-vast.less';

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
   * @property {number} [ajaxTimeout] - timeout in ms for an AJAX request to load a VAST tag from the ad server.
   *  Default 8000.
   * @property {number} [creativeLoadTimeout] - timeout in ms to load linear media creative from the server. 
   *  Default 10000.
   * @property {boolean} [ajaxWithCredentials] - AJAX request to load VAST tag from ad server should or should not be 
   *  made with credentials. Default: false.
   * @property {number} [maxNumRedirects] - the number of VAST wrappers the player should follow before triggering an
   *  error. Default: 4. Capped at 30 to avoid infinite wrapper loops.
   * @property {boolean} [outstream] - Enables outstream ad mode. Default: false.
   * @property {boolean} [showControlsForVastPlayer] - Shows VAST player HTML5 default video controls. Default: false.
   * @property {boolean} [vastXmlInput] - Instead of a VAST URI, we provide directly to rmp-vast VAST XML. Default: false.
   * @property {boolean} [enableVpaid] - Enables VPAID support or not. Default: true.
   * @property {VpaidSettings} [vpaidSettings] - Information required to display VPAID creatives - note that it is up 
   *  to the parent application of rmp-vast to provide those informations
   * @property {boolean} [useHlsJS] - Enables hls.js usage to display creatives delivered in HLS format on all devices. Include hls.js library (./externals/hls/hls.min.js) in your page before usage. Default: false.
   * @property {boolean} [debugHlsJS] - Enables debug log when hls.js is used to stream creatives. Default: false.
   * @property {boolean} [forceUseContentPlayerForAds] - Forces player to use content player for ads - on Apple devices we may have a need to set useContentPlayerForAds differently based on content playback type (native vs. MSE playback). Default: false.
   * @property {boolean} [omidSupport] - Enables OMID (OM Web SDK) support in rmp-vast. Default: false.
   * @property {string[]} [omidAllowedVendors] - List of allowed vendors for ad verification. Vendors not listed will 
   *  be rejected. Default: [].
   * @property {boolean} [omidUnderEvaluation] - When in development/testing/staging set this to true. Default: false.
   * @property {boolean} [omidAutoplay] - The content player will autoplay or not. The possibility of autoplay is not 
   *  determined by rmp-vast, this information needs to be passed to rmp-vast (see this 
   *  script for example). Default: false (means a click to play is required).
   * @property {string} [partnerName] - partnerName for OMID. Default: 'rmp-vast'.
   * @property {string} [partnerVersion] - partnerVersion for OMID. Default: current rmp-vast version 'x.x.x'.
   * @property {Labels} [labels] - Information required to properly display VPAID creatives - note that it is up to the 
   *  parent application of rmp-vast to provide those informations
   * @param {RmpVastParams} [params] - An object representing various parameters that can be passed to a rmp-vast 
   *  instance and that will affect the player inner-workings. Optional parameter.
   */
  constructor(id, params) {
    // reset instance variables - once per session
    Utils.initInstanceVariables.call(this);
    if (typeof id !== 'string' || id === '') {
      console.error(`Invalid id to create new instance - exit`);
      return;
    }
    this.id = id;
    this.container = document.getElementById(this.id);
    if (this.container === null) {
      console.error(`Invalid DOM layout - exit`);
      return;
    }
    this.contentWrapper = this.container.querySelector('.rmp-content');
    this.contentPlayer = this.container.querySelector('.rmp-video');
    if (this.contentWrapper === null || this.contentPlayer === null) {
      console.error(`Invalid DOM layout - exit`);
      return;
    }

    console.log(`${FW.consolePrepend} Creating new RmpVast instance`, FW.consoleStyle, '');

    FW.logVideoEvents(this.contentPlayer, 'content');
    // reset loadAds variables - this is reset at addestroyed 
    // so that next loadAds is cleared
    Utils.resetVariablesForNewLoadAds.call(this);
    // handle fullscreen events
    Utils.handleFullscreen.call(this);
    // filter input params
    Utils.filterParams.call(this, params);

    // set useContentPlayerForAds if needed
    if (this.params.forceUseContentPlayerForAds) {
      console.log(`${FW.consolePrepend} forceUseContentPlayerForAds enabled`, FW.consoleStyle, '');
      this.useContentPlayerForAds = true;
    }

    console.log(`${FW.consolePrepend} Filtered params follow`, FW.consoleStyle, '');
    console.log(this.params);
  }

  /** 
   * Dispatch an event to the custom event system
   * @type {(eventName: string, data: object) => void} 
   */
  dispatch(eventName, data) {
    const event = this.events[eventName];
    if (event) {
      const validatedData = {
        type: eventName
      };
      if (data) {
        validatedData.data = data;
      }
      event.fire(validatedData);
    }
  }

  /** 
   * @private
   */
  _on(eventName, callback) {
    // First we grab the event from this.events
    let event = this.events[eventName];
    // If the event does not exist then we should create it!
    if (!event) {
      event = new DispatcherEvent(eventName);
      this.events[eventName] = event;
    }
    // Now we add the callback to the event
    event.registerCallback(callback);
  }

  /** 
   * Listen to an event from the custom event system
   * @type {(eventName: string, callback: function) => void} 
   */
  on(eventName, callback) {
    if (typeof eventName !== 'string' || eventName === '' || typeof callback !== 'function') {
      return;
    }
    const split = eventName.split(' ');
    split.forEach(eventItem => {
      this._on(eventItem, callback);
    });
  }

  /** 
   * @private
   */
  _one(eventName, callback) {
    const newCallback = function (e) {
      this.off(eventName, newCallback);
      callback(e);
    }.bind(this);
    this.on(eventName, newCallback);
  }

  /** 
   * Listen once to an event from the custom event system
   * @type {(eventName: string, callback: function) => void} 
   */
  one(eventName, callback) {
    if (typeof eventName !== 'string' || eventName === '' || typeof callback !== 'function') {
      return;
    }
    const split = eventName.split(' ');
    split.forEach(eventItem => {
      this._one(eventItem, callback);
    });
  }

  /** 
   * @private
   */
  _off(eventName, callback) {
    // First get the correct event
    const event = this.events[eventName];
    // Check that the event exists and it has the callback registered
    if (event && event.callbacks.indexOf(callback) > -1) {
      // if it is registered then unregister it!
      event.unregisterCallback(callback);
      // if the event has no callbacks left, delete the event
      if (event.callbacks.length === 0) {
        delete this.events[eventName];
      }
    }
  }

  /** 
   * Unregister an event from the custom event system
   * @type {(eventName: string, callback: function) => void} 
   */
  off(eventName, callback) {
    if (typeof eventName !== 'string' || eventName === '' || typeof callback !== 'function') {
      return;
    }
    const split = eventName.split(' ');
    split.forEach(eventItem => {
      this._off(eventItem, callback);
    });
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
   * @private
   */
  _addTrackingEvents(trackingEvents) {
    const keys = Object.keys(trackingEvents);
    keys.forEach(key => {
      trackingEvents[key].forEach(url => {
        this.trackingTags.push({
          event: key,
          url: url
        });
      });
    });
  }

  /** 
   * @private
   */
  _parseCompanion(creative) {
    // reset variables in case wrapper
    this.validCompanionAds = [];
    this.companionAdsRequiredAttribute = '';
    if (creative.required) {
      this.companionAdsRequiredAttribute = creative.required;
    }
    const companions = creative.variations;
    // at least 1 Companion is expected to continue
    if (companions.length > 0) {
      for (let i = 0; i < companions.length; i++) {
        const companion = companions[i];
        const newCompanionAds = {
          width: companion.width,
          height: companion.height
        };
        const staticResourceFound = companion.staticResources.find(staticResource => {
          if (staticResource.url) {
            return true;
          }
        });
        const iframeResourceFound = companion.iframeResources.find(iframeResource => {
          if (iframeResource) {
            return true;
          }
        });
        const htmlResourceFound = companion.htmlResources.find(htmlResource => {
          if (htmlResource) {
            return true;
          }
        });
        if (staticResourceFound && staticResourceFound.url) {
          newCompanionAds.imageUrl = staticResourceFound.url;
        }
        if (iframeResourceFound && iframeResourceFound.length > 0) {
          newCompanionAds.iframeUrl = iframeResourceFound;
        }
        if (htmlResourceFound && htmlResourceFound.length > 0) {
          newCompanionAds.htmlContent = htmlResourceFound;
        }
        // if no companion content for this <Companion> then move on to the next
        if (typeof staticResourceFound === 'undefined' &&
          typeof iframeResourceFound === 'undefined' &&
          typeof htmlResourceFound === 'undefined') {
          continue;
        }
        if (companion.companionClickThroughURLTemplate) {
          newCompanionAds.companionClickThroughUrl = companion.companionClickThroughURLTemplate;
        }
        if (companion.companionClickTrackingURLTemplates.length > 0) {
          newCompanionAds.companionClickTrackingUrls = companion.companionClickTrackingURLTemplates;
        }
        if (companion.altText) {
          newCompanionAds.altText = companion.altText;
        }
        if (companion.adSlotID) {
          newCompanionAds.adSlotID = companion.adSlotID;
        }
        newCompanionAds.trackingEventsUrls = [];
        if (companion.trackingEvents && companion.trackingEvents.creativeView) {
          companion.trackingEvents.creativeView.forEach((creativeView) => {
            newCompanionAds.trackingEventsUrls.push(creativeView);
          });
        }
        this.validCompanionAds.push(newCompanionAds);
      }
    }

    console.log(`${FW.consolePrepend} Parse companion ads follow`, FW.consoleStyle, '');
    console.log(this.validCompanionAds);
  }

  /** 
   * @private
   */
  _handleIntersect(entries) {
    entries.forEach(entry => {
      if (entry.intersectionRatio > this.viewablePreviousRatio) {
        this.viewableObserver.unobserve(this.container);
        Utils.createApiEvent.call(this, 'adviewable');
        TRACKING_EVENTS.dispatch.call(this, 'viewable');
      }
      this.viewablePreviousRatio = entry.intersectionRatio;
    });
  }

  /** 
   * @private
   */
  _attachViewableObserver() {
    this.off('adstarted', this.attachViewableObserver);
    if (typeof window.IntersectionObserver !== 'undefined') {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: [0.5],
      };
      this.viewableObserver = new IntersectionObserver(this._handleIntersect.bind(this), options);
      this.viewableObserver.observe(this.container);
    } else {
      Utils.createApiEvent.call(this, 'adviewundetermined');
      TRACKING_EVENTS.dispatch.call(this, 'viewundetermined');
    }
  }

  /** 
   * @private
   */
  _initViewableImpression() {
    if (this.viewableObserver) {
      this.viewableObserver.unobserve(this.container);
    }
    this.ad.viewableImpression.forEach(viewableImpression => {
      if (viewableImpression.viewable.length > 0) {
        viewableImpression.viewable.forEach(url => {
          this.trackingTags.push({
            event: 'viewable',
            url: url
          });
        });
      }
      if (viewableImpression.notviewable.length > 0) {
        viewableImpression.notviewable.forEach(url => {
          this.trackingTags.push({
            event: 'notviewable',
            url: url
          });
        });
      }
      if (viewableImpression.viewundetermined.length > 0) {
        viewableImpression.viewundetermined.forEach(url => {
          this.trackingTags.push({
            event: 'viewundetermined',
            url: url
          });
        });
      }
    });
    this.attachViewableObserver = this._attachViewableObserver.bind(this);
    this.on('adstarted', this.attachViewableObserver);
  }

  /** 
   * @private
   */
  async _loopAds(ads) {
    for (let i = 0; i < ads.length; i++) {
      await new Promise(resolve => {
        const currentAd = ads[i];

        console.log(`${FW.consolePrepend} currentAd follows`, FW.consoleStyle, '');
        console.log(currentAd);

        this.ad.id = currentAd.id;
        this.ad.adServingId = currentAd.adServingId;
        this.ad.categories = currentAd.categories;
        if (this.requireCategory) {
          if (this.ad.categories.length === 0 || !this.ad.categories[0].authority) {
            Utils.processVastErrors.call(this, 204, true);
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
                Utils.processVastErrors.call(this, 205, true);
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
        ads.find(ad => {
          this.adPod = false;
          if (ad.sequence && ad.sequence > 1) {
            this.adPod = true;
            return true;
          }
        });
        // this is to fix a weird bug in vast-client-js - sometimes it returns sequence === null for some items when
        // adpod is made of redirects
        if (this.adPod) {
          let max = ads.reduce(function (prev, current) {
            return (prev.sequence > current.sequence) ? prev : current;
          }).sequence;
          ads.forEach(ad => {
            if (ad.sequence === null) {
              ad.sequence = max + 1;
              max++;
            }
          });
        }
        if (this.adPod) {
          this.adSequence++;
          if (this.adPodLength === 0) {
            let adPodLength = 0;
            ads.forEach(ad => {
              if (ad.sequence) {
                adPodLength++;
              }
            });
            this.adPodLength = adPodLength;

            console.log(`${FW.consolePrepend} AdPod detected with length ${this.adPodLength}`, FW.consoleStyle, '');
          }
        }
        this.ad.viewableImpression = currentAd.viewableImpression;
        if (this.ad.viewableImpression.length > 0) {
          this._initViewableImpression();
        }
        currentAd.errorURLTemplates.forEach(errorURLTemplate => {
          this.adErrorTags.push({
            event: 'error',
            url: errorURLTemplate
          });
        });
        currentAd.impressionURLTemplates.forEach(impression => {
          if (impression.url) {
            this.trackingTags.push({
              event: 'impression',
              url: impression.url
            });
          }
        });
        this.one('addestroyed', () => {
          if (this.adPod && this.adSequence === this.adPodLength) {
            this.adPodLength = 0;
            this.adSequence = 0;
            this.adPod = false;
            Utils.createApiEvent.call(this, 'adpodcompleted');
          }
          resolve();
        });
        // parse companion
        const creatives = currentAd.creatives;

        console.log(`${FW.consolePrepend} Parsed creatives follow`, FW.consoleStyle, '');
        console.log(creatives);

        creatives.find(creative => {
          if (creative.type === 'companion') {
            console.log(`${FW.consolePrepend} Creative type companion detected`, FW.consoleStyle, '');

            this._parseCompanion(creative);
            return true;
          }
        });
        for (let k = 0; k < creatives.length; k++) {
          const creative = creatives[k];
          // companion >> continue
          if (creative.type === 'companion') {
            continue;
          }
          this.creative.id = creative.id;
          this.creative.universalAdIds = creative.universalAdIds;
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
                creative.videoClickTrackingURLTemplates.forEach((videoClickTrackingURLTemplate) => {
                  if (videoClickTrackingURLTemplate.url) {
                    this.trackingTags.push({
                      event: 'clickthrough',
                      url: videoClickTrackingURLTemplate.url
                    });
                  }
                });
              }
              this.creative.isLinear = true;
              if (creative.interactiveCreativeFile &&
                /simid/i.test(creative.interactiveCreativeFile.apiFramework) &&
                /text\/html/i.test(creative.interactiveCreativeFile.type)) {
                this.creative.simid = {
                  fileURL: creative.interactiveCreativeFile.fileURL,
                  variableDuration: creative.interactiveCreativeFile.variableDuration,
                  adParameters: creative.adParameters
                };
              }
              this._addTrackingEvents(creative.trackingEvents);
              LINEAR.parse.call(this, creative.icons, creative.adParameters, creative.mediaFiles);
              if (this.params.omidSupport && currentAd.adVerifications.length > 0) {
                const omSdkManager = new OmSdkManager(
                  currentAd.adVerifications,
                  this.contentPlayer,
                  this.vastPlayer,
                  this.params,
                  this.getIsSkippableAd(),
                  this.getSkipTimeOffset()
                );
                omSdkManager.init();
              }
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

  /** 
   * @private
   */
  _handleParsedVast(response) {
    console.log(`${FW.consolePrepend} VAST response follows`, FW.consoleStyle, '');
    console.log(response);

    // error at VAST/Error level
    if (response.errorURLTemplates.length > 0) {
      response.errorURLTemplates.forEach(errorURLTemplate => {
        this.vastErrorTags.push({
          event: 'error',
          url: errorURLTemplate
        });
      });
    }
    // VAST/Ad 
    if (response.ads.length === 0) {
      Utils.processVastErrors.call(this, 303, true);
      return;
    } else {
      this._loopAds(response.ads);
    }
  }

  /** 
   * @private
   */
  _getVastTag(vastData) {
    // we check for required VAST input and API here
    // as we need to have this.currentContentSrc available for iOS
    if (typeof vastData !== 'string' || vastData === '') {
      Utils.processVastErrors.call(this, 1001, false);
      return;
    }
    if (typeof DOMParser === 'undefined') {
      Utils.processVastErrors.call(this, 1002, false);
      return;
    }
    Utils.createApiEvent.call(this, 'adtagstartloading');
    if (!this.params.vastXmlInput) {
      const vastClient = new VASTClient();
      const options = {
        timeout: this.params.ajaxTimeout,
        withCredentials: this.params.ajaxWithCredentials,
        wrapperLimit: this.params.maxNumRedirects,
        resolveAll: false,
        allowMultipleAds: true
      };
      this.adTagUrl = vastData;

      console.log(`${FW.consolePrepend} Try to load VAST tag at: ${this.adTagUrl}`, FW.consoleStyle, '');

      vastClient.get(this.adTagUrl, options).then(response => {
        Utils.createApiEvent.call(this, 'adtagloaded');
        this._handleParsedVast(response);
      }).catch(error => {
        console.warn(error);
        // PING 900 Undefined Error.
        Utils.processVastErrors.call(this, 900, true);
      });
    } else {
      // input is not a VAST URI but raw VAST XML -> we parse it and proceed
      let vastXml;
      try {
        vastXml = (new DOMParser()).parseFromString(vastData, 'text/xml');
      } catch (error) {
        console.warn(error);
        // PING 900 Undefined Error.
        Utils.processVastErrors.call(this, 900, true);
        return;
      }
      const vastParser = new VASTParser();
      vastParser.parseVAST(vastXml).then(response => {
        Utils.createApiEvent.call(this, 'adtagloaded');
        this._handleParsedVast(response);
      }).catch(error => {
        console.warn(error);
        // PING 900 Undefined Error.
        Utils.processVastErrors.call(this, 900, true);
      });
    }
  }

  /** 
   * @param {string} vastData - the URI to the VAST resource to be loaded - or raw VAST XML if params.vastXmlInput is true
   * @param {object} [regulationsInfo] - data for regulations as
   * @param {string} [regulationsInfo.regulations] - coppa|gdpr for REGULATIONS macro
   * @param {string} [regulationsInfo.limitAdTracking] - 0|1 for LIMITADTRACKING macro
   * @param {string} [regulationsInfo.gdprConsent] - Base64-encoded Cookie Value of IAB GDPR consent info for 
   *  GDPRCONSENT macro
   * @param {boolean} [requireCategory] - for enforcement of VAST 4 Ad Categories
   * @return {void}
   */
  loadAds(vastData, regulationsInfo, requireCategory) {
    console.log(`${FW.consolePrepend} loadAds method starts`, FW.consoleStyle, '');

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
    let finalVastData = vastData;
    if (!this.params.vastXmlInput) {
      // we have a VAST URI replaceMacros
      finalVastData = TRACKING_EVENTS.replaceMacros.call(this, vastData, false);
    }

    // if an ad is already on stage we need to clear it first before we can accept another ad request
    if (this.getAdOnStage()) {
      console.log(
        `${FW.consolePrepend} Creative already on stage calling stopAds before loading new ad`,
        FW.consoleStyle,
        ''
      );

      const _onDestroyLoadAds = function (vastData) {
        this.loadAds(vastData);
      };
      this.one('addestroyed', _onDestroyLoadAds.bind(this, finalVastData));
      this.stopAds();
      return;
    }
    // for useContentPlayerForAds we need to know early what is the content src
    // so that we can resume content when ad finishes or on aderror
    const contentCurrentTime = CONTENT_PLAYER.getCurrentTime.call(this);
    if (this.useContentPlayerForAds) {
      this.currentContentSrc = this.contentPlayer.src;

      console.log(`${FW.consolePrepend} currentContentSrc is ${this.currentContentSrc}`, FW.consoleStyle, '');

      this.currentContentCurrentTime = contentCurrentTime;

      console.log(
        `${FW.consolePrepend} currentContentCurrentTime is ${this.currentContentCurrentTime}`,
        FW.consoleStyle,
        ''
      );

      // on iOS we need to prevent seeking when linear ad is on stage
      CONTENT_PLAYER.preventSeekingForCustomPlayback.call(this);
    }
    this._getVastTag(finalVastData);
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
      } else if (this.simidPlayer) {
        this.simidPlayer.stopAd();
      } else {
        // this will destroy ad
        VAST_PLAYER.resumeContent.call(this);
      }
    }
  }

  /** 
   * The difference between stopAds and destroy is that after calling destroy you may not call loadAds again
   * You will need to create a new RmpVast instance. 
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
    Utils.initInstanceVariables.call(this);
  }

  /** 
   * @type {() => void} 
   */
  skipAd() {
    if (this.adOnStage && this.getAdSkippableState()) {
      if (this.isVPAID) {
        VPAID.skipAd.call(this);
      } else if (this.simidPlayer) {
        this.simidPlayer.skipAd();
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
    return '';
  }

  /** 
   * @type {() => boolean} 
   */
  getAdLinear() {
    if (this.creative && this.creative.isLinear) {
      return true;
    }
    return false;
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
      return {
        value: this.ad.system.value || '',
        version: this.ad.system.version || ''

      };
    }
    return {
      value: '',
      version: ''
    };
  }

  /** 
   * @typedef {object} universalAdId
   * @property {string} idRegistry
   * @property {string} value
   * @return {universalAdId[]}
   */
  getAdUniversalAdIds() {
    // <UniversalAdId idRegistry="daily-motion-L">Linear-12345</UniversalAdId>
    // [{idRegistry: String, value: String}]
    if (this.creative && this.creative.universalAdIds) {
      return this.creative.universalAdIds;
    }
    return [];
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
    if (this.ad && this.ad.advertiser && this.ad.advertiser !== null) {
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
    if (this.ad && this.ad.pricing && this.ad.pricing !== null) {
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
        return Math.round(duration);
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
        return Math.round(duration - remainingTime) * 1000;
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
        let adRemainingTime = VPAID.getAdRemainingTime.call(this);
        if (adRemainingTime > 0) {
          adRemainingTime = adRemainingTime * 1000;
        }
        return Math.round(adRemainingTime);
      } else {
        const currentTime = VAST_PLAYER.getCurrentTime.call(this);
        const duration = VAST_PLAYER.getDuration.call(this);
        if (currentTime === -1 || duration === -1 || currentTime > duration) {
          return -1;
        }
        return duration - currentTime;
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
      } else if (this.simidPlayer) {
        return true;
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
        availableCompanionAds = this.validCompanionAds.filter(companionAds => {
          return inputWidth >= companionAds.width && inputHeight >= companionAds.height;
        });
      } else {
        availableCompanionAds = this.validCompanionAds;
      }
      if (availableCompanionAds.length > 0) {
        this.companionAdsList = availableCompanionAds;
        return this.companionAdsList;
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
          trackingEventsUrls.forEach(trackingEventsUrl => {
            TRACKING_EVENTS.pingURI.call(this, trackingEventsUrl);
          });
        };
        html.onerror = () => {
          TRACKING_EVENTS.error.call(this, 603);
        };
      }
      let companionClickTrackingUrls = null;
      if (companionAd.companionClickTrackingUrls) {

        console.log(`${FW.consolePrepend} Companion click tracking URIs`, FW.consoleStyle, '');
        console.log(companionClickTrackingUrls);

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
        html.addEventListener(
          'touchend',
          _onImgClickThrough.bind(this, companionAd.companionClickThroughUrl, companionClickTrackingUrls)
        );
        html.addEventListener(
          'click',
          _onImgClickThrough.bind(this, companionAd.companionClickThroughUrl, companionClickTrackingUrls)
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
        html = html.documentElement;
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
      console.log(`${FW.consolePrepend} Upon user interaction - player needs to be initialized`, FW.consoleStyle, '');
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
