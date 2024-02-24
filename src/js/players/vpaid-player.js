import FW from '../framework/fw';
import Utils from '../framework/utils';
import Tracking from '../tracking/tracking';


export default class VpaidPlayer {

  constructor(rmpVast) {
    this._rmpVast = rmpVast;
    this._adContainer = rmpVast.adContainer;
    this._adPlayer = rmpVast.__adPlayer;
    this._params = rmpVast.params;
    this._adParametersData = rmpVast.adParametersData;
    this._initialWidth = 640;
    this._initialHeight = 360;
    this._initialViewMode = 'normal';
    this._desiredBitrate = 500;
    this._vpaidCreativeUrl = '';
    this._vpaidCreative = null;
    this._vpaidScript = null;
    this._vpaidIframe = null;
    this._vpaidAdLoaded = false;
    this._initAdTimeout = null;
    this._vpaidCallbacks = {};
    this._startAdTimeout = null;
    this._vpaidAdStarted = false;
    this._vpaidVersion = -1;
    this._vpaid1AdDuration = -1;
    this._adStoppedTimeout = null;
    this._adSkippedTimeout = null;
    this._vpaidAdRemainingTimeInterval = null;
    this._vpaidRemainingTime = -1;
    this._vpaidCurrentVolume = 1;
    this._vpaidPaused = true;
    this._vpaidLoadTimeout = null;
    this._vpaidAvailableInterval = null;
    this._vpaidSlot = null;
  }

  // VPAID creative events
  _onAdLoaded() {
    this._vpaidAdLoaded = true;
    if (!this._vpaidCreative) {
      return;
    }
    FW.clearTimeout(this._initAdTimeout);
    if (this._vpaidCallbacks.AdLoaded) {
      this._vpaidCreative.unsubscribe(this._vpaidCallbacks.AdLoaded, 'AdLoaded');
    }
    // when we call startAd we expect AdStarted event to follow closely
    // otherwise we need to resume content
    this._startAdTimeout = setTimeout(() => {
      if (!this._vpaidAdStarted && this._rmpVast.rmpVastAdPlayer) {
        this._rmpVast.rmpVastAdPlayer.resumeContent();
      }
      this._vpaidAdStarted = false;
    }, this._params.creativeLoadTimeout);
    this._rmpVast.__adOnStage = true;
    this._vpaidCreative.startAd();
    Utils.createApiEvent.call(this._rmpVast, 'adloaded');
    Tracking.dispatch.call(this._rmpVast, 'loaded');
  }

  _onAdStarted() {
    this._vpaidAdStarted = true;
    if (!this._vpaidCreative) {
      return;
    }
    FW.clearTimeout(this._startAdTimeout);
    if (this._vpaidCallbacks.AdStarted) {
      this._vpaidCreative.unsubscribe(this._vpaidCallbacks.AdStarted, 'AdStarted');
    }
    // update duration for VPAID 1.*
    if (this._vpaidVersion === 1) {
      this._vpaid1AdDuration = this._vpaidCreative.getAdRemainingTime();
    }
    // append icons - if VPAID does not handle them
    const adIcons = this._vpaidCreative.getAdIcons();
    if (!adIcons && this._rmpVast.rmpVastIcons) {
      const iconsData = this._rmpVast.rmpVastIcons.iconsData;
      if (iconsData.length > 0) {
        this._rmpVast.rmpVastIcons.append();
      }
    }
    if (typeof this._vpaidCreative.getAdLinear === 'function') {
      this._rmpVast.creative.isLinear = this._vpaidCreative.getAdLinear();
    }
    Tracking.dispatch.call(this._rmpVast, 'creativeView');
  }

  _onAdStopped() {
    console.log(`${FW.consolePrepend} VPAID AdStopped event`, FW.consoleStyle, '');

    FW.clearTimeout(this._adStoppedTimeout);
    if (this._rmpVast.rmpVastAdPlayer) {
      this._rmpVast.rmpVastAdPlayer.resumeContent();
    }
  }

  _onAdSkipped() {
    FW.clearTimeout(this._adSkippedTimeout);
    Utils.createApiEvent.call(this._rmpVast, 'adskipped');
    Tracking.dispatch.call(this._rmpVast, 'skip');
  }

