import { FW } from '../fw/fw';
import { ENV } from '../fw/env';
import { VASTERRORS } from '../utils/vast-errors';
import { API } from '../api/api';
import { PING } from '../tracking/ping';
import { VASTPLAYER } from '../players/vast-player';
import { ICONS } from '../creatives/icons';
import { TRACKINGEVENTS } from '../tracking/tracking-events';
import { CONTENTPLAYER } from '../players/content-player';

const VPAID = {};

// vpaidCreative getters

VPAID.getAdWidth = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdWidth === 'function') {
    return this.vpaidCreative.getAdWidth();
  }
  return null;
};

VPAID.getAdHeight = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdHeight === 'function') {
    return this.vpaidCreative.getAdHeight();
  }
  return null;
};

VPAID.getAdDuration = function () {
  if (this.vpaidCreative) {
    if (typeof this.vpaidCreative.getAdDuration === 'function') {
      return this.vpaidCreative.getAdDuration();
    } else if (this.vpaid1AdDuration > -1) {
      return this.vpaid1AdDuration;
    }
  }
  return -1;
};

VPAID.getAdRemainingTime = function () {
  if (this.vpaidRemainingTime >= 0) {
    return this.vpaidRemainingTime;
  }
  return -1;
};

VPAID.getCreativeUrl = function () {
  if (this.vpaidCreativeUrl) {
    return this.vpaidCreativeUrl;
  }
  return null;
};

VPAID.getVpaidCreative = function () {
  return this.vpaidCreative;
};

VPAID.getAdVolume = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdVolume === 'function') {
    return this.vpaidCreative.getAdVolume();
  }
  return null;
};

VPAID.getAdPaused = function () {
  return this.vpaidPaused;
};

VPAID.getAdExpanded = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdExpanded === 'function') {
    return this.vpaidCreative.getAdExpanded();
  }
  return null;
};

VPAID.getAdSkippableState = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdSkippableState === 'function') {
    return this.vpaidCreative.getAdSkippableState();
  }
  return null;
};

VPAID.getAdIcons = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdIcons === 'function') {
    return this.vpaidCreative.getAdIcons();
  }
  return null;
};

VPAID.getAdCompanions = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdCompanions === 'function') {
    return this.vpaidCreative.getAdCompanions();
  }
  return null;
};


// VPAID creative events
var _onAdLoaded = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdLoaded event');
  }
  this.vpaidAdLoaded = true;
  if (!this.vpaidCreative) {
    return;
  }
  if (this.initAdTimeout) {
    clearTimeout(this.initAdTimeout);
  }
  if (this.vpaidCallbacks.AdLoaded) {
    this.vpaidCreative.unsubscribe(this.vpaidCallbacks.AdLoaded, 'AdLoaded');
  }
  // when we call startAd we expect AdStarted event to follow closely
  // otherwise we need to resume content
  this.startAdTimeout = setTimeout(() => {
    if (!this.vpaidAdStarted) {
      VASTPLAYER.resumeContent.call(this);
    }
    this.vpaidAdStarted = false;
  }, this.params.creativeLoadTimeout);
  // pause content player
  CONTENTPLAYER.pause.call(this);
  this.adOnStage = true;
  this.vpaidCreative.startAd();
  API.createEvent.call(this, 'adloaded');
};

var _onAdStarted = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdStarted event');
  }
  this.vpaidAdStarted = true;
  if (!this.vpaidCreative) {
    return;
  }
  if (this.startAdTimeout) {
    clearTimeout(this.startAdTimeout);
  }
  if (this.vpaidCallbacks.AdStarted) {
    this.vpaidCreative.unsubscribe(this.vpaidCallbacks.AdStarted, 'AdStarted');
  }
  // update duration for VPAID 1.*
  if (this.vpaidVersion === 1) {
    this.vpaid1AdDuration = VPAID.getAdRemainingTime.call(this);
  }
  // append icons - if VPAID does not handle them
  if (!VPAID.getAdIcons.call(this) && !this.useContentPlayerForAds && this.icons.length > 0) {
    ICONS.append.call(this);
  }
  if (typeof this.vpaidCreative.getAdLinear === 'function') {
    this.adIsLinear = this.vpaidCreative.getAdLinear();
  }
  FW.dispatchPingEvent.call(this, 'creativeView');
};

