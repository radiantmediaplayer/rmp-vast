import FW from '../framework/fw';
import Environment from '../framework/environment';
import Logger from '../framework/logger';
import Icons from './icons';
import RmpConnection from '../../assets/rmp-connection/rmp-connection';
import SimidPlayer from '../players/simid/simid_player';
import VpaidPlayer from '../players/vpaid-player';


export default class LinearCreative {

  constructor(rmpVast) {
    this._rmpVast = rmpVast;
    this._params = rmpVast.params;
    this._adContainer = rmpVast.adContainer;
    this._adPlayer = rmpVast.currentAdPlayer;
    this._contentPlayer = rmpVast.currentContentPlayer;
    this._firstAdPlayerPlayRequest = true;
    this._interactionMobileUI = null;
    this._skipWaitingUI = null;
    this._skipMessageUI = null;
    this._skipIconUI = null;
    this._skipButtonUI = null;
    this._skippableAdCanBeSkipped = false;
    this._onSkipInteractionFn = null;
    this._onTimeupdateCheckSkipFn = null;
    this._onDurationChangeFn = null;
    this._onLoadedmetadataPlayFn = null;
    this._onContextMenuFn = null;
    this._onPlaybackErrorFn = null;
    this._onInteractionOpenClickThroughUrlFn = null;
    this._creativeLoadTimeoutCallback = null;
    // hls.js
    this._hlsJS = [];
    this._hlsJSIndex = 0;
    this._readingHlsJS = false;
  }

  get hlsJSInstances() {
    return this._hlsJS;
  }

  get hlsJSIndex() {
    return this._hlsJSIndex;
  }

  set hlsJSIndex(value) {
    this._hlsJSIndex = value;
  }

  get readingHlsJS() {
    return this._readingHlsJS;
  }

  set readingHlsJS(value) {
    this._readingHlsJS = value;
  }

  get skippableAdCanBeSkipped() {
    return this._skippableAdCanBeSkipped;
  }

  _onDurationChange() {
    let adPlayerDuration = -1;
    if (this._rmpVast.rmpVastAdPlayer) {
      adPlayerDuration = this._rmpVast.rmpVastAdPlayer.duration;
    }
    this._rmpVast.rmpVastUtils.createApiEvent('addurationchange');
    // progress event
    if (adPlayerDuration === -1) {
      return;
    }
    const keys = Object.keys(this._rmpVast.creative.trackingEvents);
    keys.forEach(eventName => {
      if (/progress-/i.test(eventName)) {
        const time = eventName.split('-');
        const time_2 = time[1];
        if (/%/i.test(time_2)) {
          let timePerCent = time_2.slice(0, -1);
          timePerCent = (adPlayerDuration * parseFloat(timePerCent)) / 100;
          const trackingUrls = this._rmpVast.creative.trackingEvents[eventName];
          trackingUrls.forEach(url => {
            this._rmpVast.progressEvents.push({
              time: timePerCent,
              url: url
            });
          });
        } else {
          const trackingUrls = this._rmpVast.creative.trackingEvents[eventName];
          trackingUrls.forEach(url => {
            this._rmpVast.progressEvents.push({
              time: parseFloat(time_2) * 1000,
              url: url
            });
          });
        }
      }
    });
    // sort progress time ascending
    if (this._rmpVast.progressEvents.length > 0) {
      this._rmpVast.progressEvents.sort((a, b) => {
        return a.time - b.time;
      });
    }
  }

  _onLoadedmetadataPlay() {
    FW.clearTimeout(this._creativeLoadTimeoutCallback);
    // adjust volume to make sure content player volume matches ad player volume
    if (this._adPlayer) {
      if (this._adPlayer.volume !== this._contentPlayer.volume) {
        this._adPlayer.volume = this._contentPlayer.volume;
      }
      if (this._contentPlayer.muted) {
        this._adPlayer.muted = true;
      } else {
        this._adPlayer.muted = false;
      }
    }
    // show ad container holding ad player
    FW.show(this._adContainer);
    FW.show(this._adPlayer);
    this._rmpVast.__adOnStage = true;
    // play ad player
    if (this._rmpVast.rmpVastAdPlayer) {
      this._rmpVast.rmpVastAdPlayer.play(this._firstAdPlayerPlayRequest);
      this._firstAdPlayerPlayRequest = false;
    }
    this._rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adloaded');
  }

