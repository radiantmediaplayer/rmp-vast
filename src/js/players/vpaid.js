import FW from '../framework/fw';
import Utils from '../framework/utils';
import VAST_PLAYER from '../players/vast-player';
import ICONS from '../creatives/icons';
import TRACKING_EVENTS from '../tracking/tracking-events';
import CONTENT_PLAYER from '../players/content-player';

const VPAID = {};

// vpaidCreative getters

VPAID.getAdWidth = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdWidth === 'function') {
    return this.vpaidCreative.getAdWidth();
  }
  return -1;
};

VPAID.getAdHeight = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdHeight === 'function') {
    return this.vpaidCreative.getAdHeight();
  }
  return -1;
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
  return '';
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
  return false;
};

VPAID.getAdSkippableState = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdSkippableState === 'function') {
    return this.vpaidCreative.getAdSkippableState();
  }
  return false;
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
  return '';
};


// VPAID creative events
const _onAdLoaded = function () {
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
      VAST_PLAYER.resumeContent.call(this);
    }
    this.vpaidAdStarted = false;
  }, this.params.creativeLoadTimeout);
  this.adOnStage = true;
  this.vpaidCreative.startAd();
  Utils.createApiEvent.call(this, 'adloaded');
  TRACKING_EVENTS.dispatch.call(this, 'loaded');
};

const _onAdStarted = function () {
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
  if (!VPAID.getAdIcons.call(this) && !this.useContentPlayerForAds && this.iconsData.length > 0) {
    ICONS.append.call(this);
  }
  if (typeof this.vpaidCreative.getAdLinear === 'function') {
    this.creative.isLinear = this.vpaidCreative.getAdLinear();
  }
  TRACKING_EVENTS.dispatch.call(this, 'creativeView');
};

const _onAdStopped = function () {
  console.log(`${FW.consolePrepend} VPAID AdStopped event`, FW.consoleStyle, '');

  if (this.adStoppedTimeout) {
    clearTimeout(this.adStoppedTimeout);
  }
  VAST_PLAYER.resumeContent.call(this);
};

const _onAdSkipped = function () {
  if (this.adSkippedTimeout) {
    clearTimeout(this.adSkippedTimeout);
  }
  Utils.createApiEvent.call(this, 'adskipped');
  TRACKING_EVENTS.dispatch.call(this, 'skip');
};

const _onAdSkippableStateChange = function () {
  Utils.createApiEvent.call(this, 'adskippablestatechanged');
};

const _onAdDurationChange = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdRemainingTime === 'function') {
    const remainingTime = this.vpaidCreative.getAdRemainingTime();
    if (remainingTime >= 0) {
      this.vpaidRemainingTime = remainingTime;
    }
    // AdRemainingTimeChange is deprecated in VPAID 2
    // instead we use setInterval
    clearInterval(this.vpaidAdRemainingTimeInterval);
    this.vpaidAdRemainingTimeInterval = setInterval(() => {
      const remainingTime = this.vpaidCreative.getAdRemainingTime();
      if (remainingTime >= 0) {
        this.vpaidRemainingTime = remainingTime;
      }
    }, 200);
    Utils.createApiEvent.call(this, 'addurationchange');
  }
};

const _onAdVolumeChange = function () {
  const newVolume = VPAID.getAdVolume.call(this);
  if (newVolume === null) {
    return;
  }
  if (this.vpaidCurrentVolume > 0 && newVolume === 0) {
    TRACKING_EVENTS.dispatch.call(this, 'mute');
  } else if (this.vpaidCurrentVolume === 0 && newVolume > 0) {
    TRACKING_EVENTS.dispatch.call(this, 'unmute');
  }
  this.vpaidCurrentVolume = newVolume;
  Utils.createApiEvent.call(this, 'advolumechanged');
};

const _onAdImpression = function () {
  Utils.createApiEvent.call(this, 'adimpression');
  TRACKING_EVENTS.dispatch.call(this, 'impression');
};

const _onAdVideoStart = function () {
  this.vpaidPaused = false;
  let newVolume = VPAID.getAdVolume.call(this);
  if (newVolume === null) {
    newVolume = 1;
  }
  this.vpaidCurrentVolume = newVolume;
  Utils.createApiEvent.call(this, 'adstarted');
  TRACKING_EVENTS.dispatch.call(this, 'start');
};

