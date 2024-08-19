import FW from '../framework/fw';
import Environment from '../framework/environment';
import Logger from '../framework/logger';
import Icons from './icons';
import RmpConnection from '../../assets/rmp-connection/rmp-connection';
import SimidPlayer from '../players/simid/simid_player';
import VpaidPlayer from '../players/vpaid-player';


export default class LinearCreative {

  #rmpVast;
  #params;
  #adContainer;
  #adPlayer;
  #contentPlayer;
  #firstAdPlayerPlayRequest = true;
  #interactionMobileUI = null;
  #skipWaitingUI = null;
  #skipMessageUI = null;
  #skipIconUI = null;
  #skipButtonUI = null;
  #skippableAdCanBeSkipped = false;
  #onTimeupdateCheckSkipFn = null;
  #onDurationChangeFn = null;
  #onLoadedmetadataPlayFn = null;
  #onContextMenuFn = null;
  #onPlaybackErrorFn = null;
  #onInteractionOpenClickThroughUrlFn = null;
  #creativeLoadTimeoutCallback = null;
  #hlsJS = [];
  #hlsJSIndex = 0;
  #readingHlsJS = false;

  constructor(rmpVast) {
    this.#rmpVast = rmpVast;
    this.#params = rmpVast.params;
    this.#adContainer = rmpVast.adContainer;
    this.#adPlayer = rmpVast.currentAdPlayer;
    this.#contentPlayer = rmpVast.currentContentPlayer;
  }

  get hlsJSInstances() {
    return this.#hlsJS;
  }

  get hlsJSIndex() {
    return this.#hlsJSIndex;
  }

  set hlsJSIndex(value) {
    this.#hlsJSIndex = value;
  }

  get readingHlsJS() {
    return this.#readingHlsJS;
  }

  set readingHlsJS(value) {
    this.#readingHlsJS = value;
  }

  get skippableAdCanBeSkipped() {
    return this.#skippableAdCanBeSkipped;
  }