  _onInteractionOpenClickThroughUrl(event) {
    if (event) {
      event.stopPropagation();
    }
    if (!Environment.isMobile) {
      FW.openWindow(this._rmpVast.creative.clickThroughUrl);
    }
    this._rmpVast.pause();
    this._rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adclick');
  }

  _onPlaybackError(event) {
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

        Logger.print('error', `Error on video element with code ${errorCode.toString()} and message ${errorMessage}`);
        Logger.print('info',
          `error type is ${htmlMediaErrorTypes[errorCode] ? htmlMediaErrorTypes[errorCode] : 'unknown type'}`);

        // MEDIA_ERR_SRC_NOT_SUPPORTED (numeric value 4)
        if (errorCode === 4) {
          this._rmpVast.rmpVastUtils.processVastErrors(401, true);
        }
      }
    }
  }

  _onContextMenu(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  _updateWaitingForCanBeSkippedUI(delta) {
    if (Math.round(delta) > 0) {
      this._skipWaitingUI.textContent = this._params.labels.skipMessage + ' ' + Math.round(delta) + 's';
    }
  }

  _onTimeupdateCheckSkip() {
    if (this._skipButtonUI.style.display === 'none') {
      FW.setStyle(this._skipButtonUI, { display: 'block' });
    }
    const adPlayerCurrentTime = this._adPlayer.currentTime;
    if (FW.isNumber(adPlayerCurrentTime) && adPlayerCurrentTime > 0) {
      if (adPlayerCurrentTime >= this._rmpVast.creative.skipoffset) {
        this._adPlayer.removeEventListener('timeupdate', this._onTimeupdateCheckSkipFn);
        FW.setStyle(this._skipWaitingUI, { display: 'none' });
        FW.setStyle(this._skipMessageUI, { display: 'block' });
        FW.setStyle(this._skipIconUI, { display: 'block' });
        this._skippableAdCanBeSkipped = true;
        this._rmpVast.rmpVastUtils.createApiEvent('adskippablestatechanged');
      } else if (this._rmpVast.creative.skipoffset - adPlayerCurrentTime > 0) {
        this._updateWaitingForCanBeSkippedUI(this._rmpVast.creative.skipoffset - adPlayerCurrentTime);
      }
    }
  }

  _onSkipInteraction(event) {
    if (event) {
      event.stopPropagation();
      if (event.type === 'touchend') {
        event.preventDefault();
      }
    }
    if (this._skippableAdCanBeSkipped) {
      this._rmpVast.rmpVastTracking.dispatchTrackingAndApiEvent('adskipped');
      // resume content
      if (this._rmpVast.rmpVastAdPlayer) {
        this._rmpVast.rmpVastAdPlayer.resumeContent();
      }
    }
  }

  _appendSkipUI() {
    const skipMessage = this._params.labels.skipMessage;
    this._skipButtonUI = document.createElement('div');
    this._skipButtonUI.className = 'rmp-ad-container-skip';
    FW.setStyle(this._skipButtonUI, { display: 'none' });
    this._rmpVast.rmpVastUtils.makeButtonAccessible(this._skipButtonUI, skipMessage);

    this._skipWaitingUI = document.createElement('div');
    this._skipWaitingUI.className = 'rmp-ad-container-skip-waiting';
    this._updateWaitingForCanBeSkippedUI(this._rmpVast.creative.skipoffset);
    FW.setStyle(this._skipWaitingUI, { display: 'block' });

    this._skipMessageUI = document.createElement('div');
    this._skipMessageUI.className = 'rmp-ad-container-skip-message';
    this._skipMessageUI.textContent = skipMessage;
    FW.setStyle(this._skipMessageUI, { display: 'none' });

    this._skipIconUI = document.createElement('div');
    this._skipIconUI.className = 'rmp-ad-container-skip-icon';
    FW.setStyle(this._skipIconUI, { display: 'none' });

    this._onSkipInteractionFn = this._onSkipInteraction.bind(this);
    FW.addEvents(['click', 'touchend'], this._skipButtonUI, this._onSkipInteractionFn);
    this._skipButtonUI.appendChild(this._skipWaitingUI);
    this._skipButtonUI.appendChild(this._skipMessageUI);
    this._skipButtonUI.appendChild(this._skipIconUI);
    this._adContainer.appendChild(this._skipButtonUI);
    this._onTimeupdateCheckSkipFn = this._onTimeupdateCheckSkip.bind(this);
    this._adPlayer.addEventListener('timeupdate', this._onTimeupdateCheckSkipFn);
  }

  _onHlsJSError(event, data) {
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          // try to recover network error
          this._hlsJS[this._hlsJSIndex].startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          this._hlsJS[this._hlsJSIndex].recoverMediaError();
          break;
        default:
          this._rmpVast.rmpVastUtils.processVastErrors(900, true);
          break;
      }
    }
  }

  destroy() {
    if (this._interactionMobileUI) {
      this._interactionMobileUI.removeEventListener('touchend', this._onInteractionOpenClickThroughUrlFn);
      FW.removeElement(this._interactionMobileUI);
    }
    FW.clearTimeout(this._creativeLoadTimeoutCallback);
    FW.removeElement(this._skipButtonUI);
    FW.removeEvents(['click', 'touchend'], this._skipButtonUI, this._onSkipInteractionFn);
    if (this._adPlayer) {
      this._adPlayer.removeEventListener('click', this._onInteractionOpenClickThroughUrlFn);
      this._adPlayer.removeEventListener('timeupdate', this._onTimeupdateCheckSkipFn);
      this._adPlayer.removeEventListener('durationchange', this._onDurationChangeFn);
      this._adPlayer.removeEventListener('loadedmetadata', this._onLoadedmetadataPlayFn);
      this._adPlayer.removeEventListener('contextmenu', this._onContextMenuFn);
      this._adPlayer.removeEventListener('error', this._onPlaybackErrorFn);
    }
    this._contentPlayer.removeEventListener('error', this._onPlaybackErrorFn);
  }

  update(url, type) {
    Logger.print('info', `update ad player for linear creative of type ${type} located at ${url}`);

    this._onDurationChangeFn = this._onDurationChange.bind(this);
    this._adPlayer.addEventListener('durationchange', this._onDurationChangeFn, { once: true });

    // when creative is loaded play it 
    this._onLoadedmetadataPlayFn = this._onLoadedmetadataPlay.bind(this);
    this._adPlayer.addEventListener('loadedmetadata', this._onLoadedmetadataPlayFn, { once: true });

    // prevent built in menu to show on right click
    this._onContextMenuFn = this._onContextMenu.bind(this);
    this._adPlayer.addEventListener('contextmenu', this._onContextMenuFn);

    this._onPlaybackErrorFn = this._onPlaybackError.bind(this);

    // start creativeLoadTimeout
    this._creativeLoadTimeoutCallback = setTimeout(() => {
      this._rmpVast.rmpVastUtils.processVastErrors(402, true);
    }, this._params.creativeLoadTimeout);

    if (this._params.useHlsJS && type === 'application/vnd.apple.mpegurl' &&
      typeof window.Hls !== 'undefined' && Hls.isSupported()) {
      this._readingHlsJS = true;
      const hlsJSConfig = {
        debug: this._params.debugHlsJS,
        capLevelToPlayerSize: true,
        testBandwidth: true,
        startLevel: -1,
        lowLatencyMode: false
      };
      this._hlsJS[this._hlsJSIndex] = new Hls(hlsJSConfig);
      this._hlsJS[this._hlsJSIndex].on(Hls.Events.ERROR, this._onHlsJSError.bind(this));
      this._hlsJS[this._hlsJSIndex].loadSource(url);
      this._hlsJS[this._hlsJSIndex].attachMedia(this._adPlayer);
    } else {
      if (typeof this._rmpVast.creative.simid === 'undefined' ||
        (this._rmpVast.creative.simid && !this._params.enableSimid)) {
        this._adPlayer.addEventListener('error', this._onPlaybackErrorFn);
        this._adPlayer.src = url;
        // we need this extra load for Chrome data saver mode in mobile or desktop
        this._adPlayer.load();
      } else {
        if (this._rmpVast.rmpVastSimidPlayer) {
          this._rmpVast.rmpVastSimidPlayer.stopAd();
        }
        this._rmpVast.rmpVastSimidPlayer = new SimidPlayer(url, this._rmpVast);
        this._rmpVast.rmpVastSimidPlayer.initializeAd();
        this._rmpVast.rmpVastSimidPlayer.playAd();
      }
    }


    // clickthrough interaction
    this._onInteractionOpenClickThroughUrlFn = this._onInteractionOpenClickThroughUrl.bind(this);
    if (this._rmpVast.creative.clickThroughUrl) {
      if (Environment.isMobile) {
        // we create a <a> tag rather than using window.open 
        // because it works better in standalone mode and WebView
        this._interactionMobileUI = document.createElement('a');
        this._interactionMobileUI.className = 'rmp-ad-click-ui-mobile';
        this._interactionMobileUI.textContent = this._params.labels.textForInteractionUIOnMobile;
        this._interactionMobileUI.addEventListener('touchend', this._onInteractionOpenClickThroughUrlFn);
        this._interactionMobileUI.href = this._rmpVast.creative.clickThroughUrl;
        this._interactionMobileUI.target = '_blank';
        this._adContainer.appendChild(this._interactionMobileUI);
      } else {
        this._adPlayer.addEventListener('click', this._onInteractionOpenClickThroughUrlFn);
      }
    }

    // skippable - only where ad player is different from 
    // content player
    if (this._rmpVast.creative.isSkippableAd) {
      this._appendSkipUI();
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
      this._rmpVast.rmpVastIcons = new Icons(this._rmpVast);
      this._rmpVast.rmpVastIcons.parse(icons);
    }
    // check for AdParameters tag in case we have a VPAID creative
    this._rmpVast.adParametersData = '';
    if (adParameters && adParameters.value) {
      this._rmpVast.adParametersData = adParameters.value;
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
      if (this._params.enableVpaid && currentMediaFile.apiFramework &&
        vpaidPattern.test(currentMediaFile.apiFramework) && jsPattern.test(type)) {
        Logger.print('info', `VPAID creative detected`);
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
        this._rmpVast.rmpVastVpaidPlayer = new VpaidPlayer(this._rmpVast);
        this._rmpVast.rmpVastVpaidPlayer.init(url, this._params.vpaidSettings);
        this._rmpVast.creative.type = type;
        return;
      }
      // we have HLS > use hls.js where no native support for HLS is available or native HLS otherwise (Apple devices mainly)
      if (this._rmpVast.rmpVastAdPlayer) {
        if (type === 'application/vnd.apple.mpegurl' &&
          (Environment.checkCanPlayType(type) || (typeof window.Hls !== 'undefined' && Hls.isSupported()))) {
          this._rmpVast.rmpVastAdPlayer.append(url, type);
          this._rmpVast.creative.type = type;
          return;
        }
        // we have DASH and DASH is natively supported > use DASH
        if (Environment.checkCanPlayType('application/dash+xml')) {
          this._rmpVast.rmpVastAdPlayer.append(url, type);
          this._rmpVast.creative.type = type;
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
      this._rmpVast.rmpVastUtils.processVastErrors(403, true);
      return;
    }

    // sort supported creatives by width
    retainedCreatives.sort((a, b) => {
      return a.width - b.width;
    });

    Logger.print('info', `Vavailable linear creative follows`, retainedCreatives);

    // we have files matching device capabilities
    // select the best one based on player current width
    let finalCreative;
    let validCreativesByWidth = [];
    let validCreativesByBitrate = [];
    if (retainedCreatives.length > 1) {
      const containerWidth = FW.getWidth(this._rmpVast.container) * Environment.devicePixelRatio;
      const containerHeight = FW.getHeight(this._rmpVast.container) * Environment.devicePixelRatio;
      if (containerWidth > 0 && containerHeight > 0) {
        validCreativesByWidth = retainedCreatives.filter(creative => {
          return containerWidth >= creative.width && containerHeight >= creative.height;
        });
      }

      Logger.print('info', `validCreativesByWidth follow`, validCreativesByWidth);

      // if no match by size 
      if (validCreativesByWidth.length === 0) {
        validCreativesByWidth = [retainedCreatives[0]];
      }

      // filter by bitrate to provide best quality
      const rmpConnection = new RmpConnection();
      let availableBandwidth = rmpConnection.bandwidthData.estimate;

      Logger.print('info', `availableBandwidth is ${availableBandwidth} Mbps`);

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

        Logger.print('info', `validCreativesByBitrate follow`, validCreativesByBitrate);

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

    Logger.print('info', `selected linear creative follows`, finalCreative);

    this._rmpVast.creative.mediaUrl = finalCreative.url;
    this._rmpVast.creative.height = finalCreative.height;
    this._rmpVast.creative.width = finalCreative.width;
    this._rmpVast.creative.type = finalCreative.type;
    if (this._rmpVast.rmpVastAdPlayer) {
      this._rmpVast.rmpVastAdPlayer.append(finalCreative.url, finalCreative.type);
    }
  }

}