const _onAdVideoFirstQuartile = function () {
  Utils.createApiEvent.call(this, 'adfirstquartile');
  TRACKING_EVENTS.dispatch.call(this, 'firstQuartile');
};

const _onAdVideoMidpoint = function () {
  Utils.createApiEvent.call(this, 'admidpoint');
  TRACKING_EVENTS.dispatch.call(this, 'midpoint');
};

const _onAdVideoThirdQuartile = function () {
  Utils.createApiEvent.call(this, 'adthirdquartile');
  TRACKING_EVENTS.dispatch.call(this, 'thirdQuartile');
};

const _onAdVideoComplete = function () {
  Utils.createApiEvent.call(this, 'adcomplete');
  TRACKING_EVENTS.dispatch.call(this, 'complete');
};

const _onAdClickThru = function (url, id, playerHandles) {
  Utils.createApiEvent.call(this, 'adclick');
  TRACKING_EVENTS.dispatch.call(this, 'clickthrough');
  if (typeof playerHandles !== 'boolean') {
    return;
  }
  if (!playerHandles) {
    return;
  } else {
    let destUrl;
    if (url) {
      destUrl = url;
    } else if (this.creative.clickThroughUrl) {
      destUrl = this.creative.clickThroughUrl;
    }
    if (destUrl) {
      // for getClickThroughUrl API method
      this.creative.clickThroughUrl = destUrl;
      FW.openWindow(this.creative.clickThroughUrl);
    }
  }
};

const _onAdPaused = function () {
  this.vpaidPaused = true;
  Utils.createApiEvent.call(this, 'adpaused');
  TRACKING_EVENTS.dispatch.call(this, 'pause');
};

const _onAdPlaying = function () {
  this.vpaidPaused = false;
  Utils.createApiEvent.call(this, 'adresumed');
  TRACKING_EVENTS.dispatch.call(this, 'resume');
};

const _onAdLog = function (message) {
  console.log(`${FW.consolePrepend} VPAID AdLog event ${message}`, FW.consoleStyle, '');
};

const _onAdError = function (message) {
  console.log(`${FW.consolePrepend} VPAID AdError event ${message}`, FW.consoleStyle, '');

  Utils.processVastErrors.call(this, 901, true);
};

const _onAdInteraction = function () {
  Utils.createApiEvent.call(this, 'adinteraction');
};

const _onAdUserAcceptInvitation = function () {
  Utils.createApiEvent.call(this, 'aduseracceptinvitation');
  TRACKING_EVENTS.dispatch.call(this, 'acceptInvitation');
};

const _onAdUserMinimize = function () {
  Utils.createApiEvent.call(this, 'adcollapse');
  TRACKING_EVENTS.dispatch.call(this, ['collapse', 'adCollapse']);
};

const _onAdUserClose = function () {
  Utils.createApiEvent.call(this, 'adclosed');
  TRACKING_EVENTS.dispatch.call(this, 'close');
};

const _onAdSizeChange = function () {
  Utils.createApiEvent.call(this, 'adsizechange');
};

const _onAdLinearChange = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdLinear === 'function') {
    this.creative.isLinear = this.vpaidCreative.getAdLinear();
    Utils.createApiEvent.call(this, 'adlinearchange');
  }
};

const _onAdExpandedChange = function () {
  Utils.createApiEvent.call(this, 'adexpandedchange');
};

const _onAdRemainingTimeChange = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdRemainingTime === 'function') {
    const remainingTime = this.vpaidCreative.getAdRemainingTime();
    if (remainingTime >= 0) {
      this.vpaidRemainingTime = remainingTime;
    }
    Utils.createApiEvent.call(this, 'adremainingtimechange');
  }
};

// vpaidCreative methods
VPAID.resizeAd = function (width, height, viewMode) {
  if (!this.vpaidCreative) {
    return;
  }
  if (!FW.isNumber(width) || !FW.isNumber(height) || typeof viewMode !== 'string') {
    return;
  }
  if (width <= 0 || height <= 0) {
    return;
  }
  let validViewMode = 'normal';
  if (viewMode === 'fullscreen') {
    validViewMode = viewMode;
  }

  console.log(
    `${FW.consolePrepend} VPAID resizeAd with width ${width}, height ${height}, viewMode ${viewMode}`,
    FW.consoleStyle,
    ''
  );

  this.vpaidCreative.resizeAd(width, height, validViewMode);
};

