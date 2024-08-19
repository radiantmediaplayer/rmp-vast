import FW from '../framework/fw';
import Logger from '../framework/logger';


export default class VpaidPlayer {

  #rmpVast;
  #adContainer;
  #adPlayer;
  #params;
  #adParametersData;
  #initialWidth = 640;
  #initialHeight = 360;
  #initialViewMode = 'normal';
  #desiredBitrate = 500;
  #vpaidCreativeUrl = '';
  #vpaidCreative = null;
  #vpaidScript = null;
  #vpaidIframe = null;
  #vpaidAdLoaded = false;
  #initAdTimeout = null;
  #vpaidCallbacks = {};
  #startAdTimeout = null;
  #vpaidAdStarted = false;
  #vpaidVersion = -1;
  #vpaid1AdDuration = -1;
  #adStoppedTimeout = null;
  #adSkippedTimeout = null;
  #vpaidAdRemainingTimeInterval = null;
  #vpaidRemainingTime = -1;
  #vpaidCurrentVolume = 1;
  #vpaidPaused = true;
  #vpaidLoadTimeout = null;
  #vpaidAvailableInterval = null;
  #vpaidSlot = null;

  constructor(rmpVast) {
    this.#rmpVast = rmpVast;
    this.#adContainer = rmpVast.adContainer;
    this.#adPlayer = rmpVast.currentAdPlayer;
    this.#params = rmpVast.params;
    this.#adParametersData = rmpVast.adParametersData;
  }

