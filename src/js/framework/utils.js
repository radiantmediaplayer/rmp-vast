import FW from './fw';
import Environment from './environment';
import Tracking from '../tracking/tracking';


export default class Utils {

  // attach fullscreen states
  // this assumes we have a polyfill for fullscreenchange event 
  // see app/js/app.js
  // we need this to handle VAST fullscreen events
  static _onFullscreenchange(event) {
    if (event && event.type) {
      console.log(`${FW.consolePrepend} event is ${event.type}`, FW.consoleStyle, '');

      if (event.type === 'fullscreenchange') {
        if (this.isInFullscreen) {
          this.isInFullscreen = false;
          if (this.__adOnStage && this.creative.isLinear) {
            Tracking.dispatch.call(this, ['exitFullscreen', 'playerCollapse']);
          }
        } else {
          this.isInFullscreen = true;
          if (this.__adOnStage && this.creative.isLinear) {
            Tracking.dispatch.call(this, ['fullscreen', 'playerExpand']);
          }
        }
      } else if (event.type === 'webkitbeginfullscreen') {
        // iOS uses webkitbeginfullscreen
        if (this.__adOnStage && this.creative.isLinear) {
          Tracking.dispatch.call(this, ['fullscreen', 'playerExpand']);
        }
        this.isInFullscreen = true;
      } else if (event.type === 'webkitendfullscreen') {
        // iOS uses webkitendfullscreen
        if (this.__adOnStage && this.creative.isLinear) {
          Tracking.dispatch.call(this, ['exitFullscreen', 'playerCollapse']);
        }
        this.isInFullscreen = false;
      }
    }
  }