VPAID.stopAd = function () {
  if (!this.vpaidCreative) {
    return;
  }

  console.log(`${FW.consolePrepend} stopAd`, FW.consoleStyle, '');

  // when stopAd is called we need to check a 
  // AdStopped event follows
  this.adStoppedTimeout = setTimeout(() => {
    _onAdStopped.call(this);
  }, this.params.creativeLoadTimeout);
  this.vpaidCreative.stopAd();
};

VPAID.pauseAd = function () {
  console.log(`${FW.consolePrepend} pauseAd`, FW.consoleStyle, '');

  if (this.vpaidCreative && !this.vpaidPaused) {
    this.vpaidCreative.pauseAd();
  }
};

VPAID.resumeAd = function () {
  console.log(`${FW.consolePrepend} resumeAd`, FW.consoleStyle, '');

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
  if (this.vpaidCreative && FW.isNumber(volume) && volume >= 0 && volume <= 1 &&
    typeof this.vpaidCreative.setAdVolume === 'function') {
    this.vpaidCreative.setAdVolume(volume);
  }
};

const _setCallbacksForCreative = function () {
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
  const callbacksKeys = Object.keys(this.vpaidCallbacks);
  callbacksKeys.forEach(key => {
    this.vpaidCreative.subscribe(this.vpaidCallbacks[key], key);
  });
};

const _unsetCallbacksForCreative = function () {
  if (!this.vpaidCreative) {
    return;
  }
  // Looping through the object and registering each of the callbacks with the creative
  const callbacksKeys = Object.keys(this.vpaidCallbacks);
  callbacksKeys.forEach(key => {
    this.vpaidCreative.unsubscribe(this.vpaidCallbacks[key], key);
  });
};

const _isValidVPAID = function (creative) {
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

const _onVPAIDAvailable = function () {
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
    } catch (error) {
      console.warn(error);
      console.log(`${FW.consolePrepend} could not validate VPAID ad unit handshakeVersion`, FW.consoleStyle, '');

      Utils.processVastErrors.call(this, 901, true);
      return;
    }
    this.vpaidVersion = parseInt(vpaidVersion);
    if (this.vpaidVersion < 1) {
      console.log(`${FW.consolePrepend} unsupported VPAID version - exit`, FW.consoleStyle, '');

      Utils.processVastErrors.call(this, 901, true);
      return;
    }
    if (!_isValidVPAID(this.vpaidCreative)) {
      //The VPAID creative doesn't conform to the VPAID spec
      console.log(`${FW.consolePrepend} VPAID creative does not conform to VPAID spec - exit`, FW.consoleStyle, '');

      Utils.processVastErrors.call(this, 901, true);
      return;
    }
    // wire callback for VPAID events
    _setCallbacksForCreative.call(this);
    // wire tracking events for VAST pings
    TRACKING_EVENTS.wire.call(this);
    const creativeData = {};
    creativeData.AdParameters = this.adParametersData;

    console.log(`${FW.consolePrepend} VPAID AdParameters follow`, FW.consoleStyle, '');
    console.log(this.adParametersData);

    FW.show(this.adContainer);
    FW.show(this.vastPlayer);
    const environmentVars = {};
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
        console.log(`${FW.consolePrepend} initAdTimeout`, FW.consoleStyle, '');

        VAST_PLAYER.resumeContent.call(this);
      }
      this.vpaidAdLoaded = false;
    }, this.params.creativeLoadTimeout * 10);

    console.log(`${FW.consolePrepend} calling initAd on VPAID creative now`, FW.consoleStyle, '');

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

const _onJSVPAIDLoaded = function () {
  console.log(`${FW.consolePrepend} VPAID JS loaded`, FW.consoleStyle, '');

  const iframeWindow = this.vpaidIframe.contentWindow;
  if (typeof iframeWindow.getVPAIDAd === 'function') {
    _onVPAIDAvailable.call(this);
  } else {
    this.vpaidAvailableInterval = setInterval(() => {
      if (typeof iframeWindow.getVPAIDAd === 'function') {
        _onVPAIDAvailable.call(this);
      }
    }, 100);
  }
  this.vpaidScript.onload = null;
  this.vpaidScript.onerror = null;
};

