import FW from './framework/fw';
import Environment from './framework/environment';
import Logger from './framework/logger';
import Utils from './helpers/utils';
import Tracking from './helpers/tracking';
import LinearCreative from './creatives/linear';
import NonLinearCreative from './creatives/non-linear';
import CompanionCreative from './creatives/companion';
import AdPlayer from './players/ad-player';
import OmSdkManager from './verification/omsdk';
import Dispatcher from './framework/dispatcher';
import ContentPlayer from './players/content-player';
import { VASTClient } from '@dailymotion/vast-client';

import '../css/rmp-vast.css';


/**
 * The class to instantiate RmpVast
 * @export
 * @class RmpVast
*/
export default class RmpVast {

  /**
   * @constructor
   * @param {string|HTMLElement}  idOrElement - the id or element for the player container. Required parameter.
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
   * @property {boolean} [useHlsJS] - Enables hls.js usage to display creatives delivered in HLS format on all devices. Include hls.js library (./externals/hls/hls.min.js) in your page before usage. Default: true.
   * @property {boolean} [debugHlsJS] - Enables debug log when hls.js is used to stream creatives. Default: false.
   * @property {boolean} [debugRawConsoleLogs] - Enables raw debug console log for Flutter apps and legacy platforms. Default: false.
  * @property {boolean} [omidSupport] - Enables OMID (OM Web SDK) support in rmp-vast. Default: false.
   * @property {string[]} [omidAllowedVendors] - List of allowed vendors for ad verification. Vendors not listed will 
   *  be rejected. Default: [].
   * @property {boolean} [omidAutoplay] - The content player will autoplay or not. The possibility of autoplay is not 
   *  determined by rmp-vast, this information needs to be passed to rmp-vast (see this 
   *  script for example). Default: false (means a click to play is required).
   * @property {string} [partnerName] - partnerName for OMID. Default: 'rmp-vast'.
   * @property {string} [partnerVersion] - partnerVersion for OMID. Default: current rmp-vast version 'x.x.x'.
   * @property {Labels} [labels] - Information required to properly display VPAID creatives - note that it is up to the 
   *  parent application of rmp-vast to provide those informations
   * @property {object} [macros] - 
   * @param {RmpVastParams} [params] - An object representing various parameters that can be passed to a rmp-vast 
   *  instance and that will affect the player inner-workings. Optional parameter.
   */
  constructor(idOrElement, params) {
    // reset instance variables - once per session
    this.#initInstanceVariables();

    if (typeof idOrElement === 'string' && idOrElement !== '') {
      this.container = document.getElementById(idOrElement);
    } else if (typeof idOrElement !== 'undefined' && idOrElement instanceof HTMLElement) {
      this.container = idOrElement;
    } else {
      console.error(`Invalid idOrElement to create new instance - exit`);
      return;
    }


    this.contentWrapper = this.container.querySelector('.rmp-content');
    this.currentContentPlayer = this.container.querySelector('.rmp-video');

    if (this.container === null || this.contentWrapper === null || this.currentContentPlayer === null) {
      console.error(`Invalid DOM layout - missing container or content wrapper or content player - exit`);
      return;
    }

    // filter input params
    this.rmpVastUtils = new Utils(this);
    this.rmpVastUtils.filterParams(params);
    if (this.params.debugRawConsoleLogs) {
      this.debugRawConsoleLogs = true;
    }

    Logger.print(this.debugRawConsoleLogs, `Filtered params follow`, this.params);

    Logger.print(this.debugRawConsoleLogs, `Creating new RmpVast instance`);

    this.rmpVastContentPlayer = new ContentPlayer(this);
    this.rmpVastTracking = new Tracking(this);
    this.rmpVastCompanionCreative = new CompanionCreative(this);
    this.environmentData = Environment;

    Logger.printVideoEvents(this.debugRawConsoleLogs, this.currentContentPlayer, 'content');
    // reset loadAds variables - this is reset at addestroyed 
    // so that next loadAds is cleared
    this.resetVariablesForNewLoadAds();
    // handle fullscreen events
    this.rmpVastUtils.handleFullscreen();
  }