  static _updateVastError(errorCode) {
    // List of VAST errors according to specs
    const vastErrorsList = [{
      code: 201,
      description: 'Video player expecting different linearity.'
    }, {
      code: 204,
      description: 'Ad category was required but not provided.'
    }, {
      code: 205,
      description: 'Inline Category violates Wrapper BlockedAdCategories.'
    }, {
      code: 303,
      description: 'No VAST response after one or more Wrappers.'
    }, {
      code: 400,
      description: 'General Linear error. Video player is unable to display the Linear Ad.'
    }, {
      code: 401,
      description: 'File not found. Unable to find Linear/MediaFile from URI.'
    }, {
      code: 402,
      description: 'Timeout of MediaFile URI.'
    }, {
      code: 403,
      description: 'Couldn\'t find MediaFile that is supported by this video player, based on the attributes of the MediaFile element.'
    }, {
      code: 501,
      description: 'Unable to display NonLinear Ad because creative dimensions do not align with creative display area (i.e. creative dimension too large).'
    }, {
      code: 502,
      description: 'Unable to fetch NonLinearAds/NonLinear resource.'
    }, {
      code: 503,
      description: 'Couldn\'t find NonLinear resource with supported type.'
    }, {
      code: 603,
      description: 'Unable to fetch CompanionAds/Companion resource.'
    }, {
      code: 900,
      description: 'Undefined Error.'
    }, {
      code: 901,
      description: 'General VPAID error.'
    }, {
      code: 1001,
      description: 'Invalid input for loadAds method'
    }, {
      code: 1002,
      description: 'Required DOMParser API is not available'
    }, {
      code: 1100,
      description: 'SIMID error: UNSPECIFIED_CREATIVE_ERROR'
    }, {
      code: 1101,
      description: 'SIMID error: CANNOT_LOAD_RESOURCE'
    }, {
      code: 1102,
      description: 'SIMID error: PLAYBACK_AREA_UNUSABLE'
    }, {
      code: 1103,
      description: 'SIMID error: INCORRECT_VERSION'
    }, {
      code: 1104,
      description: 'SIMID error: TECHNICAL_ERROR'
    }, {
      code: 1105,
      description: 'SIMID error: EXPAND_NOT_POSSIBLE'
    }, {
      code: 1106,
      description: 'SIMID error: PAUSE_NOT_HONORED'
    }, {
      code: 1107,
      description: 'SIMID error: PLAYMODE_NOT_ADEQUATE'
    }, {
      code: 1108,
      description: 'SIMID error: CREATIVE_INTERNAL_ERROR'
    }, {
      code: 1109,
      description: 'SIMID error: DEVICE_NOT_SUPPORTED'
    }, {
      code: 1110,
      description: 'SIMID error: MESSAGES_NOT_FOLLOWING_SPEC'
    }, {
      code: 1111,
      description: 'SIMID error: PLAYER_RESPONSE_TIMEOUT'
    }, {
      code: 1200,
      description: 'SIMID error: UNSPECIFIED_PLAYER_ERROR'
    }, {
      code: 1201,
      description: 'SIMID error: WRONG_VERSION'
    }, {
      code: 1202,
      description: 'SIMID error: UNSUPPORTED_TIME'
    }, {
      code: 1203,
      description: 'SIMID error: UNSUPPORTED_FUNCTIONALITY_REQUEST'
    }, {
      code: 1204,
      description: 'SIMID error: UNSUPPORTED_ACTIONS'
    }, {
      code: 1205,
      description: 'SIMID error: POSTMESSAGE_CHANNEL_OVERLOADED'
    }, {
      code: 1206,
      description: 'SIMID error: VIDEO_COULD_NOT_LOAD'
    }, {
      code: 1207,
      description: 'SIMID error: VIDEO_TIME_OUT'
    }, {
      code: 1208,
      description: 'SIMID error: RESPONSE_TIMEOUT'
    }, {
      code: 1209,
      description: 'SIMID error: MEDIA_NOT_SUPPORTED'
    }, {
      code: 1210,
      description: 'SIMID error: SPEC_NOT_FOLLOWED_ON_INIT'
    }, {
      code: 1211,
      description: 'SIMID error: SPEC_NOT_FOLLOWED_ON_MESSAGES'
    }];

    // Indicates that the error was encountered after the ad loaded, during ad play. 
    // Possible causes: ad assets could not be loaded, etc.
    const playErrorsList = [
      201, 204, 205,
      400, 401, 402, 403,
      501, 502, 503,
      603,
      901,
      1002
    ];

    // Indicates that the error was encountered when the ad was being loaded. 
    // Possible causes: there was no response from the ad server, malformed ad response was returned ...
    // 300, 301, 302, 303, 304 Wrapper errors are managed in ast-client-js
    const loadErrorsList = [
      303,
      900,
      1001
    ];

    const error = vastErrorsList.filter((value) => {
      return value.code === errorCode;
    });
    if (error.length > 0) {
      this.__vastErrorCode = error[0].code;
      this.__adErrorMessage = error[0].description;
    } else {
      this.__vastErrorCode = -1;
      this.__adErrorMessage = 'Error getting VAST error';
    }
    if (this.__vastErrorCode > -1) {
      if (loadErrorsList.indexOf(this.__vastErrorCode) > -1) {
        this.__adErrorType = 'adLoadError';
      } else if (playErrorsList.indexOf(this.__vastErrorCode) > -1) {
        this.__adErrorType = 'adPlayError';
      }
    }

    console.log(`${FW.consolePrepend} VAST error code is ${this.__vastErrorCode}`, FW.consoleStyle, '');
    console.log(`${FW.consolePrepend} VAST error message is ${this.__adErrorMessage}`, FW.consoleStyle, '');
    console.log(`${FW.consolePrepend} Ad error type is ${this.__adErrorType}`, FW.consoleStyle, '');
  }