const _onJSVPAIDError = function () {
  console.log(`${FW.consolePrepend} VPAID JS error loading`, FW.consoleStyle, '');

  Utils.processVastErrors.call(this, 901, true);
  this.vpaidScript.onload = null;
  this.vpaidScript.onerror = null;
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
      let existingVastPlayer = null;
      if (this.adContainer) {
        existingVastPlayer = this.adContainer.querySelector('.rmp-ad-vast-video-player');
      }
      if (existingVastPlayer === null) {
        Utils.processVastErrors.call(this, 900, true);
        return;
      }
      this.vastPlayer = existingVastPlayer;
    }
  }
  // pause content player
  CONTENT_PLAYER.pause.call(this);
  // create FiF 
  this.vpaidIframe = document.createElement('iframe');
  this.vpaidIframe.sandbox = 'allow-scripts allow-same-origin';
  this.vpaidIframe.id = 'vpaid-frame';
  // do not use display: none;
  // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  FW.setStyle(this.vpaidIframe, { visibility: 'hidden', width: '0px', height: '0px', border: 'none' });
  // this is to adhere to Best Practices for Rich Media Ads 
  // in Asynchronous Ad Environments  http://www.iab.net/media/file/rich_media_ajax_best_practices.pdf
  const src = 'about:blank';
  // ... however this does not work in Firefox (onload is never reached)
  // https://bugzilla.mozilla.org/show_bug.cgi?id=444165
  // about:self also causes protocol mis-match issues with iframes in iOS/macOS Safari
  // ... TL;DR iframes are troubles
  //let src = 'about:self';
  /*if (ENV.isFirefox || this.useContentPlayerForAds) {
    src = '';
  }*/
  // see https://bugs.chromium.org/p/chromium/issues/detail?id=1220186 about:self no longer works
  // we use about:blank instead but this is still under review
  // since about:blank seems to work in our testing cross browsers and is what is 
  // recommended on the web 
  // (see https://stackoverflow.com/questions/5946607/is-an-empty-iframe-src-valid/5946631) we now use about:blank
  this.vpaidIframe.onload = function () {
    console.log(`${FW.consolePrepend} vpaidIframe.onload`, FW.consoleStyle, '');

    // we unwire listeners
    this.vpaidIframe.onload = this.vpaidIframe.onerror = FW.nullFn;
    if (!this.vpaidIframe.contentWindow || !this.vpaidIframe.contentWindow.document ||
      !this.vpaidIframe.contentWindow.document.body) {
      // PING error and resume content
      Utils.processVastErrors.call(this, 901, true);
      return;
    }
    const iframeWindow = this.vpaidIframe.contentWindow;
    const iframeDocument = iframeWindow.document;
    const iframeBody = iframeDocument.body;
    this.vpaidScript = iframeDocument.createElement('script');

    this.vpaidLoadTimeout = setTimeout(() => {
      console.log(
        `${FW.consolePrepend} could not load VPAID JS Creative or getVPAIDAd in iframeWindow - resume content`,
        FW.consoleStyle,
        ''
      );

      this.vpaidScript.onload = null;
      this.vpaidScript.onerror = null;
      VAST_PLAYER.resumeContent.call(this);
    }, this.params.creativeLoadTimeout);
    this.vpaidScript.onload = _onJSVPAIDLoaded.bind(this);
    this.vpaidScript.onerror = _onJSVPAIDError.bind(this);
    iframeBody.appendChild(this.vpaidScript);
    this.vpaidScript.src = this.vpaidCreativeUrl;
  }.bind(this);

  this.vpaidIframe.onerror = function () {
    console.log(`${FW.consolePrepend} vpaidIframe.onerror`, FW.consoleStyle, '');

    // we unwire listeners
    this.vpaidIframe.onload = this.vpaidIframe.onerror = FW.nullFn;
    // PING error and resume content
    Utils.processVastErrors.call(this, 901, true);
  }.bind(this);

  this.vpaidIframe.src = src;
  this.adContainer.appendChild(this.vpaidIframe);
};

VPAID.destroy = function () {
  console.log(`${FW.consolePrepend} destroy VPAID dependencies`, FW.consoleStyle, '');

  if (this.vpaidAvailableInterval) {
    clearInterval(this.vpaidAvailableInterval);
  }
  if (this.vpaidAdRemainingTimeInterval) {
    clearInterval(this.vpaidAdRemainingTimeInterval);
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
    this.vpaidScript.onload = null;
    this.vpaidScript.onerror = null;
  }
  if (this.vpaidSlot) {
    FW.removeElement(this.vpaidSlot);
  }
  if (this.vpaidIframe) {
    FW.removeElement(this.vpaidIframe);
  }
};

export default VPAID;
