import FW from '../fw/fw';
import ENV from '../fw/env';
import TRACKING_EVENTS from '../tracking/tracking-events';

const DEFAULT = {};

DEFAULT.instanceVariables = function () {
  this.adContainer = null;
  this.debug = false;
  this.rmpVastInitialized = false;
  this.useContentPlayerForAds = false;
  this.contentPlayerCompleted = false;
  this.currentContentSrc = '';
  this.currentContentCurrentTime = -1;
  this.needsSeekAdjust = false;
  this.seekAdjustAttached = false;
  this.onDestroyLoadAds = null;
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
    if (this.debug) {
      FW.log('vast player will be content player');
    }
  }
};

DEFAULT.resetLoadAds = function () {
  // init internal methods 
  this.onLoadedmetadataPlay = null;
  this.onPlaybackError = null;
  // init internal tracking events methods
  this.onPause = null;
  this.onPlay = null;
  this.onPlaying = null;
  this.onEnded = null;
  this.onVolumeChange = null;
  this.onTimeupdate = null;
  this.onEventPingTracking = null;
  this.onClickThrough = null;
  this.onPlayingAppendIcons = null;
  this.onTimeupdateCheckSkip = null;
  this.onClickSkip = null;
  this.onNonLinearLoadSuccess = null;
  this.onNonLinearLoadError = null;
  this.onNonLinearClickThrough = null;
  this.onContextMenu = null;
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
  this.onClickCloseNonLinear = null;
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
  this.onJSVPAIDLoaded = FW.nullFn;
  this.onJSVPAIDError = FW.nullFn;
  if (this.container) {
    this.container.removeEventListener('adstarted', this.attachViewableObserver);
  }
  if (this.vastPlayer) {
    this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdateCheckSkip);
  }
};

DEFAULT.fullscreen = function () {
  // attach fullscreen states
  // this assumes we have a polyfill for fullscreenchange event 
  // see app/js/app.js
  // we need this to handle VAST fullscreen events
  const _onFullscreenchange = function (event) {
    if (event && event.type) {
      if (this.debug) {
        FW.log('event is ' + event.type);
      }
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
  };
  // if we have native fullscreen support we handle fullscreen events
  if (ENV.hasNativeFullscreenSupport) {
    this.onFullscreenchange = _onFullscreenchange.bind(this);
    // for our beloved iOS 
    if (ENV.isIos[0]) {
      this.contentPlayer.addEventListener('webkitbeginfullscreen', this.onFullscreenchange);
      this.contentPlayer.addEventListener('webkitendfullscreen', this.onFullscreenchange);
    } else {
      document.addEventListener('fullscreenchange', this.onFullscreenchange);
    }
  }
};

export default DEFAULT;
