import { ENV } from '../fw/env';
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
  this.onReset = null;
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
  this.onFullscreenchange = null;
  this.onPlayingSeek = null;
  this.onContextMenu = null;
  this.updateInitialContentSrc = null;
  // init internal variables
  this.adTagUrl = null;
  this.vastPlayer = null;
  this.vastPlayerSource = null;
  this.vastDocument = null;
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
  this.readyForReset = false;
  this.vastErrorCode = -1;
  this.vastErrorMessage = 'Error getting VAST error';
  this.adSystem = null;
  this.adIsLinear = null;
  this.adContentType = null;
  this.adTitle = null;
  this.adDescription = null;
  this.adOnStage = false;
  this.adPauseEventTimeout = null;
  this.clickThroughUrl = null;
  this.isWrapper = false;
  this.vastAdTagURI = null;
  this.redirectsFollowed = 0;
  this.icons = [];
  this.clickUIOnMobile = null;
  this.currentContentSrc = null;
  this.currentContentCurrentTime = -1;
  // skip
  this.isSkippableAd = false;
  this.hasSkipEvent = false;
  this.skipoffset = '';
  this.progressEventOffsets = [];
  this.progressEventOffsetsSeconds = null;
  this.skipButton = null;
  this.skipWaiting = null;
  this.skipMessage = null;
  this.skipButton = null;
  this.skippableAdCanBeSkipped = false;
  // non linear
  this.nonLinearCreative = null;
  this.nonLinearCreativeUrl = null;
  this.nonLinearCreativeHeight = 0;
  this.nonLinearCreativeWidth = 0;
};

RESET.unwireVastPlayerEvents = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: RESET unwireVastPlayerEvents');
  }
  if (this.nonLinearCreative) {
    this.nonLinearCreative.removeEventListener('load', this.onNonLinearLoadSuccess);
    this.nonLinearCreative.removeEventListener('error', this.onNonLinearLoadError);
    this.nonLinearCreative.removeEventListener('click', this.onNonLinearClickThrough);
    for (let i = 0, len = this.trackingTags.length; i < len; i++) {
      this.nonLinearCreative.removeEventListener(this.trackingTags[i].event, this.onEventPingTracking);
    }
  }
  if (this.vastPlayer) {
    if (this.vastPlayerSource) {
      this.vastPlayerSource.removeEventListener('error', this.onPlaybackError);
    }
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
    this.vastPlayer.removeEventListener('click', this.onClickThrough);
    // remove icons 
    this.vastPlayer.removeEventListener('playing', this.onPlayingAppendIcons);
    // skip
    this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdateCheckSkip);
    if (this.skipButton) {
      this.skipButton.removeEventListener('click', this.onClickSkip);
      this.skipButton.removeEventListener('touchend', this.onClickSkip);
    }
    // click UI on mobile
    if (this.clickUIOnMobile) {
      this.clickUIOnMobile.removeEventListener('click', this.onClickThrough);
    }
    // fullscreen
    if (ENV.hasNativeFullscreenSupport) {
      document.removeEventListener('fullscreenchange', this.onFullscreenchange);
      // for our beloved iOS 
      if (this.useContentPlayerForAds) {
        this.vastPlayer.removeEventListener('webkitbeginfullscreen', this.onFullscreenchange);
        this.vastPlayer.removeEventListener('webkitendfullscreen', this.onFullscreenchange);
      }
    }
  }
  if (this.contentPlayer) {
    this.contentPlayer.removeEventListener('loadstart', this.updateInitialContentSrc);
    this.contentPlayer.removeEventListener('playing', this.onPlayingSeek);
  }
};

export { RESET };