  _onAdSkippableStateChange() {
    Utils.createApiEvent.call(this._rmpVast, 'adskippablestatechanged');
  }

  _onAdDurationChange() {
    if (this._vpaidCreative && typeof this._vpaidCreative.getAdRemainingTime === 'function') {
      const remainingTime = this._vpaidCreative.getAdRemainingTime();
      if (remainingTime >= 0) {
        this._vpaidRemainingTime = remainingTime;
      }
      // AdRemainingTimeChange is deprecated in VPAID 2
      // instead we use setInterval
      FW.clearInterval(this._vpaidAdRemainingTimeInterval);
      this._vpaidAdRemainingTimeInterval = setInterval(() => {
        const remainingTime = this._vpaidCreative.getAdRemainingTime();
        if (remainingTime >= 0) {
          this._vpaidRemainingTime = remainingTime;
        }
      }, 200);
      Utils.createApiEvent.call(this._rmpVast, 'addurationchange');
    }
  }

  _onAdVolumeChange() {
    let newVolume = -1;
    if (this._vpaidCreative) {
      newVolume = this._vpaidCreative.getAdVolume();
    }
    if (typeof newVolume === 'number' && newVolume >= 0) {
      if (this._vpaidCurrentVolume > 0 && newVolume === 0) {
        Tracking.dispatch.call(this._rmpVast, 'mute');
      } else if (this._vpaidCurrentVolume === 0 && newVolume > 0) {
        Tracking.dispatch.call(this._rmpVast, 'unmute');
      }
      this._vpaidCurrentVolume = newVolume;
      Utils.createApiEvent.call(this._rmpVast, 'advolumechanged');
    }
  }

  _onAdImpression() {
    Utils.createApiEvent.call(this._rmpVast, 'adimpression');
    Tracking.dispatch.call(this._rmpVast, 'impression');
  }

  _onAdVideoStart() {
    this._vpaidPaused = false;
    let newVolume = -1;
    if (this._vpaidCreative) {
      newVolume = this._vpaidCreative.getAdVolume();
    }
    if (typeof newVolume === 'number' && newVolume >= 0) {
      this._vpaidCurrentVolume = newVolume;
      Utils.createApiEvent.call(this._rmpVast, 'adstarted');
      Tracking.dispatch.call(this._rmpVast, 'start');
    }
  }

  _onAdVideoFirstQuartile() {
    Utils.createApiEvent.call(this._rmpVast, 'adfirstquartile');
    Tracking.dispatch.call(this._rmpVast, 'firstQuartile');
  }

  _onAdVideoMidpoint() {
    Utils.createApiEvent.call(this._rmpVast, 'admidpoint');
    Tracking.dispatch.call(this._rmpVast, 'midpoint');
  }

  _onAdVideoThirdQuartile() {
    Utils.createApiEvent.call(this._rmpVast, 'adthirdquartile');
    Tracking.dispatch.call(this._rmpVast, 'thirdQuartile');
  }

  _onAdVideoComplete() {
    Utils.createApiEvent.call(this._rmpVast, 'adcomplete');
    Tracking.dispatch.call(this._rmpVast, 'complete');
  }

  _onAdClickThru(url, id, playerHandles) {
    Utils.createApiEvent.call(this._rmpVast, 'adclick');
    Tracking.dispatch.call(this._rmpVast, 'clickthrough');
    if (typeof playerHandles !== 'boolean') {
      return;
    }
    if (!playerHandles) {
      return;
    } else {
      let destUrl;
      if (url) {
        destUrl = url;
      } else if (this._rmpVast.creative.clickThroughUrl) {
        destUrl = this._rmpVast.creative.clickThroughUrl;
      }
      if (destUrl) {
        this._rmpVast.creative.clickThroughUrl = destUrl;
        FW.openWindow(this._rmpVast.creative.clickThroughUrl);
      }
    }
  }

  _onAdPaused() {
    this._vpaidPaused = true;
    Utils.createApiEvent.call(this._rmpVast, 'adpaused');
    Tracking.dispatch.call(this._rmpVast, 'pause');
  }

  _onAdPlaying() {
    this._vpaidPaused = false;
    Utils.createApiEvent.call(this._rmpVast, 'adresumed');
    Tracking.dispatch.call(this._rmpVast, 'resume');
  }

