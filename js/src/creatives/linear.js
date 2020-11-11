import FW from '../fw/fw';
import ENV from '../fw/env';
import HELPERS from '../utils/helpers';
import TRACKING_EVENTS from '../tracking/tracking-events';
import CONTENT_PLAYER from '../players/content-player';
import VAST_PLAYER from '../players/vast-player';
import VPAID from '../players/vpaid';
import SKIP from './skip';
import ICONS from './icons';
import VAST_ERRORS from '../utils/vast-errors';
import RMPCONNECTION from '../../../externals/rmp-connection';

const LINEAR = {};

const VPAID_PATTERN = /vpaid/i;
const JS_PATTERN = /\/javascript/i;
const html5MediaErrorTypes = [
  'MEDIA_ERR_CUSTOM',
  'MEDIA_ERR_ABORTED',
  'MEDIA_ERR_NETWORK',
  'MEDIA_ERR_DECODE',
  'MEDIA_ERR_SRC_NOT_SUPPORTED',
  'MEDIA_ERR_ENCRYPTED'
];
const testCommonVideoFormats = [
  'video/webm',
  'video/mp4',
  'video/ogg',
  'video/3gpp'
];

const _onDurationChange = function () {
  this.vastPlayer.removeEventListener('durationchange', this.onDurationChange);
  this.vastPlayerDuration = VAST_PLAYER.getDuration.call(this);
  HELPERS.createApiEvent.call(this, 'addurationchange');
  // progress event
  if (this.vastPlayerDuration === -1) {
    return;
  }
  const keys = Object.keys(this.creative.trackingEvents);
  for (let k = 0, len = keys.length; k < len; k++) {
    const eventName = keys[k];
    if (/progress-/i.test(eventName)) {
      const time = eventName.split('-');
      const time_2 = time[1];
      if (/%/i.test(time_2)) {
        let timePerCent = time_2.slice(0, -1);
        timePerCent = (this.vastPlayerDuration * parseFloat(timePerCent)) / 100;
        const trackingUrls = this.creative.trackingEvents[keys[k]];
        trackingUrls.forEach(url => {
          this.progressEvents.push({
            time: timePerCent,
            url: url
          });
        });
      } else {
        const trackingUrls = this.creative.trackingEvents[keys[k]];
        trackingUrls.forEach(url => {
          this.progressEvents.push({
            time: parseFloat(time_2) * 1000,
            url: url
          });
        });
      }
    }
  }
  // sort progress time ascending
  if (this.progressEvents.length > 0) {
    this.progressEvents.sort(function (a, b) {
      return a.time - b.time;
    });
  }
};

const _onLoadedmetadataPlay = function () {
  this.vastPlayer.removeEventListener('loadedmetadata', this.onLoadedmetadataPlay);
  clearTimeout(this.creativeLoadTimeoutCallback);
  HELPERS.createApiEvent.call(this, 'adloaded');
  TRACKING_EVENTS.dispatch.call(this, 'loaded');
  CONTENT_PLAYER.pause.call(this);
  // show ad container holding vast player
  FW.show(this.adContainer);
  FW.show(this.vastPlayer);
  this.adOnStage = true;
  // play VAST player
  VAST_PLAYER.play.call(this, this.firstVastPlayerPlayRequest);
  if (this.firstVastPlayerPlayRequest) {
    this.firstVastPlayerPlayRequest = false;
  }
};

const _onClickThrough = function (event) {
  if (event) {
    event.stopPropagation();
  }
  if (!ENV.isMobile) {
    FW.openWindow(this.creative.clickThroughUrl);
  }
  if (this.params.pauseOnClick) {
    this.pause();
  }
  HELPERS.createApiEvent.call(this, 'adclick');
  TRACKING_EVENTS.dispatch.call(this, 'clickthrough');
};

const _onPlaybackError = function (event) {
  // https://www.w3.org/TR/html50/embedded-content-0.html#mediaerror
  // MEDIA_ERR_SRC_NOT_SUPPORTED is sign of fatal error
  // other errors may produce non-fatal error in the browser so we do not 
  // act upon them
  if (event && event.target) {
    const videoElement = event.target;
    if (FW.isObject(videoElement.error) && FW.isNumber(videoElement.error.code)) {
      const errorCode = videoElement.error.code;
      let errorMessage = '';
      if (typeof videoElement.error.message === 'string') {
        errorMessage = videoElement.error.message;
      }
      if (this.debug) {
        FW.log('error on video element with code ' + errorCode.toString() + ' and message ' + errorMessage);
        if (html5MediaErrorTypes[errorCode]) {
          FW.log('error type is ' + html5MediaErrorTypes[errorCode]);
        }
      }
      // EDIA_ERR_SRC_NOT_SUPPORTED (numeric value 4)
      if (errorCode === 4) {
        VAST_ERRORS.process.call(this, 401, true);
      }
    }
  }
};

