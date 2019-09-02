import FW from '../fw/fw';
import ENV from '../fw/env';
import HELPERS from '../utils/helpers';
import PING from '../tracking/ping';
import CONTENTPLAYER from '../players/content-player';
import VASTPLAYER from '../players/vast-player';
import VPAID from '../players/vpaid';
import SKIP from './skip';
import ICONS from './icons';
import VASTERRORS from '../utils/vast-errors';
import RMPCONNECTION from '../../../externals/rmp-connection';

const LINEAR = {};

const VPAID_PATTERN = /vpaid/i;
const JS_PATTERN = /\/javascript/i;
const HLS_PATTERN = /(application\/vnd\.apple\.mpegurl|x-mpegurl)/i;
const DASH_PATTERN = /application\/dash\+xml/i;
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
  if (DEBUG) {
    FW.log('durationchange for VAST player reached');
  }
  this.vastPlayer.removeEventListener('durationchange', this.onDurationChange);
  this.vastPlayerDuration = VASTPLAYER.getDuration.call(this);
  HELPERS.createApiEvent.call(this, 'addurationchange');
};

const _onLoadedmetadataPlay = function () {
  if (DEBUG) {
    FW.log('loadedmetadata for VAST player reached');
  }
  this.vastPlayer.removeEventListener('loadedmetadata', this.onLoadedmetadataPlay);
  clearTimeout(this.creativeLoadTimeoutCallback);
  HELPERS.createApiEvent.call(this, 'adloaded');
  if (DEBUG) {
    FW.log('pause content player');
  }
  CONTENTPLAYER.pause.call(this);
  // show ad container holding vast player
  FW.show(this.adContainer);
  FW.show(this.vastPlayer);
  this.adOnStage = true;
  // play VAST player
  if (DEBUG) {
    FW.log('play VAST player');
  }
  VASTPLAYER.play.call(this, this.firstVastPlayerPlayRequest);
  if (this.firstVastPlayerPlayRequest) {
    this.firstVastPlayerPlayRequest = false;
  }
};

const _onClickThrough = function (event) {
  if (event) {
    event.stopPropagation();
  }
  if (DEBUG) {
    FW.log('onClickThrough');
  }
  if (!ENV.isMobile) {
    FW.openWindow(this.clickThroughUrl);
  }
  if (this.params.pauseOnClick) {
    this.pause();
  }
  HELPERS.createApiEvent.call(this, 'adclick');
  HELPERS.dispatchPingEvent.call(this, 'clickthrough');
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
      if (DEBUG) {
        FW.log('error on video element with code ' + errorCode.toString() + ' and message ' + errorMessage);
        if (html5MediaErrorTypes[errorCode]) {
          FW.log('error type is ' + html5MediaErrorTypes[errorCode]);
        }
      }
      // EDIA_ERR_SRC_NOT_SUPPORTED (numeric value 4)
      if (errorCode === 4) {
        PING.error.call(this, 401);
        VASTERRORS.process.call(this, 401);
      }
    }
  }
};