  _onAdLog(message) {
    console.log(`${FW.consolePrepend} VPAID AdLog event ${message}`, FW.consoleStyle, '');
  }

  _onAdError(message) {
    console.log(`${FW.consolePrepend} VPAID AdError event ${message}`, FW.consoleStyle, '');

    Utils.processVastErrors.call(this._rmpVast, 901, true);
  }

  _onAdInteraction() {
    Utils.createApiEvent.call(this._rmpVast, 'adinteraction');
  }

  _onAdUserAcceptInvitation() {
    Utils.createApiEvent.call(this._rmpVast, 'aduseracceptinvitation');
    Tracking.dispatch.call(this._rmpVast, 'acceptInvitation');
  }

  _onAdUserMinimize() {
    Utils.createApiEvent.call(this._rmpVast, 'adcollapse');
    Tracking.dispatch.call(this._rmpVast, ['collapse', 'adCollapse']);
  }

  _onAdUserClose() {
    Utils.createApiEvent.call(this._rmpVast, 'adclosed');
    Tracking.dispatch.call(this._rmpVast, 'close');
  }

  _onAdSizeChange() {
    Utils.createApiEvent.call(this._rmpVast, 'adsizechange');
  }

  _onAdLinearChange() {
    if (this._vpaidCreative && typeof this._vpaidCreative.getAdLinear === 'function') {
      this._rmpVast.creative.isLinear = this._vpaidCreative.getAdLinear();
      Utils.createApiEvent.call(this._rmpVast, 'adlinearchange');
    }
  }

  _onAdExpandedChange() {
    Utils.createApiEvent.call(this._rmpVast, 'adexpandedchange');
  }

  _onAdRemainingTimeChange() {
    if (this._vpaidCreative && typeof this._vpaidCreative.getAdRemainingTime === 'function') {
      const remainingTime = this._vpaidCreative.getAdRemainingTime();
      if (remainingTime >= 0) {
        this._vpaidRemainingTime = remainingTime;
      }
      Utils.createApiEvent.call(this._rmpVast, 'adremainingtimechange');
    }
  }

  _setCallbacksForCreative() {
    if (!this._vpaidCreative) {
      return;
    }
    this._vpaidCallbacks = {
      AdLoaded: this._onAdLoaded.bind(this),
      AdStarted: this._onAdStarted.bind(this),
      AdStopped: this._onAdStopped.bind(this),
      AdSkipped: this._onAdSkipped.bind(this),
      AdSkippableStateChange: this._onAdSkippableStateChange.bind(this),
      AdDurationChange: this._onAdDurationChange.bind(this),
      AdVolumeChange: this._onAdVolumeChange.bind(this),
      AdImpression: this._onAdImpression.bind(this),
      AdVideoStart: this._onAdVideoStart.bind(this),
      AdVideoFirstQuartile: this._onAdVideoFirstQuartile.bind(this),
      AdVideoMidpoint: this._onAdVideoMidpoint.bind(this),
      AdVideoThirdQuartile: this._onAdVideoThirdQuartile.bind(this),
      AdVideoComplete: this._onAdVideoComplete.bind(this),
      AdClickThru: this._onAdClickThru.bind(this),
      AdPaused: this._onAdPaused.bind(this),
      AdPlaying: this._onAdPlaying.bind(this),
      AdLog: this._onAdLog.bind(this),
      AdError: this._onAdError.bind(this),
      AdInteraction: this._onAdInteraction.bind(this),
      AdUserAcceptInvitation: this._onAdUserAcceptInvitation.bind(this),
      AdUserMinimize: this._onAdUserMinimize.bind(this),
      AdUserClose: this._onAdUserClose.bind(this),
      AdSizeChange: this._onAdSizeChange.bind(this),
      AdLinearChange: this._onAdLinearChange.bind(this),
      AdExpandedChange: this._onAdExpandedChange.bind(this),
      AdRemainingTimeChange: this._onAdRemainingTimeChange.bind(this)
    };
    // Looping through the object and registering each of the callbacks with the creative
    const callbacksKeys = Object.keys(this._vpaidCallbacks);
    callbacksKeys.forEach(key => {
      this._vpaidCreative.subscribe(this._vpaidCallbacks[key], key);
    });
  }

