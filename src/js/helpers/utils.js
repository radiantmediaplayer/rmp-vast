import FW from '../framework/fw';
import Environment from '../framework/environment';
import Logger from '../framework/logger';


export default class Utils {

  constructor(rmpVast) {
    this._rmpVast = rmpVast;
    // we cannot have this here - we need this._rmpVast.debugRawConsoleLogs
    //this._debugRawConsoleLogs = rmpVast.debugRawConsoleLogs;
    this._onFullscreenchangeFn = null;
  }

  // attach fullscreen states
  // this assumes we have a polyfill for fullscreenchange event 
  // see app/js/app.js
  // we need this to handle VAST fullscreen events
  _onFullscreenchange(event) {
    if (event && event.type) {
      Logger.print(this._rmpVast.debugRawConsoleLogs, `event is ${event.type}`);
      const isLinear = this._rmpVast.creative.isLinear;
      const isOnStage = this._rmpVast.__adOnStage;
      if (event.type === 'fullscreenchange') {
        if (this._rmpVast.isInFullscreen) {
          this._rmpVast.isInFullscreen = false;
          if (isOnStage && isLinear) {
            this._rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent(['adexitfullscreen', 'adplayercollapse']);
          }
        } else {
          this._rmpVast.isInFullscreen = true;
          if (isOnStage && isLinear) {
            this._rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent(['adfullscreen', 'adplayerexpand']);
          }
        }
      } else if (event.type === 'webkitbeginfullscreen') {
        // iOS uses webkitbeginfullscreen
        if (isOnStage && isLinear) {
          this._rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent(['adfullscreen', 'adplayerexpand']);
        }
        this._rmpVast.isInFullscreen = true;
      } else if (event.type === 'webkitendfullscreen') {
        // iOS uses webkitendfullscreen
        if (isOnStage && isLinear) {
          this._rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent(['adexitfullscreen', 'adplayercollapse']);
        }
        this._rmpVast.isInFullscreen = false;
      }
    }
  }

  _updateVastError(errorCode) {
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

    const error = vastErrorsList.filter(value => {
      return value.code === errorCode;
    });
    if (error.length > 0) {
      this._rmpVast.__vastErrorCode = error[0].code;
      this._rmpVast.__adErrorMessage = error[0].description;
    } else {
      this._rmpVast.__vastErrorCode = -1;
      this._rmpVast.__adErrorMessage = 'Error getting VAST error';
    }
    if (this._rmpVast.__vastErrorCode > -1) {
      if (loadErrorsList.indexOf(this._rmpVast.__vastErrorCode) > -1) {
        this._rmpVast.__adErrorType = 'adLoadError';
      } else if (playErrorsList.indexOf(this._rmpVast.__vastErrorCode) > -1) {
        this._rmpVast.__adErrorType = 'adPlayError';
      }
    }
    Logger.print(this._rmpVast.debugRawConsoleLogs, `VAST error code is ${this._rmpVast.__vastErrorCode} with message: ${this._rmpVast.__adErrorMessage}`);
    Logger.print(this._rmpVast.debugRawConsoleLogs, `Ad error type is ${this._rmpVast.__adErrorType}`);
  }

  filterParams(inputParams) {
    // default for input parameters
    const defaultParams = {
      ajaxTimeout: 8000,
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
      useHlsJS: true,
      debugHlsJS: false,
      debugRawConsoleLogs: false,
      // OM SDK params
      omidSupport: false,
      omidAllowedVendors: [],
      omidUnderEvaluation: false,
      omidRunValidationScript: false,
      omidAutoplay: false,
      macros: new Map(),
      partnerName: 'rmp-vast',
      partnerVersion: RMP_VAST_VERSION
    };

    this._rmpVast.params = defaultParams;

    if (inputParams && typeof inputParams === 'object') {
      const keys = Object.keys(inputParams);
      keys.forEach(key => {
        if (typeof inputParams[key] === typeof this._rmpVast.params[key]) {
          if ((FW.isNumber(inputParams[key]) && inputParams[key] > 0) || typeof inputParams[key] !== 'number') {
            if (key === 'vpaidSettings') {
              if (FW.isNumber(inputParams.vpaidSettings.width) && inputParams.vpaidSettings.width > 0) {
                this._rmpVast.params.vpaidSettings.width = inputParams.vpaidSettings.width;
              }
              if (FW.isNumber(inputParams.vpaidSettings.height) && inputParams.vpaidSettings.height > 0) {
                this._rmpVast.params.vpaidSettings.height = inputParams.vpaidSettings.height;
              }
              if (typeof inputParams.vpaidSettings.viewMode === 'string' && inputParams.vpaidSettings.viewMode === 'fullscreen') {
                this._rmpVast.params.vpaidSettings.viewMode = inputParams.vpaidSettings.viewMode;
              }
              if (FW.isNumber(inputParams.vpaidSettings.desiredBitrate) && inputParams.vpaidSettings.desiredBitrate > 0) {
                this._rmpVast.params.vpaidSettings.desiredBitrate = inputParams.vpaidSettings.desiredBitrate;
              }
            } else {
              this._rmpVast.params[key] = inputParams[key];
            }
          }
        }
      });
    }
  }

