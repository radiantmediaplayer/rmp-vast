import { FW } from '../fw/fw';
import { FWVAST } from '../fw/fw-vast';
import { VASTERRORS } from '../utils/vast-errors';
import { API } from '../api/api';
import { PING } from '../tracking/ping';
import { VASTPLAYER } from '../players/vast-player';
import { ICONS } from '../creatives/icons';
import { TRACKINGEVENTS } from '../tracking/tracking-events';
import { CONTENTPLAYER } from '../players/content-player';

const VPAID = {};

var slot;
var vpaidPlayer;
var rmpVast;
var vpaidCreative = null;
var scriptVPAID = null;
var iframe = null;
var jsLoadTimeout = null;
var initAdTimeout = null;
var startAdTimeout = null;
var vpaidAvailableInterval = null;
var adStoppedTimeout = null;
var adSkippedTimeout = null;
var adParametersData = '';
var clickThroughUrl = '';
var currentVPAIDVolume = 1;
var vpaidPaused = true;
var jsCreativeUrl = '';
var vpaidRemainingTime = -1;
var intVpaidVersion = -1;
var adDurationVPAID1 = -1;
var vpaidIsLinear = true;
var initialWidth = 640;
var initialHeight = 360;
var initialViewMode = 'normal';
var desiredBitrate = 500;
var ajaxTimeout = 7000;
var creativeLoadTimeout = 10000;
var hadAdLoaded = false;
var hasAdStarted = false;

// vpaidCreative getters
VPAID.getCreativeVersion = function () {
  return intVpaidVersion;
};
VPAID.getAdWidth = function () {
  if (vpaidCreative && typeof vpaidCreative.getAdWidth === 'function') {
    return vpaidCreative.getAdWidth();
  }
  return null;
};
VPAID.getAdHeight = function () {
  if (vpaidCreative && typeof vpaidCreative.getAdHeight === 'function') {
    return vpaidCreative.getAdHeight();
  }
  return null;
};
VPAID.getAdDuration = function () {
  if (vpaidCreative) {
    if (typeof vpaidCreative.getAdDuration === 'function') {
      return vpaidCreative.getAdDuration();
    } else if (adDurationVPAID1 > -1) {
      return adDurationVPAID1;
    }
  }
  return -1;
};
VPAID.getAdRemainingTime = function () {
  if (vpaidRemainingTime >= 0) {
    return vpaidRemainingTime;
  }
  return -1;
};
VPAID.getCreativeUrl = function () {
  if (jsCreativeUrl) {
    return jsCreativeUrl;
  }
  return null;
};
VPAID.getVpaidCreative = function () {
  if (vpaidCreative) {
    return vpaidCreative;
  }
  return null;
};
VPAID.getAdVolume = function () {
  if (vpaidCreative && typeof vpaidCreative.getAdVolume === 'function') {
    return vpaidCreative.getAdVolume();
  }
  return null;
};
VPAID.getAdPaused = function () {
  return vpaidPaused;
};
VPAID.getAdExpanded = function () {
  if (vpaidCreative && typeof vpaidCreative.getAdExpanded === 'function') {
    return vpaidCreative.getAdExpanded();
  }
  return null;
};
VPAID.getAdSkippableState = function () {
  if (vpaidCreative && typeof vpaidCreative.getAdSkippableState === 'function') {
    return vpaidCreative.getAdSkippableState();
  }
  return null;
};
VPAID.getAdIcons = function () {
  if (vpaidCreative && typeof vpaidCreative.getAdIcons === 'function') {
    return vpaidCreative.getAdIcons();
  }
  return null;
};
VPAID.getAdCompanions = function () {
  if (vpaidCreative && typeof vpaidCreative.getAdCompanions === 'function') {
    return vpaidCreative.getAdCompanions();
  }
  return null;
};