  _unsetCallbacksForCreative() {
    if (!this._vpaidCreative) {
      return;
    }
    // Looping through the object and registering each of the callbacks with the creative
    const callbacksKeys = Object.keys(this._vpaidCallbacks);
    callbacksKeys.forEach(key => {
      this._vpaidCreative.unsubscribe(this._vpaidCallbacks[key], key);
    });
  }

  _isValidVPAID(creative) {
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
  }

  _onVPAIDAvailable() {
    FW.clearInterval(this._vpaidAvailableInterval);
    FW.clearTimeout(this._vpaidLoadTimeout);
    this._vpaidCreative = this._vpaidIframe.contentWindow.getVPAIDAd();
    if (this._vpaidCreative && typeof this._vpaidCreative.handshakeVersion === 'function') {
      // we need to insure handshakeVersion return
      let vpaidVersion;
      try {
        vpaidVersion = this._vpaidCreative.handshakeVersion('2.0');
      } catch (error) {
        console.warn(error);
        console.log(`${FW.consolePrepend} could not validate VPAID ad unit handshakeVersion`, FW.consoleStyle, '');

        Utils.processVastErrors.call(this._rmpVast, 901, true);
        return;
      }
      this._vpaidVersion = parseInt(vpaidVersion);
      if (this._vpaidVersion < 1) {
        console.log(`${FW.consolePrepend} unsupported VPAID version - exit`, FW.consoleStyle, '');

        Utils.processVastErrors.call(this._rmpVast, 901, true);
        return;
      }
      if (!this._isValidVPAID(this._vpaidCreative)) {
        //The VPAID creative doesn't conform to the VPAID spec
        console.log(`${FW.consolePrepend} VPAID creative does not conform to VPAID spec - exit`, FW.consoleStyle, '');

        Utils.processVastErrors.call(this._rmpVast, 901, true);
        return;
      }
      // wire callback for VPAID events
      this._setCallbacksForCreative();
      // wire tracking events for VAST pings
      Tracking.wire.call(this._rmpVast);
      const creativeData = {};
      creativeData.AdParameters = this._adParametersData;

      console.log(`${FW.consolePrepend} VPAID AdParameters follow`, FW.consoleStyle, '');
      console.log(this._adParametersData);

      FW.show(this._adContainer);
      FW.show(this._adPlayer);
      const environmentVars = {};
      // we create a new slot for VPAID creative - using adContainer can cause some VPAID to ill-render
      // from spec:
      // The 'environmentVars' object contains a reference, 'slot', to the HTML element
      // on the page in which the ad is to be rendered. The ad unit essentially gets
      // control of that element. 
      this._vpaidSlot = document.createElement('div');
      this._vpaidSlot.className = 'rmp-vpaid-container';
      this._adContainer.appendChild(this._vpaidSlot);
      environmentVars.slot = this._vpaidSlot;
      environmentVars.videoSlot = this._adPlayer;
      // we assume we can autoplay (or at least muted autoplay) because this._rmpVast.__adPlayer 
      // has been init
      environmentVars.videoSlotCanAutoPlay = true;
      // when we call initAd we expect AdLoaded event to follow closely
      // if not we need to resume content
      this._initAdTimeout = setTimeout(() => {
        if (!this._vpaidAdLoaded) {
          console.log(`${FW.consolePrepend} _initAdTimeout`, FW.consoleStyle, '');
          if (this._rmpVast.rmpVastAdPlayer) {
            this._rmpVast.rmpVastAdPlayer.resumeContent();
          }
        }
        this._vpaidAdLoaded = false;
      }, this._params.creativeLoadTimeout * 10);

      console.log(`${FW.consolePrepend} calling initAd on VPAID creative now`, FW.consoleStyle, '');

      this._vpaidCreative.initAd(
        this._initialWidth,
        this._initialHeight,
        this._initialViewMode,
        this._desiredBitrate,
        creativeData,
        environmentVars
      );
    }
  }

