import { FW } from '../fw/fw';
import { FWVAST } from '../fw/fw-vast';
import { ENV } from '../fw/env';
import { PING } from '../tracking/ping';
import { CONTENTPLAYER } from '../players/content-player';
import { VASTPLAYER } from '../players/vast-player';
import { VPAID } from '../players/vpaid';
import { API } from '../api/api';
import { SKIP } from './skip';
import { ICONS } from './icons';
import { VASTERRORS } from '../utils/vast-errors';

const LINEAR = {};

var patternVPAID = /vpaid/i;
var patternJavaScript = /\/javascript/i;
var hlsPattern = /(application\/vnd\.apple\.mpegurl|x-mpegurl)/i;

var _onDurationChange = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: durationchange for VAST player reached');
  }
  this.vastPlayer.removeEventListener('durationchange', this.onDurationChange);
  this.vastPlayerDuration = VASTPLAYER.getDuration.call(this);
  API.createEvent.call(this, 'addurationchange');
};

var _onLoadedmetadataPlay = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: loadedmetadata for VAST player reached');
  }
  this.vastPlayer.removeEventListener('loadedmetadata', this.onLoadedmetadataPlay);
  clearTimeout(this.creativeLoadTimeoutCallback);
  API.createEvent.call(this, 'adloaded');
  if (DEBUG) {
    FW.log('RMP-VAST: pause content player');
  }
  CONTENTPLAYER.pause.call(this);
  // show ad container holding vast player
  FW.show(this.adContainer);
  FW.show(this.vastPlayer);
  this.adOnStage = true;
  // play VAST player
  if (DEBUG) {
    FW.log('RMP-VAST: play VAST player');
  }
  VASTPLAYER.play.call(this);
};

var _onEndedResumeContent = function () {
  if (DEBUG) {
    FW.log('RMP-VAST: creative ended in VAST player - resume content');
  }
  this.vastPlayer.removeEventListener('ended', this.onEndedResumeContent);
  VASTPLAYER.resumeContent.call(this);
};

var _onClickThrough = function (event) {
  try {
    if (event) {
      event.stopPropagation();
    }
    if (DEBUG) {
      FW.log('RMP-VAST: onClickThrough');
    }
    if (!ENV.isMobile) {
      window.open(this.clickThroughUrl, '_blank');
    }
    if (this.params.pauseOnClick) {
      this.pause();
    }
    API.createEvent.call(this, 'adclick');
    FWVAST.dispatchPingEvent.call(this, 'clickthrough');
  } catch (e) {
    FW.trace(e);
  }
};

var _onPlaybackError = function (event) {
  // MEDIA_ERR_SRC_NOT_SUPPORTED is sign of fatal error
  // other errors may produce non-fatal error in the browser so we do not 
  // act upon them
  if (event && event.target && event.target.error && event.target.error.code) {
    if (event.target.error.code !== event.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED) {
      return;
    }
  }
  PING.error.call(this, 401);
  VASTERRORS.process.call(this, 401);
};

var _appendClickUIOnMobile = function () {
  // we create a <a> tag rather than using window.open 
  // because it works better in standalone mode and WebView
  this.clickUIOnMobile = document.createElement('a');
  this.clickUIOnMobile.className = 'rmp-ad-click-ui-mobile';
  this.clickUIOnMobile.textContent = this.params.textForClickUIOnMobile;
  this.clickUIOnMobile.addEventListener('click', this.onClickThrough);
  this.clickUIOnMobile.href = this.clickThroughUrl;
  this.clickUIOnMobile.target = '_blank';
  this.adContainer.appendChild(this.clickUIOnMobile);
};

var _onContextMenu = function (event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
};