// VPAID creative events
var _onAdLoaded = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdLoaded event');
  }
  hadAdLoaded = true;
  if (!rmpVast || !vpaidCreative) {
    return;
  }
  if (initAdTimeout) {
    clearTimeout(initAdTimeout);
  }
  vpaidCreative.unsubscribe(_onAdLoaded, 'AdLoaded');
  startAdTimeout = setTimeout(() => {
    if (rmpVast && !hasAdStarted) {
      VASTPLAYER.resumeContent.call(rmpVast);
    }
    hasAdStarted = false;
  }, ajaxTimeout);
  FW.show(slot);
  FW.show(vpaidPlayer);
  // pause content player
  CONTENTPLAYER.pause.call(rmpVast);
  rmpVast.adOnStage = true;
  vpaidCreative.startAd();
  API.createEvent.call(rmpVast, 'adloaded');
};

var _onAdStarted = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdStarted event');
  }
  hasAdStarted = true;
  if (!rmpVast || !vpaidCreative) {
    return;
  }
  if (startAdTimeout) {
    clearTimeout(startAdTimeout);
  }
  vpaidCreative.unsubscribe(_onAdStarted, 'AdStarted');
  // update duration for VPAID 1.*
  if (intVpaidVersion === 1) {
    adDurationVPAID1 = VPAID.getAdRemainingTime();
  }
  // append icons - if VPAID does not handle them
  if (!VPAID.getAdIcons() && !rmpVast.useContentPlayerForAds && rmpVast.icons.length > 0) {
    ICONS.append.call(rmpVast);
  }
  if (typeof vpaidCreative.getAdLinear === 'function') {
    vpaidIsLinear = rmpVast.adIsLinear = vpaidCreative.getAdLinear();
    if (!vpaidIsLinear) {
      // we currently do not support Click-to-Linear Video Ad
      VPAID.stopAd();
    }
  }
  FWVAST.dispatchPingEvent.call(rmpVast, 'creativeView');
};

var _onAdStopped = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdStopped event');
  }
  if (adStoppedTimeout) {
    clearTimeout(adStoppedTimeout);
  }
  if (rmpVast) {
    VASTPLAYER.resumeContent.call(rmpVast);
  }
};

var _onAdSkipped = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdSkipped event');
  }
  if (adSkippedTimeout) {
    clearTimeout(adSkippedTimeout);
  }
  if (rmpVast) {
    API.createEvent.call(rmpVast, 'adskipped');
    FWVAST.dispatchPingEvent.call(rmpVast, 'skip');
  }
};

var _onAdSkippableStateChange = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdSkippableStateChange event');
  }
  if (rmpVast) {
    API.createEvent.call(rmpVast, 'adskippablestatechanged');
  }
};

var _onAdDurationChange = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdDurationChange event ' + VPAID.getAdDuration());
  }
  if (!rmpVast || !vpaidCreative) {
    return;
  }
  if (typeof vpaidCreative.getAdRemainingTime === 'function') {
    let remainingTime = vpaidCreative.getAdRemainingTime();
    if (remainingTime >= 0) {
      vpaidRemainingTime = remainingTime;
    }
  }
  API.createEvent.call(rmpVast, 'addurationchange');
};

var _onAdVolumeChange = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdVolumeChange event');
  }
  if (!rmpVast) {
    return;
  }
  let newVolume = VPAID.getAdVolume();
  if (newVolume === null) {
    return;
  }
  if (currentVPAIDVolume > 0 && newVolume === 0) {
    FWVAST.dispatchPingEvent.call(rmpVast, 'mute');
  } else if (currentVPAIDVolume === 0 && newVolume > 0) {
    FWVAST.dispatchPingEvent.call(rmpVast, 'unmute');
  }
  currentVPAIDVolume = newVolume;
  API.createEvent.call(rmpVast, 'advolumechanged');
};

var _onAdImpression = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdImpression event');
  }
  if (!rmpVast) {
    return;
  }
  API.createEvent.call(rmpVast, 'adimpression');
  FWVAST.dispatchPingEvent.call(rmpVast, 'impression');
};

var _onAdVideoStart = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdVideoStart event');
  }
  if (!rmpVast) {
    return;
  }
  vpaidPaused = false;
  let newVolume = VPAID.getAdVolume();
  if (newVolume === null) {
    newVolume = 1;
  }
  currentVPAIDVolume = newVolume;
  API.createEvent.call(rmpVast, 'adstarted');
  FWVAST.dispatchPingEvent.call(rmpVast, 'start');
};