  _onJSVPAIDLoaded() {
    console.log(`${FW.consolePrepend} VPAID JS loaded`, FW.consoleStyle, '');

    const iframeWindow = this._vpaidIframe.contentWindow;
    if (typeof iframeWindow.getVPAIDAd === 'function') {
      this._onVPAIDAvailable();
    } else {
      this._vpaidAvailableInterval = setInterval(() => {
        if (typeof iframeWindow.getVPAIDAd === 'function') {
          this._onVPAIDAvailable();
        }
      }, 100);
    }
    this._vpaidScript.onload = null;
    this._vpaidScript.onerror = null;
  }

  _onJSVPAIDError() {
    console.log(`${FW.consolePrepend} VPAID JS error loading`, FW.consoleStyle, '');

    Utils.processVastErrors.call(this._rmpVast, 901, true);
    this._vpaidScript.onload = null;
    this._vpaidScript.onerror = null;
  }

  // _vpaidCreative getters

  getAdWidth() {
    if (this._vpaidCreative && typeof this._vpaidCreative.getAdWidth === 'function') {
      return this._vpaidCreative.getAdWidth();
    }
    return -1;
  }

  getAdHeight() {
    if (this._vpaidCreative && typeof this._vpaidCreative.getAdHeight === 'function') {
      return this._vpaidCreative.getAdHeight();
    }
    return -1;
  }

  getAdDuration() {
    if (this._vpaidCreative) {
      if (typeof this._vpaidCreative.getAdDuration === 'function') {
        return this._vpaidCreative.getAdDuration();
      } else if (this._vpaid1AdDuration > -1) {
        return this._vpaid1AdDuration;
      }
    }
    return -1;
  }

  getAdRemainingTime() {
    if (this._vpaidRemainingTime >= 0) {
      return this._vpaidRemainingTime;
    }
    return -1;
  }

  getCreativeUrl() {
    if (this._vpaidCreativeUrl) {
      return this._vpaidCreativeUrl;
    }
    return '';
  }

  getAdVolume() {
    if (this._vpaidCreative && typeof this._vpaidCreative.getAdVolume === 'function') {
      return this._vpaidCreative.getAdVolume();
    }
    return -1;
  }

  getAdPaused() {
    return this._vpaidPaused;
  }

  getAdExpanded() {
    if (this._vpaidCreative && typeof this._vpaidCreative.getAdExpanded === 'function') {
      return this._vpaidCreative.getAdExpanded();
    }
    return false;
  }

  getAdSkippableState() {
    if (this._vpaidCreative && typeof this._vpaidCreative.getAdSkippableState === 'function') {
      return this._vpaidCreative.getAdSkippableState();
    }
    return false;
  }

  getAdCompanions() {
    if (this._vpaidCreative && typeof this._vpaidCreative.getAdCompanions === 'function') {
      return this._vpaidCreative.getAdCompanions();
    }
    return '';
  }