  #onDurationChange() {
    let adPlayerDuration = -1;
    if (this.#rmpVast.rmpVastAdPlayer) {
      adPlayerDuration = this.#rmpVast.rmpVastAdPlayer.duration;
    }
    this.#rmpVast.rmpVastUtils.createApiEvent('addurationchange');
    // progress event
    if (adPlayerDuration === -1) {
      return;
    }
    const keys = Object.keys(this.#rmpVast.creative.trackingEvents);
    keys.forEach(eventName => {
      if (/progress-/i.test(eventName)) {
        const time = eventName.split('-');
        const time_2 = time[1];
        if (/%/i.test(time_2)) {
          let timePerCent = time_2.slice(0, -1);
          timePerCent = (adPlayerDuration * parseFloat(timePerCent)) / 100;
          const trackingUrls = this.#rmpVast.creative.trackingEvents[eventName];
          trackingUrls.forEach(url => {
            this.#rmpVast.progressEvents.push({
              time: timePerCent,
              url
            });
          });
        } else {
          const trackingUrls = this.#rmpVast.creative.trackingEvents[eventName];
          trackingUrls.forEach(url => {
            this.#rmpVast.progressEvents.push({
              time: parseFloat(time_2) * 1000,
              url
            });
          });
        }
      }
    });
    // sort progress time ascending
    if (this.#rmpVast.progressEvents.length > 0) {
      this.#rmpVast.progressEvents.sort((a, b) => {
        return a.time - b.time;
      });
    }
  }

  #onLoadedmetadataPlay() {
    window.clearTimeout(this.#creativeLoadTimeoutCallback);
    // adjust volume to make sure content player volume matches ad player volume
    if (this.#adPlayer) {
      if (this.#adPlayer.volume !== this.#contentPlayer.volume) {
        this.#adPlayer.volume = this.#contentPlayer.volume;
      }
      if (this.#contentPlayer.muted) {
        this.#adPlayer.muted = true;
      } else {
        this.#adPlayer.muted = false;
      }
    }
    // show ad container holding ad player
    FW.show(this.#adContainer);
    FW.show(this.#adPlayer);
    this.#rmpVast.__adOnStage = true;
    // play ad player
    if (this.#rmpVast.rmpVastAdPlayer) {
      this.#rmpVast.rmpVastAdPlayer.play(this.#firstAdPlayerPlayRequest);
      this.#firstAdPlayerPlayRequest = false;
    }
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adloaded');
  }

  #onInteractionOpenClickThroughUrl(event) {
    if (event) {
      event.stopPropagation();
    }
    if (!Environment.isMobile) {
      FW.openWindow(this.#rmpVast.creative.clickThroughUrl);
    }
    this.#rmpVast.pause();
    this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adclick');
  }

  #onPlaybackError(event) {
    // https://www.w3.org/TR/html50/embedded-content-0.html#mediaerror
    // MEDIA_ERR_SRC_NOT_SUPPORTED is sign of fatal error
    // other errors may produce non-fatal error in the browser so we do not 
    // act upon them
    if (event && event.target) {
      const videoElement = event.target;
      if (videoElement.error && FW.isNumber(videoElement.error.code)) {
        const errorCode = videoElement.error.code;
        let errorMessage = '';
        if (typeof videoElement.error.message === 'string') {
          errorMessage = videoElement.error.message;
        }

        const htmlMediaErrorTypes = [
          'MEDIA_ERR_CUSTOM',
          'MEDIA_ERR_ABORTED',
          'MEDIA_ERR_NETWORK',
          'MEDIA_ERR_DECODE',
          'MEDIA_ERR_SRC_NOT_SUPPORTED',
          'MEDIA_ERR_ENCRYPTED'
        ];

        console.error(`Error on video element with code ${errorCode.toString()} and message ${errorMessage}`);
        Logger.print(this.#rmpVast.debugRawConsoleLogs, `error type is ${htmlMediaErrorTypes[errorCode] ? htmlMediaErrorTypes[errorCode] : 'unknown type'}`);

        // MEDIA_ERR_SRC_NOT_SUPPORTED (numeric value 4)
        if (errorCode === 4) {
          this.#rmpVast.rmpVastUtils.processVastErrors(401, true);
        }
      }
    }
  }

  #updateWaitingForCanBeSkippedUI(delta) {
    if (Math.round(delta) > 0) {
      this.#skipWaitingUI.textContent = this.#params.labels.skipMessage + ' ' + Math.round(delta) + 's';
    }
  }

  #onTimeupdateCheckSkip() {
    if (this.#skipButtonUI.style.display === 'none') {
      FW.setStyle(this.#skipButtonUI, { display: 'block' });
    }
    const adPlayerCurrentTime = this.#adPlayer.currentTime;
    if (FW.isNumber(adPlayerCurrentTime) && adPlayerCurrentTime > 0) {
      if (adPlayerCurrentTime >= this.#rmpVast.creative.skipoffset) {
        this.#adPlayer.removeEventListener('timeupdate', this.#onTimeupdateCheckSkipFn);
        FW.setStyle(this.#skipWaitingUI, { display: 'none' });
        FW.setStyle(this.#skipMessageUI, { display: 'block' });
        FW.setStyle(this.#skipIconUI, { display: 'block' });
        this.#skippableAdCanBeSkipped = true;
        this.#rmpVast.rmpVastUtils.createApiEvent('adskippablestatechanged');
      } else if (this.#rmpVast.creative.skipoffset - adPlayerCurrentTime > 0) {
        this.#updateWaitingForCanBeSkippedUI(this.#rmpVast.creative.skipoffset - adPlayerCurrentTime);
      }
    }
  }

  #onSkipInteraction(event) {
    if (event) {
      event.stopPropagation();
      if (event.type === 'touchend') {
        event.preventDefault();
      }
    }
    if (this.#skippableAdCanBeSkipped) {
      this.#rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adskipped');
      // resume content
      if (this.#rmpVast.rmpVastAdPlayer) {
        this.#rmpVast.rmpVastAdPlayer.resumeContent();
      }
    }
  }

  #appendSkipUI() {
    const skipMessage = this.#params.labels.skipMessage;
    this.#skipButtonUI = document.createElement('div');
    this.#skipButtonUI.className = 'rmp-ad-container-skip';
    FW.setStyle(this.#skipButtonUI, { display: 'none' });
    FW.makeButtonAccessible(this.#skipButtonUI, skipMessage);

    this.#skipWaitingUI = document.createElement('div');
    this.#skipWaitingUI.className = 'rmp-ad-container-skip-waiting';
    this.#updateWaitingForCanBeSkippedUI(this.#rmpVast.creative.skipoffset);
    FW.setStyle(this.#skipWaitingUI, { display: 'block' });

    this.#skipMessageUI = document.createElement('div');
    this.#skipMessageUI.className = 'rmp-ad-container-skip-message';
    this.#skipMessageUI.textContent = skipMessage;
    FW.setStyle(this.#skipMessageUI, { display: 'none' });

    this.#skipIconUI = document.createElement('div');
    this.#skipIconUI.className = 'rmp-ad-container-skip-icon';
    FW.setStyle(this.#skipIconUI, { display: 'none' });

    const onSkipInteractionFn = this.#onSkipInteraction.bind(this);
    FW.addEvents(['click', 'touchend'], this.#skipButtonUI, onSkipInteractionFn);
    this.#skipButtonUI.appendChild(this.#skipWaitingUI);
    this.#skipButtonUI.appendChild(this.#skipMessageUI);
    this.#skipButtonUI.appendChild(this.#skipIconUI);
    this.#adContainer.appendChild(this.#skipButtonUI);
    this.#onTimeupdateCheckSkipFn = this.#onTimeupdateCheckSkip.bind(this);
    this.#adPlayer.addEventListener('timeupdate', this.#onTimeupdateCheckSkipFn);
  }

  #onHlsJSError(event, data) {
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          // try to recover network error
          this.#hlsJS[this.#hlsJSIndex].startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          this.#hlsJS[this.#hlsJSIndex].recoverMediaError();
          break;
        default:
          this.#rmpVast.rmpVastUtils.processVastErrors(900, true);
          break;
      }
    }
  }

  destroy() {
    if (this.#interactionMobileUI) {
      this.#interactionMobileUI.removeEventListener('touchend', this.#onInteractionOpenClickThroughUrlFn);
      FW.removeElement(this.#interactionMobileUI);
    }
    window.clearTimeout(this.#creativeLoadTimeoutCallback);
    FW.removeElement(this.#skipButtonUI);
    if (this.#adPlayer) {
      this.#adPlayer.removeEventListener('click', this.#onInteractionOpenClickThroughUrlFn);
      this.#adPlayer.removeEventListener('timeupdate', this.#onTimeupdateCheckSkipFn);
      this.#adPlayer.removeEventListener('durationchange', this.#onDurationChangeFn);
      this.#adPlayer.removeEventListener('loadedmetadata', this.#onLoadedmetadataPlayFn);
      this.#adPlayer.removeEventListener('contextmenu', this.#onContextMenuFn);
      this.#adPlayer.removeEventListener('error', this.#onPlaybackErrorFn);
    }
    this.#contentPlayer.removeEventListener('error', this.#onPlaybackErrorFn);
  }

  update(url, type) {
    Logger.print(this.#rmpVast.debugRawConsoleLogs, `update ad player for linear creative of type ${type} located at ${url}`);

    this.#onDurationChangeFn = this.#onDurationChange.bind(this);
    this.#adPlayer.addEventListener('durationchange', this.#onDurationChangeFn, { once: true });

    // when creative is loaded play it 
    this.#onLoadedmetadataPlayFn = this.#onLoadedmetadataPlay.bind(this);
    this.#adPlayer.addEventListener('loadedmetadata', this.#onLoadedmetadataPlayFn, { once: true });

    // prevent built in menu to show on right click
    this.#onContextMenuFn = FW.stopPreventEvent;
    this.#adPlayer.addEventListener('contextmenu', this.#onContextMenuFn);

    this.#onPlaybackErrorFn = this.#onPlaybackError.bind(this);

    // start creativeLoadTimeout
    this.#creativeLoadTimeoutCallback = window.setTimeout(() => {
      this.#rmpVast.rmpVastUtils.processVastErrors(402, true);
    }, this.#params.creativeLoadTimeout);

    if (this.#params.useHlsJS && type === 'application/vnd.apple.mpegurl' &&
      typeof window.Hls !== 'undefined' && Hls.isSupported()) {
      this.#readingHlsJS = true;
      const hlsJSConfig = {
        debug: this.#params.debugHlsJS,
        capLevelToPlayerSize: true,
        testBandwidth: true,
        startLevel: -1,
        lowLatencyMode: false
      };
      this.#hlsJS[this.#hlsJSIndex] = new Hls(hlsJSConfig);
      this.#hlsJS[this.#hlsJSIndex].on(Hls.Events.ERROR, this.#onHlsJSError.bind(this));
      this.#hlsJS[this.#hlsJSIndex].loadSource(url);
      this.#hlsJS[this.#hlsJSIndex].attachMedia(this.#adPlayer);
    } else {
      if (typeof this.#rmpVast.creative.simid === 'undefined' ||
        (this.#rmpVast.creative.simid && !this.#params.enableSimid)) {
        this.#adPlayer.addEventListener('error', this.#onPlaybackErrorFn);
        this.#adPlayer.src = url;
        // we need this extra load for Chrome data saver mode in mobile or desktop
        this.#adPlayer.load();
      } else {
        if (this.#rmpVast.rmpVastSimidPlayer) {
          this.#rmpVast.rmpVastSimidPlayer.stopAd();
        }
        this.#rmpVast.rmpVastSimidPlayer = new SimidPlayer(url, this.#rmpVast);
        this.#rmpVast.rmpVastSimidPlayer.initializeAd();
        this.#rmpVast.rmpVastSimidPlayer.playAd();
      }
    }


    // clickthrough interaction
    this.#onInteractionOpenClickThroughUrlFn = this.#onInteractionOpenClickThroughUrl.bind(this);
    if (this.#rmpVast.creative.clickThroughUrl) {
      if (Environment.isMobile) {
        // we create a <a> tag rather than using window.open 
        // because it works better in standalone mode and WebView
        this.#interactionMobileUI = document.createElement('a');
        this.#interactionMobileUI.className = 'rmp-ad-click-ui-mobile';
        this.#interactionMobileUI.textContent = this.#params.labels.textForInteractionUIOnMobile;
        this.#interactionMobileUI.addEventListener('touchend', this.#onInteractionOpenClickThroughUrlFn);
        this.#interactionMobileUI.href = this.#rmpVast.creative.clickThroughUrl;
        this.#interactionMobileUI.target = '_blank';
        this.#adContainer.appendChild(this.#interactionMobileUI);
      } else {
        this.#adPlayer.addEventListener('click', this.#onInteractionOpenClickThroughUrlFn);
      }
    }

    // skippable - only where ad player is different from 
    // content player
    if (this.#rmpVast.creative.isSkippableAd) {
      this.#appendSkipUI();
    }
  }

  parse(creative) {
    const icons = creative.icons;
    const adParameters = creative.adParameters;
    const mediaFiles = creative.mediaFiles;
    // some linear tags may pass till here but have empty MediaFiles
    // this is against specification so we return
    if (mediaFiles.length === 0) {
      return;
    }
    if (icons.length > 0) {
      this.#rmpVast.rmpVastIcons = new Icons(this.#rmpVast);
      this.#rmpVast.rmpVastIcons.parse(icons);
    }
    // check for AdParameters tag in case we have a VPAID creative
    this.#rmpVast.adParametersData = '';
    if (adParameters && adParameters.value) {
      this.#rmpVast.adParametersData = adParameters.value;
    }
    let mediaFileItems = [];
    let isVpaid = false;
    for (let i = 0; i < mediaFiles.length; i++) {
      const currentMediaFile = mediaFiles[i];
      const mediaFileValue = currentMediaFile.fileURL;
      const type = currentMediaFile.mimeType;
      if (mediaFileValue === null || type === null) {
        continue;
      }
      const newMediaFileItem = {};
      newMediaFileItem.url = mediaFileValue;
      newMediaFileItem.type = type;
      if (currentMediaFile.codec !== null) {
        newMediaFileItem.codec = currentMediaFile.codec;
      }
      // check for potential VPAID - we have a VPAID JS - we break
      // for VPAID we may not have a width, height or delivery
      const vpaidPattern = /vpaid/i;
      const jsPattern = /\/javascript/i;
      if (this.#params.enableVpaid && currentMediaFile.apiFramework &&
        vpaidPattern.test(currentMediaFile.apiFramework) && jsPattern.test(type)) {
        Logger.print(this.#rmpVast.debugRawConsoleLogs, `VPAID creative detected`);
        mediaFileItems = [newMediaFileItem];
        isVpaid = true;
        break;
      }
      newMediaFileItem.width = currentMediaFile.width;
      newMediaFileItem.height = currentMediaFile.height;
      newMediaFileItem.bitrate = currentMediaFile.bitrate;
      mediaFileItems.push(newMediaFileItem);
    }
    // we support HLS; MP4; WebM: VPAID so let us fecth for those
    const creatives = [];
    for (let j = 0; j < mediaFileItems.length; j++) {
      const currentMediaFileItem = mediaFileItems[j];
      const type = currentMediaFileItem.type;
      const url = currentMediaFileItem.url;
      if (isVpaid && url) {
        this.#rmpVast.rmpVastVpaidPlayer = new VpaidPlayer(this.#rmpVast);
        this.#rmpVast.rmpVastVpaidPlayer.init(url, this.#params.vpaidSettings);
        this.#rmpVast.creative.type = type;
        return;
      }
      // we have HLS > use hls.js where no native support for HLS is available or native HLS otherwise (Apple devices mainly)
      if (this.#rmpVast.rmpVastAdPlayer) {
        if (type === 'application/vnd.apple.mpegurl' &&
          (Environment.checkCanPlayType(type) || (typeof window.Hls !== 'undefined' && Hls.isSupported()))) {
          this.#rmpVast.rmpVastAdPlayer.append(url, type);
          this.#rmpVast.creative.type = type;
          return;
        }
        // we have DASH and DASH is natively supported > use DASH
        if (Environment.checkCanPlayType('application/dash+xml')) {
          this.#rmpVast.rmpVastAdPlayer.append(url, type);
          this.#rmpVast.creative.type = type;
          return;
        }
      }
      // we gather MP4, WebM, OGG and remaining files
      creatives.push(currentMediaFileItem);
    }
    if (isVpaid) {
      return;
    }
    let retainedCreatives = [];
    const commonVideoFormats = [
      'video/webm',
      'video/mp4',
      'video/ogg',
      'video/3gpp'
    ];
    // first we check for the common formats below ... 
    const __filterCommonCreatives = (i, creative) => {
      if (creative.codec && creative.type === commonVideoFormats[i]) {
        return Environment.checkCanPlayType(creative.type, creative.codec);
      } else if (creative.type === commonVideoFormats[i]) {
        return Environment.checkCanPlayType(creative.type);
      }
      return false;
    };
    for (let k = 0; k < commonVideoFormats.length; k++) {
      retainedCreatives = creatives.filter(__filterCommonCreatives.bind(null, k));
      if (retainedCreatives.length > 0) {
        break;
      }
    }
    // ... if none of the common format work, then we check for exotic format
    // first we check for those with codec information as it provides more accurate support indication ...
    if (retainedCreatives.length === 0) {
      const __filterCodecCreatives = (codec, type, creative) => {
        return creative.codec === codec && creative.type === type;
      };
      creatives.forEach(creative => {
        if (creative.codec && creative.type && Environment.checkCanPlayType(creative.type, creative.codec)) {
          retainedCreatives = creatives.filter(__filterCodecCreatives.bind(null, creative.codec, creative.type));
        }
      });
    }
    // ... if codec information are not available then we go first type matching
    if (retainedCreatives.length === 0) {
      const __filterTypeCreatives = (type, creative) => {
        return creative.type === type;
      };
      creatives.forEach(creative => {
        if (creative.type && Environment.checkCanPlayType(creative.type)) {
          retainedCreatives = creatives.filter(__filterTypeCreatives.bind(null, creative.type));
        }
      });
    }

    // still no match for supported format - we exit
    if (retainedCreatives.length === 0) {
      // None of the MediaFile provided are supported by the player
      this.#rmpVast.rmpVastUtils.processVastErrors(403, true);
      return;
    }

    // sort supported creatives by width
    retainedCreatives.sort((a, b) => {
      return a.width - b.width;
    });

    Logger.print(this.#rmpVast.debugRawConsoleLogs, `Vavailable linear creative follows`, retainedCreatives);

    // we have files matching device capabilities
    // select the best one based on player current width
    let finalCreative;
    let validCreativesByWidth = [];
    let validCreativesByBitrate = [];
    if (retainedCreatives.length > 1) {
      const containerWidth = FW.getWidth(this.#rmpVast.container) * Environment.devicePixelRatio;
      const containerHeight = FW.getHeight(this.#rmpVast.container) * Environment.devicePixelRatio;
      if (containerWidth > 0 && containerHeight > 0) {
        validCreativesByWidth = retainedCreatives.filter(creative => {
          return containerWidth >= creative.width && containerHeight >= creative.height;
        });
      }

      Logger.print(this.#rmpVast.debugRawConsoleLogs, `validCreativesByWidth follow`, validCreativesByWidth);

      // if no match by size 
      if (validCreativesByWidth.length === 0) {
        validCreativesByWidth = [retainedCreatives[0]];
      }

      // filter by bitrate to provide best quality
      const rmpConnection = new RmpConnection();
      let availableBandwidth = rmpConnection.bandwidthData.estimate;

      Logger.print(this.#rmpVast.debugRawConsoleLogs, `availableBandwidth is ${availableBandwidth} Mbps`);

      if (availableBandwidth > -1 && validCreativesByWidth.length > 1) {
        // sort supported creatives by bitrates
        validCreativesByWidth.sort((a, b) => {
          return a.bitrate - b.bitrate;
        });
        // convert to kbps
        availableBandwidth = Math.round(availableBandwidth * 1000);
        validCreativesByBitrate = validCreativesByWidth.filter(creative => {
          return availableBandwidth >= creative.bitrate;
        });

        Logger.print(this.#rmpVast.debugRawConsoleLogs, `validCreativesByBitrate follow`, validCreativesByBitrate);

        // pick max available bitrate
        finalCreative = validCreativesByBitrate[validCreativesByBitrate.length - 1];
      }
    }

    // if no match by bitrate 
    if (!finalCreative) {
      if (validCreativesByWidth.length > 0) {
        finalCreative = validCreativesByWidth[validCreativesByWidth.length - 1];
      } else {
        retainedCreatives.sort((a, b) => {
          return a.bitrate - b.bitrate;
        });
        finalCreative = retainedCreatives[retainedCreatives.length - 1];
      }
    }

    Logger.print(this.#rmpVast.debugRawConsoleLogs, `selected linear creative follows`, finalCreative);

    this.#rmpVast.creative.mediaUrl = finalCreative.url;
    this.#rmpVast.creative.height = finalCreative.height;
    this.#rmpVast.creative.width = finalCreative.width;
    this.#rmpVast.creative.type = finalCreative.type;
    if (this.#rmpVast.rmpVastAdPlayer) {
      this.#rmpVast.rmpVastAdPlayer.append(finalCreative.url, finalCreative.type);
    }
  }

}