const _appendClickUIOnMobile = function () {
  // we create a <a> tag rather than using window.open 
  // because it works better in standalone mode and WebView
  this.clickUIOnMobile = document.createElement('a');
  this.clickUIOnMobile.className = 'rmp-ad-click-ui-mobile';
  this.clickUIOnMobile.textContent = this.params.labels.textForClickUIOnMobile;
  this.clickUIOnMobile.addEventListener('touchend', this.onClickThrough);
  this.clickUIOnMobile.href = this.creative.clickThroughUrl;
  this.clickUIOnMobile.target = '_blank';
  this.adContainer.appendChild(this.clickUIOnMobile);
};

const _onContextMenu = function (event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
};

LINEAR.update = function (url, type) {
  if (this.debug) {
    FW.log('update vast player for linear creative of type ' + type + ' located at ' + url);
  }
  this.onDurationChange = _onDurationChange.bind(this);
  this.vastPlayer.addEventListener('durationchange', this.onDurationChange);

  // when creative is loaded play it 
  this.onLoadedmetadataPlay = _onLoadedmetadataPlay.bind(this);
  this.vastPlayer.addEventListener('loadedmetadata', this.onLoadedmetadataPlay);

  // prevent built in menu to show on right click
  this.onContextMenu = _onContextMenu.bind(this);
  this.vastPlayer.addEventListener('contextmenu', this.onContextMenu);

  this.onPlaybackError = _onPlaybackError.bind(this);

  // start creativeLoadTimeout
  this.creativeLoadTimeoutCallback = setTimeout(() => {
    VAST_ERRORS.process.call(this, 402, true);
  }, this.params.creativeLoadTimeout);
  // load ad asset
  if (this.useContentPlayerForAds) {
    this.contentPlayer.addEventListener('error', this.onPlaybackError);
    this.contentPlayer.src = url;
  } else {
    this.vastPlayer.addEventListener('error', this.onPlaybackError);
    this.vastPlayer.src = url;
    // we need this extra load for Chrome data saver mode in mobile or desktop
    this.vastPlayer.load();
  }

  // clickthrough interaction
  this.onClickThrough = _onClickThrough.bind(this);
  if (this.creative.clickThroughUrl) {
    if (ENV.isMobile) {
      _appendClickUIOnMobile.call(this);
    } else {
      this.vastPlayer.addEventListener('click', this.onClickThrough);
    }
  }

  // skippable - only where vast player is different from 
  // content player
  if (this.creative.isSkippableAd) {
    SKIP.append.call(this);
  }
};