  // _vpaidCreative methods
  resizeAd(width, height, viewMode) {
    if (!this._vpaidCreative) {
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
    this._vpaidCreative.resizeAd(width, height, validViewMode);
  }

  stopAd() {
    if (!this._vpaidCreative) {
      return;
    }
    console.log(`${FW.consolePrepend} stopAd`, FW.consoleStyle, '');
    // when stopAd is called we need to check a 
    // AdStopped event follows
    this._adStoppedTimeout = setTimeout(() => {
      this._onAdStopped();
    }, this._params.creativeLoadTimeout);
    this._vpaidCreative.stopAd();
  }

  pauseAd() {
    console.log(`${FW.consolePrepend} pauseAd`, FW.consoleStyle, '');
    if (this._vpaidCreative && !this._vpaidPaused) {
      this._vpaidCreative.pauseAd();
    }
  }

  resumeAd() {
    console.log(`${FW.consolePrepend} resumeAd`, FW.consoleStyle, '');
    if (this._vpaidCreative && this._vpaidPaused) {
      this._vpaidCreative.resumeAd();
    }
  }

  expandAd() {
    if (this._vpaidCreative) {
      this._vpaidCreative.expandAd();
    }
  }

  collapseAd() {
    if (this._vpaidCreative) {
      this._vpaidCreative.collapseAd();
    }
  }

  skipAd() {
    if (!this._vpaidCreative) {
      return;
    }
    // when skipAd is called we need to check a 
    // AdSkipped event follows
    this._adSkippedTimeout = setTimeout(() => {
      this._onAdStopped();
    }, this._params.creativeLoadTimeout);
    this._vpaidCreative.skipAd();
  }

  setAdVolume(volume) {
    if (this._vpaidCreative && FW.isNumber(volume) && volume >= 0 && volume <= 1 &&
      typeof this._vpaidCreative.setAdVolume === 'function') {
      this._vpaidCreative.setAdVolume(volume);
    }
  }

  init(creativeUrl, vpaidSettings) {
    this._initialWidth = vpaidSettings.width;
    this._initialHeight = vpaidSettings.height;
    this._initialViewMode = vpaidSettings.viewMode;
    this._desiredBitrate = vpaidSettings.desiredBitrate;
    this._vpaidCreativeUrl = creativeUrl;
    if (!this._adPlayer) {
      // we use existing ad player as it is already 
      // available and initialized (no need for user interaction)
      let existingAdPlayer = null;
      if (this._adContainer) {
        existingAdPlayer = this._adContainer.querySelector('.rmp-ad-vast-video-player');
      }
      if (existingAdPlayer === null) {
        Utils.processVastErrors.call(this._rmpVast, 900, true);
        return;
      }
      this._adPlayer = existingAdPlayer;
    }
    // pause content player
    this._rmpVast.rmpVastContentPlayer.pause();
    // create FiF 
    this._vpaidIframe = document.createElement('iframe');
    this._vpaidIframe.sandbox = 'allow-scripts allow-same-origin';
    this._vpaidIframe.id = 'vpaid-frame';
    // do not use display: none;
    // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    FW.setStyle(this._vpaidIframe, { visibility: 'hidden', width: '0px', height: '0px', border: 'none' });
    // this is to adhere to Best Practices for Rich Media Ads 
    // in Asynchronous Ad Environments  http://www.iab.net/media/file/rich_media_ajax_best_practices.pdf
    const src = 'about:blank';
    this._vpaidIframe.onload = () => {
      console.log(`${FW.consolePrepend} _vpaidIframe.onload`, FW.consoleStyle, '');
      if (!this._vpaidIframe.contentWindow || !this._vpaidIframe.contentWindow.document ||
        !this._vpaidIframe.contentWindow.document.body) {
        // PING error and resume content

        Utils.processVastErrors.call(this._rmpVast, 901, true);
        return;
      }
      const iframeWindow = this._vpaidIframe.contentWindow;
      const iframeDocument = iframeWindow.document;
      const iframeBody = iframeDocument.body;
      this._vpaidScript = iframeDocument.createElement('script');

      this._vpaidLoadTimeout = setTimeout(() => {
        console.log(
          `${FW.consolePrepend} could not load VPAID JS Creative or getVPAIDAd in iframeWindow - resume content`,
          FW.consoleStyle,
          ''
        );

        this._vpaidScript.onload = null;
        this._vpaidScript.onerror = null;
        if (this._rmpVast.rmpVastAdPlayer) {
          this._rmpVast.rmpVastAdPlayer.resumeContent();
        }
      }, this._params.creativeLoadTimeout);
      this._vpaidScript.onload = this._onJSVPAIDLoaded.bind(this);
      this._vpaidScript.onerror = this._onJSVPAIDError.bind(this);
      iframeBody.appendChild(this._vpaidScript);
      this._vpaidScript.src = this._vpaidCreativeUrl;
    };

    this._vpaidIframe.src = src;
    this._adContainer.appendChild(this._vpaidIframe);
  }

  destroy() {
    console.log(`${FW.consolePrepend} destroy VPAID dependencies`, FW.consoleStyle, '');

    FW.clearInterval(this._vpaidAvailableInterval);
    FW.clearInterval(this._vpaidAdRemainingTimeInterval);
    FW.clearTimeout(this._vpaidLoadTimeout);
    FW.clearTimeout(this._initAdTimeout);
    FW.clearTimeout(this._startAdTimeout);
    this._unsetCallbacksForCreative();
    if (this._vpaidScript) {
      this._vpaidScript.onload = null;
      this._vpaidScript.onerror = null;
    }
    if (this._vpaidSlot) {
      FW.removeElement(this._vpaidSlot);
    }
    if (this._vpaidIframe) {
      FW.removeElement(this._vpaidIframe);
    }
  }

}