  #initInstanceVariables() {
    this.adContainer = null;
    this.contentWrapper = null;
    this.container = null;
    this.rmpVastContentPlayer = null;
    this.rmpVastAdPlayer = null;
    this.rmpVastUtils = null;
    this.rmpVastTracking = null;
    this.rmpVastCompanionCreative = null;
    this.environmentData = null;
    this.currentContentSrc = '';
    this.currentContentCurrentTime = -1;
    this.params = {};
    this.events = {};
    this.isInFullscreen = false;
    this.contentCompleted = false;
    this.currentContentPlayer = null;
    this.currentAdPlayer = null;
    this.rmpVastInitialized = false;
    this.debugRawConsoleLogs = false;
    // adpod
    this.adPod = false;
    this.adPodLength = 0;
    this.adSequence = 0;
  }

  resetVariablesForNewLoadAds() {
    if (this.attachViewableObserverFn) {
      this.off('adstarted', this.attachViewableObserverFn);
    }
    this.rmpVastTracking.reset();
    this.rmpVastCompanionCreative.reset();
    this.trackingTags = [];
    this.vastErrorTags = [];
    this.adErrorTags = [];
    this.needsSeekAdjust = false;
    this.seekAdjustAttached = false;
    this.ad = {};
    this.creative = {};
    this.attachViewableObserverFn = null;
    this.viewableObserver = null;
    this.viewablePreviousRatio = 0.5;
    this.regulationsInfo = {};
    this.requireCategory = false;
    this.progressEvents = [];
    this.rmpVastLinearCreative = null;
    this.rmpVastNonLinearCreative = null;
    this.rmpVastVpaidPlayer = null;
    this.adParametersData = '';
    this.rmpVastSimidPlayer = null;
    this.rmpVastIcons = null;
    // for public getters
    this.__adTagUrl = '';
    this.__vastErrorCode = -1;
    this.__adErrorType = '';
    this.__adErrorMessage = '';
    this.__adOnStage = false;
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
  #on(eventName, callback) {
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
      this.#on(eventItem, callback);
    });
  }

  /** 
   * @private
   */
  #one(eventName, callback) {
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
      this.#one(eventItem, callback);
    });
  }

  /** 
   * @private
   */
  #off(eventName, callback) {
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
      this.#off(eventItem, callback);
    });
  }

  /** 
   * @private
   */
  #addTrackingEvents(trackingEvents) {
    const keys = Object.keys(trackingEvents);
    keys.forEach(key => {
      trackingEvents[key].forEach(url => {
        this.trackingTags.push({
          event: key,
          url
        });
      });
    });
  }

  /** 
   * @private
   */
  #handleIntersect(entries) {
    entries.forEach(entry => {
      if (entry.intersectionRatio > this.viewablePreviousRatio) {
        this.viewableObserver.unobserve(this.container);
        this.rmpVastTracking.dispatchTrackingAndApiEvent('adviewable');
      }
      this.viewablePreviousRatio = entry.intersectionRatio;
    });
  }

  /** 
   * @private
   */
  #attachViewableObserver() {
    this.off('adstarted', this.attachViewableObserverFn);
    if (typeof window.IntersectionObserver !== 'undefined') {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: [0.5],
      };
      this.viewableObserver = new IntersectionObserver(this.#handleIntersect.bind(this), options);
      this.viewableObserver.observe(this.container);
    } else {
      this.rmpVastTracking.dispatchTrackingAndApiEvent('adviewundetermined');
    }
  }

  /** 
   * @private
   */
  #initViewableImpression() {
    if (this.viewableObserver) {
      this.viewableObserver.unobserve(this.container);
    }
    this.ad.viewableImpression.forEach(viewableImpression => {
      if (viewableImpression.viewable.length > 0) {
        viewableImpression.viewable.forEach(url => {
          this.trackingTags.push({
            event: 'viewable',
            url
          });
        });
      }
      if (viewableImpression.notViewable.length > 0) {
        viewableImpression.notViewable.forEach(url => {
          this.trackingTags.push({
            event: 'notviewable',
            url
          });
        });
      }
      if (viewableImpression.viewUndetermined.length > 0) {
        viewableImpression.viewUndetermined.forEach(url => {
          this.trackingTags.push({
            event: 'viewundetermined',
            url
          });
        });
      }
    });
    this.attachViewableObserverFn = this.#attachViewableObserver.bind(this);
    this.on('adstarted', this.attachViewableObserverFn);
  }

  /** 
   * @private
   */
  async #loopAds(ads) {
    for (let i = 0; i < ads.length; i++) {
      await new Promise(resolve => {
        const currentAd = ads[i];

        Logger.print(this.debugRawConsoleLogs, `currentAd follows`, currentAd);

        this.ad.id = currentAd.id;
        this.ad.adServingId = currentAd.adServingId;
        this.ad.categories = currentAd.categories;
        if (this.requireCategory) {
          if (this.ad.categories.length === 0 || !this.ad.categories[0].authority) {
            this.rmpVastUtils.processVastErrors(204, true);
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
                this.rmpVastUtils.processVastErrors(205, true);
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
          return false;
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
            Logger.print(this.debugRawConsoleLogs, `AdPod detected with length ${this.adPodLength}`, currentAd);
          }

          this.one('addestroyed', () => {
            if (this.adSequence === this.adPodLength) {
              this.adPodLength = 0;
              this.adSequence = 0;
              this.adPod = false;
              this.rmpVastUtils.createApiEvent('adpodcompleted');
            }
            resolve();
          });
        }
        this.ad.viewableImpression = currentAd.viewableImpression;
        if (this.ad.viewableImpression.length > 0) {
          this.#initViewableImpression();
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
        Logger.print(this.debugRawConsoleLogs, `Parsed creatives follow`, creatives);
        creatives.find(creative => {
          if (creative.type === 'companion') {
            Logger.print(this.debugRawConsoleLogs, `Creative type companion detected`);
            this.rmpVastCompanionCreative.parse(creative);
            return true;
          }
          return false;
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
                creative.videoClickTrackingURLTemplates.forEach(videoClickTrackingURLTemplate => {
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
              this.#addTrackingEvents(creative.trackingEvents);
              this.rmpVastLinearCreative = new LinearCreative(this);
              this.rmpVastLinearCreative.parse(creative);
              if (this.params.omidSupport && currentAd.adVerifications.length > 0) {
                const omSdkManager = new OmSdkManager(currentAd.adVerifications, this);
                omSdkManager.init();
              }
              break;
            case 'nonlinear':
              this.creative.isLinear = false;
              this.#addTrackingEvents(creative.trackingEvents);
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
  #handleParsedVast(response) {
    Logger.print(this.debugRawConsoleLogs, `VAST response follows`, response);

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
      this.rmpVastUtils.processVastErrors(303, true);
      return;
    } else {
      this.#loopAds(response.ads);
    }
  }

  /** 
   * @private
   */
  #getVastTag(vastData) {
    // we check for required VAST input and API here
    // as we need to have this.currentContentSrc available for iOS
    if (typeof vastData !== 'string' || vastData === '') {
      this.rmpVastUtils.processVastErrors(1001, false);
      return;
    }
    if (typeof DOMParser === 'undefined') {
      this.rmpVastUtils.processVastErrors(1002, false);
      return;
    }
    this.rmpVastUtils.createApiEvent('adtagstartloading');
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

      Logger.print(this.debugRawConsoleLogs, `Try to load VAST tag at: ${this.__adTagUrl}`);

      vastClient.get(this.__adTagUrl, options).then(response => {
        this.rmpVastUtils.createApiEvent('adtagloaded');
        this.#handleParsedVast(response);
      }).catch(error => {
        console.warn(error);
        // PING 900 Undefined Error.
        this.rmpVastUtils.processVastErrors(900, true);
      });
    } else {
      // input is not a VAST URI but raw VAST XML -> we parse it and proceed
      let vastXml;
      try {
        vastXml = (new DOMParser()).parseFromString(vastData, 'text/xml');
      } catch (error) {
        console.warn(error);
        // PING 900 Undefined Error.
        this.rmpVastUtils.processVastErrors(900, true);
        return;
      }
      const vastParser = new VASTClient();
      vastParser.parseVAST(vastXml).then(response => {
        this.rmpVastUtils.createApiEvent('adtagloaded');
        this.#handleParsedVast(response);
      }).catch(error => {
        console.warn(error);
        // PING 900 Undefined Error.
        this.rmpVastUtils.processVastErrors(900, true);
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
    Logger.print(this.debugRawConsoleLogs, `loadAds method starts`);

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
      finalVastData = this.rmpVastTracking.replaceMacros(vastData, false);
    }

    // if an ad is already on stage we need to clear it first before we can accept another ad request
    if (this.__adOnStage) {
      Logger.print(this.debugRawConsoleLogs, `Creative already on stage calling stopAds before loading new ad`);
      this.one('addestroyed', this.loadAds.bind(this, finalVastData));
      this.stopAds();
      return;
    }
    this.#getVastTag(finalVastData);
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
    this.rmpVastUtils.destroyFullscreen();
    if (this.rmpVastAdPlayer) {
      this.rmpVastAdPlayer.destroy();
    }
    this.#initInstanceVariables();
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
    return this.environmentData;
  }

  /** 
   * @type {() => boolean} 
   */
  get adPaused() {
    if (this.__adOnStage && this.creative && this.creative.isLinear) {
      if (this.rmpVastVpaidPlayer) {
        return this.rmpVastVpaidPlayer.getAdPaused();
      } else if (this.currentAdPlayer) {
        return this.currentAdPlayer.paused;
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
    return this.contentCompleted;
  }

  /** 
   * @param {boolean} value
   * @return {void}
   */
  set contentPlayerCompleted(value) {
    if (typeof value === 'boolean') {
      this.contentCompleted = value;
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
    return this.currentAdPlayer;
  }

  /** 
   * @return {HTMLMediaElement|null}
   */
  get contentPlayer() {
    return this.currentContentPlayer;
  }

  /** 
   * @type {() => boolean} 
   */
  get initialized() {
    return this.rmpVastInitialized;
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
    return this.rmpVastCompanionCreative.requiredAttribute;
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
    return this.rmpVastCompanionCreative.getList(inputWidth, inputHeight);
  }

  /** 
   * @param {number} index
   * @return {HTMLElement|null}
   */
  getCompanionAd(index) {
    return this.rmpVastCompanionCreative.getItem(index);
  }

  /** 
   * @type {() => void} 
   */
  initialize() {
    if (!this.rmpVastInitialized) {
      Logger.print(this.debugRawConsoleLogs, `Upon user interaction - player needs to be initialized`);
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
