import { FW } from '../fw/fw';

const RESET = {};

RESET.internalVariables = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: RESET internalVariables');
  }
  // init internal methods 
  this.onLoadedmetadataPlay = null;
  this.onEndedResumeContent = null;
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
  this.vastDocument = null;
  this.adTagUrl = null;
  this.vastPlayer = null;
  this.vpaidSlot = null;
  this.trackingTags = [];
  this.vastErrorTags = [];
  this.inlineOrWrapperErrorTags = [];
  this.adMediaUrl = null;
  this.adMediaHeight = null;
  this.adMediaWidth = null;
  this.vastPlayerMuted = false;
  this.vastPlayerDuration = -1;
  this.vastPlayerCurrentTime = -1;
  this.firstQuartileEventFired = false;
  this.midpointEventFired = false;
  this.thirdQuartileEventFired = false;
  this.vastPlayerPaused = false;
  this.vastErrorCode = -1;
  this.adErrorType = '';
  this.vastErrorMessage = 'Error getting VAST error';
  this.adSystem = null;
  this.adIsLinear = null;
  this.adContentType = null;
  this.adTitle = null;
  this.adDescription = null;
  this.adOnStage = false;
  this.clickThroughUrl = null;
  this.isWrapper = false;
  this.vastAdTagURI = null;
  this.redirectsFollowed = 0;
  this.icons = [];
  this.clickUIOnMobile = null;
  this.currentContentSrc = null;
  this.customPlaybackCurrentTime = 0;
  this.antiSeekLogicInterval = null;
  this.creativeLoadTimeoutCallback = null;
  // skip
  this.isSkippableAd = false;
  this.hasSkipEvent = false;
  this.skipoffset = '';
  this.progressEventOffsets = [];
  this.progressEventOffsetsSeconds = null;
  this.skipButton = null;
  this.skipWaiting = null;
  this.skipMessage = null;
  this.skipIcon = null;
  this.skippableAdCanBeSkipped = false;
  // non linear
  this.nonLinearContainer = null;
  this.nonLinearATag = null;
  this.nonLinearImg = null;
  this.onClickCloseNonLinear = null;
  this.nonLinearCreativeHeight = 0;
  this.nonLinearCreativeWidth = 0;
  this.nonLinearMinSuggestedDuration = 0;
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
};

RESET.unwireVastPlayerEvents = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: RESET unwireVastPlayerEvents');
  }
  if (this.nonLinearContainer) {
    this.nonLinearImg.removeEventListener('load', this.onNonLinearLoadSuccess);
    this.nonLinearImg.removeEventListener('error', this.onNonLinearLoadError);
    this.nonLinearATag.removeEventListener('click', this.onNonLinearClickThrough);
    this.nonLinearATag.removeEventListener('touchend', this.onNonLinearClickThrough);
    this.nonLinearClose.removeEventListener('click', this.onClickCloseNonLinear);
    this.nonLinearClose.removeEventListener('touchend', this.onClickCloseNonLinear);
    for (let i = 0, len = this.trackingTags.length; i < len; i++) {
      this.nonLinearContainer.removeEventListener(this.trackingTags[i].event, this.onEventPingTracking);
    }
  }
  if (this.vastPlayer) {
    this.vastPlayer.removeEventListener('error', this.onPlaybackError);
    // vastPlayer content pause/resume events
    this.vastPlayer.removeEventListener('durationchange', this.onDurationChange);
    this.vastPlayer.removeEventListener('loadedmetadata', this.onLoadedmetadataPlay);
    this.vastPlayer.removeEventListener('ended', this.onEndedResumeContent);
    this.vastPlayer.removeEventListener('contextmenu', this.onContextMenu);
    // unwire HTML5 video events
    this.vastPlayer.removeEventListener('pause', this.onPause);
    this.vastPlayer.removeEventListener('play', this.onPlay);
    this.vastPlayer.removeEventListener('playing', this.onPlaying);
    this.vastPlayer.removeEventListener('ended', this.onEnded);
    this.vastPlayer.removeEventListener('volumechange', this.onVolumeChange);
    this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdate);

    // unwire HTML5 VAST events
    for (let i = 0, len = this.trackingTags.length; i < len; i++) {
      this.vastPlayer.removeEventListener(this.trackingTags[i].event, this.onEventPingTracking);
    }
    // remove clicktrough handling
    if (this.onClickThrough !== null) {
      this.vastPlayer.removeEventListener('click', this.onClickThrough);
    }
    // remove icons 
    if (this.onPlayingAppendIcons !== null) {
      this.vastPlayer.removeEventListener('playing', this.onPlayingAppendIcons);
    }
    // skip
    if (this.onTimeupdateCheckSkip !== null) {
      this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdateCheckSkip);
    }
    if (this.skipButton && this.onClickSkip !== null) {
      this.skipButton.removeEventListener('click', this.onClickSkip);
      this.skipButton.removeEventListener('touchend', this.onClickSkip);
    }
    // click UI on mobile
    if (this.clickUIOnMobile && this.onClickThrough !== null) {
      this.clickUIOnMobile.removeEventListener('touchend', this.onClickThrough);
    }
  }
  if (this.contentPlayer) {
    this.contentPlayer.removeEventListener('error', this.onPlaybackError);
  }
};

export { RESET };