  // VPAID creative events
  #onAdLoaded() {
    this.#vpaidAdLoaded = true;
    if (!this.#vpaidCreative) {
      return;
    }
    window.clearTimeout(this.#initAdTimeout);
    if (this.#vpaidCallbacks.AdLoaded) {
      this.#vpaidCreative.unsubscribe(this.#vpaidCallbacks.AdLoaded, 'AdLoaded');
    }
    // when we call startAd we expect AdStarted event to follow closely
    // otherwise we need to resume content
    this.#startAdTimeout = window.setTimeout(() => {
      if (!this.#vpaidAdStarted && this.#rmpVast.rmpVastAdPlayer) {
        this.#rmpVast.rmpVastAdPlayer.resumeContent();
      }
      this.#vpaidAdStarted = false;
    }, this.#params.creativeLoadTimeout);
    this.#rmpVast.__adOnStage = true;
    this.#vpaidCreative.startAd();
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adloaded');
  }

  #onAdStarted() {
    this.#vpaidAdStarted = true;
    if (!this.#vpaidCreative) {
      return;
    }
    window.clearTimeout(this.#startAdTimeout);
    if (this.#vpaidCallbacks.AdStarted) {
      this.#vpaidCreative.unsubscribe(this.#vpaidCallbacks.AdStarted, 'AdStarted');
    }
    // update duration for VPAID 1.*
    if (this.#vpaidVersion === 1) {
      this.#vpaid1AdDuration = this.#vpaidCreative.getAdRemainingTime();
    }
    // append icons - if VPAID does not handle them
    const adIcons = this.#vpaidCreative.getAdIcons();
    if (!adIcons && this.#rmpVast.rmpVastIcons) {
      const iconsData = this.#rmpVast.rmpVastIcons.iconsData;
      if (iconsData.length > 0) {
        this.#rmpVast.rmpVastIcons.append();
      }
    }
    if (typeof this.#vpaidCreative.getAdLinear === 'function') {
      this.#rmpVast.creative.isLinear = this.#vpaidCreative.getAdLinear();
    }
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adcreativeview');
  }

  #onAdStopped() {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `VPAID AdStopped event`);
    window.clearTimeout(this.#adStoppedTimeout);
    if (this.#rmpVast.rmpVastAdPlayer) {
      this.#rmpVast.rmpVastAdPlayer.resumeContent();
    }
  }

  #onAdSkipped() {
    window.clearTimeout(this.#adSkippedTimeout);
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adskipped');
  }

  #onAdSkippableStateChange() {
    this.#rmpVast.rmpVastUtils.createApiEvent('adskippablestatechanged');
  }

  #onAdDurationChange() {
    if (this.#vpaidCreative && typeof this.#vpaidCreative.getAdRemainingTime === 'function') {
      const remainingTime = this.#vpaidCreative.getAdRemainingTime();
      if (remainingTime >= 0) {
        this.#vpaidRemainingTime = remainingTime;
      }
      // AdRemainingTimeChange is deprecated in VPAID 2
      // instead we use setInterval
      window.clearInterval(this.#vpaidAdRemainingTimeInterval);
      this.#vpaidAdRemainingTimeInterval = window.setInterval(() => {
        const remainingTime = this.#vpaidCreative.getAdRemainingTime();
        if (remainingTime >= 0) {
          this.#vpaidRemainingTime = remainingTime;
        }
      }, 200);
      this.#rmpVast.rmpVastUtils.createApiEvent('addurationchange');
    }
  }

  #onAdVolumeChange() {
    let newVolume = -1;
    if (this.#vpaidCreative) {
      newVolume = this.#vpaidCreative.getAdVolume();
    }
    if (typeof newVolume === 'number' && newVolume >= 0) {
      if (this.#vpaidCurrentVolume > 0 && newVolume === 0) {
        this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('advolumemuted');
      } else if (this.#vpaidCurrentVolume === 0 && newVolume > 0) {
        this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('advolumeunmuted');
      }
      this.#vpaidCurrentVolume = newVolume;
      this.#rmpVast.rmpVastUtils.createApiEvent('advolumechanged');
    }
  }

  #onAdImpression() {
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adimpression');
  }

  #onAdVideoStart() {
    this.#vpaidPaused = false;
    let newVolume = -1;
    if (this.#vpaidCreative) {
      newVolume = this.#vpaidCreative.getAdVolume();
    }
    if (typeof newVolume === 'number' && newVolume >= 0) {
      this.#vpaidCurrentVolume = newVolume;
      this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adstarted');
    }
  }

  #onAdVideoFirstQuartile() {
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adfirstquartile');
  }

  #onAdVideoMidpoint() {
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('admidpoint');
  }

  #onAdVideoThirdQuartile() {
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adthirdquartile');
  }

  #onAdVideoComplete() {
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adcomplete');
  }

  #onAdClickThru(url, id, playerHandles) {
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adclick');
    if (typeof playerHandles !== 'boolean') {
      return;
    }
    if (!playerHandles) {
      return;
    } else {
      let destUrl;
      if (url) {
        destUrl = url;
      } else if (this.#rmpVast.creative.clickThroughUrl) {
        destUrl = this.#rmpVast.creative.clickThroughUrl;
      }
      if (destUrl) {
        this.#rmpVast.creative.clickThroughUrl = destUrl;
        FW.openWindow(this.#rmpVast.creative.clickThroughUrl);
      }
    }
  }

  #onAdPaused() {
    this.#vpaidPaused = true;
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adpaused');
  }

  #onAdPlaying() {
    this.#vpaidPaused = false;
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adresumed');
  }

  #onAdLog(message) {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `VPAID AdLog event ${message}`);
  }

  #onAdError(message) {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `VPAID AdError event ${message}`);
    this.#rmpVast.rmpVastUtils.processVastErrors(901, true);
  }

  #onAdInteraction() {
    this.#rmpVast.rmpVastUtils.createApiEvent('adinteraction');
  }

  #onAdUserAcceptInvitation() {
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('aduseracceptinvitation');
  }

  #onAdUserMinimize() {
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adcollapse');
  }

  #onAdUserClose() {
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adclosed');
  }

  #onAdSizeChange() {
    this.#rmpVast.rmpVastUtils.createApiEvent('adsizechange');
  }

  #onAdLinearChange() {
    if (this.#vpaidCreative && typeof this.#vpaidCreative.getAdLinear === 'function') {
      this.#rmpVast.creative.isLinear = this.#vpaidCreative.getAdLinear();
      this.#rmpVast.rmpVastUtils.createApiEvent('adlinearchange');
    }
  }

  #onAdExpandedChange() {
    this.#rmpVast.rmpVastUtils.createApiEvent('adexpandedchange');
  }

  #onAdRemainingTimeChange() {
    if (this.#vpaidCreative && typeof this.#vpaidCreative.getAdRemainingTime === 'function') {
      const remainingTime = this.#vpaidCreative.getAdRemainingTime();
      if (remainingTime >= 0) {
        this.#vpaidRemainingTime = remainingTime;
      }
      this.#rmpVast.rmpVastUtils.createApiEvent('adremainingtimechange');
    }
  }

  #setCallbacksForCreative() {
    if (!this.#vpaidCreative) {
      return;
    }
    this.#vpaidCallbacks = {
      AdLoaded: this.#onAdLoaded.bind(this),
      AdStarted: this.#onAdStarted.bind(this),
      AdStopped: this.#onAdStopped.bind(this),
      AdSkipped: this.#onAdSkipped.bind(this),
      AdSkippableStateChange: this.#onAdSkippableStateChange.bind(this),
      AdDurationChange: this.#onAdDurationChange.bind(this),
      AdVolumeChange: this.#onAdVolumeChange.bind(this),
      AdImpression: this.#onAdImpression.bind(this),
      AdVideoStart: this.#onAdVideoStart.bind(this),
      AdVideoFirstQuartile: this.#onAdVideoFirstQuartile.bind(this),
      AdVideoMidpoint: this.#onAdVideoMidpoint.bind(this),
      AdVideoThirdQuartile: this.#onAdVideoThirdQuartile.bind(this),
      AdVideoComplete: this.#onAdVideoComplete.bind(this),
      AdClickThru: this.#onAdClickThru.bind(this),
      AdPaused: this.#onAdPaused.bind(this),
      AdPlaying: this.#onAdPlaying.bind(this),
      AdLog: this.#onAdLog.bind(this),
      AdError: this.#onAdError.bind(this),
      AdInteraction: this.#onAdInteraction.bind(this),
      AdUserAcceptInvitation: this.#onAdUserAcceptInvitation.bind(this),
      AdUserMinimize: this.#onAdUserMinimize.bind(this),
      AdUserClose: this.#onAdUserClose.bind(this),
      AdSizeChange: this.#onAdSizeChange.bind(this),
      AdLinearChange: this.#onAdLinearChange.bind(this),
      AdExpandedChange: this.#onAdExpandedChange.bind(this),
      AdRemainingTimeChange: this.#onAdRemainingTimeChange.bind(this)
    };
    // Looping through the object and registering each of the callbacks with the creative
    const callbacksKeys = Object.keys(this.#vpaidCallbacks);
    callbacksKeys.forEach(key => {
      this.#vpaidCreative.subscribe(this.#vpaidCallbacks[key], key);
    });
  }

  #unsetCallbacksForCreative() {
    if (!this.#vpaidCreative) {
      return;
    }
    // Looping through the object and registering each of the callbacks with the creative
    const callbacksKeys = Object.keys(this.#vpaidCallbacks);
    callbacksKeys.forEach(key => {
      this.#vpaidCreative.unsubscribe(this.#vpaidCallbacks[key], key);
    });
  }

  // eslint-disable-next-line
  #isValidVPAID(creative) {
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

  #onVPAIDAvailable() {
    window.clearInterval(this.#vpaidAvailableInterval);
    window.clearTimeout(this.#vpaidLoadTimeout);
    this.#vpaidCreative = this.#vpaidIframe.contentWindow.getVPAIDAd();
    if (this.#vpaidCreative && typeof this.#vpaidCreative.handshakeVersion === 'function') {
      // we need to insure handshakeVersion return
      let vpaidVersion;
      try {
        vpaidVersion = this.#vpaidCreative.handshakeVersion('2.0');
      } catch (error) {
        console.warn(error);
        Logger.print(this.#rmpVast.debugRawConsoleLogs, `could not validate VPAID ad unit handshakeVersion`);
        this.#rmpVast.rmpVastUtils.processVastErrors(901, true);
        return;
      }
      this.#vpaidVersion = parseInt(vpaidVersion);
      if (this.#vpaidVersion < 1) {
        Logger.print(this.#rmpVast.debugRawConsoleLogs, `unsupported VPAID version - exit`);
        this.#rmpVast.rmpVastUtils.processVastErrors(901, true);
        return;
      }
      if (!this.#isValidVPAID(this.#vpaidCreative)) {
        //The VPAID creative doesn't conform to the VPAID spec
        Logger.print(this.#rmpVast.debugRawConsoleLogs, `VPAID creative does not conform to VPAID spec - exit`);
        this.#rmpVast.rmpVastUtils.processVastErrors(901, true);
        return;
      }
      // wire callback for VPAID events
      this.#setCallbacksForCreative();
      // wire tracking events for VAST pings
      this.#rmpVast.rmpVastTracking.wire();
      const creativeData = {};
      creativeData.AdParameters = this.#adParametersData;

      Logger.print(this.#rmpVast.debugRawConsoleLogs, `VPAID AdParameters follow`, this.#adParametersData);

      FW.show(this.#adContainer);
      FW.show(this.#adPlayer);
      const environmentVars = {};
      // we create a new slot for VPAID creative - using adContainer can cause some VPAID to ill-render
      // from spec:
      // The 'environmentVars' object contains a reference, 'slot', to the HTML element
      // on the page in which the ad is to be rendered. The ad unit essentially gets
      // control of that element. 
      this.#vpaidSlot = document.createElement('div');
      this.#vpaidSlot.className = 'rmp-vpaid-container';
      this.#adContainer.appendChild(this.#vpaidSlot);
      environmentVars.slot = this.#vpaidSlot;
      environmentVars.videoSlot = this.#adPlayer;
      // we assume we can autoplay (or at least muted autoplay) because this.#rmpVast.currentAdPlayer 
      // has been init
      environmentVars.videoSlotCanAutoPlay = true;
      // when we call initAd we expect AdLoaded event to follow closely
      // if not we need to resume content
      this.#initAdTimeout = window.setTimeout(() => {
        if (!this.#vpaidAdLoaded) {
          Logger.print(this.#rmpVast.debugRawConsoleLogs, `#initAdTimeout`);
          if (this.#rmpVast.rmpVastAdPlayer) {
            this.#rmpVast.rmpVastAdPlayer.resumeContent();
          }
        }
        this.#vpaidAdLoaded = false;
      }, this.#params.creativeLoadTimeout * 10);

      Logger.print(this.#rmpVast.debugRawConsoleLogs, `calling initAd on VPAID creative now`);

      this.#vpaidCreative.initAd(
        this.#initialWidth,
        this.#initialHeight,
        this.#initialViewMode,
        this.#desiredBitrate,
        creativeData,
        environmentVars
      );
    }
  }

  #onJSVPAIDLoaded() {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `VPAID JS loaded`);

    const iframeWindow = this.#vpaidIframe.contentWindow;
    if (typeof iframeWindow.getVPAIDAd === 'function') {
      this.#onVPAIDAvailable();
    } else {
      this.#vpaidAvailableInterval = window.setInterval(() => {
        if (typeof iframeWindow.getVPAIDAd === 'function') {
          this.#onVPAIDAvailable();
        }
      }, 100);
    }
    this.#vpaidScript.onload = null;
    this.#vpaidScript.onerror = null;
  }

  #onJSVPAIDError() {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `VPAID JS error loading`);
    this.#rmpVast.rmpVastUtils.processVastErrors(901, true);
    this.#vpaidScript.onload = null;
    this.#vpaidScript.onerror = null;
  }

  // #vpaidCreative getters

  getAdWidth() {
    if (this.#vpaidCreative && typeof this.#vpaidCreative.getAdWidth === 'function') {
      return this.#vpaidCreative.getAdWidth();
    }
    return -1;
  }

  getAdHeight() {
    if (this.#vpaidCreative && typeof this.#vpaidCreative.getAdHeight === 'function') {
      return this.#vpaidCreative.getAdHeight();
    }
    return -1;
  }

  getAdDuration() {
    if (this.#vpaidCreative) {
      if (typeof this.#vpaidCreative.getAdDuration === 'function') {
        return this.#vpaidCreative.getAdDuration();
      } else if (this.#vpaid1AdDuration > -1) {
        return this.#vpaid1AdDuration;
      }
    }
    return -1;
  }

  getAdRemainingTime() {
    if (this.#vpaidRemainingTime >= 0) {
      return this.#vpaidRemainingTime;
    }
    return -1;
  }

  getCreativeUrl() {
    if (this.#vpaidCreativeUrl) {
      return this.#vpaidCreativeUrl;
    }
    return '';
  }

  getAdVolume() {
    if (this.#vpaidCreative && typeof this.#vpaidCreative.getAdVolume === 'function') {
      return this.#vpaidCreative.getAdVolume();
    }
    return -1;
  }

  getAdPaused() {
    return this.#vpaidPaused;
  }

  getAdExpanded() {
    if (this.#vpaidCreative && typeof this.#vpaidCreative.getAdExpanded === 'function') {
      return this.#vpaidCreative.getAdExpanded();
    }
    return false;
  }

  getAdSkippableState() {
    if (this.#vpaidCreative && typeof this.#vpaidCreative.getAdSkippableState === 'function') {
      return this.#vpaidCreative.getAdSkippableState();
    }
    return false;
  }

  getAdCompanions() {
    if (this.#vpaidCreative && typeof this.#vpaidCreative.getAdCompanions === 'function') {
      return this.#vpaidCreative.getAdCompanions();
    }
    return '';
  }

  // #vpaidCreative methods
  resizeAd(width, height, viewMode) {
    if (!this.#vpaidCreative) {
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
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `VPAID resizeAd with width ${width}, height ${height}, viewMode ${viewMode}`);
    this.#vpaidCreative.resizeAd(width, height, validViewMode);
  }

  stopAd() {
    if (!this.#vpaidCreative) {
      return;
    }
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `stopAd`);
    // when stopAd is called we need to check a 
    // AdStopped event follows
    this.#adStoppedTimeout = window.setTimeout(() => {
      this.#onAdStopped();
    }, this.#params.creativeLoadTimeout);
    this.#vpaidCreative.stopAd();
  }

  pauseAd() {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `pauseAd`);
    if (this.#vpaidCreative && !this.#vpaidPaused) {
      this.#vpaidCreative.pauseAd();
    }
  }

  resumeAd() {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `resumeAd`);
    if (this.#vpaidCreative && this.#vpaidPaused) {
      this.#vpaidCreative.resumeAd();
    }
  }

  expandAd() {
    if (this.#vpaidCreative) {
      this.#vpaidCreative.expandAd();
    }
  }

  collapseAd() {
    if (this.#vpaidCreative) {
      this.#vpaidCreative.collapseAd();
    }
  }

  skipAd() {
    if (!this.#vpaidCreative) {
      return;
    }
    // when skipAd is called we need to check a 
    // AdSkipped event follows
    this.#adSkippedTimeout = window.setTimeout(() => {
      this.#onAdStopped();
    }, this.#params.creativeLoadTimeout);
    this.#vpaidCreative.skipAd();
  }

  setAdVolume(volume) {
    if (this.#vpaidCreative && FW.isNumber(volume) && volume >= 0 && volume <= 1 &&
      typeof this.#vpaidCreative.setAdVolume === 'function') {
      this.#vpaidCreative.setAdVolume(volume);
    }
  }

  init(creativeUrl, vpaidSettings) {
    this.#initialWidth = vpaidSettings.width;
    this.#initialHeight = vpaidSettings.height;
    this.#initialViewMode = vpaidSettings.viewMode;
    this.#desiredBitrate = vpaidSettings.desiredBitrate;
    this.#vpaidCreativeUrl = creativeUrl;
    if (!this.#adPlayer) {
      // we use existing ad player as it is already 
      // available and initialized (no need for user interaction)
      let existingAdPlayer = null;
      if (this.#adContainer) {
        existingAdPlayer = this.#adContainer.querySelector('.rmp-ad-vast-video-player');
      }
      if (existingAdPlayer === null) {
        this.#rmpVast.rmpVastUtils.processVastErrors(900, true);
        return;
      }
      this.#adPlayer = existingAdPlayer;
    }
    // pause content player
    this.#rmpVast.rmpVastContentPlayer.pause();
    // create FiF 
    this.#vpaidIframe = document.createElement('iframe');
    this.#vpaidIframe.sandbox = 'allow-scripts allow-same-origin';
    this.#vpaidIframe.id = 'vpaid-frame';
    // do not use display: none;
    // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    FW.setStyle(this.#vpaidIframe, { visibility: 'hidden', width: '0px', height: '0px', border: 'none' });
    // this is to adhere to Best Practices for Rich Media Ads 
    // in Asynchronous Ad Environments  http://www.iab.net/media/file/rich_media_ajax_best_practices.pdf
    const src = 'about:blank';
    this.#vpaidIframe.onload = () => {
      Logger.print(this.#rmpVast.debugRawConsoleLogs, `#vpaidIframe.onload`);
      if (!this.#vpaidIframe.contentWindow || !this.#vpaidIframe.contentWindow.document ||
        !this.#vpaidIframe.contentWindow.document.body) {
        // PING error and resume content

        this.#rmpVast.rmpVastUtils.processVastErrors(901, true);
        return;
      }
      const iframeWindow = this.#vpaidIframe.contentWindow;
      const iframeDocument = iframeWindow.document;
      const iframeBody = iframeDocument.body;
      this.#vpaidScript = iframeDocument.createElement('script');

      this.#vpaidLoadTimeout = window.setTimeout(() => {
        Logger.print(this.#rmpVast.debugRawConsoleLogs, `could not load VPAID JS Creative or getVPAIDAd in iframeWindow - resume content`);
        this.#vpaidScript.onload = null;
        this.#vpaidScript.onerror = null;
        if (this.#rmpVast.rmpVastAdPlayer) {
          this.#rmpVast.rmpVastAdPlayer.resumeContent();
        }
      }, this.#params.creativeLoadTimeout);
      this.#vpaidScript.onload = this.#onJSVPAIDLoaded.bind(this);
      this.#vpaidScript.onerror = this.#onJSVPAIDError.bind(this);
      iframeBody.appendChild(this.#vpaidScript);
      this.#vpaidScript.src = this.#vpaidCreativeUrl;
    };

    this.#vpaidIframe.src = src;
    this.#adContainer.appendChild(this.#vpaidIframe);
  }

  destroy() {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `destroy VPAID dependencies`);
    window.clearInterval(this.#vpaidAvailableInterval);
    window.clearInterval(this.#vpaidAdRemainingTimeInterval);
    window.clearTimeout(this.#vpaidLoadTimeout);
    window.clearTimeout(this.#initAdTimeout);
    window.clearTimeout(this.#startAdTimeout);
    this.#unsetCallbacksForCreative();
    if (this.#vpaidScript) {
      this.#vpaidScript.onload = null;
      this.#vpaidScript.onerror = null;
    }
    if (this.#vpaidSlot) {
      FW.removeElement(this.#vpaidSlot);
    }
    if (this.#vpaidIframe) {
      FW.removeElement(this.#vpaidIframe);
    }
  }

}