LINEAR.parse = function (icons, adParameters, mediaFiles) {
  if (icons.length > 0) {
    ICONS.parse.call(this, icons);
  }
  // check for AdParameters tag in case we have a VPAID creative
  this.adParametersData = '';
  if (adParameters !== null) {
    this.adParametersData = adParameters;
  }
  let mediaFileItems = [];
  for (let i = 0, len = mediaFiles.length; i < len; i++) {
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
    if (this.params.enableVpaid && currentMediaFile.apiFramework &&
      VPAID_PATTERN.test(currentMediaFile.apiFramework) && JS_PATTERN.test(type)) {
      if (this.debug) {
        FW.log('VPAID creative detected');
      }
      mediaFileItems = [newMediaFileItem];
      this.isVPAID = true;
      break;
    }
    newMediaFileItem.width = currentMediaFile.width;
    newMediaFileItem.height = currentMediaFile.height;
    newMediaFileItem.bitrate = currentMediaFile.bitrate;
    mediaFileItems.push(newMediaFileItem);
  }
  // we support HLS; MP4; WebM: VPAID so let us fecth for those
  const creatives = [];
  for (let i = 0, len = mediaFileItems.length; i < len; i++) {
    const currentMediaFileItem = mediaFileItems[i];
    const type = currentMediaFileItem.type;
    const url = currentMediaFileItem.url;
    if (this.isVPAID && url) {
      VPAID.loadCreative.call(this, url, this.params.vpaidSettings);
      this.creative.type = type;
      return;
    }
    // we have HLS or DASH and it is natively supported - display ad with HLS in priority
    if (ENV.canPlayType('application/vnd.apple.mpegurl') || ENV.canPlayType('application/x-mpegurl')) {
      VAST_PLAYER.append.call(this, url, type);
      this.creative.type = type;
      return;
    }
    if (ENV.canPlayType('application/dash+xml')) {
      VAST_PLAYER.append.call(this, url, type);
      this.creative.type = type;
      return;
    }
    // we gather MP4, WebM, OGG and remaining files
    creatives.push(currentMediaFileItem);
  }
  let retainedCreatives = [];
  // first we check for the common formats below ... 
  const __filterCommonCreatives = function (i, creative) {
    if (creative.codec && creative.type === testCommonVideoFormats[i]) {
      return ENV.canPlayType(creative.type, creative.codec);
    } else if (creative.type === testCommonVideoFormats[i]) {
      return ENV.canPlayType(creative.type);
    }
    return false;
  };
  for (let i = 0, len = testCommonVideoFormats.length; i < len; i++) {
    retainedCreatives = creatives.filter(__filterCommonCreatives.bind(null, i));
    if (retainedCreatives.length > 0) {
      break;
    }
  }
  // ... if none of the common format work, then we check for exotic format
  // first we check for those with codec information as it provides more accurate support indication ...
  if (retainedCreatives.length === 0) {
    const __filterCodecCreatives = function (codec, type, creative) {
      return creative.codec === codec && creative.type === type;
    };
    for (let i = 0, len = creatives.length; i < len; i++) {
      const thisCreative = creatives[i];
      if (thisCreative.codec && thisCreative.type && ENV.canPlayType(thisCreative.type, thisCreative.codec)) {
        retainedCreatives = creatives.filter(__filterCodecCreatives.bind(null, thisCreative.codec, thisCreative.type));
      }
    }
  }
  // ... if codec information are not available then we go first type matching
  if (retainedCreatives.length === 0) {
    const __filterTypeCreatives = function (type, creative) {
      return creative.type === type;
    };
    for (let i = 0, len = creatives.length; i < len; i++) {
      const thisCreative = creatives[i];
      if (thisCreative.type && ENV.canPlayType(thisCreative.type)) {
        retainedCreatives = creatives.filter(__filterTypeCreatives.bind(null, thisCreative.type));
      }
    }
  }

  // still no match for supported format - we exit
  if (retainedCreatives.length === 0) {
    // None of the MediaFile provided are supported by the player
    VAST_ERRORS.process.call(this, 403, true);
    return;
  }

  // sort supported creatives by width
  retainedCreatives.sort((a, b) => {
    return a.width - b.width;
  });

  if (this.debug) {
    FW.log('available linear creative follows', retainedCreatives);
  }

  // we have files matching device capabilities
  // select the best one based on player current width
  let finalCreative;
  let validCreativesByWidth = [];
  let validCreativesByBitrate = [];
  if (retainedCreatives.length > 1) {
    const containerWidth = FW.getWidth(this.container) * ENV.devicePixelRatio;
    const containerHeight = FW.getHeight(this.container) * ENV.devicePixelRatio;
    if (containerWidth > 0 && containerHeight > 0) {
      validCreativesByWidth = retainedCreatives.filter((creative) => {
        return containerWidth >= creative.width && containerHeight >= creative.height;
      });
    }

    // if no match by size 
    if (validCreativesByWidth.length === 0) {
      validCreativesByWidth = [retainedCreatives[0]];
    }

    // filter by bitrate to provide best quality
    let availableBandwidth = RMPCONNECTION.getBandwidthEstimate();
    if (availableBandwidth > -1 && validCreativesByWidth.length > 1) {
      // sort supported creatives by bitrates
      validCreativesByWidth.sort((a, b) => {
        return a.bitrate - b.bitrate;
      });
      // convert to kbps
      availableBandwidth = Math.round(availableBandwidth * 1000);
      validCreativesByBitrate = validCreativesByWidth.filter((creative) => {
        return availableBandwidth >= creative.bitrate;
      });
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

  if (this.debug) {
    FW.log('selected linear creative follows', finalCreative);
  }
  this.creative.mediaUrl = finalCreative.url;
  this.creative.height = finalCreative.height;
  this.creative.width = finalCreative.width;
  this.creative.type = finalCreative.type;
  VAST_PLAYER.append.call(this, finalCreative.url, finalCreative.type);
};

export default LINEAR;
