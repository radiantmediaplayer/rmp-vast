import { FW } from '../fw/fw';
import { FWVAST } from '../fw/fw-vast';
import { ENV } from '../fw/env';
import { PING } from '../tracking/ping';
import { CONTENTPLAYER } from '../players/content-player';
import { VASTPLAYER } from '../players/vast-player';
import { API } from '../api/api';
import { SKIP } from './skip';
import { ICONS } from './icons';
import { VASTERRORS } from '../utils/vast-errors';

const LINEAR = {};

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
  API.createEvent.call(this, 'adloaded');
  CONTENTPLAYER.pause.call(this);
  // show ad container holding vast player
  FW.show(this.adContainer);
  FW.show(this.vastPlayer);
  this.adOnStage = true;
  // play VAST player
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
      if (event.type === 'touchend') {
        event.preventDefault();
      }
    }
    window.open(this.clickThroughUrl, '_blank');
    API.createEvent.call(this, 'adclick');
    FWVAST.dispatchPingEvent.call(this, 'clickthrough');
  } catch (e) {
    FW.trace(e);
  }
};

var _onPlaybackError = function () {
  PING.error.call(this, 405);
  VASTERRORS.process.call(this, 405);
};

var _appendClickUIOnMobile = function () {
  this.clickUIOnMobile = document.createElement('div');
  this.clickUIOnMobile.className = 'rmp-ad-click-ui-mobile';
  this.clickUIOnMobile.textContent = this.params.textForClickUIOnMobile;
  this.clickUIOnMobile.addEventListener('touchend', this.onClickThrough);
  this.adContainer.appendChild(this.clickUIOnMobile);
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

  // append source to vast player if not there already
  if (!this.useContentPlayerForAds) {
    let existingVastPlayerSource = this.adContainer.getElementsByTagName('source')[0];
    if (!existingVastPlayerSource) {
      this.vastPlayerSource = document.createElement('source');
      this.onPlaybackError = _onPlaybackError.bind(this);
      this.vastPlayerSource.addEventListener('error', this.onPlaybackError);
      this.vastPlayer.appendChild(this.vastPlayerSource);
    } else {
      this.vastPlayerSource = existingVastPlayerSource;
    }
  }

  // append to rmp-ad-container if not there already
  let existingVastPlayer = this.adContainer.getElementsByClassName('rmp-ad-vast-video-player')[0];
  if (!this.useContentPlayerForAds && !existingVastPlayer) {
    this.adContainer.appendChild(this.vastPlayer);
  }

  // check fullscreen state
  // this is to account for non-trivial use-cases where player may be in fullscreen before
  // vastPlayer is in DOM
  if (FW.hasClass(this.container, 'rmp-fullscreen-on')) {
    this.isInFullscreen = true;
  }

  // load ad asset
  if (this.useContentPlayerForAds) {
    this.contentPlayer.src = url;
  } else {
    this.vastPlayerSource.type = type;
    this.vastPlayerSource.src = url;
  }
  this.vastPlayer.load();

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
  if (duration.length !== 1) {
    // 1 Duration element must be present otherwise VAST document is not spec compliant
    PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
    VASTERRORS.process.call(this, 101);
    return;
  }
  let mediaFiles = linear[0].getElementsByTagName('MediaFiles');
  if (mediaFiles.length !== 1) {
    // 1 MediaFiles element must be present otherwise VAST document is not spec compliant 
    PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
    VASTERRORS.process.call(this, 101);
    return;
  }
  let mediaFile = mediaFiles[0].getElementsByTagName('MediaFile');
  if (mediaFile.length < 1) {
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
    let delivery = currentMediaFile.getAttribute('delivery');
    if (delivery !== 'progressive' && delivery !== 'streaming') {
      mediaFileToRemove.push(i);
      continue;
    }
    let type = currentMediaFile.getAttribute('type');
    if (type === null || type === '') {
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
    mediaFileItems[i].url = mediaFileValue;
    mediaFileItems[i].delivery = delivery;
    mediaFileItems[i].type = type;
    mediaFileItems[i].width = parseInt(width);
    mediaFileItems[i].height = parseInt(height);
    // optional as per VAST 3 
    /*mediaFileItems[i].codec = mediaFileValue.getAttribute('codec');
    mediaFileItems[i].id = mediaFileValue.getAttribute('id');
    mediaFileItems[i].bitrate = mediaFileValue.getAttribute('bitrate');
    mediaFileItems[i].scalable = mediaFileValue.getAttribute('scalable');
    mediaFileItems[i].maintainAspectRatio = mediaFileValue.getAttribute('maintainAspectRatio');
    mediaFileItems[i].apiFramework = mediaFileValue.getAttribute('apiFramework');*/
  }
  // remove MediaFile items that do not hold VAST spec-compliant attributes or data
  FW.removeIndexFromArray(mediaFileItems, mediaFileToRemove);
  // we support HLS; MP4; WebM so let us fecth for those
  let mp4 = [];
  let webm = [];
  for (let i = 0, len = mediaFileItems.length; i < len; i++) {
    if (mediaFileItems[i].delivery === 'streaming') {
      // we have HLS and it is supported - display ad with HLS
      if ((mediaFileItems[i].type === 'application/vnd.apple.mpegurl' || mediaFileItems[i].type === 'x-mpegurl') && ENV.okHls) {
        VASTPLAYER.append.call(this, mediaFileItems[i].url, mediaFileItems[i].type);
        return;
      }
    } else {
      // we gather MP4 and WebM files
      if (mediaFileItems[i].type === 'video/mp4' && ENV.okMp4) {
        mp4.push(mediaFileItems[i]);
      } else if (mediaFileItems[i].type === 'video/webm' && ENV.okWebM) {
        webm.push(mediaFileItems[i]);
      }
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

  // icons
  // currently we only support one icon
  let icons = linear[0].getElementsByTagName('Icons');
  if (icons.length > 0) {
    ICONS.parse.call(this, icons);
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