var _onAdVideoFirstQuartile = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdVideoFirstQuartile event');
  }
  if (!rmpVast) {
    return;
  }
  API.createEvent.call(rmpVast, 'adfirstquartile');
  FWVAST.dispatchPingEvent.call(rmpVast, 'firstQuartile');
};

var _onAdVideoMidpoint = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdVideoMidpoint event');
  }
  if (!rmpVast) {
    return;
  }
  API.createEvent.call(rmpVast, 'admidpoint');
  FWVAST.dispatchPingEvent.call(rmpVast, 'midpoint');
};

var _onAdVideoThirdQuartile = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdVideoThirdQuartile event');
  }
  if (!rmpVast) {
    return;
  }
  API.createEvent.call(rmpVast, 'adthirdquartile');
  FWVAST.dispatchPingEvent.call(rmpVast, 'thirdQuartile');
};

var _onAdVideoComplete = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdVideoComplete event');
  }
  if (!rmpVast) {
    return;
  }
  API.createEvent.call(rmpVast, 'adcomplete');
  FWVAST.dispatchPingEvent.call(rmpVast, 'complete');
};

var _onAdClickThru = function (url, id, playerHandles) {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdClickThru event');
  }
  if (!rmpVast) {
    return;
  }
  API.createEvent.call(rmpVast, 'adclick');
  FWVAST.dispatchPingEvent.call(rmpVast, 'clickthrough');
  if (typeof playerHandles !== 'boolean') {
    return;
  }
  if (!playerHandles) {
    return;
  } else {
    let destUrl;
    if (url) {
      destUrl = url;
    } else if (clickThroughUrl) {
      destUrl = clickThroughUrl;
    }
    if (destUrl) {
      // for getClickThroughUrl API method
      rmpVast.clickThroughUrl = destUrl;
      window.open(destUrl, '_blank');
    }
  }
};

var _onAdPaused = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdPaused event');
  }
  if (!rmpVast) {
    return;
  }
  vpaidPaused = true;
  API.createEvent.call(rmpVast, 'adpaused');
  FWVAST.dispatchPingEvent.call(rmpVast, 'pause');
};

var _onAdPlaying = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdPlaying event');
  }
  if (!rmpVast) {
    return;
  }
  vpaidPaused = false;
  API.createEvent.call(rmpVast, 'adresumed');
  FWVAST.dispatchPingEvent.call(rmpVast, 'resume');
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
  if (!rmpVast) {
    return;
  }
  PING.error.call(rmpVast, 901);
  VASTERRORS.process.call(rmpVast, 901);
};

var _onAdInteraction = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdInteraction event');
  }
  if (!rmpVast) {
    return;
  }
  API.createEvent.call(rmpVast, 'adinteraction');
};

var _onAdUserAcceptInvitation = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdUserAcceptInvitation event');
  }
  if (!rmpVast) {
    return;
  }
  API.createEvent.call(rmpVast, 'aduseracceptinvitation');
  FWVAST.dispatchPingEvent.call(rmpVast, 'acceptInvitation');
};

var _onAdUserMinimize = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdUserMinimize event');
  }
  if (!rmpVast) {
    return;
  }
  API.createEvent.call(rmpVast, 'adcollapse');
  FWVAST.dispatchPingEvent.call(rmpVast, 'collapse');
};

var _onAdUserClose = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdUserClose event');
  }
  if (!rmpVast) {
    return;
  }
  API.createEvent.call(rmpVast, 'adclose');
  FWVAST.dispatchPingEvent.call(rmpVast, 'close');
};

var _onAdSizeChange = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdSizeChange event');
  }
  API.createEvent.call(rmpVast, 'adsizechange');
};

var _onAdLinearChange = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdLinearChange event');
  }
  if (!vpaidCreative) {
    return;
  }
  if (typeof vpaidCreative.getAdLinear === 'function') {
    vpaidIsLinear = rmpVast.adIsLinear = vpaidCreative.getAdLinear();
    API.createEvent.call(rmpVast, 'adlinearchange');
  }
};

var _onAdExpandedChange = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdExpandedChange event');
  }
  API.createEvent.call(rmpVast, 'adexpandedchange');
};