  createApiEvent(event) {
    if (Array.isArray(event)) {
      event.forEach(currentEvent => {
        if (currentEvent) {
          Logger.print(this._rmpVast.debugRawConsoleLogs, `API EVENT - ${event}`);
          this._rmpVast.dispatch(currentEvent);
        }
      });
    } else if (event) {
      Logger.print(this._rmpVast.debugRawConsoleLogs, `API EVENT - ${event}`);
      this._rmpVast.dispatch(event);
    }
  }

  playPromise(whichPlayer, firstPlayerPlayRequest) {
    let targetPlayer;
    switch (whichPlayer) {
      case 'content':
        targetPlayer = this._rmpVast.currentContentPlayer;
        break;
      case 'vast':
        targetPlayer = this._rmpVast.currentAdPlayer;
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
        const isLinear = this._rmpVast.creative.isLinear;
        playPromise.then(() => {
          Logger.print(this._rmpVast.debugRawConsoleLogs, `playPromise on ${whichPlayer} player has succeeded`);
          if (firstPlayerPlayRequest) {
            this.createApiEvent('adinitialplayrequestsucceeded');
          }
        }).catch(error => {
          console.warn(error);
          if (firstPlayerPlayRequest && whichPlayer === 'vast' && isLinear) {
            Logger.print(this._rmpVast.debugRawConsoleLogs, `initial play promise on ad player has been rejected`);
            this.processVastErrors(400, true);
            this.createApiEvent('adinitialplayrequestfailed');
          } else if (firstPlayerPlayRequest && whichPlayer === 'content' && !isLinear) {
            Logger.print(this._rmpVast.debugRawConsoleLogs, `initial play promise on content player has been rejected`);
            this.createApiEvent('adinitialplayrequestfailed');
          } else {
            Logger.print(this._rmpVast.debugRawConsoleLogs, `playPromise on ${whichPlayer} player has been rejected`);
          }
        });
      }
    }
  }

  destroyFullscreen() {
    if (this._rmpVast.currentContentPlayer) {
      this._rmpVast.currentContentPlayer.removeEventListener('webkitbeginfullscreen', this._onFullscreenchangeFn);
      this._rmpVast.currentContentPlayer.removeEventListener('webkitendfullscreen', this._onFullscreenchangeFn);
    } else {
      document.removeEventListener('fullscreenchange', this._onFullscreenchangeFn);
    }
  }

  handleFullscreen() {
    // if we have native fullscreen support we handle fullscreen events
    if (Environment.hasNativeFullscreenSupport) {
      this._onFullscreenchangeFn = this._onFullscreenchange.bind(this);
      // for iOS 
      if (Environment.isIos[0]) {
        if (this._rmpVast.currentContentPlayer) {
          this._rmpVast.currentContentPlayer.addEventListener('webkitbeginfullscreen', this._onFullscreenchangeFn);
          this._rmpVast.currentContentPlayer.addEventListener('webkitendfullscreen', this._onFullscreenchangeFn);
        }
      } else {
        document.addEventListener('fullscreenchange', this._onFullscreenchangeFn);
      }
    }
  }

  processVastErrors(errorCode, ping) {
    if (ping) {
      this._rmpVast.rmpVastTracking.error(errorCode);
    }
    this._updateVastError(errorCode);
    this.createApiEvent('aderror');
    if (this._rmpVast.rmpVastAdPlayer) {
      this._rmpVast.rmpVastAdPlayer.resumeContent();
    }
  }

}