var _onAdStopped = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdStopped event');
  }
  if (this.adStoppedTimeout) {
    clearTimeout(this.adStoppedTimeout);
  }
  VASTPLAYER.resumeContent.call(this);
};

var _onAdSkipped = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdSkipped event');
  }
  if (this.adSkippedTimeout) {
    clearTimeout(this.adSkippedTimeout);
  }
  API.createEvent.call(this, 'adskipped');
  FW.dispatchPingEvent.call(this, 'skip');
};

var _onAdSkippableStateChange = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdSkippableStateChange event');
  }
  API.createEvent.call(this, 'adskippablestatechanged');
};

var _onAdDurationChange = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdDurationChange event ' + VPAID.getAdDuration.call(this));
  }
  if (!this.vpaidCreative) {
    return;
  }
  if (typeof this.vpaidCreative.getAdRemainingTime === 'function') {
    let remainingTime = this.vpaidCreative.getAdRemainingTime();
    if (remainingTime >= 0) {
      this.vpaidRemainingTime = remainingTime;
    }
  }
  API.createEvent.call(this, 'addurationchange');
};

var _onAdVolumeChange = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdVolumeChange event');
  }
  let newVolume = VPAID.getAdVolume.call(this);
  if (newVolume === null) {
    return;
  }
  if (this.vpaidCurrentVolume > 0 && newVolume === 0) {
    FW.dispatchPingEvent.call(this, 'mute');
  } else if (this.vpaidCurrentVolume === 0 && newVolume > 0) {
    FW.dispatchPingEvent.call(this, 'unmute');
  }
  this.vpaidCurrentVolume = newVolume;
  API.createEvent.call(this, 'advolumechanged');
};

var _onAdImpression = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdImpression event');
  }
  API.createEvent.call(this, 'adimpression');
  FW.dispatchPingEvent.call(this, 'impression');
};

var _onAdVideoStart = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdVideoStart event');
  }
  this.vpaidPaused = false;
  let newVolume = VPAID.getAdVolume.call(this);
  if (newVolume === null) {
    newVolume = 1;
  }
  this.vpaidCurrentVolume = newVolume;
  API.createEvent.call(this, 'adstarted');
  FW.dispatchPingEvent.call(this, 'start');
};

var _onAdVideoFirstQuartile = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdVideoFirstQuartile event');
  }
  API.createEvent.call(this, 'adfirstquartile');
  FW.dispatchPingEvent.call(this, 'firstQuartile');
};

var _onAdVideoMidpoint = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdVideoMidpoint event');
  }
  API.createEvent.call(this, 'admidpoint');
  FW.dispatchPingEvent.call(this, 'midpoint');
};

var _onAdVideoThirdQuartile = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdVideoThirdQuartile event');
  }
  API.createEvent.call(this, 'adthirdquartile');
  FW.dispatchPingEvent.call(this, 'thirdQuartile');
};

var _onAdVideoComplete = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdVideoComplete event');
  }
  API.createEvent.call(this, 'adcomplete');
  FW.dispatchPingEvent.call(this, 'complete');
};

var _onAdClickThru = function (url, id, playerHandles) {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdClickThru event');
  }
  API.createEvent.call(this, 'adclick');
  FW.dispatchPingEvent.call(this, 'clickthrough');
  if (typeof playerHandles !== 'boolean') {
    return;
  }
  if (!playerHandles) {
    return;
  } else {
    let destUrl;
    if (url) {
      destUrl = url;
    } else if (this.clickThroughUrl) {
      destUrl = this.clickThroughUrl;
    }
    if (destUrl) {
      // for getClickThroughUrl API method
      this.clickThroughUrl = destUrl;
      FW.openWindow(this.clickThroughUrl);
    }
  }
};

var _onAdPaused = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdPaused event');
  }
  this.vpaidPaused = true;
  API.createEvent.call(this, 'adpaused');
  FW.dispatchPingEvent.call(this, 'pause');
};

var _onAdPlaying = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdPlaying event');
  }
  this.vpaidPaused = false;
  API.createEvent.call(this, 'adresumed');
  FW.dispatchPingEvent.call(this, 'resume');
};

