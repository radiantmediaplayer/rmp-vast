/**
 * @license Copyright (c) 2015-2024 Radiant Media Player | https://www.radiantmediaplayer.com
 * rmp-vast
 * GitHub: https://github.com/radiantmediaplayer/rmp-vast
 * MIT License: https://github.com/radiantmediaplayer/rmp-vast/blob/master/LICENSE
 */

import FW from './framework/fw';
import Environment from './framework/environment';
import Utils from './framework/utils';
import LinearCreative from './creatives/linear';
import NonLinearCreative from './creatives/non-linear';
import AdPlayer from './players/ad-player';
import Tracking from './tracking/tracking';
import OmSdkManager from './verification/omsdk';
import Dispatcher from './framework/dispatcher';
import ContentPlayer from './players/content-player';
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
   * @property {string} [textForInteractionUIOnMobile] 
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
   * @property {boolean} [showControlsForAdPlayer] - Shows Ad player HTML5 default video controls. Default: false.
   * @property {boolean} [vastXmlInput] - Instead of a VAST URI, we provide directly to rmp-vast VAST XML. Default: false.
   * @property {boolean} [enableVpaid] - Enables VPAID support or not. Default: true.
   * @property {VpaidSettings} [vpaidSettings] - Information required to display VPAID creatives - note that it is up 
   *  to the parent application of rmp-vast to provide those informations
   * @property {boolean} [useHlsJS] - Enables hls.js usage to display creatives delivered in HLS format on all devices. Include hls.js library (./externals/hls/hls.min.js) in your page before usage. Default: false.
   * @property {boolean} [debugHlsJS] - Enables debug log when hls.js is used to stream creatives. Default: false.
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
    this.contentWrapper = this.container.querySelector('.rmp-content');
    this.__contentPlayer = this.container.querySelector('.rmp-video');

    if (this.container === null || this.contentWrapper === null || this.__contentPlayer === null) {
      console.error(`Invalid DOM layout - missing container or content wrapper or content player - exit`);
      return;
    }

    console.log(`${FW.consolePrepend} Creating new RmpVast instance`, FW.consoleStyle, '');

    this.rmpVastContentPlayer = new ContentPlayer(this);

    FW.logVideoEvents(this.__contentPlayer, 'content');
    // reset loadAds variables - this is reset at addestroyed 
    // so that next loadAds is cleared
    Utils.resetVariablesForNewLoadAds.call(this);
    // handle fullscreen events
    Utils.handleFullscreen.call(this);
    // filter input params
    Utils.filterParams.call(this, params);

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
      event = new Dispatcher(eventName);
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
    const newCallback = (e) => {
      this.off(eventName, newCallback);
      callback(e);
    };
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
    this.__companionAdsRequiredAttribute = '';
    if (creative.required) {
      this.__companionAdsRequiredAttribute = creative.required;
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
        if (companion.adSlotId) {
          newCompanionAds.adSlotId = companion.adSlotId;
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
        Tracking.dispatch.call(this, 'viewable');
      }
      this.viewablePreviousRatio = entry.intersectionRatio;
    });
  }

  /** 
   * @private
   */
  _attachViewableObserver() {
    this.off('adstarted', this.attachViewableObserverFn);
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
      Tracking.dispatch.call(this, 'viewundetermined');
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
      if (viewableImpression.notViewable.length > 0) {
        viewableImpression.notViewable.forEach(url => {
          this.trackingTags.push({
            event: 'notviewable',
            url: url
          });
        });
      }
      if (viewableImpression.viewUndetermined.length > 0) {
        viewableImpression.viewUndetermined.forEach(url => {
          this.trackingTags.push({
            event: 'viewundetermined',
            url: url
          });
        });
      }
    });
    this.attachViewableObserverFn = this._attachViewableObserver.bind(this);
    this.on('adstarted', this.attachViewableObserverFn);
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
          let max = ads.reduce((prev, current) => {
            return (prev.sequence > current.sequence) ? prev : current;
          }).sequence;
          ads.forEach(ad => {
            if (ad.sequence === null) {
              ad.sequence = max + 1;
              max++;
            }
          });

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

          this.one('addestroyed', () => {
            if (this.adSequence === this.adPodLength) {
              this.adPodLength = 0;
              this.adSequence = 0;
              this.adPod = false;
              Utils.createApiEvent.call(this, 'adpodcompleted');
            }
            resolve();
          });
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
                };
                if (creative.adParameters && creative.adParameters.value) {
                  this.creative.simid.adParameters = creative.adParameters.value;
                }
              }
              this._addTrackingEvents(creative.trackingEvents);
              this.rmpVastLinearCreative = new LinearCreative(this);
              this.rmpVastLinearCreative.parse(creative);
              if (this.params.omidSupport && currentAd.adVerifications.length > 0) {
                const omSdkManager = new OmSdkManager(currentAd.adVerifications, this);
                omSdkManager.init();
              }
              break;
            case 'nonlinear':
              this.creative.isLinear = false;
              this._addTrackingEvents(creative.trackingEvents);
              this.rmpVastNonLinearCreative = new NonLinearCreative(this);
              this.rmpVastNonLinearCreative.parse(creative.variations);
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
      this.__adTagUrl = vastData;

      console.log(`${FW.consolePrepend} Try to load VAST tag at: ${this.__adTagUrl}`, FW.consoleStyle, '');

      vastClient.get(this.__adTagUrl, options).then(response => {
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
    if (!this.__initialized) {
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
      finalVastData = Tracking.replaceMacros.call(this, vastData, false);
    }

    // if an ad is already on stage we need to clear it first before we can accept another ad request
    if (this.__adOnStage) {
      console.log(
        `${FW.consolePrepend} Creative already on stage calling stopAds before loading new ad`,
        FW.consoleStyle,
        ''
      );
      this.one('addestroyed', this.loadAds.bind(this, finalVastData));
      this.stopAds();
      return;
    }
    this._getVastTag(finalVastData);
  }

  /** 
   * @type {() => void} 
   */
  play() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        this.rmpVastVpaidPlayer.resumeAd();
      } else if (this.rmpVastAdPlayer) {
        this.rmpVastAdPlayer.play();
      }
    } else {
      this.rmpVastContentPlayer.play();
    }
  }

  /** 
   * @type {() => void} 
   */
  pause() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        this.rmpVastVpaidPlayer.pauseAd();
      } else if (this.rmpVastAdPlayer) {
        this.rmpVastAdPlayer.pause();
      }
    } else {
      this.rmpVastContentPlayer.pause();
    }
  }

  /** 
   * @type {() => void} 
   */
  stopAds() {
    if (this.__adOnStage) {
      if (this.rmpVastVpaidPlayer) {
        this.rmpVastVpaidPlayer.stopAd();
      } else if (this.rmpVastSimidPlayer) {
        this.rmpVastSimidPlayer.stopAd();
      } else if (this.rmpVastAdPlayer) {
        // this will destroy ad
        this.rmpVastAdPlayer.resumeContent();
      }
    }
  }

  /** 
   * The difference between stopAds and destroy is that after calling destroy you may not call loadAds again
   * You will need to create a new RmpVast instance. 
   * @type {() => void} 
   */
  destroy() {
    if (this.__contentPlayer) {
      this.__contentPlayer.removeEventListener('webkitbeginfullscreen', this.onFullscreenchangeFn);
      this.__contentPlayer.removeEventListener('webkitendfullscreen', this.onFullscreenchangeFn);
    } else {
      document.removeEventListener('fullscreenchange', this.onFullscreenchangeFn);
    }
    if (this.rmpVastAdPlayer) {
      this.rmpVastAdPlayer.destroy();
    }
    Utils.initInstanceVariables.call(this);
  }

  /** 
   * @type {() => void} 
   */
  skipAd() {
    if (this.__adOnStage && this.adSkippableState) {
      if (this.rmpVastVpaidPlayer) {
        this.rmpVastVpaidPlayer.skipAd();
      } else if (this.rmpVastSimidPlayer) {
        this.rmpVastSimidPlayer.skipAd();
      } else if (this.rmpVastAdPlayer) {
        // this will destroy ad
        this.rmpVastAdPlayer.resumeContent();
      }
    }
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
  get environment() {
    return Environment;
  }

  /** 
   * @type {() => boolean} 
   */
  get adPaused() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        return this.rmpVastVpaidPlayer.getAdPaused();
      } else if (this.__adPlayer) {
        return this.__adPlayer.paused;
      }
    }
    return false;
  }

  /** 
   * @type {(level: number) => void} 
   */
  set volume(level) {
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
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        this.rmpVastVpaidPlayer.setAdVolume(validatedLevel);
      }
      if (this.rmpVastAdPlayer) {
        this.rmpVastAdPlayer.volume = validatedLevel;
      }
    }
    this.rmpVastContentPlayer.volume = validatedLevel;
  }

  /** 
   * @type {() => number} 
   */
  get volume() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        return this.rmpVastVpaidPlayer.getAdVolume();
      } else if (this.rmpVastAdPlayer) {
        return this.rmpVastAdPlayer.volume;
      }
    }
    return this.rmpVastContentPlayer.volume;
  }

  /** 
   * @type {(muted: boolean) => void} 
   */
  set muted(muted) {
    if (typeof muted !== 'boolean') {
      return;
    }
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        if (muted) {
          this.rmpVastVpaidPlayer.setAdVolume(0);
        } else {
          this.rmpVastVpaidPlayer.setAdVolume(1);
        }
      } else if (this.rmpVastAdPlayer) {
        this.rmpVastAdPlayer.muted = muted;
      }
    }
    this.rmpVastContentPlayer.muted = muted;
  }

  /** 
   * @type {() => boolean} 
   */
  get muted() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        if (this.rmpVastVpaidPlayer.getAdVolume() === 0) {
          return true;
        }
        return false;
      } else if (this.rmpVastAdPlayer) {
        return this.rmpVastAdPlayer.muted;
      }
    }
    return this.rmpVastContentPlayer.muted;
  }

  /** 
   * @type {() => string} 
   */
  get adTagUrl() {
    return this.__adTagUrl;
  }

  /** 
   * @type {() => string} 
   */
  get adMediaUrl() {
    if (this.__adOnStage) {
      if (this.rmpVastVpaidPlayer) {
        return this.rmpVastVpaidPlayer.getCreativeUrl();
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
  get adLinear() {
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
  get adSystem() {
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
  get adUniversalAdIds() {
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
  get adContentType() {
    if (this.creative && this.creative.type) {
      return this.creative.type;
    }
    return '';
  }

  /** 
   * @type {() => string} 
   */
  get adTitle() {
    if (this.ad && this.ad.title) {
      return this.ad.title;
    }
    return '';
  }

  /** 
   * @type {() => string} 
   */
  get adDescription() {
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
  get adAdvertiser() {
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
  get adPricing() {
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
  get adSurvey() {
    if (this.ad && this.ad.survey) {
      return this.ad.survey;
    }
    return {
      value: '',
      type: ''
    };
  }

  /** 
   * @type {() => string} 
   */
  get adAdServingId() {
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
  get adCategories() {
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
  get adBlockedAdCategories() {
    // <BlockedAdCategories authority=”iabtechlab.com”>232</BlockedAdCategories> 
    if (this.ad && this.ad.blockedAdCategories && this.ad.blockedAdCategories.length > 0) {
      return this.ad.blockedAdCategories;
    }
    return [];
  }

  /** 
   * @type {() => number} 
   */
  get adDuration() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        let duration = this.rmpVastVpaidPlayer.getAdDuration();
        if (duration > 0) {
          duration = duration * 1000;
        }
        return duration;
      } else if (this.rmpVastAdPlayer) {
        return this.rmpVastAdPlayer.duration;
      }
    }
    return -1;
  }

  /** 
   * @type {() => number} 
   */
  get adCurrentTime() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        const remainingTime = this.rmpVastVpaidPlayer.getAdRemainingTime();
        const duration = this.rmpVastVpaidPlayer.getAdDuration();
        if (remainingTime === -1 || duration === -1 || remainingTime > duration) {
          return -1;
        }
        return (duration - remainingTime) * 1000;
      } else if (this.rmpVastAdPlayer) {
        return this.rmpVastAdPlayer.currentTime;
      }
    }
    return -1;
  }

  /** 
   * @type {() => number} 
   */
  get adRemainingTime() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        let adRemainingTime = this.rmpVastVpaidPlayer.getAdRemainingTime();
        if (adRemainingTime > 0) {
          adRemainingTime = adRemainingTime * 1000;
        }
        return adRemainingTime;
      } else if (this.rmpVastAdPlayer) {
        const currentTime = this.rmpVastAdPlayer.currentTime;
        const duration = this.rmpVastAdPlayer.duration;
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
  get adOnStage() {
    return this.__adOnStage;
  }

  /** 
   * @type {() => number} 
   */
  get adMediaWidth() {
    if (this.__adOnStage) {
      if (this.rmpVastVpaidPlayer) {
        return this.rmpVastVpaidPlayer.getAdWidth();
      } else if (this.creative && this.creative.width) {
        return this.creative.width;
      }
    }
    return -1;
  }

  /** 
   * @type {() => number} 
   */
  get adMediaHeight() {
    if (this.__adOnStage) {
      if (this.rmpVastVpaidPlayer) {
        return this.rmpVastVpaidPlayer.getAdHeight();
      } else if (this.creative && this.creative.height) {
        return this.creative.height;
      }
    }
    return -1;
  }

  /** 
   * @type {() => string} 
   */
  get clickThroughUrl() {
    if (this.creative && this.creative.clickThroughUrl) {
      return this.creative.clickThroughUrl;
    }
    return '';
  }

  /** 
   * @type {() => number} 
   */
  get skipTimeOffset() {
    if (this.creative && this.creative.skipoffset) {
      return this.creative.skipoffset;
    }
    return -1;
  }

  /** 
   * @type {() => boolean} 
   */
  get isSkippableAd() {
    if (this.creative && this.creative.isSkippableAd) {
      return true;
    }
    return false;
  }

  /** 
   * @type {() => boolean} 
   */
  get contentPlayerCompleted() {
    return this.__contentPlayerCompleted;
  }

  /** 
   * @param {boolean} value
   * @return {void}
   */
  set contentPlayerCompleted(value) {
    if (typeof value === 'boolean') {
      this.__contentPlayerCompleted = value;
    }
  }

  /** 
   * @type {() => string} 
   */
  get adErrorMessage() {
    return this.__adErrorMessage;
  }

  /** 
   * @type {() => number} 
   */
  get adVastErrorCode() {
    return this.__vastErrorCode;
  }

  /** 
   * @type {() => string} 
   */
  get adErrorType() {
    return this.__adErrorType;
  }

  /** 
   * @type {() => boolean} 
   */
  get adSkippableState() {
    if (this.__adOnStage) {
      if (this.rmpVastVpaidPlayer) {
        return this.rmpVastVpaidPlayer.getAdSkippableState();
      } else if (this.rmpVastSimidPlayer) {
        return true;
      } else {
        if (this.isSkippableAd && this.rmpVastLinearCreative) {
          return this.rmpVastLinearCreative.skippableAdCanBeSkipped;
        }
      }
    }
    return false;
  }

  /** 
   * @return {HTMLMediaElement|null}
   */
  get adPlayer() {
    return this.__adPlayer;
  }

  /** 
   * @return {HTMLMediaElement|null}
   */
  get contentPlayer() {
    return this.__contentPlayer;
  }

  /** 
   * @type {() => boolean} 
   */
  get initialized() {
    return this.__initialized;
  }

  /** 
   * @typedef {object} AdPod
   * @property {number} adPodCurrentIndex
   * @property {number} adPodLength
   * @return {AdPod}
   */
  get adPodInfo() {
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

  /** 
   * @type {() => string} 
   */
  get companionAdsRequiredAttribute() {
    return this.__companionAdsRequiredAttribute;
  }

  /** 
   * @param {number} inputWidth
   * @param {number} inputHeight
   * @typedef {object} Companion
   * @property {string} adSlotId
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
   * @private
   */
  _onImgClickThrough(companionClickThroughUrl, companionClickTrackingUrls, event) {
    if (event) {
      event.stopPropagation();
      if (event.type === 'touchend') {
        event.preventDefault();
      }
    }
    if (companionClickTrackingUrls) {
      companionClickTrackingUrls.forEach(companionClickTrackingUrl => {
        if (companionClickTrackingUrl.url) {
          Tracking.pingURI.call(this, companionClickTrackingUrl.url);
        }
      });
    }
    FW.openWindow(companionClickThroughUrl);
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
            Tracking.pingURI.call(this, trackingEventsUrl);
          });
        };
        html.onerror = () => {
          Tracking.error.call(this, 603);
        };
      }
      let companionClickTrackingUrls = null;
      if (companionAd.companionClickTrackingUrls) {

        console.log(`${FW.consolePrepend} Companion click tracking URIs`, FW.consoleStyle, '');
        console.log(companionClickTrackingUrls);

        companionClickTrackingUrls = companionAd.companionClickTrackingUrls;
      }
      if (companionAd.companionClickThroughUrl) {
        const _onImgClickThroughFn = this._onImgClickThrough.bind(
          this,
          companionAd.companionClickThroughUrl,
          companionClickTrackingUrls
        );
        FW.addEvents(['touchend', 'click'], html, _onImgClickThroughFn);
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
   * @type {() => void} 
   */
  initialize() {
    if (!this.__initialized) {
      console.log(`${FW.consolePrepend} Upon user interaction - player needs to be initialized`, FW.consoleStyle, '');
      this.rmpVastAdPlayer = new AdPlayer(this);
      this.rmpVastAdPlayer.init();
    }
  }

  // VPAID methods
  /** 
   * @type {(width: number, height: number, viewMode: string) => void} 
   */
  resizeAd(width, height, viewMode) {
    if (this.rmpVastVpaidPlayer) {
      this.rmpVastVpaidPlayer.resizeAd(width, height, viewMode);
    }
  }

  /** 
   * @type {() => void} 
   */
  expandAd() {
    if (this.rmpVastVpaidPlayer) {
      this.rmpVastVpaidPlayer.expandAd();
    }
  }

  /** 
   * @type {() => void} 
   */
  collapseAd() {
    if (this.rmpVastVpaidPlayer) {
      this.rmpVastVpaidPlayer.collapseAd();
    }
  }

  /** 
   * @type {() => boolean} 
   */
  get adExpanded() {
    if (this.rmpVastVpaidPlayer) {
      this.rmpVastVpaidPlayer.getAdExpanded();
    }
    return false;
  }

  /** 
   * @type {() => string} 
   */
  get vpaidCompanionAds() {
    if (this.rmpVastVpaidPlayer) {
      this.rmpVastVpaidPlayer.getAdCompanions();
    }
    return '';
  }
}
