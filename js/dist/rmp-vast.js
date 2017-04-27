/**
 * @license Copyright (c) 2017 Radiant Media Player | https://www.radiantmediaplayer.com
 * rmp-vast 0.1.0
 * GitHub: https://github.com/radiantmediaplayer/rmp-vast
 * MIT License: https://www.radiantmedialyzer.net/rmp-vast/mit-license.html
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.API = undefined;

var _fw = require('../fw/fw');

var _fwVast = require('../fw/fw-vast');

var _env = require('../fw/env');

var _vastPlayer = require('../players/vast-player');

var _contentPlayer = require('../players/content-player');

var API = {};

API.getAdPaused = function () {
  if (this.adOnStage && this.adIsLinear) {
    return this.vastPlayerPaused;
  }
  return null;
};

API.play = function () {
  if (!this.vastPlayerInitialized) {
    this.initialize();
    return;
  }
  if (this.adOnStage) {
    if (this.adIsLinear) {
      _vastPlayer.VASTPLAYER.play.call(this);
    } else {
      _contentPlayer.CONTENTPLAYER.play.call(this);
    }
  } else {
    _contentPlayer.CONTENTPLAYER.play.call(this);
  }
};

API.pause = function () {
  if (this.adOnStage) {
    if (this.adIsLinear) {
      _vastPlayer.VASTPLAYER.pause.call(this);
    } else {
      _contentPlayer.CONTENTPLAYER.pause.call(this);
    }
  } else {
    _contentPlayer.CONTENTPLAYER.pause.call(this);
  }
};

API.seekTo = function (msSeek) {
  if (this.adOnStage && this.adIsLinear) {
    // you cannot seek into a playing linear ad
    return;
  } else {
    _contentPlayer.CONTENTPLAYER.seekTo.call(this, msSeek);
  }
};

API.setVolume = function (level) {
  if (typeof level !== 'number') {
    return;
  }
  var validatedLevel = 0;
  if (level < 0) {
    validatedLevel = 0;
  } else if (level > 1) {
    validatedLevel = 1;
  } else {
    validatedLevel = level;
  }
  if (this.adOnStage) {
    if (this.adIsLinear) {
      _vastPlayer.VASTPLAYER.setVolume.call(this, level);
    }
    _contentPlayer.CONTENTPLAYER.setVolume.call(this, level);
  } else {
    _contentPlayer.CONTENTPLAYER.setVolume.call(this, level);
  }
};

API.getVolume = function () {
  if (this.adOnStage && this.adIsLinear) {
    return _vastPlayer.VASTPLAYER.getVolume.call(this);
  }
  return _contentPlayer.CONTENTPLAYER.getVolume.call(this);
};

API.setMute = function (muted) {
  if (typeof muted !== 'boolean') {
    return;
  }
  if (this.adOnStage) {
    if (this.adIsLinear) {
      _vastPlayer.VASTPLAYER.setMute.call(this, muted);
    }
    _contentPlayer.CONTENTPLAYER.setMute.call(this, muted);
  } else {
    _contentPlayer.CONTENTPLAYER.setMute.call(this, muted);
  }
};

API.getMute = function () {
  if (this.adOnStage && this.adIsLinear) {
    return _vastPlayer.VASTPLAYER.getMute.call(this);
  }
  return _contentPlayer.CONTENTPLAYER.getMute.call(this);
};

API.getFullscreen = function () {
  return this.isInFullscreen;
};

API.setFullscreen = function (fs) {
  if (typeof fs === 'boolean') {
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: setFullscreen ' + fs);
    }
    if (this.isInFullscreen && !fs) {
      if (this.adOnStage && this.adIsLinear) {
        _env.ENV.exitFullscreen(this.vastPlayer);
      } else {
        _env.ENV.exitFullscreen(this.contentPlayer);
      }
    } else if (!this.isInFullscreen && fs) {
      if (this.adOnStage && this.adIsLinear) {
        _env.ENV.requestFullscreen(this.container, this.vastPlayer);
      } else {
        _env.ENV.requestFullscreen(this.container, this.contentPlayer);
      }
    }
  }
};

API.stopAds = function () {
  if (this.adOnStage) {
    this.readyForReset = true;
    // this will destroy ad
    _vastPlayer.VASTPLAYER.resumeContent.call(this);
  }
};

API.getAdTagUrl = function () {
  return this.adTagUrl;
};

API.getAdMediaUrl = function () {
  if (this.adOnStage) {
    if (this.adIsLinear) {
      return this.adMediaUrl;
    } else {
      return this.nonLinearCreativeUrl;
    }
  }
  return null;
};

API.getAdLinear = function () {
  return this.adIsLinear;
};

API.getAdSystem = function () {
  return this.adSystem;
};

API.getAdContentType = function () {
  if (this.adOnStage) {
    if (this.adIsLinear) {
      return this.adContentType;
    } else {
      return this.nonLinearContentType;
    }
  }
  return null;
};

API.getAdTitle = function () {
  return this.adTitle;
};

API.getAdDescription = function () {
  return this.adDescription;
};

API.getAdDuration = function () {
  if (this.adOnStage && this.adIsLinear) {
    return _vastPlayer.VASTPLAYER.getDuration.call(this);
  }
  return null;
};

API.getAdCurrentTime = function () {
  if (this.adOnStage && this.adIsLinear) {
    return _vastPlayer.VASTPLAYER.getCurrentTime.call(this);
  }
  return null;
};

API.getAdOnStage = function () {
  return this.adOnStage;
};

API.getAdMediaWidth = function () {
  if (this.adOnStage) {
    if (this.adIsLinear) {
      return this.adMediaWidth;
    } else {
      return this.nonLinearCreativeWidth;
    }
  }
  return null;
};

API.getAdMediaHeight = function () {
  if (this.adOnStage) {
    if (this.adIsLinear) {
      return this.adMediaHeight;
    } else {
      return this.nonLinearCreativeHeight;
    }
  }
  return null;
};

API.getClickThroughUrl = function () {
  return this.clickThroughUrl;
};

API.createEvent = function (event) {
  // adloaded, addurationchange, adclick, adimpression, adstarted, adtagloaded, adtagstartloading, adpaused, adresumed 
  // advolumemuted, advolumechanged, adcomplete, adskipped, adskippablestatechanged
  // adfirstquartile, admidpoint, adthirdquartile, aderror, adfollowingredirect, addestroyed
  if (typeof event === 'string' && event !== '' && this.container) {
    _fw.FW.createStdEvent(event, this.container);
  }
};

API.getAdErrorMessage = function () {
  return this.vastErrorMessage;
};

API.getAdVastErrorCode = function () {
  return this.vastErrorCode;
};

API.getEnv = function () {
  return _env.ENV;
};

API.getFW = function () {
  return _fw.FW;
};

API.getFWVAST = function () {
  return _fwVast.FWVAST;
};

API.getVastPlayer = function () {
  return this.vastPlayer;
};

API.getContentPlayer = function () {
  return this.contentPlayer;
};

API.getIsUsingContentPlayerForAds = function () {
  return this.useContentPlayerForAds;
};

API.initialize = function () {
  if (!this.vastPlayerInitialized) {
    if (DEBUG) {
      _fwVast.FWVAST.logPerformance('RMP-VAST: on user interaction - player needs to be initialized');
    }
    _vastPlayer.VASTPLAYER.init.call(this);
    _fw.FW.playPromise(this.contentPlayer);
    this.contentPlayer.pause();
  }
};

exports.API = API;

},{"../fw/env":6,"../fw/fw":8,"../fw/fw-vast":7,"../players/content-player":10,"../players/vast-player":11}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ICONS = undefined;

var _fw = require('../fw/fw');

var _fwVast = require('../fw/fw-vast');

var _ping = require('../tracking/ping');

var ICONS = {};

ICONS.destroy = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: start destroying icons');
  }
  var icons = this.adContainer.getElementsByClassName('rmp-ad-container-icons');
  for (var i = 0, len = icons.length; i < len; i++) {
    this.adContainer.removeChild(icons[i]);
  }
};

var _programAlreadyPresent = function _programAlreadyPresent(program) {
  for (var i = 0, len = this.icons.length; i < len; i++) {
    if (this.icons[i].program === program) {
      return true;
    }
  }
  return false;
};

ICONS.parse = function (icons) {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: start parsing for icons');
  }
  var icon = icons[0].getElementsByTagName('Icon');
  for (var i = 0, len = icon.length; i < len; i++) {
    var currentIcon = icon[i];
    var program = currentIcon.getAttribute('program');
    // program is required attribute ignore the current icon if not present
    if (program === null || program === '') {
      continue;
    }
    // if program already present we ignore it
    if (_programAlreadyPresent.call(this, program)) {
      continue;
    }
    // width, height, xPosition, yPosition are all required attributes
    // if one is missing we ignore the current icon
    var width = currentIcon.getAttribute('width');
    if (width === null || width === '' || parseInt(width) < 1) {
      continue;
    }
    var height = currentIcon.getAttribute('height');
    if (height === null || height === '' || parseInt(height) < 1) {
      continue;
    }
    var xPosition = currentIcon.getAttribute('xPosition');
    if (xPosition === null || xPosition === '') {
      continue;
    }
    var yPosition = currentIcon.getAttribute('yPosition');
    if (yPosition === null || yPosition === '') {
      continue;
    }
    var staticResource = currentIcon.getElementsByTagName('StaticResource');
    // we only support StaticResource (IFrameResource HTMLResource not supported)
    if (staticResource.length !== 1) {
      continue;
    }
    // in StaticResource we only support images (application/x-javascript and application/x-shockwave-flash not supported)
    var creativeType = staticResource[0].getAttribute('creativeType');
    var imagePattern = /^image\/(gif|jpeg|jpg|png)$/i;
    if (creativeType === null || creativeType === '' || !imagePattern.test(creativeType)) {
      continue;
    }
    var staticResourceUrl = _fwVast.FWVAST.getNodeValue(staticResource[0], true);
    if (staticResourceUrl === null) {
      continue;
    }
    var iconData = {
      program: program,
      width: width,
      height: height,
      xPosition: xPosition,
      yPosition: yPosition,
      staticResourceUrl: staticResourceUrl
    };
    // optional IconViewTracking
    var iconViewTracking = currentIcon.getElementsByTagName('IconViewTracking');
    var iconViewTrackingUrl = _fwVast.FWVAST.getNodeValue(iconViewTracking[0], true);
    if (iconViewTrackingUrl !== null) {
      iconData.iconViewTrackingUrl = iconViewTrackingUrl;
    }
    //optional IconClicks
    var iconClicks = currentIcon.getElementsByTagName('IconClicks');
    if (iconClicks.length === 1) {
      var iconClickThrough = iconClicks[0].getElementsByTagName('IconClickThrough');
      var iconClickThroughUrl = _fwVast.FWVAST.getNodeValue(iconClickThrough[0], true);
      if (iconClickThroughUrl !== null) {
        iconData.iconClickThroughUrl = iconClickThroughUrl;
        var iconClickTracking = iconClicks[0].getElementsByTagName('IconClickTracking');
        if (iconClickTracking.length > 0) {
          iconData.iconClickTrackingUrl = [];
          for (var _i = 0, _len = iconClickTracking.length; _i < _len; _i++) {
            var iconClickTrackingUrl = _fwVast.FWVAST.getNodeValue(iconClickTracking[_i], true);
            if (iconClickTrackingUrl !== null) {
              iconData.iconClickTrackingUrl.push(iconClickTrackingUrl);
            }
          }
        }
      }
    }
    this.icons.push(iconData);
  }
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: validated parsed icons follows');
    _fw.FW.log(this.icons);
  }
};

var _onIconClickThrough = function _onIconClickThrough(index) {
  var _this = this;

  if (DEBUG) {
    _fw.FW.log('RMP-VAST: click on icon with index ' + index);
  }
  try {
    // open ClickThrough link for icon
    window.open(this.icons[index].iconClickThroughUrl, '_blank ');
    // send trackers if any for IconClickTracking
    if (typeof this.icons[index].iconClickTrackingUrl !== 'undefined') {
      var iconClickTrackingUrl = this.icons[index].iconClickTrackingUrl;
      if (iconClickTrackingUrl.length > 0) {
        iconClickTrackingUrl.forEach(function (element) {
          _ping.PING.tracking.call(_this, element, null);
        });
      }
    }
  } catch (e) {
    _fw.FW.trace(e);
  }
};

var _onIconLoadPingTracking = function _onIconLoadPingTracking(index) {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: IconViewTracking for icon at index ' + index);
  }
  _ping.PING.tracking.call(this, this.icons[index].iconViewTrackingUrl, null);
};

var _onPlayingAppendIcons = function _onPlayingAppendIcons() {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: playing states has been reached - append icons');
  }
  this.vastPlayer.removeEventListener('playing', this.onPlayingAppendIcons);
  for (var i = 0, len = this.icons.length; i < len; i++) {
    var icon = document.createElement('img');
    icon.className = 'rmp-ad-container-icons';

    icon.style.width = parseInt(this.icons[i].width) + 'px';

    icon.style.height = parseInt(this.icons[i].height) + 'px';

    var xPosition = this.icons[i].xPosition;
    if (xPosition === 'left') {
      icon.style.left = '0px';
    } else if (xPosition === 'right') {
      icon.style.right = '0px';
    } else if (parseInt(xPosition) >= 0) {
      icon.style.left = xPosition + 'px';
    } else {
      icon.style.left = '0px';
    }

    var yPosition = this.icons[i].yPosition;
    if (yPosition === 'top') {
      icon.style.top = '0px';
    } else if (xPosition === 'bottom') {
      icon.style.bottom = '0px';
    } else if (parseInt(yPosition) >= 0) {
      icon.style.top = yPosition + 'px';
    } else {
      icon.style.top = '0px';
    }

    if (typeof this.icons[i].iconViewTrackingUrl !== 'undefined') {
      icon.addEventListener('load', _onIconLoadPingTracking.bind(this, i));
    }

    if (typeof this.icons[i].iconClickThroughUrl !== 'undefined') {
      icon.addEventListener('click', _onIconClickThrough.bind(this, i));
    }

    icon.src = this.icons[i].staticResourceUrl;

    this.adContainer.appendChild(icon);
  }
};

ICONS.append = function () {
  this.onPlayingAppendIcons = _onPlayingAppendIcons.bind(this);
  // as per VAST 3 spec only append icon when ad starts playing
  this.vastPlayer.addEventListener('playing', this.onPlayingAppendIcons);
};

exports.ICONS = ICONS;

},{"../fw/fw":8,"../fw/fw-vast":7,"../tracking/ping":12}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LINEAR = undefined;

var _fw = require('../fw/fw');

var _fwVast = require('../fw/fw-vast');

var _env = require('../fw/env');

var _ping = require('../tracking/ping');

var _contentPlayer = require('../players/content-player');

var _vastPlayer = require('../players/vast-player');

var _api = require('../api/api');

var _skip = require('./skip');

var _icons = require('./icons');

var _vastErrors = require('../utils/vast-errors');

var LINEAR = {};

var _onDurationChange = function _onDurationChange() {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: durationchange for VAST player reached');
  }
  this.vastPlayer.removeEventListener('durationchange', this.onDurationChange);
  this.vastPlayerDuration = _vastPlayer.VASTPLAYER.getDuration.call(this);
  _api.API.createEvent.call(this, 'addurationchange');
};

var _onLoadedmetadataPlay = function _onLoadedmetadataPlay() {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: loadedmetadata for VAST player reached');
  }
  this.vastPlayer.removeEventListener('loadedmetadata', this.onLoadedmetadataPlay);
  _api.API.createEvent.call(this, 'adloaded');
  _contentPlayer.CONTENTPLAYER.pause.call(this);
  // show ad container holding vast player
  _fw.FW.show(this.adContainer);
  _fw.FW.show(this.vastPlayer);
  this.adOnStage = true;
  // play VAST player
  _vastPlayer.VASTPLAYER.play.call(this);
};

var _onEndedResumeContent = function _onEndedResumeContent() {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: creative ended in VAST player - resume content');
  }
  this.vastPlayer.removeEventListener('ended', this.onEndedResumeContent);
  _vastPlayer.VASTPLAYER.resumeContent.call(this);
};

var _onClickThrough = function _onClickThrough(event) {
  try {
    if (event) {
      event.stopPropagation();
      if (event.type === 'touchend') {
        event.preventDefault();
      }
    }
    window.open(this.clickThroughUrl, '_blank');
    _api.API.createEvent.call(this, 'adclick');
    _fwVast.FWVAST.dispatchPingEvent.call(this, 'clickthrough');
  } catch (e) {
    _fw.FW.trace(e);
  }
};

var _onPlaybackError = function _onPlaybackError() {
  _ping.PING.error.call(this, 405);
  _vastErrors.VASTERRORS.process.call(this, 405);
};

var _appendClickUIOnMobile = function _appendClickUIOnMobile() {
  this.clickUIOnMobile = document.createElement('div');
  this.clickUIOnMobile.className = 'rmp-ad-click-ui-mobile';
  this.clickUIOnMobile.textContent = this.params.textForClickUIOnMobile;
  this.clickUIOnMobile.addEventListener('touchend', this.onClickThrough);
  this.adContainer.appendChild(this.clickUIOnMobile);
};

LINEAR.update = function (url, type) {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: update vast player for linear creative of type ' + type + ' located at ' + url);
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
    var existingVastPlayerSource = this.adContainer.getElementsByTagName('source')[0];
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
  var existingVastPlayer = this.adContainer.getElementsByClassName('rmp-ad-vast-video-player')[0];
  if (!this.useContentPlayerForAds && !existingVastPlayer) {
    this.adContainer.appendChild(this.vastPlayer);
  }

  // check fullscreen state
  // this is to account for non-trivial use-cases where player may be in fullscreen before
  // vastPlayer is in DOM
  if (_fw.FW.hasClass(this.container, 'rmp-fullscreen-on')) {
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
    if (_env.ENV.isMobile) {
      _appendClickUIOnMobile.call(this);
    } else {
      this.vastPlayer.addEventListener('click', this.onClickThrough);
    }
  }

  // skippable - only where vast player is different from 
  // content player
  if (this.isSkippableAd) {
    _skip.SKIP.append.call(this);
  }
};

LINEAR.parse = function (linear) {
  // we have an InLine Linear which is not a Wrapper - process MediaFiles
  this.adIsLinear = true;
  var duration = linear[0].getElementsByTagName('Duration');
  if (duration.length !== 1) {
    // 1 Duration element must be present otherwise VAST document is not spec compliant
    _ping.PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
    _vastErrors.VASTERRORS.process.call(this, 101);
    return;
  }
  var mediaFiles = linear[0].getElementsByTagName('MediaFiles');
  if (mediaFiles.length !== 1) {
    // 1 MediaFiles element must be present otherwise VAST document is not spec compliant 
    _ping.PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
    _vastErrors.VASTERRORS.process.call(this, 101);
    return;
  }
  var mediaFile = mediaFiles[0].getElementsByTagName('MediaFile');
  if (mediaFile.length < 1) {
    // at least 1 MediaFile element must be present otherwise VAST document is not spec compliant 
    _ping.PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
    _vastErrors.VASTERRORS.process.call(this, 101);
    return;
  }
  var mediaFileItems = [];
  var mediaFileToRemove = [];
  for (var i = 0, len = mediaFile.length; i < len; i++) {
    mediaFileItems[i] = {};
    // required per VAST3 spec CDATA URL location to media, delivery, type, width, height
    var currentMediaFile = mediaFile[i];
    var mediaFileValue = _fwVast.FWVAST.getNodeValue(currentMediaFile, true);
    if (mediaFileValue === null) {
      mediaFileToRemove.push(i);
      continue;
    }
    var delivery = currentMediaFile.getAttribute('delivery');
    if (delivery !== 'progressive' && delivery !== 'streaming') {
      mediaFileToRemove.push(i);
      continue;
    }
    var type = currentMediaFile.getAttribute('type');
    if (type === null || type === '') {
      mediaFileToRemove.push(i);
      continue;
    }
    var width = currentMediaFile.getAttribute('width');
    if (width === null || width === '') {
      mediaFileToRemove.push(i);
      continue;
    }
    var height = currentMediaFile.getAttribute('height');
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
  _fw.FW.removeIndexFromArray(mediaFileItems, mediaFileToRemove);
  // we support HLS; MP4; WebM so let us fecth for those
  var mp4 = [];
  var webm = [];
  for (var _i = 0, _len = mediaFileItems.length; _i < _len; _i++) {
    if (mediaFileItems[_i].delivery === 'streaming') {
      // we have HLS and it is supported - display ad with HLS
      if ((mediaFileItems[_i].type === 'application/vnd.apple.mpegurl' || mediaFileItems[_i].type === 'x-mpegurl') && _env.ENV.okHls) {
        _vastPlayer.VASTPLAYER.append.call(this, mediaFileItems[_i].url, mediaFileItems[_i].type);
        return;
      }
    } else {
      // we gather MP4 and WebM files
      if (mediaFileItems[_i].type === 'video/mp4' && _env.ENV.okMp4) {
        mp4.push(mediaFileItems[_i]);
      } else if (mediaFileItems[_i].type === 'video/webm' && _env.ENV.okWebM) {
        webm.push(mediaFileItems[_i]);
      }
    }
  }
  var format = [];
  // if we have MP4s and MP4 is supported - filter it by width
  // otherwise do the same for WebM
  if (_env.ENV.okMp4 && mp4.length > 0) {
    mp4.sort(function (a, b) {
      return a.width - b.width;
    });
    format = mp4;
  } else if (_env.ENV.okWebM && webm.length > 0) {
    webm.sort(function (a, b) {
      return a.width - b.width;
    });
    format = webm;
  }

  if (format.length === 0) {
    // None of the MediaFile provided are supported by the player
    _ping.PING.error.call(this, 403, this.inlineOrWrapperErrorTags);
    _vastErrors.VASTERRORS.process.call(this, 403);
    return;
  }

  // icons
  // currently we only support one icon
  var icons = linear[0].getElementsByTagName('Icons');
  if (icons.length > 0) {
    _icons.ICONS.parse.call(this, icons);
  }

  // we have files matching device capabilities
  // select the best one based on player current width
  var retainedFormat = {};
  var containerWidth = _fw.FW.getWidth(this.container);
  for (var _i2 = 0, _len2 = format.length; _i2 < _len2; _i2++) {
    retainedFormat = format[_i2];
    if (retainedFormat.width >= containerWidth) {
      break;
    }
  }
  this.adMediaUrl = retainedFormat.url;
  this.adMediaHeight = retainedFormat.height;
  this.adMediaWidth = retainedFormat.width;
  this.adContentType = retainedFormat.type;
  _vastPlayer.VASTPLAYER.append.call(this, retainedFormat.url, retainedFormat.type);
};

exports.LINEAR = LINEAR;

},{"../api/api":1,"../fw/env":6,"../fw/fw":8,"../fw/fw-vast":7,"../players/content-player":10,"../players/vast-player":11,"../tracking/ping":12,"../utils/vast-errors":15,"./icons":2,"./skip":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NONLINEAR = undefined;

var _fw = require('../fw/fw');

var _fwVast = require('../fw/fw-vast');

var _ping = require('../tracking/ping');

var _vastPlayer = require('../players/vast-player');

var _contentPlayer = require('../players/content-player');

var _api = require('../api/api');

var _vastErrors = require('../utils/vast-errors');

var NONLINEAR = {};

var _onNonLinearLoadError = function _onNonLinearLoadError() {
  _ping.PING.error.call(this, 502);
  _vastErrors.VASTERRORS.process.call(this, 502);
};

var _onNonLinearLoadSuccess = function _onNonLinearLoadSuccess() {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: success loading non-linear creative at ' + this.nonLinearCreativeUrl);
  }
  this.adOnStage = true;
  this.adMediaUrl = this.nonLinearCreativeUrl;
  _api.API.createEvent.call(this, 'adloaded');
  _api.API.createEvent.call(this, 'adimpression');
  _api.API.createEvent.call(this, 'adstarted');
  _fwVast.FWVAST.dispatchPingEvent.call(this, ['impression', 'creativeView', 'start']);
};

var _onNonLinearClickThrough = function _onNonLinearClickThrough() {
  try {
    window.open(this.clickThroughUrl, '_blank');
    _api.API.createEvent.call(this, 'adclick');
    _fwVast.FWVAST.dispatchPingEvent.call(this, 'clickthrough');
  } catch (e) {
    _fw.FW.trace(e);
  }
};

NONLINEAR.update = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: appending non-linear creative to .rmp-ad-container element');
  }
  this.nonLinearCreative = document.createElement('img');
  this.nonLinearCreative.className = 'rmp-ad-non-linear-creative';
  this.nonLinearCreative.style.width = this.nonLinearCreativeWidth + 'px';
  this.nonLinearCreative.style.height = this.nonLinearCreativeHeight + 'px';
  this.onNonLinearLoadError = _onNonLinearLoadError.bind(this);
  this.nonLinearCreative.addEventListener('error', this.onNonLinearLoadError);
  this.onNonLinearLoadSuccess = _onNonLinearLoadSuccess.bind(this);
  this.nonLinearCreative.addEventListener('load', this.onNonLinearLoadSuccess);
  if (this.clickThroughUrl) {
    this.onNonLinearClickThrough = _onNonLinearClickThrough.bind(this);
    this.nonLinearCreative.addEventListener('click', this.onNonLinearClickThrough);
  }
  this.nonLinearCreative.src = this.nonLinearCreativeUrl;
  this.adContainer.appendChild(this.nonLinearCreative);
  _fw.FW.show(this.adContainer);
  _contentPlayer.CONTENTPLAYER.play.call(this);
};

NONLINEAR.parse = function (nonLinearAds) {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: start parsing NonLinearAds');
  }
  this.adIsLinear = false;

  var nonLinear = nonLinearAds[0].getElementsByTagName('NonLinear');
  // at least 1 NonLinear is expected to continue
  // but according to spec this should not trigger an error
  // 2.3.4 One or more <NonLinear> ads may be included within a <NonLinearAds> element.
  if (nonLinear.length < 1) {
    return;
  }
  var currentNonLinear = void 0;
  var nonLinearCreativeUrl = '';
  // The video player should poll each <NonLinear> element to determine 
  // which creative is offered in a format the video player can support.
  for (var i = 0, len = nonLinear.length; i < len; i++) {
    currentNonLinear = nonLinear[i];
    var width = currentNonLinear.getAttribute('width');
    // width attribute is required
    if (width === null || width === '') {
      _ping.PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
      _vastErrors.VASTERRORS.process.call(this, 101);
      continue;
    }
    var height = currentNonLinear.getAttribute('height');
    // height attribute is also required
    if (height === null || height === '') {
      _ping.PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
      _vastErrors.VASTERRORS.process.call(this, 101);
      continue;
    }
    if (parseInt(height) <= 0 || parseInt(width) <= 0) {
      continue;
    }
    var staticResource = currentNonLinear.getElementsByTagName('StaticResource');
    // we expect at least one StaticResource tag
    // we do not support IFrameResource or HTMLResource
    if (staticResource.length < 1) {
      continue;
    }
    var creativeType = void 0;
    for (var _i = 0, _len = staticResource.length; _i < _len; _i++) {
      var currentStaticResource = staticResource[_i];
      creativeType = currentStaticResource.getAttribute('creativeType');
      if (creativeType === null || creativeType === '') {
        continue;
      }
      // we only support images for StaticResource
      var imagePattern = /^image\/(png|jpeg|jpg|gif)$/i;
      if (!imagePattern.test(creativeType)) {
        continue;
      }
      var containerWidth = _fw.FW.getWidth(this.container);
      // if width of non-linear creative does not fit within current player container width 
      // we should skip this creative
      if (parseInt(width) > containerWidth) {
        continue;
      }
      nonLinearCreativeUrl = _fwVast.FWVAST.getNodeValue(currentStaticResource, true);
      break;
    }
    // we have a valid NonLinear/StaticResource with supported creativeType - we break
    if (nonLinearCreativeUrl !== '') {
      this.nonLinearCreativeUrl = nonLinearCreativeUrl;
      this.nonLinearCreativeHeight = height;
      this.nonLinearCreativeWidth = width;
      this.nonLinearContentType = creativeType;
      break;
    }
  }
  // if not supported NonLinear type ping for error
  if (!this.nonLinearCreativeUrl || !currentNonLinear) {
    _ping.PING.error.call(this, 503, this.inlineOrWrapperErrorTags);
    _vastErrors.VASTERRORS.process.call(this, 503);
    return;
  }
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: valid non-linear creative data at ' + this.nonLinearCreativeUrl);
  }
  var nonLinearClickThrough = currentNonLinear.getElementsByTagName('NonLinearClickThrough');
  // if NonLinearClickThrough is present we only expect one tag
  if (nonLinearClickThrough.length === 1) {
    this.clickThroughUrl = _fwVast.FWVAST.getNodeValue(nonLinearClickThrough[0], true);
    var nonLinearClickTracking = nonLinear[0].getElementsByTagName('NonLinearClickTracking');
    if (nonLinearClickTracking.length > 0) {
      for (var _i2 = 0, _len2 = nonLinearClickTracking.length; _i2 < _len2; _i2++) {
        var nonLinearClickTrackingUrl = _fwVast.FWVAST.getNodeValue(nonLinearClickTracking[_i2], true);
        if (nonLinearClickTrackingUrl !== null) {
          this.trackingTags.push({ event: 'clickthrough', url: nonLinearClickTrackingUrl });
        }
      }
    }
  }
  _vastPlayer.VASTPLAYER.append.call(this);
};

exports.NONLINEAR = NONLINEAR;

},{"../api/api":1,"../fw/fw":8,"../fw/fw-vast":7,"../players/content-player":10,"../players/vast-player":11,"../tracking/ping":12,"../utils/vast-errors":15}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SKIP = undefined;

var _fw = require('../fw/fw');

var _fwVast = require('../fw/fw-vast');

var _vastPlayer = require('../players/vast-player');

var _api = require('../api/api');

var SKIP = {};

var _setCanBeSkippedUI = function _setCanBeSkippedUI() {
  this.skipWaiting.style.display = 'none';
  this.skipMessage.style.display = 'block';
  this.skipIcon.style.display = 'block';
};

var _updateWaitingForCanBeSkippedUI = function _updateWaitingForCanBeSkippedUI(delta) {
  if (Math.round(delta) > 0) {
    this.skipWaiting.textContent = this.params.skipWaitingMessage + ' ' + Math.round(delta) + 's';
  }
};

var _onTimeupdateCheckSkip = function _onTimeupdateCheckSkip() {
  if (this.skipButton.style.display === 'none') {
    this.skipButton.style.display = 'block';
  }
  this.vastPlayerCurrentTime = this.vastPlayer.currentTime;
  if (_fw.FW.isNumber(this.vastPlayerCurrentTime) && this.vastPlayerCurrentTime > 0) {
    var skipoffsetSeconds = _fwVast.FWVAST.convertOffsetToSeconds(this.skipoffset, this.vastPlayerDuration);
    if (this.vastPlayerCurrentTime >= skipoffsetSeconds) {
      this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdateCheckSkip);
      _setCanBeSkippedUI.call(this);
      this.skippableAdCanBeSkipped = true;
      _api.API.createEvent.call(this, 'adskippablestatechanged');
    } else if (skipoffsetSeconds - this.vastPlayerCurrentTime > 0) {
      _updateWaitingForCanBeSkippedUI.call(this, skipoffsetSeconds - this.vastPlayerCurrentTime);
    }
  }
};

var _onClickSkip = function _onClickSkip() {
  if (this.skippableAdCanBeSkipped) {
    // create API event
    _api.API.createEvent.call(this, 'adskipped');
    // request ping for skip event
    _fwVast.FWVAST.dispatchPingEvent.call(this, 'skip');
    // resume content
    _vastPlayer.VASTPLAYER.resumeContent.call(this);
  }
};

SKIP.append = function () {
  this.skipButton = document.createElement('div');
  this.skipButton.className = 'rmp-ad-container-skip';
  this.skipButton.style.display = 'none';

  this.skipWaiting = document.createElement('div');
  this.skipWaiting.className = 'rmp-ad-container-skip-waiting';
  _updateWaitingForCanBeSkippedUI.call(this, this.skipoffset);
  this.skipWaiting.style.display = 'block';

  this.skipMessage = document.createElement('div');
  this.skipMessage.className = 'rmp-ad-container-skip-message';
  this.skipMessage.textContent = this.params.skipMessage;
  this.skipMessage.style.display = 'none';

  this.skipIcon = document.createElement('div');
  this.skipIcon.className = 'rmp-ad-container-skip-icon';
  this.skipIcon.style.display = 'none';

  this.onClickSkip = _onClickSkip.bind(this);
  this.skipButton.addEventListener('click', this.onClickSkip);
  this.skipButton.appendChild(this.skipWaiting);
  this.skipButton.appendChild(this.skipMessage);
  this.skipButton.appendChild(this.skipIcon);
  this.adContainer.appendChild(this.skipButton);
  this.onTimeupdateCheckSkip = _onTimeupdateCheckSkip.bind(this);
  this.vastPlayer.addEventListener('timeupdate', this.onTimeupdateCheckSkip);
};

exports.SKIP = SKIP;

},{"../api/api":1,"../fw/fw":8,"../fw/fw-vast":7,"../players/vast-player":11}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ENV = {};

ENV.testVideo = document.createElement('video');

var _filterVersion = function _filterVersion(pattern, ua) {
  if (ua === null) {
    return -1;
  }
  var versionArray = ua.match(pattern);
  if (Array.isArray(versionArray) && typeof versionArray[1] !== 'undefined') {
    return parseInt(versionArray[1], 10);
  }
  return -1;
};

var _hasTouchEvents = function _hasTouchEvents() {
  if (typeof window.ontouchstart !== 'undefined' || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }
  return false;
};

var _getUserAgent = function _getUserAgent() {
  if (window.navigator && window.navigator.userAgent) {
    return window.navigator.userAgent;
  } else {
    return null;
  }
};

var _isWindowsPhone = function _isWindowsPhone(ua, hasTouchEvents) {
  var isWP = false;
  var wpVersion = -1;
  var support = [isWP, wpVersion];
  if (!hasTouchEvents) {
    return support;
  }
  var pattern = /windows\s+phone/i;
  if (pattern.test(ua)) {
    isWP = true;
    var pattern2 = /windows\s+phone\s+(\d+)\./i;
    support = [isWP, _filterVersion(pattern2, ua)];
  }
  return support;
};

var _isIos = function _isIos(ua, isWindowsPhone, hasTouchEvents) {
  var isIOS = false;
  var iOSVersion = -1;
  var support = [isIOS, iOSVersion];
  if (isWindowsPhone[0] || !hasTouchEvents) {
    return support;
  }
  var pattern = /(ipad|iphone|ipod)/i;
  if (pattern.test(ua)) {
    isIOS = true;
    var pattern2 = /os\s+(\d+)_/i;
    support = [isIOS, _filterVersion(pattern2, ua)];
  }
  return support;
};

var _isAndroid = function _isAndroid(ua, isWindowsPhone, isIos, hasTouchEvents) {
  var isAndroid = false;
  var androidVersion = -1;
  var support = [isAndroid, androidVersion];
  if (isWindowsPhone[0] || isIos[0] || !hasTouchEvents) {
    return support;
  }
  var pattern = /android/i;
  if (pattern.test(ua)) {
    isAndroid = true;
    var pattern2 = /android\s+(\d+)\./i;
    androidVersion = _filterVersion(pattern2, ua);
    support = [isAndroid, androidVersion];
  }
  return support;
};

var _video5 = function _video5() {
  try {
    if (typeof ENV.testVideo.canPlayType !== 'undefined') {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};
ENV.video5 = _video5();

var _okMp4 = function _okMp4(video5) {
  if (video5) {
    var canPlayType = ENV.testVideo.canPlayType('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
    if (canPlayType !== '') {
      return true;
    }
  }
  return false;
};
ENV.okMp4 = _okMp4(ENV.video5);

var _okWebM = function _okWebM(video5) {
  if (video5) {
    var canPlayType = ENV.testVideo.canPlayType('video/webm; codecs="vp8,vorbis"');
    if (canPlayType !== '') {
      return true;
    }
  }
  return false;
};
ENV.okWebM = _okWebM(ENV.video5);

var _okHls = function _okHls(video5, okMp4) {
  if (video5 && okMp4) {
    var isSupp1 = ENV.testVideo.canPlayType('application/vnd.apple.mpegurl');
    var isSupp2 = ENV.testVideo.canPlayType('application/x-mpegurl');
    if (isSupp1 !== '' || isSupp2 !== '') {
      return true;
    }
  }
  return false;
};
ENV.okHls = _okHls(ENV.video5, ENV.okMp4);

var _hasNativeFullscreenSupport = function _hasNativeFullscreenSupport() {
  var doc = document.documentElement;
  if (doc) {
    if (typeof doc.requestFullscreen !== 'undefined' || typeof doc.webkitRequestFullscreen !== 'undefined' || typeof doc.mozRequestFullScreen !== 'undefined' || typeof doc.msRequestFullscreen !== 'undefined' || typeof ENV.testVideo.webkitEnterFullscreen !== 'undefined') {
      return true;
    }
  }
  return false;
};
ENV.hasNativeFullscreenSupport = _hasNativeFullscreenSupport();

ENV.requestFullscreen = function (container, video) {
  if (container && video) {
    if (typeof container.requestFullscreen !== 'undefined') {
      container.requestFullscreen();
    } else if (typeof container.webkitRequestFullscreen !== 'undefined') {
      container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (typeof container.mozRequestFullScreen !== 'undefined') {
      container.mozRequestFullScreen();
    } else if (typeof container.msRequestFullscreen !== 'undefined') {
      container.msRequestFullscreen();
    } else if (video && typeof video.webkitEnterFullscreen !== 'undefined') {
      video.webkitEnterFullscreen();
    }
  }
};

ENV.exitFullscreen = function (video) {
  if (typeof document.exitFullscreen !== 'undefined') {
    document.exitFullscreen();
  } else if (typeof document.webkitExitFullscreen !== 'undefined') {
    document.webkitExitFullscreen();
  } else if (typeof document.mozCancelFullScreen !== 'undefined') {
    document.mozCancelFullScreen();
  } else if (typeof document.msExitFullscreen !== 'undefined') {
    document.msExitFullscreen();
  } else if (video && typeof video.webkitExitFullscreen !== 'undefined') {
    video.webkitExitFullscreen();
  }
};

ENV.ua = _getUserAgent();
ENV.hasTouchEvents = _hasTouchEvents();
ENV.isWindowsPhone = _isWindowsPhone(ENV.ua, ENV.hasTouchEvents);
ENV.isIos = _isIos(ENV.ua, ENV.isWindowsPhone, ENV.hasTouchEvents);
ENV.isAndroid = _isAndroid(ENV.ua, ENV.isWindowsPhone, ENV.isIos, ENV.hasTouchEvents);

ENV.isMobile = false;
if (ENV.isIos[0] || ENV.isAndroid[0] || ENV.isWindowsPhone[0]) {
  ENV.isMobile = true;
}

exports.ENV = ENV;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FWVAST = undefined;

var _fw = require('./fw');

var FWVAST = {};

FWVAST.hasDOMParser = function () {
  if (typeof window.DOMParser !== 'undefined') {
    return true;
  }
  return false;
};

FWVAST.vastReadableTime = function (time) {
  if (_fw.FW.isNumber(time)) {
    var seconds = 0;
    var minutes = 0;
    var hours = 0;
    var ms = Math.floor(time % 1000);
    if (ms === 0) {
      ms = '000';
    } else if (ms < 10) {
      ms = '00' + ms;
    } else if (ms < 100) {
      ms = '0' + ms;
    } else {
      ms = ms.toString();
    }
    seconds = Math.floor(time * 1.0 / 1000);
    if (seconds > 59) {
      minutes = Math.floor(seconds * 1.0 / 60);
      seconds = seconds - minutes * 60;
    }
    if (seconds === 0) {
      seconds = '00';
    } else if (seconds < 10) {
      seconds = '0' + seconds;
    } else {
      seconds = seconds.toString();
    }
    if (minutes > 59) {
      hours = Math.floor(minutes * 1.0 / 60);
      minutes = minutes - hours * 60;
    }
    if (minutes === 0) {
      minutes = '00';
    } else if (minutes < 10) {
      minutes = '0' + minutes;
    } else {
      minutes = minutes.toString();
    }
    if (hours === 0) {
      hours = '00';
    } else if (hours < 10) {
      hours = '0' + hours;
    } else {
      if (hours > 23) {
        hours = '00';
      } else {
        hours = hours.toString();
      }
    }
    return hours + ':' + minutes + ':' + seconds + '.' + ms;
  } else {
    return '00:00:00.000';
  }
};

FWVAST.generateCacheBusting = function () {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

FWVAST.getNodeValue = function (element, http) {
  var childNodes = element.childNodes;
  var value = '';
  // sometimes we have may several nodes - some of which may hold whitespaces
  for (var i = 0, len = childNodes.length; i < len; i++) {
    if (childNodes[i] && childNodes[i].textContent) {
      value += childNodes[i].textContent.trim();
    }
  }
  if (value) {
    // in case we have some leftovers CDATA - not sure this check needs to be done 
    var pattern = /^<!\[CDATA\[.*\]\]>$/i;
    if (pattern.test(value)) {
      value = value.replace('<![CDATA[', '').replace(']]>', '');
    }
    if (http) {
      var httpPattern = /^(https?:)?\/\//i;
      if (httpPattern.test(value)) {
        return value;
      }
    } else {
      return value;
    }
  }
  return null;
};

FWVAST.RFC3986EncodeURIComponent = function (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
};

FWVAST.isValidOffset = function (offset) {
  // HH:MM:SS or HH:MM:SS.mmm
  var skipPattern1 = /^\d+:\d+:\d+(\.\d+)?$/i;
  // n%
  var skipPattern2 = /^\d+%$/i;
  if (skipPattern1.test(offset) || skipPattern2.test(offset)) {
    return true;
  }
  return false;
};

FWVAST.convertOffsetToSeconds = function (offset, duration) {
  // HH:MM:SS or HH:MM:SS.mmm
  var skipPattern1 = /^\d+:\d+:\d+(\.\d+)?$/i;
  // n%
  var skipPattern2 = /^\d+%$/i;
  var seconds = 0;
  if (skipPattern1.test(offset)) {
    // remove .mmm
    var splitNoMS = offset.split('.');
    splitNoMS = splitNoMS[0];
    var splitTime = splitNoMS.split(':');
    seconds = parseInt(splitTime[0]) * 60 * 60 + parseInt(splitTime[1]) * 60 + parseInt(splitTime[2]);
  } else if (skipPattern2.test(offset) && duration > 0) {
    var percent = offset.split('%');
    percent = parseInt(percent[0]);
    seconds = Math.round(duration * percent / 100);
  }
  return seconds;
};

FWVAST.dispatchPingEvent = function (event) {
  if (event) {
    var element = void 0;
    if (this.adIsLinear && this.vastPlayer) {
      element = this.vastPlayer;
    } else if (!this.adIsLinear && this.nonLinearCreative) {
      element = this.nonLinearCreative;
    }
    if (element) {
      if (Array.isArray(event)) {
        event.forEach(function (currentEvent) {
          _fw.FW.createStdEvent(currentEvent, element);
        });
      } else {
        _fw.FW.createStdEvent(event, element);
      }
    }
  }
};

FWVAST.logPerformance = function (data) {
  if (window.performance && typeof window.performance.now === 'function') {
    var output = '';
    if (data) {
      output += data;
    }
    _fw.FW.log(output + ' - ' + Math.round(window.performance.now()) + ' ms');
  }
};

exports.FWVAST = FWVAST;

},{"./fw":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var FW = {};

FW.isNumber = function (n) {
  if (typeof n === 'number' && isFinite(n)) {
    return true;
  }
  return false;
};

FW.addClass = function (element, className) {
  if (element && typeof className === 'string') {
    if (element.className) {
      if (element.className.indexOf(className) === -1) {
        element.className = (element.className + ' ' + className).replace(/\s\s+/g, ' ');
      }
    } else {
      element.className = className;
    }
  }
};

FW.removeClass = function (element, className) {
  if (element && typeof className === 'string') {
    if (element.className.indexOf(className) > -1) {
      element.className = element.className.replace(className, '').replace(/\s\s+/g, ' ');
    }
  }
};

FW.hasClass = function (element, className) {
  if (element && typeof element.className === 'string' && typeof className === 'string') {
    if (element.className.indexOf(className) > -1) {
      return true;
    }
    return false;
  }
};

FW.createStdEvent = function (eventName, element) {
  var event = void 0;
  if (element) {
    if (typeof window.Event === 'function') {
      try {
        event = new Event(eventName);
        element.dispatchEvent(event);
      } catch (e) {
        FW.trace(e);
      }
    } else {
      try {
        event = document.createEvent('Event');
        event.initEvent(eventName, true, true);
        element.dispatchEvent(event);
      } catch (e) {
        FW.trace(e);
      }
    }
  }
};

FW.getStyleAttributeData = function (element, style) {
  var styleAttributeData = FW.getComputedStyle(element, style) || 0;
  styleAttributeData = styleAttributeData.toString();
  if (styleAttributeData.indexOf('px') > -1) {
    styleAttributeData = styleAttributeData.replace('px', '');
  }
  return parseFloat(styleAttributeData);
};

FW.getWidth = function (element) {
  if (element) {
    if (typeof element.offsetWidth === 'number' && element.offsetWidth !== 0) {
      return element.offsetWidth;
    } else {
      return FW.getStyleAttributeData(element, 'width');
    }
  }
  return 0;
};

FW.getHeight = function (element) {
  if (element) {
    if (typeof element.offsetHeight === 'number' && element.offsetHeight !== 0) {
      return element.offsetHeight;
    } else {
      return FW.getStyleAttributeData(element, 'height');
    }
  }
  return 0;
};
FW.getComputedStyle = function (element, style) {
  var cs = '';
  if (element) {
    cs = window.getComputedStyle(element, null).getPropertyValue(style);
    cs = cs.toString().toLowerCase();
  }
  return cs;
};

FW.show = function (element) {
  if (element) {
    element.style.display = 'block';
  }
};

FW.hide = function (element) {
  if (element) {
    element.style.display = 'none';
  }
};

FW.isEmptyObject = function (obj) {
  if (Object.keys(obj).length === 0 && obj.constructor === Object) {
    return true;
  }
  return false;
};

FW.ajax = function (url, timeout, returnData, withCredentials) {
  return new Promise(function (resolve, reject) {
    if (window.XMLHttpRequest) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.timeout = timeout;
      if (withCredentials) {
        xhr.withCredentials = true;
      }
      xhr.onloadend = function () {
        if (typeof xhr.status === 'number' && xhr.status >= 200 && xhr.status < 300) {
          if (typeof xhr.responseText === 'string' && xhr.responseText !== '') {
            if (returnData) {
              resolve(xhr.responseText);
            } else {
              resolve();
            }
          } else {
            reject();
          }
        } else {
          reject();
        }
      };
      xhr.ontimeout = function () {
        FW.log('RMP: XMLHttpRequest timeout');
        reject();
      };
      xhr.send(null);
    } else {
      reject();
    }
  });
};

FW.log = function (data) {
  if (data && window.console && typeof window.console.log === 'function') {
    window.console.log(data);
  }
};

FW.trace = function (data) {
  if (data && window.console && typeof window.console.trace === 'function') {
    window.console.trace(data);
  }
};

FW.removeIndexFromArray = function (arrayInput, indexArrayInput) {
  var array = arrayInput;
  var indexArray = indexArrayInput;
  indexArray.sort(function (a, b) {
    return b - a;
  });
  for (var i = 0; i < indexArray.length; i++) {
    array.splice(indexArray[i], 1);
  }
  return array;
};

FW.playPromise = function (video) {
  if (video) {
    var playPromise = video.play();
    // on Chrome 50+ play() returns a promise
    // https://developers.google.com/web/updates/2016/03/play-returns-promise
    // but not all browsers support this - so we just catch the potential Chrome error that 
    // may result if pause() is called in between - pause should overwrite play 
    // and in this case causes a promise rejection
    if (playPromise !== undefined) {
      playPromise.then(function () {
        if (DEBUG) {
          FW.log('RMP: playPromise on content has resolved');
        }
      }).catch(function (e) {
        if (DEBUG) {
          FW.log(e);
          FW.log('RMP: playPromise on content has been rejected');
        }
      });
    }
  }
};

exports.FW = FW;

},{}],9:[function(require,module,exports){
'use strict';

var _fw = require('./fw/fw');

var _env = require('./fw/env');

var _fwVast = require('./fw/fw-vast');

var _ping = require('./tracking/ping');

var _linear = require('./creatives/linear');

var _nonLinear = require('./creatives/non-linear');

var _trackingEvents2 = require('./tracking/tracking-events');

var _api = require('./api/api');

var _contentPlayer = require('./players/content-player');

var _reset = require('./utils/reset');

var _vastErrors = require('./utils/vast-errors');

window.DEBUG = true;

window.RmpVast = function (id, params) {
  if (typeof id !== 'string' || id === '') {
    _fw.FW.log('RMP-VAST: invalid id to create new instance - exit');
    return;
  }
  this.id = id;
  this.container = document.getElementById(this.id);
  this.content = this.container.getElementsByClassName('rmp-content')[0];
  this.contentPlayer = this.container.getElementsByClassName('rmp-video')[0];
  this.adContainer = null;
  this.isInFullscreen = false;
  this.vastPlayerInitialized = false;
  this.useContentPlayerForAds = false;
  if (_env.ENV.isIos[0]) {
    // on iOS we use content player to play ads
    // to avoid issues related to fullscreen management 
    // as fullscreen on iOS is handled by the default OS player
    this.useContentPlayerForAds = true;
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: vast player will be content player');
    }
  }
  // filter input params
  var defaultParams = {
    ajaxTimeout: 10000,
    ajaxWithCredentials: true,
    playsInline: true,
    debugLevel: 1,
    maxNumRedirects: 4,
    skipMessage: 'Skip ad',
    skipWaitingMessage: 'Skip ad in',
    textForClickUIOnMobile: 'Learn more'
  };
  this.params = defaultParams;
  if (params && !_fw.FW.isEmptyObject(params)) {
    if (_fw.FW.isNumber(params.ajaxTimeout) && params.ajaxTimeout > 0) {
      this.params.ajaxTimeout = params.ajaxTimeout;
    }
    if (typeof params.ajaxWithCredentials === 'boolean') {
      this.params.ajaxWithCredentials = params.ajaxWithCredentials;
    }
    if (typeof params.playsInline === 'boolean') {
      this.params.playsInline = params.playsInline;
    }
    if (_fw.FW.isNumber(params.debugLevel) && params.debugLevel === 2) {
      this.params.debugLevel = params.debugLevel;
    }
    if (_fw.FW.isNumber(params.maxNumRedirects) && params.maxNumRedirects > 0 && params.maxNumRedirects !== 4) {
      this.params.maxNumRedirects = params.maxNumRedirects;
    }
    if (typeof params.skipMessage === 'string') {
      this.params.skipMessage = params.skipMessage;
    }
    if (typeof params.skipWaitingMessage === 'string') {
      this.params.skipWaitingMessage = params.skipWaitingMessage;
    }
    if (typeof params.textForClickUIOnMobile === 'string') {
      this.params.textForClickUIOnMobile = params.textForClickUIOnMobile;
    }
  }
  // reset internal variables
  _reset.RESET.internalVariables.call(this);
};

// enrich RmpVast prototype with API methods
var apiKeys = Object.keys(_api.API);
for (var i = 0, len = apiKeys.length; i < len; i++) {
  var currentKey = apiKeys[i];
  window.RmpVast.prototype[currentKey] = _api.API[currentKey];
}

var _execRedirect = function _execRedirect() {
  _api.API.createEvent.call(this, 'adfollowingredirect');
  var redirectUrl = _fwVast.FWVAST.getNodeValue(this.vastAdTagURI[0], true);
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: redirect URL is ' + redirectUrl);
  }
  if (redirectUrl !== null) {
    if (this.params.maxNumRedirects > this.redirectsFollowed) {
      this.redirectsFollowed++;
      this.loadAds(redirectUrl);
    } else {
      // Wrapper limit reached, as defined by maxNumRedirects
      _ping.PING.error.call(this, 302, this.inlineOrWrapperErrorTags);
      _vastErrors.VASTERRORS.process.call(this, 302);
    }
  } else {
    // not a valid redirect URI - ping for error
    _ping.PING.error.call(this, 300, this.inlineOrWrapperErrorTags);
    _vastErrors.VASTERRORS.process.call(this, 300);
  }
};

var _parseCreatives = function _parseCreatives(creative) {
  for (var _i = 0, _len = creative.length; _i < _len; _i++) {
    var currentCreative = creative[_i];
    //let creativeID = currentCreative[0].getAttribute('id');
    //let creativeSequence = currentCreative[0].getAttribute('sequence');
    //let creativeAdId = currentCreative[0].getAttribute('adId');
    //let creativeApiFramework = currentCreative[0].getAttribute('apiFramework');
    // we only pick the first creative that is either Linear or NonLinearAds
    var nonLinearAds = currentCreative.getElementsByTagName('NonLinearAds');
    var linear = currentCreative.getElementsByTagName('Linear');
    // we expect only 1 Linear or NonLinearAds tag 
    if (nonLinearAds.length !== 1 && linear.length !== 1) {
      _ping.PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
      _vastErrors.VASTERRORS.process.call(this, 101);
      return;
    }
    if (nonLinearAds.length === 1) {
      var trackingEvents = nonLinearAds[0].getElementsByTagName('TrackingEvents');
      // if present only one TrackingEvents is expected
      if (trackingEvents.length === 1) {
        _trackingEvents2.TRACKINGEVENTS.filter.call(this, trackingEvents);
      }
      if (this.isWrapper) {
        _execRedirect.call(this);
        return;
      }
      _nonLinear.NONLINEAR.parse.call(this, nonLinearAds);
      return;
    } else if (linear.length === 1) {
      // check for skippable ads (Linear skipoffset)
      var skipoffset = linear[0].getAttribute('skipoffset');
      if (this.params.skipMessage !== '' && skipoffset !== null && skipoffset !== '' && _fwVast.FWVAST.isValidOffset(skipoffset)) {
        if (DEBUG) {
          _fw.FW.log('RMP-VAST: skippable ad detected with offset ' + skipoffset);
        }
        this.isSkippableAd = true;
        this.skipoffset = skipoffset;
        // we  do not display skippable ads when useContentPlayerForAds is true
        if (this.useContentPlayerForAds) {
          _ping.PING.error.call(this, 200, this.inlineOrWrapperErrorTags);
          _vastErrors.VASTERRORS.process.call(this, 200);
          return;
        }
      }

      // TrackingEvents
      var _trackingEvents = linear[0].getElementsByTagName('TrackingEvents');
      // if present only one TrackingEvents is expected
      if (_trackingEvents.length === 1) {
        _trackingEvents2.TRACKINGEVENTS.filter.call(this, _trackingEvents);
      }

      // VideoClicks for linear
      var videoClicks = linear[0].getElementsByTagName('VideoClicks');
      if (videoClicks.length === 1) {
        var clickThrough = videoClicks[0].getElementsByTagName('ClickThrough');
        var clickTracking = videoClicks[0].getElementsByTagName('ClickTracking');
        if (clickThrough.length === 1) {
          this.clickThroughUrl = _fwVast.FWVAST.getNodeValue(clickThrough[0], true);
        }
        if (clickTracking.length > 0) {
          for (var _i2 = 0, _len2 = clickTracking.length; _i2 < _len2; _i2++) {
            var clickTrackingUrl = _fwVast.FWVAST.getNodeValue(clickTracking[_i2], true);
            if (clickTrackingUrl !== null) {
              this.trackingTags.push({ event: 'clickthrough', url: clickTrackingUrl });
            }
          }
        }
      }

      // return on wrapper
      if (this.isWrapper) {
        _execRedirect.call(this);
        return;
      }
      _linear.LINEAR.parse.call(this, linear);
      return;
    }
  }
};

var _onXmlAvailable = function _onXmlAvailable(xml) {
  // check for VAST node
  this.vastDocument = xml.getElementsByTagName('VAST');
  if (this.vastDocument.length !== 1) {
    _vastErrors.VASTERRORS.process.call(this, 100);
    return;
  }
  // VAST/Error node
  var errorNode = this.vastDocument[0].getElementsByTagName('Error');
  if (errorNode.length === 1) {
    var errorUrl = _fwVast.FWVAST.getNodeValue(errorNode[0], true);
    if (errorUrl !== null) {
      this.vastErrorTags.push({ event: 'error', url: errorUrl });
    }
  }
  //check for VAST version 2 or 3
  var pattern = /^(2|3)\./i;
  var version = this.vastDocument[0].getAttribute('version');
  if (!pattern.test(version)) {
    _ping.PING.error.call(this, 102, this.vastErrorTags);
    _vastErrors.VASTERRORS.process.call(this, 102);
    return;
  }
  // if empty VAST return
  var ad = this.vastDocument[0].getElementsByTagName('Ad');
  if (ad.length === 0) {
    _ping.PING.error.call(this, 303, this.vastErrorTags);
    _vastErrors.VASTERRORS.process.call(this, 303);
    return;
  }
  // filter Ad and AdPod
  var retainedAd = void 0;
  var adPod = [];
  for (var _i3 = 0, _len3 = ad.length; _i3 < _len3; _i3++) {
    var sequence = ad[_i3].getAttribute('sequence');
    if ((sequence === '' || sequence === null) && !retainedAd) {
      // the first standalone ad (without sequence attribute) is the good one
      retainedAd = ad[_i3];
    } else {
      // if it has sequence attribute then push to adPod array (ad pod will be skipped)
      adPod.push(ad[_i3]);
    }
  }
  if (!retainedAd) {
    // we ping Error for each detected item within the Ad Pods as required by spec
    for (var _i4 = 0, _len4 = adPod.length; _i4 < _len4; _i4++) {
      var _inline = adPod[_i4].getElementsByTagName('InLine');
      var _wrapper = adPod[_i4].getElementsByTagName('Wrapper');
      if (_inline.length === 1 || _wrapper.length === 1) {
        _ping.PING.error.call(this, 200, this.vastErrorTags);
      }
    }
    _vastErrors.VASTERRORS.process.call(this, 200);
    return;
  }
  //let adId = retainedAd[0].getAttribute('id');
  var inline = retainedAd.getElementsByTagName('InLine');
  var wrapper = retainedAd.getElementsByTagName('Wrapper');
  // only 1 InLine or Wrapper element must be present 
  if (inline.length !== 1 && wrapper.length !== 1) {
    _ping.PING.error.call(this, 101, this.vastErrorTags);
    _vastErrors.VASTERRORS.process.call(this, 101);
    return;
  }
  var inlineOrWrapper = void 0;
  if (wrapper.length === 1) {
    this.isWrapper = true;
    inlineOrWrapper = wrapper;
    this.vastAdTagURI = inlineOrWrapper[0].getElementsByTagName('VASTAdTagURI');
  } else {
    inlineOrWrapper = inline;
  }
  var adSystem = inlineOrWrapper[0].getElementsByTagName('AdSystem');
  var impression = inlineOrWrapper[0].getElementsByTagName('Impression');
  // VAST/Ad/InLine/Error node
  errorNode = inlineOrWrapper[0].getElementsByTagName('Error');
  if (errorNode.length === 1) {
    var _errorUrl = _fwVast.FWVAST.getNodeValue(errorNode[0], true);
    if (_errorUrl !== null) {
      this.inlineOrWrapperErrorTags.push({ event: 'error', url: _errorUrl });
    }
  }
  var adTitle = inlineOrWrapper[0].getElementsByTagName('AdTitle');
  var adDescription = inlineOrWrapper[0].getElementsByTagName('Description');
  var creatives = inlineOrWrapper[0].getElementsByTagName('Creatives');
  //let extensions = inline[0].getElementsByTagName('Extensions');

  // Required InLine Elements are AdSystem, AdTitle, Impression, Creatives
  // Required Wrapper Elements are AdSystem, vastAdTagURI, Impression
  // if not present exit and ping InLine/Wrapper Error element
  if (this.isWrapper) {
    if (adSystem.length !== 1 || this.vastAdTagURI.length !== 1 || impression.length !== 1) {
      _ping.PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
      _vastErrors.VASTERRORS.process.call(this, 101);
      return;
    }
  } else {
    if (adSystem.length !== 1 || adTitle.length !== 1 || impression.length !== 1 || creatives.length < 1) {
      _ping.PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
      _vastErrors.VASTERRORS.process.call(this, 101);
      return;
    }
  }

  var creative = void 0;
  if (creatives.length === 1) {
    creative = creatives[0].getElementsByTagName('Creative');
    // at least one creative tag is expected for InLine
    if (!this.isWrapper && creative.length < 1) {
      _ping.PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
      _vastErrors.VASTERRORS.process.call(this, 101);
      return;
    }
  }

  this.adSystem = _fwVast.FWVAST.getNodeValue(adSystem[0], false);
  var impressionUrl = _fwVast.FWVAST.getNodeValue(impression[0], true);
  if (impressionUrl !== null) {
    this.trackingTags.push({ event: 'impression', url: impressionUrl });
  }
  if (!this.isWrapper) {
    this.adTitle = _fwVast.FWVAST.getNodeValue(adTitle[0], false);
    this.adDescription = _fwVast.FWVAST.getNodeValue(adDescription[0], false);
  }
  // in case no Creative with Wrapper we make our redirect call here
  if (this.isWrapper && !creative) {
    _execRedirect.call(this);
    return;
  }
  _parseCreatives.call(this, creative);
};

RmpVast.prototype.loadAds = function (vastUrl) {
  var _this = this;

  if (typeof vastUrl !== 'string' || vastUrl === '') {
    _vastErrors.VASTERRORS.process.call(this, 1001);
    return;
  }
  if (!_fwVast.FWVAST.hasDOMParser()) {
    _vastErrors.VASTERRORS.process.call(this, 1002);
    return;
  }
  // if we try to load ads when currentTime < 200 ms - be it linear or non-linear - we pause CONTENTPLAYER
  // CONTENTPLAYER (non-linear) or VASTPLAYER (linear) will resume later when VAST has finished loading/parsing
  // this is to avoid bad user experience where content may start for a few ms before ad starts
  var contentCurrentTime = _contentPlayer.CONTENTPLAYER.getCurrentTime.call(this);
  if (contentCurrentTime < 200) {
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: pause content for pre-roll while processing loadAds');
    }
    _contentPlayer.CONTENTPLAYER.pause.call(this);
  }
  // for useContentPlayerForAds we need to know early what is the content src
  // so that we can resume content when ad finishes or on aderror
  if (this.useContentPlayerForAds) {
    if (this.contentPlayer.currentSrc) {
      this.currentContentSrc = this.contentPlayer.currentSrc;
    } else if (this.contentPlayer.src) {
      this.currentContentSrc = this.contentPlayer.src;
    } else {
      _vastErrors.VASTERRORS.process.call(this, 1003);
      return;
    }
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: currentContentSrc is ' + this.currentContentSrc);
    }
    this.currentContentCurrentTime = contentCurrentTime;
  }
  // if we already have an ad on stage - we need to destroy it first 
  if (this.adOnStage) {
    _api.API.stopAds.call(this);
  }
  _api.API.createEvent.call(this, 'adtagstartloading');
  this.isWrapper = false;
  this.vastAdTagURI = null;
  this.adTagUrl = vastUrl;
  _fw.FW.ajax(this.adTagUrl, this.params.ajaxTimeout, true, this.params.ajaxWithCredentials).then(function (data) {
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: VAST loaded from ' + _this.adTagUrl);
    }
    _api.API.createEvent.call(_this, 'adtagloaded');
    var xml = void 0;
    try {
      // Parse XML
      var parser = new DOMParser();
      xml = parser.parseFromString(data, 'text/xml');
      if (DEBUG) {
        _fw.FW.log('RMP-VAST: parsed XML document follows');
        _fw.FW.log(xml);
      }
    } catch (e) {
      _fw.FW.trace(e);
      _vastErrors.VASTERRORS.process.call(_this, 100);
      return;
    }
    _onXmlAvailable.call(_this, xml);
  }).catch(function (e) {
    _fw.FW.trace(e);
    _vastErrors.VASTERRORS.process.call(_this, 1000);
  });
};

},{"./api/api":1,"./creatives/linear":3,"./creatives/non-linear":4,"./fw/env":6,"./fw/fw":8,"./fw/fw-vast":7,"./players/content-player":10,"./tracking/ping":12,"./tracking/tracking-events":13,"./utils/reset":14,"./utils/vast-errors":15}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CONTENTPLAYER = undefined;

var _fw = require('../fw/fw');

var CONTENTPLAYER = {};

CONTENTPLAYER.play = function () {
  if (this.contentPlayer.paused) {
    _fw.FW.playPromise(this.contentPlayer);
  }
};

CONTENTPLAYER.pause = function () {
  if (!this.contentPlayer.paused) {
    this.contentPlayer.pause();
  }
};

CONTENTPLAYER.setVolume = function (level) {
  this.contentPlayer.volume = level;
};

CONTENTPLAYER.getVolume = function () {
  return this.contentPlayer.volume;
};

CONTENTPLAYER.getMute = function () {
  return this.contentPlayer.muted;
};

CONTENTPLAYER.setMute = function (muted) {
  if (muted && !this.contentPlayer.muted) {
    this.contentPlayer.muted = true;
  } else if (!muted && this.contentPlayer.muted) {
    this.contentPlayer.muted = false;
  }
};

CONTENTPLAYER.getDuration = function () {
  var duration = this.contentPlayer.duration;
  if (_fw.FW.isNumber(duration)) {
    return Math.round(duration * 1000);
  }
  return -1;
};

CONTENTPLAYER.getCurrentTime = function () {
  var currentTime = this.contentPlayer.currentTime;
  if (_fw.FW.isNumber(currentTime)) {
    return Math.round(currentTime * 1000);
  }
  return -1;
};

CONTENTPLAYER.seekTo = function (msSeek) {
  if (!_fw.FW.isNumber(msSeek)) {
    return;
  }
  if (msSeek >= 0) {
    var seekValue = Math.round(msSeek / 1000 * 100) / 100;
    try {
      this.contentPlayer.currentTime = seekValue;
    } catch (e) {
      _fw.FW.trace(e);
    }
  }
};

exports.CONTENTPLAYER = CONTENTPLAYER;

},{"../fw/fw":8}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VASTPLAYER = undefined;

var _fw = require('../fw/fw');

var _fwVast = require('../fw/fw-vast');

var _env = require('../fw/env');

var _contentPlayer = require('../players/content-player');

var _icons = require('../creatives/icons');

var _reset = require('../utils/reset');

var _trackingEvents = require('../tracking/tracking-events');

var _nonLinear = require('../creatives/non-linear');

var _linear = require('../creatives/linear');

var _api = require('../api/api');

var _vastErrors = require('../utils/vast-errors');

var VASTPLAYER = {};

var _onPlayingSeek = function _onPlayingSeek() {
  this.contentPlayer.removeEventListener('playing', this.onPlayingSeek);
  _contentPlayer.CONTENTPLAYER.seekTo.call(this, this.currentContentCurrentTime);
};

var _destroyVastPlayer = function _destroyVastPlayer() {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: start destroying vast player');
  }
  // destroy icons if any 
  if (this.icons.length > 0) {
    _icons.ICONS.destroy.call(this);
  }
  // unwire events
  _reset.RESET.unwireVastPlayerEvents.call(this);
  // remove clickUI on mobile
  if (this.clickUIOnMobile) {
    this.adContainer.removeChild(this.clickUIOnMobile);
  }
  // hide rmp-ad-container
  _fw.FW.hide(this.adContainer);
  if (this.useContentPlayerForAds) {
    if (this.currentContentCurrentTime > 200) {
      this.onPlayingSeek = _onPlayingSeek.bind(this);
      this.contentPlayer.addEventListener('playing', this.onPlayingSeek);
    }
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: recovering content with src ' + this.currentContentSrc);
    }
    this.contentPlayer.src = this.currentContentSrc;
    this.contentPlayer.load();
  } else {
    this.vastPlayer.pause();
    _fw.FW.hide(this.vastPlayer);
    // empty buffer for vastPlayer
    try {
      if (this.vastPlayer && this.vastPlayerSource) {
        if (this.vastPlayerSource.hasAttribute('src')) {
          this.vastPlayerSource.removeAttribute('src');
          this.vastPlayer.load();
          if (DEBUG) {
            _fw.FW.log('RMP-VAST: emptied VAST player buffer');
          }
        }
      }
      if (this.nonLinearCreative) {
        this.adContainer.removeChild(this.nonLinearCreative);
      }
    } catch (e) {
      _fw.FW.trace(e);
    }
  }
  // reset internal variables for next ad if any
  _reset.RESET.internalVariables.call(this);
  _api.API.createEvent.call(this, 'addestroyed');
};

VASTPLAYER.init = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: init called on VASTPLAYER');
  }
  if (!this.adContainer) {
    this.adContainer = document.createElement('div');
    this.adContainer.className = 'rmp-ad-container';
    this.content.appendChild(this.adContainer);
  }
  _fw.FW.hide(this.adContainer);
  if (!this.useContentPlayerForAds) {
    this.vastPlayer = document.createElement('video');
    this.vastPlayer.className = 'rmp-ad-vast-video-player';
    if (!_env.ENV.isMobile) {
      this.vastPlayer.style.cursor = 'pointer';
    }
    _fw.FW.hide(this.vastPlayer);
    this.vastPlayer.controls = false;
    if (this.contentPlayer.muted) {
      this.vastPlayer.muted = true;
    }
    this.vastPlayer.setAttribute('x-webkit-airplay', 'allow');
    if (this.params.playsInline) {
      if (typeof this.vastPlayer.playsInline === 'boolean') {
        this.vastPlayer.setAttribute('playsinline', true);
      } else {
        // TO REVIEW
        this.vastPlayer.setAttribute('webkit-playsinline', true);
      }
    }
    this.vastPlayer.preload = 'auto';
    this.vastPlayer.defaultPlaybackRate = 1;
    if (_env.ENV.isMobile) {
      if (DEBUG) {
        _fw.FW.log('RMP-VAST: fake start for mobiles to init video tag');
      }
      _fw.FW.playPromise(this.vastPlayer);
      this.vastPlayer.pause();
    }
  } else {
    this.vastPlayer = this.contentPlayer;
  }
  this.vastPlayerInitialized = true;
};

VASTPLAYER.append = function (url, type) {
  // this is for autoplay on desktop
  // or muted autoplay on mobile where player is not initialize
  if (!this.vastPlayerInitialized) {
    VASTPLAYER.init.call(this);
  }
  // in case loadAds is called several times - vastPlayerInitialized is already true
  // but we still need to locate the vastPlayer
  if (!this.vastPlayer) {
    if (this.useContentPlayerForAds) {
      this.vastPlayer = this.contentPlayer;
    } else {
      var existingVastPlayer = this.adContainer.getElementsByClassName('rmp-ad-vast-video-player')[0];
      if (!existingVastPlayer) {
        _vastErrors.VASTERRORS.process.call(this, 1004);
        return;
      }
      this.vastPlayer = existingVastPlayer;
    }
  }
  if (!this.adIsLinear) {
    _nonLinear.NONLINEAR.update.call(this);
  } else {
    if (url && type) {
      _linear.LINEAR.update.call(this, url, type);
    }
  }
  // wire tracking events
  _trackingEvents.TRACKINGEVENTS.wire.call(this);

  // append icons - only where vast player is different from 
  // content player
  if (!this.useContentPlayerForAds && this.icons.length > 0) {
    _icons.ICONS.append.call(this);
  }
};

VASTPLAYER.setVolume = function (level) {
  this.vastPlayer.volume = level;
};

VASTPLAYER.getVolume = function () {
  return this.vastPlayer.volume;
};

VASTPLAYER.setMute = function (muted) {
  if (muted && !this.vastPlayer.muted) {
    this.vastPlayer.muted = true;
    _fwVast.FWVAST.dispatchPingEvent.call(this, 'mute');
  } else if (!muted && this.vastPlayer.muted) {
    this.vastPlayer.muted = false;
    _fwVast.FWVAST.dispatchPingEvent.call(this, 'unmute');
  }
};

VASTPLAYER.getMute = function () {
  return this.vastPlayer.muted;
};

VASTPLAYER.play = function () {
  if (this.vastPlayer.paused) {
    _fw.FW.playPromise(this.vastPlayer);
  }
};

VASTPLAYER.pause = function () {
  if (!this.vastPlayer.paused) {
    this.vastPlayer.pause();
  }
};

VASTPLAYER.getDuration = function () {
  var duration = this.vastPlayer.duration;
  if (_fw.FW.isNumber(duration)) {
    return Math.round(duration * 1000);
  }
  return -1;
};

VASTPLAYER.getCurrentTime = function () {
  var currentTime = this.vastPlayer.currentTime;
  if (_fw.FW.isNumber(currentTime)) {
    return Math.round(currentTime * 1000);
  }
  return -1;
};

var _onReset = function _onReset() {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: processing onReset after adcontentresumerequested');
  }
  if (this.vastPlayer) {
    this.vastPlayer.removeEventListener('reset', this.onReset);
  }
  _destroyVastPlayer.call(this);
  _contentPlayer.CONTENTPLAYER.play.call(this);
};

VASTPLAYER.resumeContent = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: resumeContent');
  }
  this.onReset = _onReset.bind(this);
  if (this.readyForReset) {
    this.onReset();
  } else {
    // in case we need to wait for the ping on complete/skip
    this.vastPlayer.addEventListener('reset', this.onReset);
  }
};

exports.VASTPLAYER = VASTPLAYER;

},{"../api/api":1,"../creatives/icons":2,"../creatives/linear":3,"../creatives/non-linear":4,"../fw/env":6,"../fw/fw":8,"../fw/fw-vast":7,"../players/content-player":10,"../tracking/tracking-events":13,"../utils/reset":14,"../utils/vast-errors":15}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PING = undefined;

var _fw = require('../fw/fw');

var _fwVast = require('../fw/fw-vast');

var _contentPlayer = require('../players/content-player');

var PING = {};

PING.events = ['impression', 'creativeView', 'start', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete', 'mute', 'unmute', 'pause', 'resume', 'fullscreen', 'exitFullscreen', 'skip', 'progress', 'clickthrough'];

var _replaceMacros = function _replaceMacros(url, errorCode, assetUri) {
  var pattern1 = /\[CACHEBUSTING\]/gi;
  var finalString = url;
  if (pattern1.test(finalString)) {
    finalString = finalString.replace(pattern1, _fwVast.FWVAST.generateCacheBusting());
  }
  var pattern2 = /\[ERRORCODE\]/gi;
  if (pattern2.test(finalString) && typeof errorCode === 'number' && errorCode > 0 && errorCode < 1000) {
    finalString = finalString.replace(pattern2, errorCode);
  }
  var pattern3 = /\[CONTENTPLAYHEAD\]/gi;
  var currentTime = _contentPlayer.CONTENTPLAYER.getCurrentTime.call(this);
  if (pattern3.test(finalString) && currentTime > -1) {
    currentTime = _fwVast.FWVAST.vastReadableTime(currentTime);
    finalString = finalString.replace(pattern3, _fwVast.FWVAST.RFC3986EncodeURIComponent(currentTime));
  }
  var pattern4 = /\[ASSETURI\]/gi;
  if (pattern4.test(finalString) && typeof assetUri === 'string' && assetUri !== '') {
    finalString = finalString.replace(pattern4, _fwVast.FWVAST.RFC3986EncodeURIComponent(assetUri));
  }
  return finalString;
};

var _ping = function _ping(url, timeout, debugLevel) {
  var img = new Image();
  img.addEventListener('load', function () {
    if (DEBUG) {
      if (debugLevel === 2) {
        _fw.FW.log('RMP-VAST: VAST tracker successfully loaded ' + url);
      }
    }
    img = null;
  });
  img.addEventListener('error', function () {
    if (DEBUG) {
      if (debugLevel === 2) {
        _fw.FW.log('RMP-VAST: VAST tracker failed loading ' + url);
      }
    }
    img = null;
  });
  img.src = url;
};

PING.tracking = function (url, assetUri) {
  var trackingUrl = _replaceMacros.call(this, url, null, assetUri);
  _ping(trackingUrl, this.params.debugLevel);
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VAST tracking requesting ping at URL ' + trackingUrl);
  }
};

PING.error = function (errorCode, errorTags) {
  // for each Error tag within an InLine or chain of Wrapper ping error URL
  if (errorTags && errorTags.length > 0) {
    for (var i = 0, len = errorTags.length; i < len; i++) {
      var errorUrl = _replaceMacros.call(this, errorTags[i].url, errorCode, null);
      _ping(errorUrl, this.params.debugLevel);
      if (DEBUG) {
        _fw.FW.log('RMP-VAST: VAST tracking requesting error at URL ' + errorUrl);
      }
    }
  }
};

exports.PING = PING;

},{"../fw/fw":8,"../fw/fw-vast":7,"../players/content-player":10}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TRACKINGEVENTS = undefined;

var _fw = require('../fw/fw');

var _fwVast = require('../fw/fw-vast');

var _env = require('../fw/env');

var _ping = require('./ping');

var _api = require('../api/api');

var _vastPlayer = require('../players/vast-player');

var TRACKINGEVENTS = {};

var _pingTrackers = function _pingTrackers(trackers) {
  var _this = this;

  trackers.forEach(function (element) {
    _ping.PING.tracking.call(_this, element.url, _this.adMediaUrl);
  });
};

var _onEventPingTracking = function _onEventPingTracking(event) {
  var _this2 = this;

  if (event && event.type) {
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: ping tracking for ' + event.type + ' VAST event');
    }
    // filter trackers - may return multiple urls for same event as allowed by VAST spec
    var trackers = this.trackingTags.filter(function (value) {
      return event.type === value.event;
    });
    // send ping for each valid tracker
    if (trackers.length > 0) {
      // we need to filter pause event - because it can fire just before HTML5 video ended event 
      // and according to VAST spec we should not ping for this pause event - only for user initiated pause
      if (this.vastPlayer && event.type === 'pause') {
        clearTimeout(this.adPauseEventTimeout);
        this.adPauseEventTimeout = setTimeout(function () {
          _pingTrackers.call(_this2, trackers);
        }, 200);
      } else {
        _pingTrackers.call(this, trackers);
      }
    }
    // we need to tell the player it is ok to destroy as all pings have been sent
    if (this.vastPlayer && (event.type === 'complete' || event.type === 'skip')) {
      // in case a pause event is due to be ping - cancel it now (see above)
      clearTimeout(this.adPauseEventTimeout);
      this.readyForReset = true;
      _fwVast.FWVAST.dispatchPingEvent.call(this, 'reset');
    }
  }
};

var _onVolumeChange = function _onVolumeChange() {
  if (this.vastPlayer.muted || this.vastPlayer.volume === 0) {
    _api.API.createEvent.call(this, 'advolumemuted');
    _fwVast.FWVAST.dispatchPingEvent.call(this, 'mute');
    this.vastPlayerMuted = true;
  } else {
    if (this.vastPlayerMuted) {
      _fwVast.FWVAST.dispatchPingEvent.call(this, 'unmute');
      this.vastPlayerMuted = false;
    }
  }
  _api.API.createEvent.call(this, 'advolumechanged');
};

var _onTimeupdate = function _onTimeupdate() {
  var _this3 = this;

  this.vastPlayerCurrentTime = _vastPlayer.VASTPLAYER.getCurrentTime.call(this);
  if (this.vastPlayerCurrentTime > 0) {
    if (this.vastPlayerDuration > 0 && this.vastPlayerDuration > this.vastPlayerCurrentTime) {
      if (this.vastPlayerCurrentTime >= this.vastPlayerDuration * 0.25 && !this.firstQuartileEventFired) {
        this.firstQuartileEventFired = true;
        _api.API.createEvent.call(this, 'adfirstquartile');
        _fwVast.FWVAST.dispatchPingEvent.call(this, 'firstQuartile');
      } else if (this.vastPlayerCurrentTime >= this.vastPlayerDuration * 0.5 && !this.midpointEventFired) {
        this.midpointEventFired = true;
        _api.API.createEvent.call(this, 'admidpoint');
        _fwVast.FWVAST.dispatchPingEvent.call(this, 'midpoint');
      } else if (this.vastPlayerCurrentTime >= this.vastPlayerDuration * 0.75 && !this.thirdQuartileEventFired) {
        this.thirdQuartileEventFired = true;
        _api.API.createEvent.call(this, 'adthirdquartile');
        _fwVast.FWVAST.dispatchPingEvent.call(this, 'thirdQuartile');
      }
    }
    if (this.isSkippableAd) {
      // progress event for skippable ads
      if (this.progressEventOffsetsSeconds === null) {
        this.progressEventOffsetsSeconds = [];
        this.progressEventOffsets.forEach(function (element) {
          _this3.progressEventOffsetsSeconds.push({
            offsetSeconds: _fwVast.FWVAST.convertOffsetToSeconds(element, _this3.vastPlayerDuration),
            offsetRaw: element
          });
        });
        this.progressEventOffsetsSeconds.sort(function (a, b) {
          return a.offsetSeconds - b.offsetSeconds;
        });
      }
      if (Array.isArray(this.progressEventOffsetsSeconds) && this.progressEventOffsetsSeconds.length > 0 && this.vastPlayerCurrentTime >= this.progressEventOffsetsSeconds[0].offsetSeconds) {
        _fwVast.FWVAST.dispatchPingEvent.call(this, 'progress-' + this.progressEventOffsetsSeconds[0].offsetRaw);
        this.progressEventOffsetsSeconds.shift();
      }
    }
  }
};

var _onPause = function _onPause() {
  if (!this.vastPlayerPaused) {
    this.vastPlayerPaused = true;
    _api.API.createEvent.call(this, 'adpaused');
    // do not dispatchPingEvent for pause event here if it is already in this.trackingTags
    for (var i = 0, len = this.trackingTags.length; i < len; i++) {
      if (this.trackingTags[i].event === 'pause') {
        return;
      }
    }
    _fwVast.FWVAST.dispatchPingEvent.call(this, 'pause');
  }
};

var _onPlay = function _onPlay() {
  if (this.vastPlayerPaused) {
    this.vastPlayerPaused = false;
    _api.API.createEvent.call(this, 'adresumed');
    _fwVast.FWVAST.dispatchPingEvent.call(this, 'resume');
  }
};

var _onPlaying = function _onPlaying() {
  this.vastPlayer.removeEventListener('playing', this.onPlaying);
  _api.API.createEvent.call(this, 'adimpression');
  _api.API.createEvent.call(this, 'adstarted');
  _fwVast.FWVAST.dispatchPingEvent.call(this, ['impression', 'creativeView', 'start']);
};

var _onEnded = function _onEnded() {
  this.vastPlayer.removeEventListener('ended', this.onEnded);
  _api.API.createEvent.call(this, 'adcomplete');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'complete');
};

var _onFullscreenchange = function _onFullscreenchange(event) {
  if (event && event.type) {
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: event is ' + event.type + ' isInFullscreen before changes is ' + this.isInFullscreen);
    }
    if (event.type === 'fullscreenchange') {
      if (this.isInFullscreen) {
        this.isInFullscreen = false;
        _fw.FW.removeClass(this.container, 'rmp-fullscreen-on');
        if (this.adOnStage && this.adIsLinear) {
          _fwVast.FWVAST.dispatchPingEvent.call(this, 'exitFullscreen');
        }
      } else {
        this.isInFullscreen = true;
        _fw.FW.addClass(this.container, 'rmp-fullscreen-on');
        if (this.adOnStage && this.adIsLinear) {
          _fwVast.FWVAST.dispatchPingEvent.call(this, 'fullscreen');
        }
      }
    } else if (event.type === 'webkitbeginfullscreen') {
      this.isInFullscreen = true;
      if (this.adOnStage && this.adIsLinear) {
        _fwVast.FWVAST.dispatchPingEvent.call(this, 'fullscreen');
      }
    } else if (event.type === 'webkitendfullscreen') {
      this.isInFullscreen = false;
      if (this.adOnStage && this.adIsLinear) {
        _fwVast.FWVAST.dispatchPingEvent.call(this, 'exitFullscreen');
      }
    }
  }
};

TRACKINGEVENTS.wire = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: wire tracking events');
  }

  // we filter through all HTML5 video events and create new VAST events 
  // those VAST events are based on PING.events
  if (this.vastPlayer) {
    this.onPause = _onPause.bind(this);
    this.vastPlayer.addEventListener('pause', this.onPause);
    this.onPlay = _onPlay.bind(this);
    this.vastPlayer.addEventListener('play', this.onPlay);

    this.onPlaying = _onPlaying.bind(this);
    this.vastPlayer.addEventListener('playing', this.onPlaying);

    this.onEnded = _onEnded.bind(this);
    this.vastPlayer.addEventListener('ended', this.onEnded);

    this.onVolumeChange = _onVolumeChange.bind(this);
    this.vastPlayer.addEventListener('volumechange', this.onVolumeChange);

    this.onTimeupdate = _onTimeupdate.bind(this);
    this.vastPlayer.addEventListener('timeupdate', this.onTimeupdate);

    //if we have native fullscreen support we handle fullscreen events
    if (_env.ENV.hasNativeFullscreenSupport) {
      this.onFullscreenchange = _onFullscreenchange.bind(this);
      document.addEventListener('fullscreenchange', this.onFullscreenchange);
      // for our beloved iOS 
      if (this.useContentPlayerForAds) {
        this.vastPlayer.addEventListener('webkitbeginfullscreen', this.onFullscreenchange);
        this.vastPlayer.addEventListener('webkitendfullscreen', this.onFullscreenchange);
      }
    }
  }

  // wire for VAST tracking events
  this.onEventPingTracking = _onEventPingTracking.bind(this);
  for (var i = 0, len = this.trackingTags.length; i < len; i++) {
    if (this.vastPlayer) {
      this.vastPlayer.addEventListener(this.trackingTags[i].event, this.onEventPingTracking);
    } else if (this.nonLinearCreative) {
      // non linear
      this.nonLinearCreative.addEventListener(this.trackingTags[i].event, this.onEventPingTracking);
    }
  }
};

TRACKINGEVENTS.filter = function (trackingEvents) {
  var trackingTags = trackingEvents[0].getElementsByTagName('Tracking');
  // collect supported tracking events with valid event names and tracking urls
  for (var i = 0, len = trackingTags.length; i < len; i++) {
    var event = trackingTags[i].getAttribute('event');
    var url = _fwVast.FWVAST.getNodeValue(trackingTags[i], true);
    if (event !== null && event !== '' && _ping.PING.events.indexOf(event) > -1 && url !== null) {
      if (event === 'progress') {
        var offset = trackingTags[i].getAttribute('offset');
        if (offset === null || offset === '' || !_fwVast.FWVAST.isValidOffset(offset)) {
          // offset attribute is required on Tracking event="progress"
          continue;
        }
        this.progressEventOffsets.push(offset);
        event = event + '-' + offset;
      }
      this.trackingTags.push({ event: event, url: url });
    }
  }
};

exports.TRACKINGEVENTS = TRACKINGEVENTS;

},{"../api/api":1,"../fw/env":6,"../fw/fw":8,"../fw/fw-vast":7,"../players/vast-player":11,"./ping":12}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RESET = undefined;

var _env = require('../fw/env');

var _fw = require('../fw/fw');

var RESET = {};

RESET.internalVariables = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: RESET internalVariables');
  }
  // init internal methods 
  this.onLoadedmetadataPlay = null;
  this.onEndedResumeContent = null;
  this.onPlaybackError = null;
  this.onReset = null;
  // init internal tracking events methods
  this.onPause = null;
  this.onPlay = null;
  this.onPlaying = null;
  this.onEnded = null;
  this.onVolumeChange = null;
  this.onTimeupdate = null;
  this.onEventPingTracking = null;
  this.onClickThrough = null;
  this.onPlayingAppendIcons = null;
  this.onTimeupdateCheckSkip = null;
  this.onClickSkip = null;
  this.onNonLinearLoadSuccess = null;
  this.onNonLinearLoadError = null;
  this.onNonLinearClickThrough = null;
  this.onFullscreenchange = null;
  this.onPlayingSeek = null;
  // init internal variables
  this.adTagUrl = null;
  this.vastPlayer = null;
  this.vastPlayerSource = null;
  this.vastDocument = null;
  this.trackingTags = [];
  this.vastErrorTags = [];
  this.inlineOrWrapperErrorTags = [];
  this.adMediaUrl = null;
  this.adMediaHeight = null;
  this.adMediaWidth = null;
  this.vastPlayerMuted = false;
  this.vastPlayerDuration = -1;
  this.vastPlayerCurrentTime = -1;
  this.firstQuartileEventFired = false;
  this.midpointEventFired = false;
  this.thirdQuartileEventFired = false;
  this.vastPlayerPaused = false;
  this.readyForReset = false;
  this.vastErrorCode = -1;
  this.vastErrorMessage = 'Error getting VAST error';
  this.adSystem = null;
  this.adIsLinear = null;
  this.adContentType = null;
  this.adTitle = null;
  this.adDescription = null;
  this.adOnStage = false;
  this.adPauseEventTimeout = null;
  this.clickThroughUrl = null;
  this.isWrapper = false;
  this.vastAdTagURI = null;
  this.redirectsFollowed = 0;
  this.icons = [];
  this.clickUIOnMobile = null;
  this.currentContentSrc = null;
  this.currentContentCurrentTime = -1;
  // skip
  this.isSkippableAd = false;
  this.skipoffset = '';
  this.progressEventOffsets = [];
  this.progressEventOffsetsSeconds = null;
  this.skipButton = null;
  this.skipWaiting = null;
  this.skipMessage = null;
  this.skipButton = null;
  this.skippableAdCanBeSkipped = false;
  // non linear
  this.nonLinearCreative = null;
  this.nonLinearCreativeUrl = null;
  this.nonLinearCreativeHeight = 0;
  this.nonLinearCreativeWidth = 0;
};

RESET.unwireVastPlayerEvents = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: RESET unwireVastPlayerEvents');
  }
  if (this.nonLinearCreative) {
    this.nonLinearCreative.removeEventListener('load', this.onNonLinearLoadSuccess);
    this.nonLinearCreative.removeEventListener('error', this.onNonLinearLoadError);
    this.nonLinearCreative.removeEventListener('click', this.onNonLinearClickThrough);
    for (var i = 0, len = this.trackingTags.length; i < len; i++) {
      this.nonLinearCreative.removeEventListener(this.trackingTags[i].event, this.onEventPingTracking);
    }
  }
  if (this.vastPlayer) {
    if (this.vastPlayerSource) {
      this.vastPlayerSource.removeEventListener('error', this.onPlaybackError);
    }
    // vastPlayer content pause/resume events
    this.vastPlayer.removeEventListener('durationchange', this.onDurationChange);
    this.vastPlayer.removeEventListener('loadedmetadata', this.onLoadedmetadataPlay);
    this.vastPlayer.removeEventListener('ended', this.onEndedResumeContent);
    // unwire HTML5 video events
    this.vastPlayer.removeEventListener('pause', this.onPause);
    this.vastPlayer.removeEventListener('play', this.onPlay);
    this.vastPlayer.removeEventListener('playing', this.onPlaying);
    this.vastPlayer.removeEventListener('ended', this.onEnded);
    this.vastPlayer.removeEventListener('volumechange', this.onVolumeChange);
    this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdate);

    // unwire HTML5 VAST events
    for (var _i = 0, _len = this.trackingTags.length; _i < _len; _i++) {
      this.vastPlayer.removeEventListener(this.trackingTags[_i].event, this.onEventPingTracking);
    }
    // remove clicktrough handling
    this.vastPlayer.removeEventListener('click', this.onClickThrough);
    // remove icons 
    this.vastPlayer.removeEventListener('playing', this.onPlayingAppendIcons);
    // skip
    this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdateCheckSkip);
    if (this.skipButton) {
      this.skipButton.removeEventListener('click', this.onClickSkip);
    }
    // click UI on mobile
    if (this.clickUIOnMobile) {
      this.clickUIOnMobile.addEventListener('touchend', this.onClickThrough);
    }
    // fullscreen
    if (_env.ENV.hasNativeFullscreenSupport) {
      document.removeEventListener('fullscreenchange', this.onFullscreenchange);
      // for our beloved iOS 
      if (this.useContentPlayerForAds) {
        this.vastPlayer.removeEventListener('webkitbeginfullscreen', this.onFullscreenchange);
        this.vastPlayer.removeEventListener('webkitendfullscreen', this.onFullscreenchange);
      }
    }
  }
};

exports.RESET = RESET;

},{"../fw/env":6,"../fw/fw":8}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VASTERRORS = undefined;

var _fw = require('../fw/fw');

var _api = require('../api/api');

var _vastPlayer = require('../players/vast-player');

var VASTERRORS = {};

VASTERRORS.list = [{
  code: 100,
  description: 'XML parsing error.'
}, {
  code: 101,
  description: 'VAST schema validation error.'
}, {
  code: 102,
  description: 'VAST version of response not supported.'
}, {
  code: 200,
  description: 'Trafficking error. Video player received an Ad type that it was not expecting and/or cannot display.'
}, {
  code: 201,
  description: 'Video player expecting different linearity.'
}, {
  code: 202,
  description: 'Video player expecting different duration.'
}, {
  code: 203,
  description: 'Video player expecting different size.'
}, {
  code: 300,
  description: 'General Wrapper error.'
}, {
  code: 301,
  description: 'Timeout of VAST URI provided in Wrapper element, or of VAST URI provided in a subsequent Wrapper element. (URI was either unavailable or reached a timeout as defined by the video player.)'
}, {
  code: 302,
  description: 'Wrapper limit reached, as defined by the video player. Too many Wrapper responses have been received with no InLine response.'
}, {
  code: 303,
  description: 'No Ads VAST response after one or more Wrappers.'
}, {
  code: 400,
  description: 'General Linear error. Video player is unable to display the Linear Ad.'
}, {
  code: 401,
  description: 'File not found. Unable to find Linear/MediaFile from URI.'
}, {
  code: 402,
  description: 'Timeout of MediaFile URI.'
}, {
  code: 403,
  description: 'Couldn\'t find MediaFile that is supported by this video player, based on the attributes of the MediaFile element.'
}, {
  code: 405,
  description: 'Problem displaying MediaFile. Video player found a MediaFile with supported type but couldn\'t display it. MediaFile may include: unsupported codecs, different MIME type than MediaFile@type, unsupported delivery method, etc.'
}, {
  code: 500,
  description: 'General NonLinearAds error.'
}, {
  code: 501,
  description: 'Unable to display NonLinear Ad because creative dimensions do not align with creative display area (i.e. creative dimension too large).'
}, {
  code: 502,
  description: 'Unable to fetch NonLinearAds/NonLinear resource.'
}, {
  code: 503,
  description: 'Couldn\'t find NonLinear resource with supported type.'
}, {
  code: 600,
  description: 'General CompanionAds error.'
}, {
  code: 601,
  description: 'Unable to display Companion because creative dimensions do not fit within Companion display area (i.e., no available space).'
}, {
  code: 602,
  description: 'Unable to display Required Companion.'
}, {
  code: 603,
  description: 'Unable to fetch CompanionAds/Companion resource.'
}, {
  code: 604,
  description: 'Couldn\'t find Companion resource with supported type.'
}, {
  code: 900,
  description: 'Undefined Error.'
}, {
  code: 901,
  description: 'General VPAID error.'
}, {
  code: 1000,
  description: 'Error processing AJAX call to retrieve adTag'
}, {
  code: 1001,
  description: 'Invalid input for loadAds method'
}, {
  code: 1002,
  description: 'Required DOMParser API is not available'
}, {
  code: 1003,
  description: 'Could not get source for content player'
}, {
  code: 1004,
  description: 'Could not find vast player in DOM'
}];

var _updateVastError = function _updateVastError(errorCode) {
  var error = VASTERRORS.list.filter(function (value) {
    return value.code === errorCode;
  });
  if (error.length === 1) {
    this.vastErrorCode = error[0].code;
    this.vastErrorMessage = error[0].description;
  } else {
    this.vastErrorCode = -1;
    this.vastErrorMessage = 'Error getting VAST error';
  }
  if (DEBUG) {
    _fw.FW.trace('RMP-VAST: VAST error ' + this.vastErrorCode + ' - ' + this.vastErrorMessage);
  }
};

VASTERRORS.process = function (errorCode) {
  this.readyForReset = true;
  _updateVastError.call(this, errorCode);
  _api.API.createEvent.call(this, 'aderror');
  _vastPlayer.VASTPLAYER.resumeContent.call(this);
};

exports.VASTERRORS = VASTERRORS;

},{"../api/api":1,"../fw/fw":8,"../players/vast-player":11}]},{},[9]);