var _onAdLog = function (message) {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdLog event ' + message);
  }
};

var _onAdError = function (message) {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdError event ' + message);
  }
  PING.error.call(this, 901);
  VASTERRORS.process.call(this, 901);
};

var _onAdInteraction = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdInteraction event');
  }
  API.createEvent.call(this, 'adinteraction');
};

var _onAdUserAcceptInvitation = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdUserAcceptInvitation event');
  }
  API.createEvent.call(this, 'aduseracceptinvitation');
  FW.dispatchPingEvent.call(this, 'acceptInvitation');
};

var _onAdUserMinimize = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdUserMinimize event');
  }
  API.createEvent.call(this, 'adcollapse');
  FW.dispatchPingEvent.call(this, 'collapse');
};

var _onAdUserClose = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdUserClose event');
  }
  API.createEvent.call(this, 'adclose');
  FW.dispatchPingEvent.call(this, 'close');
};

var _onAdSizeChange = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdSizeChange event');
  }
  API.createEvent.call(this, 'adsizechange');
};

var _onAdLinearChange = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdLinearChange event');
  }
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdLinear === 'function') {
    this.adIsLinear = this.vpaidCreative.getAdLinear();
    API.createEvent.call(this, 'adlinearchange');
  }
};

var _onAdExpandedChange = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdExpandedChange event');
  }
  API.createEvent.call(this, 'adexpandedchange');
};

var _onAdRemainingTimeChange = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdRemainingTimeChange event');
  }
  if (!this.vpaidCreative && typeof this.vpaidCreative.getAdRemainingTime === 'function') {
    let remainingTime = this.vpaidCreative.getAdRemainingTime();
    if (remainingTime >= 0) {
      this.vpaidRemainingTime = remainingTime;
    }
  }
  API.createEvent.call(this, 'adremainingtimechange');
};

// vpaidCreative methods
VPAID.resizeAd = function (width, height, viewMode) {
  if (!this.vpaidCreative) {
    return;
  }
  if (typeof width !== 'number' || typeof height !== 'number' || typeof viewMode !== 'string') {
    return;
  }
  if (width <= 0 || height <= 0) {
    return;
  }
  let validViewMode = 'normal';
  if (viewMode === 'fullscreen') {
    validViewMode = viewMode;
  }
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID resizeAd with width ' + width + ' - height ' + height + ' - viewMode ' + viewMode);
  }
  this.vpaidCreative.resizeAd(width, height, validViewMode);
};

VPAID.stopAd = function () {
  if (!this.vpaidCreative) {
    return;
  }
  if (DEBUG) {
    FW.log('RMP-VAST: stopAd');
  }
  // when stopAd is called we need to check a 
  // AdStopped event follows
  this.adStoppedTimeout = setTimeout(() => {
    _onAdStopped.call(this);
  }, this.params.creativeLoadTimeout);
  this.vpaidCreative.stopAd();
};

VPAID.pauseAd = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: pauseAd');
  }
  if (this.vpaidCreative && !this.vpaidPaused) {
    this.vpaidCreative.pauseAd();
  }
};

VPAID.resumeAd = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: resumeAd');
  }
  if (this.vpaidCreative && this.vpaidPaused) {
    this.vpaidCreative.resumeAd();
  }
};

VPAID.expandAd = function () {
  if (this.vpaidCreative) {
    this.vpaidCreative.expandAd();
  }
};

VPAID.collapseAd = function () {
  if (this.vpaidCreative) {
    this.vpaidCreative.collapseAd();
  }
};

VPAID.skipAd = function () {
  if (!this.vpaidCreative) {
    return;
  }
  // when skipAd is called we need to check a 
  // AdSkipped event follows
  this.adSkippedTimeout = setTimeout(() => {
    _onAdStopped.call(this);
  }, this.params.creativeLoadTimeout);
  this.vpaidCreative.skipAd();
};

VPAID.setAdVolume = function (volume) {
  if (this.vpaidCreative && typeof volume === 'number' && volume >= 0 && volume <= 1 &&
    typeof this.vpaidCreative.setAdVolume === 'function') {
    this.vpaidCreative.setAdVolume(volume);
  }
};