var _onAdRemainingTimeChange = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID AdRemainingTimeChange event');
  }
  if (!rmpVast || !vpaidCreative) {
    return;
  }
  if (typeof vpaidCreative.getAdRemainingTime === 'function') {
    let remainingTime = vpaidCreative.getAdRemainingTime();
    if (remainingTime >= 0) {
      vpaidRemainingTime = remainingTime;
    }
  }
  API.createEvent.call(rmpVast, 'adremainingtimechange');
};

// vpaidCreative methods
VPAID.resizeAd = function (width, height, viewMode) {
  if (!vpaidCreative) {
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
  vpaidCreative.resizeAd(width, height, validViewMode);
};

VPAID.stopAd = function () {
  if (!vpaidCreative) {
    return;
  }
  if (DEBUG) {
    FW.log('RMP-VAST: stopAd');
  }
  // when stopAd is called we need to check a 
  // AdStopped event follows
  adStoppedTimeout = setTimeout(() => {
    _onAdStopped();
  }, ajaxTimeout);
  vpaidCreative.stopAd();
};

VPAID.pauseAd = function () {
  if (!vpaidCreative) {
    return;
  }
  if (DEBUG) {
    FW.log('RMP-VAST: pauseAd');
  }
  if (!vpaidPaused) {
    vpaidCreative.pauseAd();
  }
};

VPAID.resumeAd = function () {
  if (!vpaidCreative) {
    return;
  }
  if (DEBUG) {
    FW.log('RMP-VAST: resumeAd');
  }
  if (vpaidPaused) {
    vpaidCreative.resumeAd();
  }
};

VPAID.expandAd = function () {
  if (!vpaidCreative) {
    return;
  }
  vpaidCreative.expandAd();
};

VPAID.collapseAd = function () {
  if (!vpaidCreative) {
    return;
  }
  vpaidCreative.collapseAd();
};

VPAID.skipAd = function () {
  if (!vpaidCreative) {
    return;
  }
  // when skipAd is called we need to check a 
  // AdSkipped event follows
  adSkippedTimeout = setTimeout(() => {
    _onAdStopped();
  }, ajaxTimeout);
  vpaidCreative.skipAd();
};

VPAID.setAdVolume = function (volume) {
  if (!vpaidCreative) {
    return;
  }
  if (typeof volume === 'number' && volume >= 0 && volume <= 1 &&
    typeof vpaidCreative.setAdVolume === 'function') {
    vpaidCreative.setAdVolume(volume);
  }
};

var _callbacks = {
  AdLoaded: _onAdLoaded,
  AdStarted: _onAdStarted,
  AdStopped: _onAdStopped,
  AdSkipped: _onAdSkipped,
  AdSkippableStateChange: _onAdSkippableStateChange,
  AdDurationChange: _onAdDurationChange,
  AdVolumeChange: _onAdVolumeChange,
  AdImpression: _onAdImpression,
  AdVideoStart: _onAdVideoStart,
  AdVideoFirstQuartile: _onAdVideoFirstQuartile,
  AdVideoMidpoint: _onAdVideoMidpoint,
  AdVideoThirdQuartile: _onAdVideoThirdQuartile,
  AdVideoComplete: _onAdVideoComplete,
  AdClickThru: _onAdClickThru,
  AdPaused: _onAdPaused,
  AdPlaying: _onAdPlaying,
  AdLog: _onAdLog,
  AdError: _onAdError,
  AdInteraction: _onAdInteraction,
  AdUserAcceptInvitation: _onAdUserAcceptInvitation,
  AdUserMinimize: _onAdUserMinimize,
  AdUserClose: _onAdUserClose,
  AdSizeChange: _onAdSizeChange,
  AdLinearChange: _onAdLinearChange,
  AdExpandedChange: _onAdExpandedChange,
  AdRemainingTimeChange: _onAdRemainingTimeChange
};

var _setCallbacksForCreative = function () {
  // Looping through the object and registering each of the callbacks with the creative
  let callbacksKeys = Object.keys(_callbacks);
  for (let i = 0, len = callbacksKeys.length; i < len; i++) {
    let currentKey = callbacksKeys[i];
    if (vpaidCreative) {
      vpaidCreative.subscribe(_callbacks[currentKey], currentKey);
    }
  }
};

var _unsetCallbacksForCreative = function () {
  // Looping through the object and registering each of the callbacks with the creative
  let callbacksKeys = Object.keys(_callbacks);
  for (let i = 0, len = callbacksKeys.length; i < len; i++) {
    let currentKey = callbacksKeys[i];
    if (vpaidCreative) {
      vpaidCreative.unsubscribe(_callbacks[currentKey], currentKey);
    }
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
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID available for initAd after being loaded');
  }
  if (vpaidAvailableInterval) {
    clearInterval(vpaidAvailableInterval);
  }
  if (jsLoadTimeout) {
    clearTimeout(jsLoadTimeout);
  }
  vpaidCreative = iframe.contentWindow.getVPAIDAd();
  if (vpaidCreative && typeof vpaidCreative.handshakeVersion === 'function') {
    // we need to insure handshakeVersion return
    let vpaidVersion;
    try {
      vpaidVersion = vpaidCreative.handshakeVersion('2.0');
    } catch (e) {
      FW.log(e);
      if (DEBUG) {
        FW.log('RMP-VAST: could not validate VPAID ad unit handshakeVersion');
      }
      PING.error.call(rmpVast, 901);
      VASTERRORS.process.call(rmpVast, 901);
      return;
    }
    intVpaidVersion = parseInt(vpaidVersion);
    if (intVpaidVersion < 1) {
      if (DEBUG) {
        FW.log('RMP-VAST: unsupported VPAID version');
      }
      PING.error.call(rmpVast, 901);
      VASTERRORS.process.call(rmpVast, 901);
      return;
    }
    if (!_isValidVPAID(vpaidCreative)) {
      //The VPAID creative doesn't conform to the VPAID spec
      PING.error.call(rmpVast, 901);
      VASTERRORS.process.call(rmpVast, 901);
      return;
    }
    // wire callback for VPAID events
    _setCallbacksForCreative();
    // wire tracking events for VAST pings
    TRACKINGEVENTS.wire.call(rmpVast);
    let creativeData = {};
    creativeData.AdParameters = adParametersData;
    if (DEBUG) {
      FW.log('RMP-VAST: VPAID AdParameters follow:');
      FW.log(adParametersData);
    }
    let environmentVars = {};
    environmentVars.slot = slot;
    environmentVars.videoSlot = vpaidPlayer;
    // we assume we can autoplay (or at least muted autoplay) because rmpVast.vastPlayer 
    // has been init
    environmentVars.videoSlotCanAutoPlay = true;
    // when we call initAd we expect AdLoaded event to follow closely
    // if not we need to resume content
    initAdTimeout = setTimeout(() => {
      if (rmpVast && !hadAdLoaded) {
        VASTPLAYER.resumeContent.call(rmpVast);
      }
      hadAdLoaded = false;
    }, ajaxTimeout);
    vpaidCreative.initAd(initialWidth, initialHeight, initialViewMode,
      desiredBitrate, creativeData, environmentVars);
  }
};

var _onJSVPAIDLoaded = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID JS loaded');
  }
  scriptVPAID.removeEventListener('load', _onJSVPAIDLoaded);
  let iframeWindow = iframe.contentWindow;
  if (typeof iframeWindow.getVPAIDAd === 'function') {
    _onVPAIDAvailable();
  } else {
    vpaidAvailableInterval = setInterval(() => {
      if (typeof iframeWindow.getVPAIDAd === 'function') {
        _onVPAIDAvailable();
      }
    }, 100);
  }
};