  static filterParams(inputParams) {
    // default for input parameters
    const defaultParams = {
      ajaxTimeout: 5000,
      creativeLoadTimeout: 8000,
      ajaxWithCredentials: false,
      maxNumRedirects: 4,
      labels: {
        skipMessage: 'Skip ad',
        closeAd: 'Close ad',
        textForInteractionUIOnMobile: 'Learn more'
      },
      outstream: false,
      showControlsForAdPlayer: false,
      vastXmlInput: false,
      enableVpaid: true,
      enableSimid: true,
      vpaidSettings: {
        width: 640,
        height: 360,
        viewMode: 'normal',
        desiredBitrate: 500
      },
      useHlsJS: false,
      debugHlsJS: false,
      // OM SDK params
      omidSupport: false,
      omidAllowedVendors: [],
      omidUnderEvaluation: false,
      omidRunValidationScript: false,
      omidAutoplay: false,
      partnerName: 'rmp-vast',
      partnerVersion: RMP_VAST_VERSION
    };

    this.params = defaultParams;

    if (inputParams && typeof inputParams === 'object') {
      const keys = Object.keys(inputParams);
      keys.forEach(key => {
        if (typeof inputParams[key] === typeof this.params[key]) {
          if ((FW.isNumber(inputParams[key]) && inputParams[key] > 0) || typeof inputParams[key] !== 'number') {
            if (key === 'vpaidSettings') {
              if (FW.isNumber(inputParams.vpaidSettings.width) && inputParams.vpaidSettings.width > 0) {
                this.params.vpaidSettings.width = inputParams.vpaidSettings.width;
              }
              if (FW.isNumber(inputParams.vpaidSettings.height) && inputParams.vpaidSettings.height > 0) {
                this.params.vpaidSettings.height = inputParams.vpaidSettings.height;
              }
              if (typeof inputParams.vpaidSettings.viewMode === 'string' && inputParams.vpaidSettings.viewMode === 'fullscreen') {
                this.params.vpaidSettings.viewMode = inputParams.vpaidSettings.viewMode;
              }
              if (FW.isNumber(inputParams.vpaidSettings.desiredBitrate) && inputParams.vpaidSettings.desiredBitrate > 0) {
                this.params.vpaidSettings.desiredBitrate = inputParams.vpaidSettings.desiredBitrate;
              }
            } else {
              this.params[key] = inputParams[key];
            }
          }
        }
      });
    }
  }

  static createApiEvent(event) {
    // adloaded, addurationchange, adclick, adimpression, adstarted, 
    // adtagloaded, adtagstartloading, adpaused, adresumed 
    // advolumemuted, advolumechanged, adcomplete, adskipped, 
    // adskippablestatechanged, adclosed
    // adfirstquartile, admidpoint, adthirdquartile, aderror, 
    // addestroyed
    // adlinearchange, adexpandedchange, adremainingtimechange 
    // adinteraction, adsizechange
    if (Array.isArray(event)) {
      event.forEach(currentEvent => {
        if (currentEvent) {
          console.log(`${FW.consolePrepend} EVENT ${event}`, FW.consoleStyle, '');
          this.dispatch(currentEvent);
        }
      });
    } else if (event) {
      console.log(`${FW.consolePrepend} EVENT ${event}`, FW.consoleStyle, '');
      this.dispatch(event);
    }
  }

  static playPromise(whichPlayer, firstPlayerPlayRequest) {
    let targetPlayer;
    switch (whichPlayer) {
      case 'content':
        targetPlayer = this.__contentPlayer;
        break;
      case 'vast':
        targetPlayer = this.__adPlayer;
        break;
      default:
        break;
    }
    if (targetPlayer) {
      const playPromise = targetPlayer.play();
      // most modern browsers support play as a Promise
      // this lets us handle autoplay rejection 
      // https://developers.google.com/web/updates/2016/03/play-returns-promise
      if (playPromise !== undefined) {
        playPromise.then(() => {

          console.log(
            `${FW.consolePrepend} playPromise on ${whichPlayer} player has succeeded`,
            FW.consoleStyle,
            ''
          );

          if (firstPlayerPlayRequest) {
            Utils.createApiEvent.call(this, 'adinitialplayrequestsucceeded');
          }
        }).catch(error => {
          console.warn(error);

          if (firstPlayerPlayRequest && whichPlayer === 'vast' && this.creative.isLinear) {
            console.log(
              `${FW.consolePrepend} initial play promise on ad player has been rejected`,
              FW.consoleStyle,
              ''
            );

            Utils.processVastErrors.call(this, 400, true);
            Utils.createApiEvent.call(this, 'adinitialplayrequestfailed');
          } else if (firstPlayerPlayRequest && whichPlayer === 'content' && !this.creative.isLinear) {
            console.log(
              `${FW.consolePrepend} initial play promise on content player has been rejected`,
              FW.consoleStyle,
              ''
            );

            Utils.createApiEvent.call(this, 'adinitialplayrequestfailed');
          } else {
            console.log(
              `${FW.consolePrepend} playPromise on ${whichPlayer} player has been rejected`,
              FW.consoleStyle,
              ''
            );
          }
        });
      }
    }
  }