var _setCallbacksForCreative = function () {
  if (!this.vpaidCreative) {
    return;
  }
  this.vpaidCallbacks = {
    AdLoaded: _onAdLoaded.bind(this),
    AdStarted: _onAdStarted.bind(this),
    AdStopped: _onAdStopped.bind(this),
    AdSkipped: _onAdSkipped.bind(this),
    AdSkippableStateChange: _onAdSkippableStateChange.bind(this),
    AdDurationChange: _onAdDurationChange.bind(this),
    AdVolumeChange: _onAdVolumeChange.bind(this),
    AdImpression: _onAdImpression.bind(this),
    AdVideoStart: _onAdVideoStart.bind(this),
    AdVideoFirstQuartile: _onAdVideoFirstQuartile.bind(this),
    AdVideoMidpoint: _onAdVideoMidpoint.bind(this),
    AdVideoThirdQuartile: _onAdVideoThirdQuartile.bind(this),
    AdVideoComplete: _onAdVideoComplete.bind(this),
    AdClickThru: _onAdClickThru.bind(this),
    AdPaused: _onAdPaused.bind(this),
    AdPlaying: _onAdPlaying.bind(this),
    AdLog: _onAdLog.bind(this),
    AdError: _onAdError.bind(this),
    AdInteraction: _onAdInteraction.bind(this),
    AdUserAcceptInvitation: _onAdUserAcceptInvitation.bind(this),
    AdUserMinimize: _onAdUserMinimize.bind(this),
    AdUserClose: _onAdUserClose.bind(this),
    AdSizeChange: _onAdSizeChange.bind(this),
    AdLinearChange: _onAdLinearChange.bind(this),
    AdExpandedChange: _onAdExpandedChange.bind(this),
    AdRemainingTimeChange: _onAdRemainingTimeChange.bind(this)
  };
  // Looping through the object and registering each of the callbacks with the creative
  let callbacksKeys = Object.keys(this.vpaidCallbacks);
  for (let i = 0, len = callbacksKeys.length; i < len; i++) {
    let currentKey = callbacksKeys[i];
    this.vpaidCreative.subscribe(this.vpaidCallbacks[currentKey], currentKey);
  }
};

var _unsetCallbacksForCreative = function () {
  if (!this.vpaidCreative) {
    return;
  }
  // Looping through the object and registering each of the callbacks with the creative
  let callbacksKeys = Object.keys(this.vpaidCallbacks);
  for (let i = 0, len = callbacksKeys.length; i < len; i++) {
    let currentKey = callbacksKeys[i];
    this.vpaidCreative.unsubscribe(this.vpaidCallbacks[currentKey], currentKey);
  }
};

var _isValidVPAID = function (creative) {
  if (typeof creative.initAd === 'function' &&
    typeof creative.startAd === 'function' &&
    typeof creative.stopAd === 'function' &&
    typeof creative.skipAd === 'function' &&
    typeof creative.resizeAd === 'function' &&
    typeof creative.pauseAd === 'function' &&
    typeof creative.resumeAd === 'function' &&
    typeof creative.expandAd === 'function' &&
    typeof creative.collapseAd === 'function' &&
    typeof creative.subscribe === 'function' &&
    typeof creative.unsubscribe === 'function') {
    return true;
  }
  return false;
};