var _onJSVPAIDError = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: VPAID JS error loading');
  }
  if (!scriptVPAID || !rmpVast) {
    return;
  }
  scriptVPAID.removeEventListener('error', _onJSVPAIDError);
  PING.error.call(rmpVast, 901);
  VASTERRORS.process.call(rmpVast, 901);
};

VPAID.loadCreative = function (creativeUrl, adParams, vpaidSettings, ajaxTimeoutParam, creativeLoadTimeoutParam) {
  rmpVast = this;
  if (!rmpVast) {
    return;
  }
  ajaxTimeout = ajaxTimeoutParam;
  creativeLoadTimeout = creativeLoadTimeoutParam;
  initialWidth = vpaidSettings.width;
  initialHeight = vpaidSettings.height;
  initialViewMode = vpaidSettings.viewMode;
  desiredBitrate = vpaidSettings.desiredBitrate;
  jsCreativeUrl = creativeUrl;
  adParametersData = adParams;
  slot = rmpVast.adContainer;
  if (!rmpVast.vastPlayer) {
    // we use existing rmp-ad-vast-video-player as it is already 
    // available and initialized (no need for user interaction)
    let existingVastPlayer = rmpVast.adContainer.getElementsByClassName('rmp-ad-vast-video-player')[0];
    if (!existingVastPlayer) {
      VASTERRORS.process.call(rmpVast, 1004);
      return;
    }
    rmpVast.vastPlayer = existingVastPlayer;
  }
  vpaidPlayer = rmpVast.vastPlayer;
  if (rmpVast.clickThroughUrl) {
    clickThroughUrl = rmpVast.clickThroughUrl;
  }
  // create FiF 
  iframe = document.createElement('iframe');
  iframe.id = 'vpaid-frame';
  iframe.style.display = 'none';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  slot.appendChild(iframe);
  if (!iframe.contentWindow || !iframe.contentWindow.document || !iframe.contentWindow.document.body) {
    return;
  }
  let iframeWindow = iframe.contentWindow;
  let iframeDocument = iframeWindow.document;
  let iframeBody = iframeDocument.body;
  scriptVPAID = iframeDocument.createElement('script');
  jsLoadTimeout = setTimeout(() => {
    if (!rmpVast || !scriptVPAID) {
      return;
    }
    scriptVPAID.removeEventListener('load', _onJSVPAIDLoaded);
    scriptVPAID.removeEventListener('error', _onJSVPAIDError);
    VASTPLAYER.resumeContent.call(rmpVast);
  }, creativeLoadTimeout);
  scriptVPAID.addEventListener('load', _onJSVPAIDLoaded);
  scriptVPAID.addEventListener('error', _onJSVPAIDError);
  scriptVPAID.src = jsCreativeUrl;
  iframeBody.appendChild(scriptVPAID);
};