LINEAR.update = function (url, type) {
  if (DEBUG) {
    FW.log('RMP-VAST: update vast player for linear creative of type ' + type + ' located at ' + url);
  }
  this.onDurationChange = _onDurationChange.bind(this);
  this.vastPlayer.addEventListener('durationchange', this.onDurationChange);

  // when creative is loaded play it 
  this.onLoadedmetadataPlay = _onLoadedmetadataPlay.bind(this);
  this.vastPlayer.addEventListener('loadedmetadata', this.onLoadedmetadataPlay);

  // when creative ends resume content
  this.onEndedResumeContent = _onEndedResumeContent.bind(this);
  this.vastPlayer.addEventListener('ended', this.onEndedResumeContent);

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
  }

  // clickthrough interaction
  if (this.clickThroughUrl) {
    this.onClickThrough = _onClickThrough.bind(this);
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
  let duration = linear[0].getElementsByTagName('Duration');
  if (duration.length === 0) {
    // 1 Duration element must be present otherwise VAST document is not spec compliant
    PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
    VASTERRORS.process.call(this, 101);
    return;
  }
  let mediaFiles = linear[0].getElementsByTagName('MediaFiles');
  if (mediaFiles.length === 0) {
    // 1 MediaFiles element must be present otherwise VAST document is not spec compliant 
    PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
    VASTERRORS.process.call(this, 101);
    return;
  }
  // Industry Icons - currently we only support one icon
  let icons = linear[0].getElementsByTagName('Icons');
  if (icons.length > 0) {
    ICONS.parse.call(this, icons);
  }
  // check for AdParameters tag in case we have a VPAID creative
  let adParameters = linear[0].getElementsByTagName('AdParameters');
  let adParametersData = '';
  if (adParameters.length > 0) {
    adParametersData = FWVAST.getNodeValue(adParameters[0], false);
  }
  let mediaFile = mediaFiles[0].getElementsByTagName('MediaFile');
  if (mediaFile.length === 0) {
    // at least 1 MediaFile element must be present otherwise VAST document is not spec compliant 
    PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
    VASTERRORS.process.call(this, 101);
    return;
  }
  let mediaFileItems = [];
  let mediaFileToRemove = [];
  for (let i = 0, len = mediaFile.length; i < len; i++) {
    mediaFileItems[i] = {};
    // required per VAST3 spec CDATA URL location to media, delivery, type, width, height
    let currentMediaFile = mediaFile[i];
    let mediaFileValue = FWVAST.getNodeValue(currentMediaFile, true);
    if (mediaFileValue === null) {
      mediaFileToRemove.push(i);
      continue;
    }
    let type = currentMediaFile.getAttribute('type');
    if (type === null || type === '') {
      mediaFileToRemove.push(i);
      continue;
    }
    mediaFileItems[i].url = mediaFileValue;
    mediaFileItems[i].type = type;
    // check for potential VPAID
    let apiFramework = mediaFileItems[i].apiFramework = currentMediaFile.getAttribute('apiFramework');
    // we have a VPAID JS - we break
    // for VPAID we may not have a width, height or delivery
    if (this.params.enableVpaid && !this.useContentPlayerForAds && apiFramework &&
      patternVPAID.test(apiFramework) && patternJavaScript.test(type)) {
      if (DEBUG) {
        FW.log('RMP-VAST: VPAID creative detected');
      }
      let currentMediaFileItem = mediaFileItems[i];
      mediaFileItems = [];
      mediaFileToRemove = [];
      mediaFileItems[0] = currentMediaFileItem;
      this.isVPAID = true;
      break;
    }
    let delivery = currentMediaFile.getAttribute('delivery');
    if (delivery !== 'progressive' && delivery !== 'streaming') {
      mediaFileToRemove.push(i);
      continue;
    }
    let width = currentMediaFile.getAttribute('width');
    if (width === null || width === '') {
      mediaFileToRemove.push(i);
      continue;
    }
    let height = currentMediaFile.getAttribute('height');
    if (height === null || height === '') {
      mediaFileToRemove.push(i);
      continue;
    }
    mediaFileItems[i].width = parseInt(width);
    mediaFileItems[i].height = parseInt(height);
    // optional as per VAST 3 
    /*mediaFileItems[i].codec = mediaFileValue.getAttribute('codec');
    mediaFileItems[i].id = mediaFileValue.getAttribute('id');
    mediaFileItems[i].bitrate = mediaFileValue.getAttribute('bitrate');
    mediaFileItems[i].scalable = mediaFileValue.getAttribute('scalable');
    mediaFileItems[i].maintainAspectRatio = mediaFileValue.getAttribute('maintainAspectRatio');*/

  }
  // remove MediaFile items that do not hold VAST spec-compliant attributes or data
  if (mediaFileToRemove.length > 0) {
    for (let i = mediaFileToRemove.length - 1; i >= 0; i--) {
      mediaFileItems.splice(mediaFileToRemove[i], 1);
    }
  }
  // we support HLS; MP4; WebM: VPAID so let us fecth for those
  let mp4 = [];
  let webm = [];
  for (let i = 0, len = mediaFileItems.length; i < len; i++) {
    let currentMediaFileItem = mediaFileItems[i];
    let type = currentMediaFileItem.type;
    let url = currentMediaFileItem.url;
    if (this.isVPAID && url) {
      VPAID.loadCreative.call(
        this,
        url,
        adParametersData,
        this.params.vpaidSettings,
        this.params.ajaxTimeout,
        this.params.creativeLoadTimeout
      );
      this.adContentType = type;
      return;
    }
    // we have HLS and it is supported - display ad with HLS in priority
    if (hlsPattern.test(type) && ENV.okHls) {
      VASTPLAYER.append.call(this, url, type);
      this.adContentType = type;
      return;
    }
    // we gather MP4 and WebM files
    if (type === 'video/mp4' && ENV.okMp4) {
      mp4.push(currentMediaFileItem);
    } else if (type === 'video/webm' && ENV.okWebM) {
      webm.push(currentMediaFileItem);
    }
  }

  let format = [];
  // if we have WebM and WebM is supported - filter it by width
  // otherwise do the same for MP4
  if (ENV.okWebM && webm.length > 0) {
    webm.sort((a, b) => {
      return a.width - b.width;
    });
    format = webm;
  } else if (ENV.okMp4 && mp4.length > 0) {
    mp4.sort((a, b) => {
      return a.width - b.width;
    });
    format = mp4;
  }

  if (format.length === 0) {
    // None of the MediaFile provided are supported by the player
    PING.error.call(this, 403, this.inlineOrWrapperErrorTags);
    VASTERRORS.process.call(this, 403);
    return;
  }

  // we have files matching device capabilities
  // select the best one based on player current width
  let retainedFormat = format[0];
  let containerWidth = FW.getWidth(this.container);
  let formatLength = format.length;
  if (format[formatLength - 1].width < containerWidth) {
    retainedFormat = format[formatLength - 1];
  } else if (format[0].width > containerWidth) {
    retainedFormat = format[0];
  } else {
    for (let i = 0, len = formatLength; i < len; i++) {
      if (format[i].width >= containerWidth) {
        retainedFormat = format[i];
        break;
      }
    }
  }
  if (DEBUG) {
    FW.log('RMP-VAST: selected linear creative follows');
    FW.log(retainedFormat);
  }
  this.adMediaUrl = retainedFormat.url;
  this.adMediaHeight = retainedFormat.height;
  this.adMediaWidth = retainedFormat.width;
  this.adContentType = retainedFormat.type;
  VASTPLAYER.append.call(this, retainedFormat.url, retainedFormat.type);
};

export { LINEAR };