var _onVPAIDAvailable = function () {
  if (this.vpaidAvailableInterval) {
    clearInterval(this.vpaidAvailableInterval);
  }
  if (this.vpaidLoadTimeout) {
    clearTimeout(this.vpaidLoadTimeout);
  }
  this.vpaidCreative = this.vpaidIframe.contentWindow.getVPAIDAd();
  if (this.vpaidCreative && typeof this.vpaidCreative.handshakeVersion === 'function') {
    // we need to insure handshakeVersion return
    let vpaidVersion;
    try {
      vpaidVersion = this.vpaidCreative.handshakeVersion('2.0');
    } catch (e) {
      FW.log(e);
      if (DEBUG) {
        FW.log('RMP-VAST: could not validate VPAID ad unit handshakeVersion');
      }
      PING.error.call(this, 901);
      VASTERRORS.process.call(this, 901);
      return;
    }
    this.vpaidVersion = parseInt(vpaidVersion);
    if (this.vpaidVersion < 1) {
      if (DEBUG) {
        FW.log('RMP-VAST: unsupported VPAID version - exit');
      }
      PING.error.call(this, 901);
      VASTERRORS.process.call(this, 901);
      return;
    }
    if (!_isValidVPAID(this.vpaidCreative)) {
      //The VPAID creative doesn't conform to the VPAID spec
      if (DEBUG) {
        FW.log('RMP-VAST: VPAID creative does not conform to VPAID spec - exit');
      }
      PING.error.call(this, 901);
      VASTERRORS.process.call(this, 901);
      return;
    }
    // wire callback for VPAID events
    _setCallbacksForCreative.call(this);
    // wire tracking events for VAST pings
    TRACKINGEVENTS.wire.call(this);
    let creativeData = {};
    creativeData.AdParameters = this.adParametersData;
    if (DEBUG) {
      FW.log('RMP-VAST: VPAID AdParameters follow');
      FW.log(this.adParametersData);
    }
    FW.show(this.adContainer);
    FW.show(this.vastPlayer);
    let environmentVars = {};
    // we create a new slot for VPAID creative - using adContainer can cause some VPAID to ill-render
    // from spec:
    // The 'environmentVars' object contains a reference, 'slot', to the HTML element
    // on the page in which the ad is to be rendered. The ad unit essentially gets
    // control of that element. 
    this.vpaidSlot = document.createElement('div');
    this.vpaidSlot.className = 'rmp-vpaid-container';
    this.adContainer.appendChild(this.vpaidSlot);
    environmentVars.slot = this.vpaidSlot;
    environmentVars.videoSlot = this.vastPlayer;
    // we assume we can autoplay (or at least muted autoplay) because this.vastPlayer 
    // has been init
    environmentVars.videoSlotCanAutoPlay = true;
    // when we call initAd we expect AdLoaded event to follow closely
    // if not we need to resume content
    this.initAdTimeout = setTimeout(() => {
      if (!this.vpaidAdLoaded) {
        if (DEBUG) {
          FW.log('RMP-VAST: initAdTimeout');
        }
        VASTPLAYER.resumeContent.call(this);
      }
      this.vpaidAdLoaded = false;
    }, this.params.creativeLoadTimeout * 10);
    if (DEBUG) {
      FW.log('RMP-VAST: calling initAd on VPAID creative now');
    }
    this.vpaidCreative.initAd(
      this.initialWidth,
      this.initialHeight,
      this.initialViewMode,
      this.desiredBitrate,
      creativeData,
      environmentVars
    );
  }
};

var _onJSVPAIDLoaded = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID JS loaded');
  }
  this.vpaidScript.removeEventListener('load', this.onJSVPAIDLoaded);
  let iframeWindow = this.vpaidIframe.contentWindow;
  if (typeof iframeWindow.getVPAIDAd === 'function') {
    _onVPAIDAvailable.call(this);
  } else {
    this.vpaidAvailableInterval = setInterval(() => {
      if (typeof iframeWindow.getVPAIDAd === 'function') {
        _onVPAIDAvailable.call(this);
      }
    }, 100);
  }
};

var _onJSVPAIDError = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID JS error loading');
  }
  this.vpaidScript.removeEventListener('error', this.onJSVPAIDError);
  PING.error.call(this, 901);
  VASTERRORS.process.call(this, 901);
};