  static makeButtonAccessible(element, ariaLabel) {
    // make skip button accessible
    element.tabIndex = 0;
    element.setAttribute('role', 'button');
    element.addEventListener('keyup', (event) => {
      const code = event.which;
      // 13 = Return, 32 = Space
      if ((code === 13) || (code === 32)) {
        event.stopPropagation();
        event.preventDefault();
        FW.createSyntheticEvent('click', element);
      }
    });
    if (ariaLabel) {
      element.setAttribute('aria-label', ariaLabel);
    }
  }

  static initInstanceVariables() {
    this.adContainer = null;
    this.contentWrapper = null;
    this.container = null;
    this.rmpVastContentPlayer = null;
    this.rmpVastAdPlayer = null;
    this.currentContentSrc = '';
    this.currentContentCurrentTime = -1;
    this.params = {};
    this.events = {};
    this.onFullscreenchangeFn = null;
    this.id = null;
    this.isInFullscreen = false;
    // adpod
    this.adPod = false;
    this.adPodLength = 0;
    this.adSequence = 0;
    // for public getters
    this.__contentPlayer = null;
    this.__adPlayer = null;
    this.__initialized = false;
    this.__contentPlayerCompleted = false;
  }

  static resetVariablesForNewLoadAds() {
    this.off('adstarted', this.attachViewableObserverFn);
    this.onPauseFn = null;
    this.onPlayFn = null;
    this.onPlayingFn = null;
    this.onEndedFn = null;
    this.onVolumeChangeFn = null;
    this.onTimeupdateFn = null;
    this.trackingTags = [];
    this.vastErrorTags = [];
    this.adErrorTags = [];
    this.firstQuartileEventFired = false;
    this.midpointEventFired = false;
    this.thirdQuartileEventFired = false;
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
    this.validCompanionAds = [];
    this.companionAdsList = [];
    this.rmpVastVpaidPlayer = null;
    this.adParametersData = '';
    this.rmpVastSimidPlayer = null;
    this.rmpVastIcons = null;
    // for public getters
    this.__adTagUrl = '';
    this.__companionAdsRequiredAttribute = '';
    this.__vastErrorCode = -1;
    this.__adErrorType = '';
    this.__adErrorMessage = '';
    this.__adOnStage = false;
  }

  static handleFullscreen() {
    // if we have native fullscreen support we handle fullscreen events
    if (Environment.hasNativeFullscreenSupport) {
      this.onFullscreenchangeFn = Utils._onFullscreenchange.bind(this);
      // for our beloved iOS 
      if (Environment.isIos[0]) {
        this.__contentPlayer.addEventListener('webkitbeginfullscreen', this.onFullscreenchangeFn);
        this.__contentPlayer.addEventListener('webkitendfullscreen', this.onFullscreenchangeFn);
      } else {
        document.addEventListener('fullscreenchange', this.onFullscreenchangeFn);
      }
    }
  }

  static processVastErrors(errorCode, ping) {
    if (ping) {
      Tracking.error.call(this, errorCode);
    }
    Utils._updateVastError.call(this, errorCode);
    Utils.createApiEvent.call(this, 'aderror');
    if (this.rmpVastAdPlayer) {
      this.rmpVastAdPlayer.resumeContent();
    }

  }
}
