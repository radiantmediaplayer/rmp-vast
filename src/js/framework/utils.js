import FW from './fw';
import ENV from './env';
import VAST_PLAYER from '../players/vast-player';
import TRACKING_EVENTS from '../tracking/tracking-events';

// Indicates that the error was encountered when the ad was being loaded. 
// Possible causes: there was no response from the ad server, malformed ad response was returned ...
// 300, 301, 302, 303, 304 Wrapper errors are managed in ast-client-js
const LOAD_ERROR_LIST = [
  303,
  900,
  1001
];

// Indicates that the error was encountered after the ad loaded, during ad play. 
// Possible causes: ad assets could not be loaded, etc.
const PLAY_ERROR_LIST = [
  201, 204, 205,
  400, 401, 402, 403,
  501, 502, 503,
  603,
  901,
  1002
];

const VAST_ERRORS_LIST = [{
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
}];

export default class Utils {

  static filterParams(inputParams) {
    const defaultParams = {
      ajaxTimeout: 5000,
      creativeLoadTimeout: 8000,
      ajaxWithCredentials: false,
      maxNumRedirects: 4,
      labels: {
        skipMessage: 'Skip ad',
        closeAd: 'Close ad',
        textForClickUIOnMobile: 'Learn more'
      },
      outstream: false,
      showControlsForVastPlayer: false,
      enableVpaid: true,
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
      omidPathTo: '../externals/omweb-v1.js',
      omidUnderEvaluation: false,
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
          console.dir(currentEvent);
          FW.createStdEvent(currentEvent, this.container);
        }
      });
    } else if (event) {
      console.dir(event);
      FW.createStdEvent(event, this.container);
    }
  }

  static playPromise(whichPlayer, firstPlayerPlayRequest) {
    let targetPlayer;
    switch (whichPlayer) {
      case 'content':
        targetPlayer = this.contentPlayer;
        break;
      case 'vast':
        targetPlayer = this.vastPlayer;
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
          if (firstPlayerPlayRequest) {
            console.log(
              `${FW.consolePrepend} initial play promise on ${whichPlayer} player has succeeded`,
              FW.consoleStyle,
              ''
            );
            Utils.createApiEvent.call(this, 'adinitialplayrequestsucceeded');
          }
        }).catch(error => {
          console.warn(error);
          if (firstPlayerPlayRequest && whichPlayer === 'vast' && this.creative.isLinear) {
            console.log(
              `${FW.consolePrepend} initial play promise on VAST player has been rejected`,
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
        FW.createStdEvent('click', element);
      }
    });
    if (ariaLabel) {
      element.setAttribute('aria-label', ariaLabel);
    }
  }

  static initInstanceVariables() {
    this.adContainer = null;
    this.debug = false;
    this.rmpVastInitialized = false;
    this.useContentPlayerForAds = false;
    this.contentPlayerCompleted = false;
    this.currentContentSrc = '';
    this.currentContentCurrentTime = -1;
    this.needsSeekAdjust = false;
    this.seekAdjustAttached = false;
    this.firstVastPlayerPlayRequest = true;
    this.firstContentPlayerPlayRequest = true;
    this.params = {};
    this.onFullscreenchange = FW.nullFn;
    this.contentWrapper = null;
    this.contentPlayer = null;
    this.id = null;
    this.container = null;
    this.isInFullscreen = false;
    // adpod
    this.adPod = false;
    this.adPodLength = 0;
    this.adSequence = 0;
    // on iOS and macOS Safari we use content player to play ads
    // to avoid issues related to fullscreen management and autoplay
    // as fullscreen on iOS is handled by the default OS player
    if (ENV.isIos[0] || ENV.isMacOSSafari || ENV.isIpadOS) {
      this.useContentPlayerForAds = true;
      console.log(`${FW.consolePrepend} vast player will be content player`, FW.consoleStyle, '');
    }
  }

  static resetVariablesForNewLoadAds() {
    this.container.removeEventListener('adstarted', this.attachViewableObserver);
    // init internal methods 
    this.onLoadedmetadataPlay = FW.nullFn;
    this.onPlaybackError = FW.nullFn;
    // init internal tracking events methods
    this.onPause = FW.nullFn;
    this.onPlay = FW.nullFn;
    this.onPlaying = FW.nullFn;
    this.onEnded = FW.nullFn;
    this.onVolumeChange = FW.nullFn;
    this.onTimeupdate = FW.nullFn;
    this.onEventPingTracking = FW.nullFn;
    this.onClickThrough = FW.nullFn;
    this.onPlayingAppendIcons = FW.nullFn;
    this.onDurationChange = FW.nullFn;
    this.onTimeupdateCheckSkip = FW.nullFn;
    this.onClickSkip = FW.nullFn;
    this.onNonLinearLoadSuccess = FW.nullFn;
    this.onNonLinearLoadError = FW.nullFn;
    this.onNonLinearClickThrough = FW.nullFn;
    this.onContextMenu = FW.nullFn;
    // init internal variables
    this.adTagUrl = '';
    this.vastPlayer = null;
    this.vpaidSlot = null;
    this.trackingTags = [];
    this.vastErrorTags = [];
    this.adErrorTags = [];
    this.vastPlayerMuted = false;
    this.vastPlayerDuration = -1;
    this.vastPlayerCurrentTime = -1;
    this.firstQuartileEventFired = false;
    this.midpointEventFired = false;
    this.thirdQuartileEventFired = false;
    this.vastPlayerPaused = false;
    this.vastErrorCode = -1;
    this.adErrorType = '';
    this.vastErrorMessage = '';
    this.adOnStage = false;
    // hls.js
    this.hlsJS = [];
    this.hlsJSIndex = 0;
    this.readingHlsJS = false;
    // VAST ICONS
    this.iconsData = [];
    // players
    this.clickUIOnMobile = null;
    this.customPlaybackCurrentTime = 0;
    this.antiSeekLogicInterval = null;
    this.creativeLoadTimeoutCallback = null;
    // VAST 4
    this.ad = {};
    this.creative = {};
    this.attachViewableObserver = null;
    this.viewableObserver = null;
    this.viewablePreviousRatio = 0.5;
    this.regulationsInfo = {};
    this.requireCategory = false;
    // skip
    this.progressEvents = [];
    this.skipButton = null;
    this.skipWaiting = null;
    this.skipMessage = null;
    this.skipIcon = null;
    this.skippableAdCanBeSkipped = false;
    // non linear
    this.nonLinearContainer = null;
    this.nonLinearATag = null;
    this.nonLinearInnerElement = null;
    this.onClickCloseNonLinear = FW.nullFn;
    this.nonLinearMinSuggestedDuration = 0;
    // companion ads
    this.validCompanionAds = [];
    this.companionAdsRequiredAttribute = '';
    this.companionAdsList = [];
    // VPAID
    this.isVPAID = false;
    this.vpaidCreative = null;
    this.vpaidScript = null;
    this.vpaidIframe = null;
    this.vpaidLoadTimeout = null;
    this.initAdTimeout = null;
    this.startAdTimeout = null;
    this.vpaidAvailableInterval = null;
    this.adStoppedTimeout = null;
    this.adSkippedTimeout = null;
    this.adParametersData = '';
    this.vpaidCurrentVolume = 1;
    this.vpaidPaused = true;
    this.vpaidCreativeUrl = '';
    this.vpaidRemainingTime = -1;
    this.vpaidVersion = -1;
    this.vpaid1AdDuration = -1;
    this.initialWidth = 640;
    this.initialHeight = 360;
    this.initialViewMode = 'normal';
    this.desiredBitrate = 500;
    this.vpaidAdLoaded = false;
    this.vpaidAdStarted = false;
    this.vpaidCallbacks = {};
  }

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
          if (this.adOnStage && this.creative.isLinear) {
            TRACKING_EVENTS.dispatch.call(this, ['exitFullscreen', 'playerCollapse']);
          }
        } else {
          this.isInFullscreen = true;
          if (this.adOnStage && this.creative.isLinear) {
            TRACKING_EVENTS.dispatch.call(this, ['fullscreen', 'playerExpand']);
          }
        }
      } else if (event.type === 'webkitbeginfullscreen') {
        // iOS uses webkitbeginfullscreen
        if (this.adOnStage && this.creative.isLinear) {
          TRACKING_EVENTS.dispatch.call(this, ['fullscreen', 'playerExpand']);
        }
        this.isInFullscreen = true;
      } else if (event.type === 'webkitendfullscreen') {
        // iOS uses webkitendfullscreen
        if (this.adOnStage && this.creative.isLinear) {
          TRACKING_EVENTS.dispatch.call(this, ['exitFullscreen', 'playerCollapse']);
        }
        this.isInFullscreen = false;
      }
    }
  }

  static handleFullscreen() {
    // if we have native fullscreen support we handle fullscreen events
    if (ENV.hasNativeFullscreenSupport) {
      this.onFullscreenchange = Utils._onFullscreenchange.bind(this);
      // for our beloved iOS 
      if (ENV.isIos[0]) {
        this.contentPlayer.addEventListener('webkitbeginfullscreen', this.onFullscreenchange);
        this.contentPlayer.addEventListener('webkitendfullscreen', this.onFullscreenchange);
      } else {
        document.addEventListener('fullscreenchange', this.onFullscreenchange);
      }
    }
  }

  static _updateVastError(errorCode) {
    const error = VAST_ERRORS_LIST.filter((value) => {
      return value.code === errorCode;
    });
    if (error.length > 0) {
      this.vastErrorCode = error[0].code;
      this.vastErrorMessage = error[0].description;
    } else {
      this.vastErrorCode = -1;
      this.vastErrorMessage = 'Error getting VAST error';
    }
    if (this.vastErrorCode > -1) {
      if (LOAD_ERROR_LIST.indexOf(this.vastErrorCode) > -1) {
        this.adErrorType = 'adLoadError';
      } else if (PLAY_ERROR_LIST.indexOf(this.vastErrorCode) > -1) {
        this.adErrorType = 'adPlayError';
      }
    }
    console.log(`${FW.consolePrepend} VAST error code is ${this.vastErrorCode}`, FW.consoleStyle, '');
    console.log(`${FW.consolePrepend} VAST error message is ${this.vastErrorMessage}`, FW.consoleStyle, '');
    console.log(`${FW.consolePrepend} Ad error type is ${this.adErrorType}`, FW.consoleStyle, '');
  }

  static processVastErrors(errorCode, ping) {
    if (ping) {
      TRACKING_EVENTS.error.call(this, errorCode);
    }
    Utils._updateVastError.call(this, errorCode);
    Utils.createApiEvent.call(this, 'aderror');
    VAST_PLAYER.resumeContent.call(this);
  }
}