const _appendClickUIOnMobile = function () {
  // we create a <a> tag rather than using window.open 
  // because it works better in standalone mode and WebView
  const textBtn = this.params.textForClickUIOnMobile;
  this.clickUIOnMobile = document.createElement('a');
  this.clickUIOnMobile.className = textBtn ? 'rmp-ad-click-ui-mobile' : 'rmp-ad-click-ui-mobile-no-text';
  this.clickUIOnMobile.textContent = textBtn;
  this.clickUIOnMobile.addEventListener('touchend', this.onClickThrough);
  this.clickUIOnMobile.href = this.clickThroughUrl;
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
  if (DEBUG) {
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
    PING.error.call(this, 402);
    VASTERRORS.process.call(this, 402);
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
  if (this.clickThroughUrl) {
    if (ENV.isMobile) {
      _appendClickUIOnMobile.call(this);
    } else {
      this.vastPlayer.addEventListener('click', this.onClickThrough);
    }
  }

  // skippable - only where vast player is different from 
  // content player
  if (this.isSkippableAd) {
    SKIP.append.call(this);
  }
};

LINEAR.parse = function (linear) {
  // we have an InLine Linear which is not a Wrapper - process MediaFiles
  this.adIsLinear = true;
  if (DEBUG) {
    const duration = linear[0].getElementsByTagName('Duration');
    if (duration.length === 0) {
      if (DEBUG) {
        FW.log('missing Duration tag child of Linear tag - this is not a VAST 3 spec compliant adTag - continuing anyway (same as IMA)');
      }
    }
  }
  const mediaFiles = linear[0].getElementsByTagName('MediaFiles');
  if (mediaFiles.length === 0) {
    // 1 MediaFiles element must be present otherwise VAST document is not spec compliant 
    PING.error.call(this, 101);
    VASTERRORS.process.call(this, 101);
    return;
  }
  // Industry Icons - currently we only support one icon
  const icons = linear[0].getElementsByTagName('Icons');
  if (icons.length > 0) {
    ICONS.parse.call(this, icons);
  }
  // check for AdParameters tag in case we have a VPAID creative
  const adParameters = linear[0].getElementsByTagName('AdParameters');
  this.adParametersData = '';
  if (adParameters.length > 0) {
    this.adParametersData = FW.getNodeValue(adParameters[0], false);
  }
  const mediaFile = mediaFiles[0].getElementsByTagName('MediaFile');
  if (mediaFile.length === 0) {
    // at least 1 MediaFile element must be present otherwise VAST document is not spec compliant 
    PING.error.call(this, 101);
    VASTERRORS.process.call(this, 101);
    return;
  }
  let mediaFileItems = [];
  let mediaFileToRemove = [];
  for (let i = 0, len = mediaFile.length; i < len; i++) {
    mediaFileItems[i] = {};
    // required per VAST3 spec CDATA URL location to media, delivery, type, width, height
    const currentMediaFile = mediaFile[i];
    const mediaFileValue = FW.getNodeValue(currentMediaFile, true);
    if (mediaFileValue === null) {
      mediaFileToRemove.push(i);
      continue;
    }
    const type = currentMediaFile.getAttribute('type');
    if (type === null || type === '') {
      mediaFileToRemove.push(i);
      continue;
    }
    mediaFileItems[i].url = mediaFileValue;
    mediaFileItems[i].type = type;
    const codec = currentMediaFile.getAttribute('codec');
    if (codec !== null && codec !== '') {
      mediaFileItems[i].codec = codec;
    }
    // check for potential VPAID
    const apiFramework = mediaFileItems[i].apiFramework = currentMediaFile.getAttribute('apiFramework');
    // we have a VPAID JS - we break
    // for VPAID we may not have a width, height or delivery
    if (this.params.enableVpaid && apiFramework &&
      VPAID_PATTERN.test(apiFramework) && JS_PATTERN.test(type)) {
      if (DEBUG) {
        FW.log('VPAID creative detected');
      }
      mediaFileItems = [mediaFileItems[i]];
      mediaFileToRemove = [];
      this.isVPAID = true;
      break;
    }
    /* delivery attribute is required but sometimes missing in real world and not really necessary to move forward */
    /*let delivery = currentMediaFile.getAttribute('delivery');
    if (delivery !== 'progressive' && delivery !== 'streaming') {
      delivery = 'progressive';
      if (DEBUG) {
        FW.log('missing required delivery attribute on MediaFile tag - this is not a VAST 3 spec compliant adTag - continuing anyway (same as IMA)');
      }
    }*/
    let width = currentMediaFile.getAttribute('width');
    if (width === null || width === '') {
      if (DEBUG) {
        FW.log('missing required width attribute on MediaFile tag - this is not a VAST 3 spec compliant adTag - continuing anyway (same as IMA)');
      }
      width = 0;
    }
    let height = currentMediaFile.getAttribute('height');
    if (height === null || height === '') {
      if (DEBUG) {
        FW.log('missing required height attribute on MediaFile tag - this is not a VAST 3 spec compliant adTag - continuing anyway (same as IMA)');
      }
      height = 0;
    }
    let bitrate = currentMediaFile.getAttribute('bitrate');
    if (bitrate === null || bitrate === '' || bitrate < 10) {
      bitrate = 0;
    }
    mediaFileItems[i].width = parseInt(width);
    mediaFileItems[i].height = parseInt(height);
    mediaFileItems[i].bitrate = parseInt(bitrate);

  }
  // remove MediaFile items that do not hold VAST spec-compliant attributes or data
  if (mediaFileToRemove.length > 0) {
    for (let i = mediaFileToRemove.length - 1; i >= 0; i--) {
      mediaFileItems.splice(mediaFileToRemove[i], 1);
    }
  }
  // we support HLS; MP4; WebM: VPAID so let us fecth for those
  const creatives = [];
  for (let i = 0, len = mediaFileItems.length; i < len; i++) {
    const currentMediaFileItem = mediaFileItems[i];
    const type = currentMediaFileItem.type;
    const url = currentMediaFileItem.url;
    if (this.isVPAID && url) {
      VPAID.loadCreative.call(this, url, this.params.vpaidSettings);
      this.adContentType = type;
      return;
    }
    // we have HLS or DASH and it is natively supported - display ad with HLS in priority
    if (HLS_PATTERN.test(type) && ENV.okHls) {
      VASTPLAYER.append.call(this, url, type);
      this.adContentType = type;
      return;
    }
    if (DASH_PATTERN.test(type) && ENV.okDash) {
      VASTPLAYER.append.call(this, url, type);
      this.adContentType = type;
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
    PING.error.call(this, 403);
    VASTERRORS.process.call(this, 403);
    return;
  }

  // sort supported creatives by width
  retainedCreatives.sort((a, b) => {
    return a.width - b.width;
  });

  if (DEBUG) {
    FW.log('available linear creative follows');
    FW.log(retainedCreatives);
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

  if (DEBUG) {
    FW.log('selected linear creative follows');
    FW.log(finalCreative);
  }
  this.adMediaUrl = finalCreative.url;
  this.adMediaHeight = finalCreative.height;
  this.adMediaWidth = finalCreative.width;
  this.adContentType = finalCreative.type;
  VASTPLAYER.append.call(this, finalCreative.url, finalCreative.type);
};

export default LINEAR;