VPAID.destroy = function () {
  if (vpaidAvailableInterval) {
    clearInterval(vpaidAvailableInterval);
  }
  if (jsLoadTimeout) {
    clearTimeout(jsLoadTimeout);
  }
  if (initAdTimeout) {
    clearTimeout(initAdTimeout);
  }
  if (startAdTimeout) {
    clearTimeout(startAdTimeout);
  }
  _unsetCallbacksForCreative();
  scriptVPAID.removeEventListener('load', _onJSVPAIDLoaded);
  scriptVPAID.removeEventListener('error', _onJSVPAIDError);
  if (vpaidPlayer) {
    // empty buffer
    vpaidPlayer.removeAttribute('src');
    vpaidPlayer.load();
    FW.hide(vpaidPlayer);
  }
  let vpaidIframe = document.getElementById('vpaid-frame');
  if (vpaidIframe !== null) {
    try {
      slot.removeChild(vpaidIframe);
    } catch (e) {
      FW.trace(e);
    }
  }
  setTimeout(() => {
    vpaidCreative = null;
    scriptVPAID = null;
    iframe = null;
    jsLoadTimeout = null;
    initAdTimeout = null;
    startAdTimeout = null;
    vpaidAvailableInterval = null;
    adStoppedTimeout = null;
    adSkippedTimeout = null;
    adParametersData = '';
    clickThroughUrl = '';
    currentVPAIDVolume = 1;
    vpaidPaused = true;
    jsCreativeUrl = '';
    vpaidRemainingTime = -1;
    intVpaidVersion = -1;
    adDurationVPAID1 = -1;
    vpaidIsLinear = true;
    initialWidth = 640;
    initialHeight = 360;
    initialViewMode = 'normal';
    desiredBitrate = 500;
    ajaxTimeout = 7000;
    creativeLoadTimeout = 10000;
    hadAdLoaded = false;
    hasAdStarted = false;
  }, 100);
};

export { VPAID };