VPAID.loadCreative = function (creativeUrl, vpaidSettings) {
  this.initialWidth = vpaidSettings.width;
  this.initialHeight = vpaidSettings.height;
  this.initialViewMode = vpaidSettings.viewMode;
  this.desiredBitrate = vpaidSettings.desiredBitrate;
  this.vpaidCreativeUrl = creativeUrl;
  if (!this.vastPlayer) {
    if (this.useContentPlayerForAds) {
      this.vastPlayer = this.contentPlayer;
    } else {
      // we use existing rmp-ad-vast-video-player as it is already 
      // available and initialized (no need for user interaction)
      let existingVastPlayer = this.adContainer.getElementsByClassName('rmp-ad-vast-video-player')[0];
      if (!existingVastPlayer) {
        VASTERRORS.process.call(this, 1004);
        return;
      }
      this.vastPlayer = existingVastPlayer;
    }
  }
  // create FiF 
  this.vpaidIframe = document.createElement('iframe');
  this.vpaidIframe.id = 'vpaid-frame';
  // do not use display: none;
  // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  this.vpaidIframe.style.visibility = 'hidden';
  this.vpaidIframe.style.width = '0px';
  this.vpaidIframe.style.height = '0px';
  this.vpaidIframe.style.border = 'none';
  // this is to adhere to Best Practices for Rich Media Ads 
  // in Asynchronous Ad Environments  http://www.iab.net/media/file/rich_media_ajax_best_practices.pdf
  let src = 'about:self';
  // ... however this does not work in Firefox (onload is never reached)
  // https://bugzilla.mozilla.org/show_bug.cgi?id=444165
  // about:self also causes protocol mis-match issues with iframes in iOS/macOS Safari
  // ... TL;DR iframes are troubles
  if (ENV.isFirefox || this.useContentPlayerForAds) {
    src = '';
  }
  this.vpaidIframe.onload = function () {
    if (DEBUG) {
      FW.log('RMP-VAST: iframe.onload');
    }
    // we unwire listeners
    this.vpaidIframe.onload = this.vpaidIframe.onerror = FW.nullFn;
    if (!this.vpaidIframe.contentWindow || !this.vpaidIframe.contentWindow.document ||
      !this.vpaidIframe.contentWindow.document.body) {
      // PING error and resume content
      PING.error.call(this, 901);
      VASTERRORS.process.call(this, 901);
      return;
    }
    let iframeWindow = this.vpaidIframe.contentWindow;
    let iframeDocument = iframeWindow.document;
    let iframeBody = iframeDocument.body;
    this.vpaidScript = iframeDocument.createElement('script');

    this.vpaidLoadTimeout = setTimeout(() => {
      if (DEBUG) {
        FW.log('RMP-VAST: could not load VPAID JS Creative or getVPAIDAd in iframeWindow - resume content');
      }
      this.vpaidScript.removeEventListener('load', this.onJSVPAIDLoaded);
      this.vpaidScript.removeEventListener('error', this.onJSVPAIDError);
      VASTPLAYER.resumeContent.call(this);
    }, this.params.creativeLoadTimeout);
    this.onJSVPAIDLoaded = _onJSVPAIDLoaded.bind(this);
    this.onJSVPAIDError = _onJSVPAIDError.bind(this);
    this.vpaidScript.addEventListener('load', this.onJSVPAIDLoaded);
    this.vpaidScript.addEventListener('error', this.onJSVPAIDError);
    iframeBody.appendChild(this.vpaidScript);
    this.vpaidScript.src = this.vpaidCreativeUrl;
  }.bind(this);

  this.vpaidIframe.onerror = function () {
    if (DEBUG) {
      FW.log('RMP-VAST: iframe.onerror');
    }
    // we unwire listeners
    this.vpaidIframe.onload = this.vpaidIframe.onerror = FW.nullFn;
    // PING error and resume content
    PING.error.call(this, 901);
    VASTERRORS.process.call(this, 901);
  }.bind(this);

  this.vpaidIframe.src = src;
  this.adContainer.appendChild(this.vpaidIframe);
};

VPAID.destroy = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: destroy VPAID dependencies');
  }
  if (this.vpaidAvailableInterval) {
    clearInterval(this.vpaidAvailableInterval);
  }
  if (this.vpaidLoadTimeout) {
    clearTimeout(this.vpaidLoadTimeout);
  }
  if (this.initAdTimeout) {
    clearTimeout(this.initAdTimeout);
  }
  if (this.startAdTimeout) {
    clearTimeout(this.startAdTimeout);
  }
  _unsetCallbacksForCreative.call(this);
  if (this.vpaidScript) {
    this.vpaidScript.removeEventListener('load', this.onJSVPAIDLoaded);
    this.vpaidScript.removeEventListener('error', this.onJSVPAIDError);
  }
  if (this.vpaidSlot) {
    try {
      this.adContainer.removeChild(this.vpaidSlot);
    } catch (e) {
      FW.trace(e);
    }
  }
  if (this.vpaidIframe) {
    try {
      this.adContainer.removeChild(this.vpaidIframe);
    } catch (e) {
      FW.trace(e);
    }
  }
};

export { VPAID };