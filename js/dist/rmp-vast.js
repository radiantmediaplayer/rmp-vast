/**
 * @license Copyright (c) 2017 Radiant Media Player | https://www.radiantmediaplayer.com
 * rmp-vast 1.3.2
 * GitHub: https://github.com/radiantmediaplayer/rmp-vast
 * MIT License: https://github.com/radiantmediaplayer/rmp-vast/blob/master/LICENSE
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

var _vpaid = require('../players/vpaid');

var API = {};

API.play = function () {
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      _vpaid.VPAID.resumeAd.call(this);
    } else {
      _vastPlayer.VASTPLAYER.play.call(this);
    }
  } else {
    _contentPlayer.CONTENTPLAYER.play.call(this);
  }
};

API.pause = function () {
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      _vpaid.VPAID.pauseAd.call(this);
    } else {
      _vastPlayer.VASTPLAYER.pause.call(this);
    }
  } else {
    _contentPlayer.CONTENTPLAYER.pause.call(this);
  }
};

API.getAdPaused = function () {
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      return _vpaid.VPAID.getAdPaused.call(this);
    } else {
      return this.vastPlayerPaused;
    }
  }
  return null;
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
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      _vpaid.VPAID.setAdVolume.call(this, level);
    } else {
      _vastPlayer.VASTPLAYER.setVolume.call(this, level);
    }
  }
  _contentPlayer.CONTENTPLAYER.setVolume.call(this, level);
};

API.getVolume = function () {
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      return _vpaid.VPAID.getAdVolume.call(this);
    } else {
      return _vastPlayer.VASTPLAYER.getVolume.call(this);
    }
  }
  return _contentPlayer.CONTENTPLAYER.getVolume.call(this);
};

API.setMute = function (muted) {
  if (typeof muted !== 'boolean') {
    return;
  }
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      if (muted) {
        _vpaid.VPAID.setAdVolume.call(this, 0);
      } else {
        _vpaid.VPAID.setAdVolume.call(this, 1);
      }
    } else {
      _vastPlayer.VASTPLAYER.setMute.call(this, muted);
    }
  }
  _contentPlayer.CONTENTPLAYER.setMute.call(this, muted);
};

API.getMute = function () {
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      if (_vpaid.VPAID.getAdVolume.call(this) === 0) {
        return true;
      }
      return false;
    } else {
      return _vastPlayer.VASTPLAYER.getMute.call(this);
    }
  }
  return _contentPlayer.CONTENTPLAYER.getMute.call(this);
};

API.stopAds = function () {
  if (this.adOnStage) {
    if (this.isVPAID) {
      _vpaid.VPAID.stopAd.call(this);
    } else {
      // this will destroy ad
      _vastPlayer.VASTPLAYER.resumeContent.call(this);
    }
  }
};

API.getAdTagUrl = function () {
  return this.adTagUrl;
};

API.getAdMediaUrl = function () {
  if (this.adOnStage) {
    if (this.isVPAID) {
      return _vpaid.VPAID.getCreativeUrl.call(this);
    } else {
      return this.adMediaUrl;
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
    if (this.adIsLinear || this.isVPAID) {
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
    if (this.isVPAID) {
      var duration = _vpaid.VPAID.getAdDuration.call(this);
      if (duration > 0) {
        duration = duration * 1000;
      }
      return duration;
    } else {
      return _vastPlayer.VASTPLAYER.getDuration.call(this);
    }
  }
  return -1;
};

API.getAdCurrentTime = function () {
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      var remainingTime = _vpaid.VPAID.getAdRemainingTime.call(this);
      var duration = _vpaid.VPAID.getAdDuration.call(this);
      if (remainingTime === -1 || duration === -1 || remainingTime > duration) {
        return -1;
      }
      return (duration - remainingTime) * 1000;
    } else {
      return _vastPlayer.VASTPLAYER.getCurrentTime.call(this);
    }
  }
  return -1;
};

API.getAdRemainingTime = function () {
  if (this.adOnStage && this.adIsLinear) {
    if (this.isVPAID) {
      return _vpaid.VPAID.getAdRemainingTime.call(this);
    } else {
      var currentTime = _vastPlayer.VASTPLAYER.getCurrentTime.call(this);
      var duration = _vastPlayer.VASTPLAYER.getDuration.call(this);
      if (currentTime === -1 || duration === -1 || currentTime > duration) {
        return -1;
      }
      return (duration - currentTime) * 1000;
    }
  }
  return -1;
};

API.getAdOnStage = function () {
  return this.adOnStage;
};

API.getAdMediaWidth = function () {
  if (this.adOnStage) {
    if (this.isVPAID) {
      return _vpaid.VPAID.getAdWidth.call(this);
    } else if (this.adIsLinear) {
      return this.adMediaWidth;
    } else {
      return this.nonLinearCreativeWidth;
    }
  }
  return null;
};

API.getAdMediaHeight = function () {
  if (this.adOnStage) {
    if (this.isVPAID) {
      return _vpaid.VPAID.getAdHeight.call(this);
    } else if (this.adIsLinear) {
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

API.getIsSkippableAd = function () {
  return this.isSkippableAd;
};

API.getContentPlayerCompleted = function () {
  return this.contentPlayerCompleted;
};

API.setContentPlayerCompleted = function (value) {
  if (typeof value === 'boolean') {
    this.contentPlayerCompleted = value;
  }
};

API.createEvent = function (event) {
  // adloaded, addurationchange, adclick, adimpression, adstarted, 
  // adtagloaded, adtagstartloading, adpaused, adresumed 
  // advolumemuted, advolumechanged, adcomplete, adskipped, 
  // adskippablestatechanged, adclosed
  // adfirstquartile, admidpoint, adthirdquartile, aderror, 
  // adfollowingredirect, addestroyed
  // adlinearchange, adexpandedchange, adremainingtimechange 
  // adinteraction, adsizechange
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

API.getVastPlayer = function () {
  return this.vastPlayer;
};

API.getContentPlayer = function () {
  return this.contentPlayer;
};

API.getVpaidCreative = function () {
  if (this.adOnStage && this.isVPAID) {
    return _vpaid.VPAID.getVpaidCreative.call(this);
  }
  return null;
};

API.getIsUsingContentPlayerForAds = function () {
  return this.useContentPlayerForAds;
};

API.initialize = function () {
  if (this.rmpVastInitialized) {
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: rmp-vast already initialized');
    }
  } else {
    if (DEBUG) {
      _fwVast.FWVAST.logPerformance('RMP-VAST: on user interaction - player needs to be initialized');
    }
    _vastPlayer.VASTPLAYER.init.call(this);
  }
};

API.getInitialized = function () {
  return this.rmpVastInitialized;
};

// VPAID methods
API.resizeAd = function (width, height, viewMode) {
  if (this.adOnStage && this.isVPAID) {
    _vpaid.VPAID.resizeAd.call(this, width, height, viewMode);
  }
};

API.expandAd = function () {
  if (this.adOnStage && this.isVPAID) {
    _vpaid.VPAID.expandAd.call(this);
  }
};

API.collapseAd = function () {
  if (this.adOnStage && this.isVPAID) {
    _vpaid.VPAID.collapseAd.call(this);
  }
};

API.skipAd = function () {
  if (this.adOnStage && this.isVPAID) {
    _vpaid.VPAID.skipAd.call(this);
  }
};

API.getAdExpanded = function () {
  if (this.adOnStage && this.isVPAID) {
    _vpaid.VPAID.getAdExpanded.call(this);
  }
  return null;
};

API.getAdSkippableState = function () {
  if (this.adOnStage && this.isVPAID) {
    _vpaid.VPAID.getAdSkippableState.call(this);
  }
  return null;
};

API.getAdCompanions = function () {
  if (this.adOnStage && this.isVPAID) {
    _vpaid.VPAID.getAdCompanions.call(this);
  }
  return null;
};

exports.API = API;

},{"../fw/env":6,"../fw/fw":8,"../fw/fw-vast":7,"../players/content-player":10,"../players/vast-player":11,"../players/vpaid":12}],2:[function(require,module,exports){
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
  var _this = this;

  if (DEBUG) {
    _fw.FW.log('RMP-VAST: start destroying icons');
  }
  var icons = this.adContainer.getElementsByClassName('rmp-ad-container-icons');
  var arrayIcons = [];
  for (var i = 0, len = icons.length; i < len; i++) {
    arrayIcons.push(icons[i]);
  }
  arrayIcons.forEach(function (element) {
    try {
      _this.adContainer.removeChild(element);
    } catch (e) {
      _fw.FW.trace(e);
    }
  });
};

var _programAlreadyPresent = function (program) {
  var newArray = [];
  for (var i = 0, len = this.icons.length; i < len; i++) {
    if (this.icons[i].program !== program) {
      newArray.push(this.icons[i]);
    }
  }
  this.icons = newArray;
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
    // width, height, xPosition, yPosition are all required attributes
    // if one is missing we ignore the current icon
    var width = currentIcon.getAttribute('width');
    if (width === null || width === '' || parseInt(width) <= 0) {
      continue;
    }
    var height = currentIcon.getAttribute('height');
    if (height === null || height === '' || parseInt(height) <= 0) {
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
    if (staticResource.length === 0) {
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
    // if program already present we delete it
    _programAlreadyPresent.call(this, program);

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
    if (iconClicks.length > 0) {
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

var _onIconClickThrough = function (index) {
  var _this2 = this;

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
          _ping.PING.tracking.call(_this2, element, null);
        });
      }
    }
  } catch (e) {
    _fw.FW.trace(e);
  }
};

var _onIconLoadPingTracking = function (index) {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: IconViewTracking for icon at index ' + index);
  }
  _ping.PING.tracking.call(this, this.icons[index].iconViewTrackingUrl, null);
};

var _onPlayingAppendIcons = function () {
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

},{"../fw/fw":8,"../fw/fw-vast":7,"../tracking/ping":13}],3:[function(require,module,exports){
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

var _vpaid = require('../players/vpaid');

var _api = require('../api/api');

var _skip = require('./skip');

var _icons = require('./icons');

var _vastErrors = require('../utils/vast-errors');

var LINEAR = {};

var patternVPAID = /vpaid/i;
var patternJavaScript = /\/javascript/i;
var hlsPattern = /(application\/vnd\.apple\.mpegurl|x-mpegurl)/i;

var _onDurationChange = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: durationchange for VAST player reached');
  }
  this.vastPlayer.removeEventListener('durationchange', this.onDurationChange);
  this.vastPlayerDuration = _vastPlayer.VASTPLAYER.getDuration.call(this);
  _api.API.createEvent.call(this, 'addurationchange');
};

var _onLoadedmetadataPlay = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: loadedmetadata for VAST player reached');
  }
  this.vastPlayer.removeEventListener('loadedmetadata', this.onLoadedmetadataPlay);
  clearTimeout(this.creativeLoadTimeoutCallback);
  _api.API.createEvent.call(this, 'adloaded');
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: pause content player');
  }
  _contentPlayer.CONTENTPLAYER.pause.call(this);
  // show ad container holding vast player
  _fw.FW.show(this.adContainer);
  _fw.FW.show(this.vastPlayer);
  this.adOnStage = true;
  // play VAST player
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: play VAST player');
  }
  _vastPlayer.VASTPLAYER.play.call(this);
};

var _onEndedResumeContent = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: creative ended in VAST player - resume content');
  }
  this.vastPlayer.removeEventListener('ended', this.onEndedResumeContent);
  _vastPlayer.VASTPLAYER.resumeContent.call(this);
};

var _onClickThrough = function (event) {
  try {
    if (event) {
      event.stopPropagation();
    }
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: onClickThrough');
    }
    if (!_env.ENV.isMobile) {
      window.open(this.clickThroughUrl, '_blank');
    }
    if (this.params.pauseOnClick) {
      this.pause();
    }
    _api.API.createEvent.call(this, 'adclick');
    _fwVast.FWVAST.dispatchPingEvent.call(this, 'clickthrough');
  } catch (e) {
    _fw.FW.trace(e);
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
  _ping.PING.error.call(this, 401);
  _vastErrors.VASTERRORS.process.call(this, 401);
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
  var _this = this;

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

  // prevent built in menu to show on right click
  this.onContextMenu = _onContextMenu.bind(this);
  this.vastPlayer.addEventListener('contextmenu', this.onContextMenu);

  this.onPlaybackError = _onPlaybackError.bind(this);

  // start creativeLoadTimeout
  this.creativeLoadTimeoutCallback = setTimeout(function () {
    _ping.PING.error.call(_this, 402);
    _vastErrors.VASTERRORS.process.call(_this, 402);
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
  if (DEBUG) {
    var duration = linear[0].getElementsByTagName('Duration');
    if (duration.length === 0) {
      _fw.FW.log('RMP-VAST: missing Duration tag child of Linear tag - this is not a VAST 3 spec compliant adTag - continuing anyway (same as IMA)');
    }
  }
  var mediaFiles = linear[0].getElementsByTagName('MediaFiles');
  if (mediaFiles.length === 0) {
    // 1 MediaFiles element must be present otherwise VAST document is not spec compliant 
    _ping.PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
    _vastErrors.VASTERRORS.process.call(this, 101);
    return;
  }
  // Industry Icons - currently we only support one icon
  var icons = linear[0].getElementsByTagName('Icons');
  if (icons.length > 0) {
    _icons.ICONS.parse.call(this, icons);
  }
  // check for AdParameters tag in case we have a VPAID creative
  var adParameters = linear[0].getElementsByTagName('AdParameters');
  this.adParametersData = '';
  if (adParameters.length > 0) {
    this.adParametersData = _fwVast.FWVAST.getNodeValue(adParameters[0], false);
  }
  var mediaFile = mediaFiles[0].getElementsByTagName('MediaFile');
  if (mediaFile.length === 0) {
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
    var type = currentMediaFile.getAttribute('type');
    if (type === null || type === '') {
      mediaFileToRemove.push(i);
      continue;
    }
    mediaFileItems[i].url = mediaFileValue;
    mediaFileItems[i].type = type;
    // check for potential VPAID
    var apiFramework = mediaFileItems[i].apiFramework = currentMediaFile.getAttribute('apiFramework');
    // we have a VPAID JS - we break
    // for VPAID we may not have a width, height or delivery
    if (this.params.enableVpaid && apiFramework && patternVPAID.test(apiFramework) && patternJavaScript.test(type)) {
      if (DEBUG) {
        _fw.FW.log('RMP-VAST: VPAID creative detected');
      }
      var currentMediaFileItem = mediaFileItems[i];
      mediaFileItems = [];
      mediaFileToRemove = [];
      mediaFileItems[0] = currentMediaFileItem;
      this.isVPAID = true;
      break;
    }
    var delivery = currentMediaFile.getAttribute('delivery');
    if (delivery !== 'progressive' && delivery !== 'streaming') {
      delivery = 'progressive';
      if (DEBUG) {
        _fw.FW.log('RMP-VAST: missing required delivery attribute on MediaFile tag - this is not a VAST 3 spec compliant adTag - continuing anyway (same as IMA)');
      }
    }
    var width = currentMediaFile.getAttribute('width');
    if (width === null || width === '') {
      if (DEBUG) {
        _fw.FW.log('RMP-VAST: missing required width attribute on MediaFile tag - this is not a VAST 3 spec compliant adTag - continuing anyway (same as IMA)');
      }
      width = 480;
    }
    var height = currentMediaFile.getAttribute('height');
    if (height === null || height === '') {
      if (DEBUG) {
        _fw.FW.log('RMP-VAST: missing required height attribute on MediaFile tag - this is not a VAST 3 spec compliant adTag - continuing anyway (same as IMA)');
      }
      height = 270;
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
    for (var _i = mediaFileToRemove.length - 1; _i >= 0; _i--) {
      mediaFileItems.splice(mediaFileToRemove[_i], 1);
    }
  }
  // we support HLS; MP4; WebM: VPAID so let us fecth for those
  var mp4 = [];
  var webm = [];
  for (var _i2 = 0, _len = mediaFileItems.length; _i2 < _len; _i2++) {
    var _currentMediaFileItem = mediaFileItems[_i2];
    var _type = _currentMediaFileItem.type;
    var url = _currentMediaFileItem.url;
    if (this.isVPAID && url) {
      _vpaid.VPAID.loadCreative.call(this, url, this.params.vpaidSettings);
      this.adContentType = _type;
      return;
    }
    // we have HLS and it is supported - display ad with HLS in priority
    if (hlsPattern.test(_type) && _env.ENV.okHls) {
      _vastPlayer.VASTPLAYER.append.call(this, url, _type);
      this.adContentType = _type;
      return;
    }
    // we gather MP4 and WebM files
    if (_type === 'video/mp4' && _env.ENV.okMp4) {
      mp4.push(_currentMediaFileItem);
    } else if (_type === 'video/webm' && _env.ENV.okWebM) {
      webm.push(_currentMediaFileItem);
    }
  }

  var format = [];
  // if we have WebM and WebM is supported - filter it by width
  // otherwise do the same for MP4
  if (_env.ENV.okWebM && webm.length > 0) {
    webm.sort(function (a, b) {
      return a.width - b.width;
    });
    format = webm;
  } else if (_env.ENV.okMp4 && mp4.length > 0) {
    mp4.sort(function (a, b) {
      return a.width - b.width;
    });
    format = mp4;
  }

  if (format.length === 0) {
    // None of the MediaFile provided are supported by the player
    _ping.PING.error.call(this, 403, this.inlineOrWrapperErrorTags);
    _vastErrors.VASTERRORS.process.call(this, 403);
    return;
  }

  // we have files matching device capabilities
  // select the best one based on player current width
  var retainedFormat = format[0];
  var containerWidth = _fw.FW.getWidth(this.container);
  var formatLength = format.length;
  if (format[formatLength - 1].width < containerWidth) {
    retainedFormat = format[formatLength - 1];
  } else if (format[0].width > containerWidth) {
    retainedFormat = format[0];
  } else {
    for (var _i3 = 0, _len2 = formatLength; _i3 < _len2; _i3++) {
      if (format[_i3].width >= containerWidth) {
        retainedFormat = format[_i3];
        break;
      }
    }
  }
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: selected linear creative follows');
    _fw.FW.log(retainedFormat);
  }
  this.adMediaUrl = retainedFormat.url;
  this.adMediaHeight = retainedFormat.height;
  this.adMediaWidth = retainedFormat.width;
  this.adContentType = retainedFormat.type;
  _vastPlayer.VASTPLAYER.append.call(this, retainedFormat.url, retainedFormat.type);
};

exports.LINEAR = LINEAR;

},{"../api/api":1,"../fw/env":6,"../fw/fw":8,"../fw/fw-vast":7,"../players/content-player":10,"../players/vast-player":11,"../players/vpaid":12,"../tracking/ping":13,"../utils/vast-errors":16,"./icons":2,"./skip":5}],4:[function(require,module,exports){
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

var _onNonLinearLoadError = function () {
  _ping.PING.error.call(this, 502);
  _vastErrors.VASTERRORS.process.call(this, 502);
};

var _onNonLinearLoadSuccess = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: success loading non-linear creative at ' + this.adMediaUrl);
  }
  this.adOnStage = true;
  _api.API.createEvent.call(this, 'adloaded');
  _api.API.createEvent.call(this, 'adimpression');
  _api.API.createEvent.call(this, 'adstarted');
  _fwVast.FWVAST.dispatchPingEvent.call(this, ['impression', 'creativeView', 'start']);
};

var _onNonLinearClickThrough = function (event) {
  try {
    if (event) {
      event.stopPropagation();
    }
    if (this.params.pauseOnClick) {
      this.pause();
    }
    _api.API.createEvent.call(this, 'adclick');
    _fwVast.FWVAST.dispatchPingEvent.call(this, 'clickthrough');
  } catch (e) {
    _fw.FW.trace(e);
  }
};

var _onClickCloseNonLinear = function (event) {
  if (event) {
    event.stopPropagation();
  }
  this.nonLinearContainer.style.display = 'none';
  _api.API.createEvent.call(this, 'adclosed');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'close');
};

var _appendCloseButton = function () {
  var _this = this;

  this.nonLinearClose = document.createElement('div');
  this.nonLinearClose.className = 'rmp-ad-non-linear-close';
  if (this.nonLinearMinSuggestedDuration > 0) {
    this.nonLinearClose.style.display = 'none';
    setTimeout(function () {
      if (_this.nonLinearClose) {
        _this.nonLinearClose.style.display = 'block';
      }
    }, this.nonLinearMinSuggestedDuration * 1000);
  } else {
    this.nonLinearClose.style.display = 'block';
  }
  this.onClickCloseNonLinear = _onClickCloseNonLinear.bind(this);
  this.nonLinearClose.addEventListener('click', this.onClickCloseNonLinear);
  this.nonLinearContainer.appendChild(this.nonLinearClose);
};

NONLINEAR.update = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: appending non-linear creative to .rmp-ad-container element');
  }

  // non-linear ad container
  this.nonLinearContainer = document.createElement('div');
  this.nonLinearContainer.className = 'rmp-ad-non-linear-container';
  this.nonLinearContainer.style.width = this.nonLinearCreativeWidth + 'px';
  this.nonLinearContainer.style.height = this.nonLinearCreativeHeight + 'px';

  // a tag to handle click - a tag is best for WebView support
  this.nonLinearATag = document.createElement('a');
  this.nonLinearATag.className = 'rmp-ad-non-linear-anchor';
  if (this.clickThroughUrl) {
    this.nonLinearATag.href = this.clickThroughUrl;
    this.nonLinearATag.target = '_blank';
    this.onNonLinearClickThrough = _onNonLinearClickThrough.bind(this);
    this.nonLinearATag.addEventListener('click', this.onNonLinearClickThrough);
  }

  // non-linear creative image
  this.nonLinearImg = document.createElement('img');
  this.nonLinearImg.className = 'rmp-ad-non-linear-img';
  this.onNonLinearLoadError = _onNonLinearLoadError.bind(this);
  this.nonLinearImg.addEventListener('error', this.onNonLinearLoadError);
  this.onNonLinearLoadSuccess = _onNonLinearLoadSuccess.bind(this);
  this.nonLinearImg.addEventListener('load', this.onNonLinearLoadSuccess);
  this.nonLinearImg.src = this.adMediaUrl;

  // append to adContainer
  this.nonLinearATag.appendChild(this.nonLinearImg);
  this.nonLinearContainer.appendChild(this.nonLinearATag);
  this.adContainer.appendChild(this.nonLinearContainer);

  // display a close button when non-linear ad has reached minSuggestedDuration
  _appendCloseButton.call(this);

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
  if (nonLinear.length === 0) {
    return;
  }
  var currentNonLinear = void 0;
  var adMediaUrl = '';
  var isDimensionError = false;
  // The video player should poll each <NonLinear> element to determine 
  // which creative is offered in a format the video player can support.
  for (var i = 0, len = nonLinear.length; i < len; i++) {
    isDimensionError = false;
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
    // get minSuggestedDuration (optional)
    var minSuggestedDuration = currentNonLinear.getAttribute('minSuggestedDuration');
    if (minSuggestedDuration !== null && minSuggestedDuration !== '' && _fwVast.FWVAST.isValidDuration(minSuggestedDuration)) {
      this.nonLinearMinSuggestedDuration = _fwVast.FWVAST.convertDurationToSeconds(minSuggestedDuration);
    }
    var staticResource = currentNonLinear.getElementsByTagName('StaticResource');
    // we expect at least one StaticResource tag
    // we do not support IFrameResource or HTMLResource
    if (staticResource.length === 0) {
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
      // if width of non-linear creative does not fit within current player container width 
      // we should skip this creative
      if (parseInt(width) > _fw.FW.getWidth(this.container)) {
        isDimensionError = true;
        continue;
      }
      adMediaUrl = _fwVast.FWVAST.getNodeValue(currentStaticResource, true);
      break;
    }
    // we have a valid NonLinear/StaticResource with supported creativeType - we break
    if (adMediaUrl !== '') {
      this.adMediaUrl = adMediaUrl;
      this.nonLinearCreativeHeight = height;
      this.nonLinearCreativeWidth = width;
      this.nonLinearContentType = creativeType;
      break;
    }
  }
  // if not supported NonLinear type ping for error
  if (!this.adMediaUrl || !currentNonLinear) {
    var vastErrorCode = 503;
    if (isDimensionError) {
      vastErrorCode = 501;
    }
    _ping.PING.error.call(this, vastErrorCode, this.inlineOrWrapperErrorTags);
    _vastErrors.VASTERRORS.process.call(this, vastErrorCode);
    return;
  }
  var nonLinearClickThrough = currentNonLinear.getElementsByTagName('NonLinearClickThrough');
  // if NonLinearClickThrough is present we expect one tag
  if (nonLinearClickThrough.length > 0) {
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

},{"../api/api":1,"../fw/fw":8,"../fw/fw-vast":7,"../players/content-player":10,"../players/vast-player":11,"../tracking/ping":13,"../utils/vast-errors":16}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SKIP = undefined;

var _fwVast = require('../fw/fw-vast');

var _vastPlayer = require('../players/vast-player');

var _trackingEvents = require('../tracking/tracking-events');

var _api = require('../api/api');

var SKIP = {};

var _setCanBeSkippedUI = function () {
  this.skipWaiting.style.display = 'none';
  this.skipMessage.style.display = 'block';
  this.skipIcon.style.display = 'block';
};

var _updateWaitingForCanBeSkippedUI = function (delta) {
  if (Math.round(delta) > 0) {
    this.skipWaiting.textContent = this.params.skipWaitingMessage + ' ' + Math.round(delta) + 's';
  }
};

var _onTimeupdateCheckSkip = function () {
  if (this.skipButton.style.display === 'none') {
    this.skipButton.style.display = 'block';
  }
  this.vastPlayerCurrentTime = this.vastPlayer.currentTime;
  if (typeof this.vastPlayerCurrentTime === 'number' && this.vastPlayerCurrentTime > 0) {
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

var _onClickSkip = function (event) {
  if (event) {
    event.stopPropagation();
    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }
  if (this.skippableAdCanBeSkipped) {
    // create API event
    _api.API.createEvent.call(this, 'adskipped');
    // request ping for skip event
    if (this.hasSkipEvent) {
      _fwVast.FWVAST.dispatchPingEvent.call(this, 'skip');
    } else {
      _trackingEvents.TRACKINGEVENTS.updateResetStatus.call(this);
    }
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
  this.skipButton.addEventListener('touchend', this.onClickSkip);
  this.skipButton.appendChild(this.skipWaiting);
  this.skipButton.appendChild(this.skipMessage);
  this.skipButton.appendChild(this.skipIcon);
  this.adContainer.appendChild(this.skipButton);
  this.onTimeupdateCheckSkip = _onTimeupdateCheckSkip.bind(this);
  this.vastPlayer.addEventListener('timeupdate', this.onTimeupdateCheckSkip);
};

exports.SKIP = SKIP;

},{"../api/api":1,"../fw/fw-vast":7,"../players/vast-player":11,"../tracking/tracking-events":14}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ENV = {};

var testVideo = document.createElement('video');

var _filterVersion = function (pattern, ua) {
  if (ua === null) {
    return -1;
  }
  var versionArray = ua.match(pattern);
  if (Array.isArray(versionArray) && typeof versionArray[1] !== 'undefined') {
    return parseInt(versionArray[1], 10);
  }
  return -1;
};

var _hasTouchEvents = function () {
  if (typeof window.ontouchstart !== 'undefined' || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }
  return false;
};

var _getUserAgent = function () {
  if (window.navigator && window.navigator.userAgent) {
    return window.navigator.userAgent;
  } else {
    return null;
  }
};

var _isWindowsPhone = function (ua, hasTouchEvents) {
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

var _isIos = function (ua, isWindowsPhone, hasTouchEvents) {
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

var _isMacOSX = function (ua, isIos) {
  var pattern = /(macintosh|mac\s+os)/i;
  if (pattern.test(ua) && !isIos[0]) {
    return true;
  }
  return false;
};

var _isSafari = function (ua) {
  var isSafari = false;
  var safariVersion = -1;
  var pattern1 = /safari\/\d+\.\d+/i;
  var pattern2 = /chrome/i;
  var pattern3 = /chromium/i;
  var pattern4 = /android/i;
  if (pattern1.test(ua) && !pattern2.test(ua) && !pattern3.test(ua) && !pattern4.test(ua)) {
    isSafari = true;
  }
  if (isSafari) {
    var versionPattern = /version\/(\d+)\./i;
    safariVersion = _filterVersion(versionPattern, ua);
  }
  return [isSafari, safariVersion];
};

var _isAndroid = function (ua, isWindowsPhone, isIos) {
  var isAndroid = false;
  var androidVersion = -1;
  var support = [isAndroid, androidVersion];
  if (isWindowsPhone[0] || isIos[0]) {
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

var _isFirefox = function (ua) {
  var firefoxPattern = /mozilla\/[.0-9]*.+rv:.+gecko\/[.0-9]*.+firefox\/[.0-9]*/i;
  if (firefoxPattern.test(ua)) {
    return true;
  }
  return false;
};

var _video5 = function () {
  try {
    if (typeof testVideo.canPlayType !== 'undefined') {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};
var html5VideoSupport = _video5();

var _okMp4 = function () {
  if (html5VideoSupport) {
    var canPlayType = testVideo.canPlayType('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
    if (canPlayType !== '') {
      return true;
    }
  }
  return false;
};
ENV.okMp4 = _okMp4();

var _okWebM = function () {
  if (html5VideoSupport) {
    var canPlayType = testVideo.canPlayType('video/webm; codecs="vp8,vorbis"');
    if (canPlayType !== '') {
      return true;
    }
  }
  return false;
};
ENV.okWebM = _okWebM();

var _okHls = function (okMp4) {
  if (html5VideoSupport && okMp4) {
    var isSupp1 = testVideo.canPlayType('application/vnd.apple.mpegurl');
    var isSupp2 = testVideo.canPlayType('application/x-mpegurl');
    if (isSupp1 !== '' || isSupp2 !== '') {
      return true;
    }
  }
  return false;
};
ENV.okHls = _okHls(ENV.okMp4);

var _hasNativeFullscreenSupport = function () {
  var doc = document.documentElement;
  if (doc) {
    if (typeof doc.requestFullscreen !== 'undefined' || typeof doc.webkitRequestFullscreen !== 'undefined' || typeof doc.mozRequestFullScreen !== 'undefined' || typeof doc.msRequestFullscreen !== 'undefined' || typeof testVideo.webkitEnterFullscreen !== 'undefined') {
      return true;
    }
  }
  return false;
};
ENV.hasNativeFullscreenSupport = _hasNativeFullscreenSupport();

var userAgent = _getUserAgent();
var hasTouchEvents = _hasTouchEvents();
var isWindowsPhone = _isWindowsPhone(userAgent, hasTouchEvents);
ENV.isIos = _isIos(userAgent, isWindowsPhone, hasTouchEvents);
ENV.isAndroid = _isAndroid(userAgent, isWindowsPhone, ENV.isIos);
ENV.isMobileAndroid = false;
if (ENV.isAndroid[0] && hasTouchEvents) {
  ENV.isMobileAndroid = true;
}
ENV.isMacOSX = _isMacOSX(userAgent, ENV.isIos);
ENV.isSafari = _isSafari(userAgent);
ENV.isFirefox = _isFirefox(userAgent);
ENV.isMobile = false;
if (ENV.isIos[0] || ENV.isMobileAndroid || isWindowsPhone[0]) {
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
  if (typeof time === 'number' && time >= 0) {
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
    // in case we have some leftovers CDATA - mainly for VPAID
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

FWVAST.isValidDuration = function (duration) {
  // HH:MM:SS or HH:MM:SS.mmm
  var skipPattern = /^\d+:\d+:\d+(\.\d+)?$/i;
  if (skipPattern.test(duration)) {
    return true;
  }
  return false;
};

FWVAST.convertDurationToSeconds = function (duration) {
  // duration is HH:MM:SS or HH:MM:SS.mmm
  // remove .mmm
  var splitNoMS = duration.split('.');
  splitNoMS = splitNoMS[0];
  var splitTime = splitNoMS.split(':');
  var seconds = 0;
  seconds = parseInt(splitTime[0]) * 60 * 60 + parseInt(splitTime[1]) * 60 + parseInt(splitTime[2]);
  return seconds;
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
    } else if (!this.adIsLinear && this.nonLinearContainer) {
      element = this.nonLinearContainer;
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

FWVAST.logVideoEvents = function (video) {
  var events = ['loadstart', 'durationchange', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'];
  events.forEach(function (value) {
    video.addEventListener(value, function (e) {
      if (e && e.type) {
        _fw.FW.log('RMP-VAST: content player event - ' + e.type);
      }
    });
  });
};

FWVAST.filterParams = function (params) {
  var defaultParams = {
    ajaxTimeout: 8000,
    creativeLoadTimeout: 10000,
    ajaxWithCredentials: false,
    maxNumRedirects: 4,
    pauseOnClick: true,
    skipMessage: 'Skip ad',
    skipWaitingMessage: 'Skip ad in',
    textForClickUIOnMobile: 'Learn more',
    enableVpaid: true,
    vpaidSettings: {
      width: 640,
      height: 360,
      viewMode: 'normal',
      desiredBitrate: 500
    }
  };
  this.params = defaultParams;
  if (params && !_fw.FW.isEmptyObject(params)) {
    if (typeof params.ajaxTimeout === 'number' && params.ajaxTimeout > 0) {
      this.params.ajaxTimeout = params.ajaxTimeout;
    }
    if (typeof params.creativeLoadTimeout === 'number' && params.creativeLoadTimeout > 0) {
      this.params.creativeLoadTimeout = params.creativeLoadTimeout;
    }
    if (typeof params.ajaxWithCredentials === 'boolean') {
      this.params.ajaxWithCredentials = params.ajaxWithCredentials;
    }
    if (typeof params.maxNumRedirects === 'number' && params.maxNumRedirects > 0 && params.maxNumRedirects !== 4) {
      this.params.maxNumRedirects = params.maxNumRedirects;
    }
    if (typeof params.pauseOnClick === 'boolean') {
      this.params.pauseOnClick = params.pauseOnClick;
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
    if (typeof params.enableVpaid === 'boolean') {
      this.params.enableVpaid = params.enableVpaid;
    }
    if (typeof params.vpaidSettings === 'object') {
      if (typeof params.vpaidSettings.width === 'number') {
        this.params.vpaidSettings.width = params.vpaidSettings.width;
      }
      if (typeof params.vpaidSettings.height === 'number') {
        this.params.vpaidSettings.height = params.vpaidSettings.height;
      }
      if (typeof params.vpaidSettings.viewMode === 'string') {
        this.params.vpaidSettings.viewMode = params.vpaidSettings.viewMode;
      }
      if (typeof params.vpaidSettings.desiredBitrate === 'number') {
        this.params.vpaidSettings.desiredBitrate = params.vpaidSettings.desiredBitrate;
      }
    }
  }
};

exports.FWVAST = FWVAST;

},{"./fw":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var FW = {};

FW.nullFn = function () {
  return null;
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

var _getComputedStyle = function (element, style) {
  var propertyValue = '';
  if (element && typeof window.getComputedStyle === 'function') {
    var cs = window.getComputedStyle(element, null);
    if (cs) {
      propertyValue = cs.getPropertyValue(style);
      propertyValue = propertyValue.toString().toLowerCase();
    }
  }
  return propertyValue;
};

var _getStyleAttributeData = function (element, style) {
  var styleAttributeData = _getComputedStyle(element, style) || 0;
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
      return _getStyleAttributeData(element, 'width');
    }
  }
  return 0;
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

require('core-js/fn/object/keys');

require('core-js/fn/function/bind');

require('core-js/fn/array/is-array');

require('core-js/fn/array/index-of');

require('core-js/fn/array/for-each');

require('core-js/fn/array/filter');

require('core-js/fn/array/sort');

require('core-js/fn/string/trim');

require('core-js/fn/number/is-finite');

require('core-js/es6/promise');

require('core-js/fn/parse-float');

require('core-js/fn/parse-int');

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

var _icons = require('./creatives/icons');

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
  if (DEBUG) {
    _fwVast.FWVAST.logVideoEvents(this.contentPlayer);
  }
  this.adContainer = null;
  this.rmpVastInitialized = false;
  this.useContentPlayerForAds = false;
  this.contentPlayerCompleted = false;
  this.currentContentCurrentTime = -1;
  this.needsSeekAdjust = false;
  this.seekAdjustAttached = false;
  this.onDestroyLoadAds = null;
  if (_env.ENV.isIos[0] || _env.ENV.isMacOSX && _env.ENV.isSafari[0]) {
    // on iOS and macOS Safari we use content player to play ads
    // to avoid issues related to fullscreen management and autoplay
    // as fullscreen on iOS is handled by the default OS player
    this.useContentPlayerForAds = true;
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: vast player will be content player');
    }
  }
  // filter input params
  _fwVast.FWVAST.filterParams.call(this, params);
  // reset internal variables
  _reset.RESET.internalVariables.call(this);
  // attach fullscreen states
  // this assumes we have a polyfill for fullscreenchange event 
  // see app/js/app.js
  // we need this to handle VAST fullscreen events
  var isInFullscreen = false;
  var onFullscreenchange = null;
  var _onFullscreenchange = function (event) {
    if (event && event.type) {
      if (DEBUG) {
        _fw.FW.log('RMP-VAST: event is ' + event.type);
      }
      if (event.type === 'fullscreenchange') {
        if (isInFullscreen) {
          isInFullscreen = false;
          if (this.adOnStage && this.adIsLinear) {
            _fwVast.FWVAST.dispatchPingEvent.call(this, 'exitFullscreen');
          }
        } else {
          isInFullscreen = true;
          if (this.adOnStage && this.adIsLinear) {
            _fwVast.FWVAST.dispatchPingEvent.call(this, 'fullscreen');
          }
        }
      } else if (event.type === 'webkitbeginfullscreen') {
        // iOS uses webkitbeginfullscreen
        if (this.adOnStage && this.adIsLinear) {
          _fwVast.FWVAST.dispatchPingEvent.call(this, 'fullscreen');
        }
      } else if (event.type === 'webkitendfullscreen') {
        // iOS uses webkitendfullscreen
        if (this.adOnStage && this.adIsLinear) {
          _fwVast.FWVAST.dispatchPingEvent.call(this, 'exitFullscreen');
        }
      }
    }
  };
  // if we have native fullscreen support we handle fullscreen events
  if (_env.ENV.hasNativeFullscreenSupport) {
    onFullscreenchange = _onFullscreenchange.bind(this);
    // for our beloved iOS 
    if (_env.ENV.isIos[0]) {
      this.contentPlayer.addEventListener('webkitbeginfullscreen', onFullscreenchange);
      this.contentPlayer.addEventListener('webkitendfullscreen', onFullscreenchange);
    } else {
      document.addEventListener('fullscreenchange', onFullscreenchange);
    }
  }
};

// enrich RmpVast prototype with API methods
var apiKeys = Object.keys(_api.API);
for (var i = 0, len = apiKeys.length; i < len; i++) {
  var currentKey = apiKeys[i];
  window.RmpVast.prototype[currentKey] = _api.API[currentKey];
}

var _execRedirect = function () {
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

var _parseCreatives = function (creative) {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: _parseCreatives');
    _fw.FW.log(creative);
  }
  for (var _i = 0, _len = creative.length; _i < _len; _i++) {
    var currentCreative = creative[_i];
    //let creativeID = currentCreative[0].getAttribute('id');
    //let creativeSequence = currentCreative[0].getAttribute('sequence');
    //let creativeAdId = currentCreative[0].getAttribute('adId');
    //let creativeApiFramework = currentCreative[0].getAttribute('apiFramework');
    // we only pick the first creative that is either Linear or NonLinearAds
    var nonLinearAds = currentCreative.getElementsByTagName('NonLinearAds');
    var linear = currentCreative.getElementsByTagName('Linear');
    // for now we ignore CreativeExtensions tag
    //let creativeExtensions = currentCreative.getElementsByTagName('CreativeExtensions');
    var companionAds = currentCreative.getElementsByTagName('CompanionAds');
    if (companionAds.length > 0) {
      continue;
    }
    // we expect 1 Linear or NonLinearAds tag 
    if (nonLinearAds.length === 0 && linear.length === 0) {
      _ping.PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
      _vastErrors.VASTERRORS.process.call(this, 101);
      return;
    }
    if (nonLinearAds.length > 0) {
      var trackingEvents = nonLinearAds[0].getElementsByTagName('TrackingEvents');
      // if TrackingEvents tag
      if (trackingEvents.length > 0) {
        _trackingEvents2.TRACKINGEVENTS.filter.call(this, trackingEvents);
      }
      if (this.isWrapper) {
        _execRedirect.call(this);
        return;
      }
      _nonLinear.NONLINEAR.parse.call(this, nonLinearAds);
      return;
    } else if (linear.length > 0) {
      // check for skippable ads (Linear skipoffset)
      var skipoffset = linear[0].getAttribute('skipoffset');
      // if we have a wrapper we ignore skipoffset in case it is present
      if (!this.isWrapper && this.params.skipMessage !== '' && skipoffset !== null && skipoffset !== '' && _fwVast.FWVAST.isValidOffset(skipoffset)) {
        if (DEBUG) {
          _fw.FW.log('RMP-VAST: skippable ad detected with offset ' + skipoffset);
        }
        this.isSkippableAd = true;
        this.skipoffset = skipoffset;
        // we  do not display skippable ads when on is iOS < 10
        if (_env.ENV.isIos[0] && _env.ENV.isIos[1] < 10) {
          _ping.PING.error.call(this, 200, this.inlineOrWrapperErrorTags);
          _vastErrors.VASTERRORS.process.call(this, 200);
          return;
        }
      }

      // TrackingEvents
      var _trackingEvents = linear[0].getElementsByTagName('TrackingEvents');
      // if present TrackingEvents
      if (_trackingEvents.length > 0) {
        _trackingEvents2.TRACKINGEVENTS.filter.call(this, _trackingEvents);
      }

      // VideoClicks for linear
      var videoClicks = linear[0].getElementsByTagName('VideoClicks');
      if (videoClicks.length > 0) {
        var clickThrough = videoClicks[0].getElementsByTagName('ClickThrough');
        var clickTracking = videoClicks[0].getElementsByTagName('ClickTracking');
        if (clickThrough.length > 0) {
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
        // if icons are presents then we push valid icons to this.icons
        var icons = linear[0].getElementsByTagName('Icons');
        if (icons.length > 0) {
          _icons.ICONS.parse.call(this, icons);
        }
        _execRedirect.call(this);
        return;
      }
      _linear.LINEAR.parse.call(this, linear);
      return;
    }
  }
  // in case wrapper with creative CompanionAds we still need to _execRedirect
  if (this.isWrapper) {
    _execRedirect.call(this);
    return;
  }
};

var _onXmlAvailable = function (xml) {
  // if VMAP we abort
  var vmap = xml.getElementsByTagName('vmap:VMAP');
  if (vmap.length > 0) {
    _vastErrors.VASTERRORS.process.call(this, 200);
    return;
  }
  // check for VAST node
  this.vastDocument = xml.getElementsByTagName('VAST');
  if (this.vastDocument.length === 0) {
    _vastErrors.VASTERRORS.process.call(this, 100);
    return;
  }
  // VAST/Error node
  var errorNode = this.vastDocument[0].getElementsByTagName('Error');
  if (errorNode.length > 0) {
    var errorUrl = _fwVast.FWVAST.getNodeValue(errorNode[0], true);
    if (errorUrl !== null) {
      this.vastErrorTags.push({ event: 'error', url: errorUrl });
    }
  }
  //check for VAST version 2, 3 or 4 (we support VAST 4 in the limit of what is supported in VAST 3)
  var pattern = /^(2|3|4)\./i;
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
      if (_inline.length > 0 || _wrapper.length > 0) {
        _ping.PING.error.call(this, 200, this.vastErrorTags);
      }
    }
    _vastErrors.VASTERRORS.process.call(this, 200);
    return;
  }
  //let adId = retainedAd[0].getAttribute('id');
  var inline = retainedAd.getElementsByTagName('InLine');
  var wrapper = retainedAd.getElementsByTagName('Wrapper');
  // 1 InLine or Wrapper element must be present 
  if (inline.length === 0 && wrapper.length === 0) {
    _ping.PING.error.call(this, 101, this.vastErrorTags);
    _vastErrors.VASTERRORS.process.call(this, 101);
    return;
  }
  var inlineOrWrapper = void 0;
  if (wrapper.length > 0) {
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
  if (errorNode.length > 0) {
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
  // however in real word some adTag do not have impression or adSystem/adTitle tags 
  // especially in the context of multiple redirects - since the IMA SDK allows those tags 
  // to render we should do the same even if those adTags are not VAST-compliant
  // so we only check and exit if missing required information to display ads 
  if (this.isWrapper) {
    if (this.vastAdTagURI.length === 0) {
      _ping.PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
      _vastErrors.VASTERRORS.process.call(this, 101);
      return;
    }
  } else {
    if (creatives.length === 0) {
      _ping.PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
      _vastErrors.VASTERRORS.process.call(this, 101);
      return;
    }
  }

  var creative = void 0;
  if (creatives.length > 0) {
    creative = creatives[0].getElementsByTagName('Creative');
    // at least one creative tag is expected for InLine
    if (!this.isWrapper && creative.length === 0) {
      _ping.PING.error.call(this, 101, this.inlineOrWrapperErrorTags);
      _vastErrors.VASTERRORS.process.call(this, 101);
      return;
    }
  }
  if (adTitle.length > 0) {
    this.adSystem = _fwVast.FWVAST.getNodeValue(adSystem[0], false);
  }
  if (impression.length > 0) {
    var impressionUrl = _fwVast.FWVAST.getNodeValue(impression[0], true);
    if (impressionUrl !== null) {
      this.trackingTags.push({ event: 'impression', url: impressionUrl });
    }
  }
  if (!this.isWrapper) {
    if (adTitle.length > 0) {
      this.adTitle = _fwVast.FWVAST.getNodeValue(adTitle[0], false);
    }
    if (adDescription.length > 0) {
      this.adDescription = _fwVast.FWVAST.getNodeValue(adDescription[0], false);
    }
  }
  // in case no Creative with Wrapper we make our redirect call here
  if (this.isWrapper && !creative) {
    _execRedirect.call(this);
    return;
  }
  _parseCreatives.call(this, creative);
};

var _makeAjaxRequest = function (vastUrl) {
  var _this = this;

  // we check for required VAST URL and API here
  // as we need to have this.currentContentSrc available for iOS
  if (typeof vastUrl !== 'string' || vastUrl === '') {
    _vastErrors.VASTERRORS.process.call(this, 1001);
    return;
  }
  if (!_fwVast.FWVAST.hasDOMParser()) {
    _vastErrors.VASTERRORS.process.call(this, 1002);
    return;
  }
  // if we already have an ad on stage - we need to destroy it first 
  if (this.adOnStage) {
    _api.API.stopAds.call(this);
  }
  _api.API.createEvent.call(this, 'adtagstartloading');
  this.isWrapper = false;
  this.vastAdTagURI = null;
  this.adTagUrl = vastUrl;
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: try to load VAST tag at ' + this.adTagUrl);
  }
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

var _onDestroyLoadAds = function (vastUrl) {
  this.container.removeEventListener('addestroyed', this.onDestroyLoadAds);
  this.loadAds(vastUrl);
};

RmpVast.prototype.loadAds = function (vastUrl) {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: loadAds starts');
  }
  // if player is not initialized - this must be done now
  if (!this.rmpVastInitialized) {
    this.initialize();
  }
  // if an ad is already on stage we need to clear it first before we can accept another ad request
  if (this.getAdOnStage()) {
    this.onDestroyLoadAds = _onDestroyLoadAds.bind(this, vastUrl);
    this.container.addEventListener('addestroyed', this.onDestroyLoadAds);
    this.stopAds();
    return;
  }
  // if we try to load ads when currentTime < 200 ms - be it linear or non-linear - we pause CONTENTPLAYER
  // CONTENTPLAYER (non-linear) or VASTPLAYER (linear) will resume later when VAST has finished loading/parsing
  // this is to avoid bad user experience where content may start for a few ms before ad starts
  var contentCurrentTime = _contentPlayer.CONTENTPLAYER.getCurrentTime.call(this);
  // for useContentPlayerForAds we need to know early what is the content src
  // so that we can resume content when ad finishes or on aderror
  if (this.useContentPlayerForAds) {
    this.currentContentSrc = this.contentPlayer.src;
    this.currentContentCurrentTime = contentCurrentTime;
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: currentContentCurrentTime ' + contentCurrentTime);
    }
    // on iOS we need to prevent seeking when linear ad is on stage
    _contentPlayer.CONTENTPLAYER.preventSeekingForCustomPlayback.call(this);
  }
  _makeAjaxRequest.call(this, vastUrl);
};

},{"./api/api":1,"./creatives/icons":2,"./creatives/linear":3,"./creatives/non-linear":4,"./fw/env":6,"./fw/fw":8,"./fw/fw-vast":7,"./players/content-player":10,"./tracking/ping":13,"./tracking/tracking-events":14,"./utils/reset":15,"./utils/vast-errors":16,"core-js/es6/promise":17,"core-js/fn/array/filter":18,"core-js/fn/array/for-each":19,"core-js/fn/array/index-of":20,"core-js/fn/array/is-array":21,"core-js/fn/array/sort":22,"core-js/fn/function/bind":23,"core-js/fn/number/is-finite":24,"core-js/fn/object/keys":25,"core-js/fn/parse-float":26,"core-js/fn/parse-int":27,"core-js/fn/string/trim":28}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CONTENTPLAYER = undefined;

var _fw = require('../fw/fw');

var CONTENTPLAYER = {};

CONTENTPLAYER.play = function () {
  if (this.contentPlayer && this.contentPlayer.paused) {
    _fw.FW.playPromise(this.contentPlayer);
  }
};

CONTENTPLAYER.pause = function () {
  if (this.contentPlayer && !this.contentPlayer.paused) {
    this.contentPlayer.pause();
  }
};

CONTENTPLAYER.setVolume = function (level) {
  if (this.contentPlayer) {
    this.contentPlayer.volume = level;
  }
};

CONTENTPLAYER.getVolume = function () {
  if (this.contentPlayer) {
    return this.contentPlayer.volume;
  }
  return null;
};

CONTENTPLAYER.getMute = function () {
  if (this.contentPlayer) {
    return this.contentPlayer.muted;
  }
  return null;
};

CONTENTPLAYER.setMute = function (muted) {
  if (this.contentPlayer) {
    if (muted && !this.contentPlayer.muted) {
      this.contentPlayer.muted = true;
    } else if (!muted && this.contentPlayer.muted) {
      this.contentPlayer.muted = false;
    }
  }
};

CONTENTPLAYER.getDuration = function () {
  if (this.contentPlayer) {
    var duration = this.contentPlayer.duration;
    if (typeof duration === 'number' && Number.isFinite(duration)) {
      return Math.round(duration * 1000);
    }
  }
  return -1;
};

CONTENTPLAYER.getCurrentTime = function () {
  if (this.contentPlayer) {
    var currentTime = this.contentPlayer.currentTime;
    if (typeof currentTime === 'number' && Number.isFinite(currentTime)) {
      return Math.round(currentTime * 1000);
    }
  }
  return -1;
};

CONTENTPLAYER.seekTo = function (msSeek) {
  if (typeof msSeek !== 'number') {
    return;
  }
  if (msSeek >= 0 && this.contentPlayer) {
    var seekValue = Math.round(msSeek / 1000 * 100) / 100;
    this.contentPlayer.currentTime = seekValue;
  }
};

CONTENTPLAYER.preventSeekingForCustomPlayback = function () {
  var _this = this;

  // after much poking it appears we cannot rely on seek events for iOS to 
  // set this up reliably - so interval it is
  if (this.contentPlayer) {
    this.antiSeekLogicInterval = setInterval(function () {
      if (_this.adIsLinear && _this.adOnStage) {
        var diff = Math.abs(_this.customPlaybackCurrentTime - _this.contentPlayer.currentTime);
        if (diff > 1) {
          _this.contentPlayer.currentTime = _this.customPlaybackCurrentTime;
        }
        _this.customPlaybackCurrentTime = _this.contentPlayer.currentTime;
      }
    }, 200);
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

var _vpaid = require('../players/vpaid');

var _icons = require('../creatives/icons');

var _reset = require('../utils/reset');

var _trackingEvents = require('../tracking/tracking-events');

var _nonLinear = require('../creatives/non-linear');

var _linear = require('../creatives/linear');

var _api = require('../api/api');

var _vastErrors = require('../utils/vast-errors');

var VASTPLAYER = {};

var _destroyVastPlayer = function () {
  var _this = this;

  if (DEBUG) {
    _fw.FW.log('RMP-VAST: start destroying vast player');
  }
  // destroy icons if any 
  if (this.icons.length > 0) {
    _icons.ICONS.destroy.call(this);
  }
  if (this.isVPAID) {
    _vpaid.VPAID.destroy.call(this);
  }
  // unwire events
  _reset.RESET.unwireVastPlayerEvents.call(this);
  // remove clickUI on mobile
  if (this.clickUIOnMobile) {
    try {
      this.adContainer.removeChild(this.clickUIOnMobile);
    } catch (e) {
      _fw.FW.trace(e);
    }
  }
  if (this.isSkippableAd) {
    try {
      this.adContainer.removeChild(this.skipButton);
    } catch (e) {
      _fw.FW.trace(e);
    }
  }
  // hide rmp-ad-container
  _fw.FW.hide(this.adContainer);
  // unwire anti-seek logic (iOS)
  clearInterval(this.antiSeekLogicInterval);
  // reset creativeLoadTimeout
  clearTimeout(this.creativeLoadTimeoutCallback);
  if (this.useContentPlayerForAds) {
    // when content is restored we need to seek to previously known currentTime
    // this must happen on playing event
    // the below is some hack I come up with because Safari is confused with 
    // what it is asked to do when post roll come into play
    if (this.currentContentCurrentTime > 4000) {
      this.needsSeekAdjust = true;
      if (this.contentPlayerCompleted) {
        this.needsSeekAdjust = false;
      }
      if (!this.seekAdjustAttached) {
        this.seekAdjustAttached = true;
        this.contentPlayer.addEventListener('playing', function () {
          if (_this.needsSeekAdjust) {
            _this.needsSeekAdjust = false;
            _contentPlayer.CONTENTPLAYER.seekTo.call(_this, _this.currentContentCurrentTime);
          }
        });
      }
    }
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: recovering content with src ' + this.currentContentSrc + ' - at time: ' + this.currentContentCurrentTime);
    }
    this.contentPlayer.src = this.currentContentSrc;
  } else {
    // flush vastPlayer
    try {
      if (this.vastPlayer) {
        this.vastPlayer.pause();
        // empty buffer
        this.vastPlayer.removeAttribute('src');
        this.vastPlayer.load();
        _fw.FW.hide(this.vastPlayer);
        if (DEBUG) {
          _fw.FW.log('RMP-VAST: vastPlayer flushed');
        }
      }
      if (this.nonLinearContainer) {
        try {
          this.adContainer.removeChild(this.nonLinearContainer);
        } catch (e) {
          _fw.FW.trace(e);
        }
      }
    } catch (e) {
      _fw.FW.trace(e);
    }
  }
  // reset internal variables for next ad if any
  // we tick to let buffer empty
  setTimeout(function () {
    _reset.RESET.internalVariables.call(_this);
    _api.API.createEvent.call(_this, 'addestroyed');
  }, 100);
};

VASTPLAYER.init = function () {
  var _this2 = this;

  if (DEBUG) {
    _fw.FW.log('RMP-VAST: init called');
  }
  this.adContainer = document.createElement('div');
  this.adContainer.className = 'rmp-ad-container';
  this.content.appendChild(this.adContainer);
  _fw.FW.hide(this.adContainer);
  if (!this.useContentPlayerForAds) {
    this.vastPlayer = document.createElement('video');
    // disable casting of video ads for Android
    if (_env.ENV.isMobileAndroid && typeof this.vastPlayer.disableRemotePlayback !== 'undefined') {
      this.vastPlayer.disableRemotePlayback = true;
    }
    this.vastPlayer.className = 'rmp-ad-vast-video-player';
    this.vastPlayer.controls = false;
    // this.contentPlayer.muted may not be set because of a bug in some version of Chromium
    if (this.contentPlayer.hasAttribute('muted')) {
      this.contentPlayer.muted = true;
    }
    if (this.contentPlayer.muted) {
      this.vastPlayer.muted = true;
    }
    // black poster based 64 png
    this.vastPlayer.poster = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    this.vastPlayer.setAttribute('x-webkit-airplay', 'allow');
    if (typeof this.contentPlayer.playsInline === 'boolean' && this.contentPlayer.playsInline) {
      this.vastPlayer.playsInline = true;
    } else if (_env.ENV.isMobile) {
      // this is for iOS/Android WebView where webkit-playsinline may be available
      this.vastPlayer.setAttribute('webkit-playsinline', true);
    }
    this.vastPlayer.defaultPlaybackRate = 1;
    // append to rmp-ad-container
    _fw.FW.hide(this.vastPlayer);
    this.adContainer.appendChild(this.vastPlayer);
  } else {
    this.vastPlayer = this.contentPlayer;
  }
  // we track ended state for content player
  this.contentPlayer.addEventListener('ended', function () {
    if (_this2.adOnStage) {
      return;
    }
    _this2.contentPlayerCompleted = true;
  });
  // we need the loadedmetadata event so we force preload 
  // in case it was set differently for useContentPlayerForAds
  if (this.vastPlayer.preload && this.vastPlayer.preload === 'none') {
    this.vastPlayer.preload = 'metadata';
  }
  // we need to init the vast player video tag
  // according to https://developers.google.com/interactive-media-ads/docs/sdks/html5/mobile_video
  // to initialize the content element, a call to the load() method is sufficient.
  if (_env.ENV.isMobile) {
    // on Android both this.contentPlayer (to resume content)
    // and this.vastPlayer (to start ads) needs to be init
    // on iOS only init this.vastPlayer (as same as this.contentPlayer)
    if (!this.useContentPlayerForAds) {
      this.contentPlayer.load();
    }
    this.vastPlayer.load();
  } else {
    // due to autoplay being blocked on macOS Safari 11+
    // we also need to init player on this browser
    // this also work on previous version of Safari
    if (this.useContentPlayerForAds) {
      this.vastPlayer.load();
    }
  }
  this.rmpVastInitialized = true;
};

VASTPLAYER.append = function (url, type) {
  // in case loadAds is called several times - rmpVastInitialized is already true
  // but we still need to locate the vastPlayer
  if (!this.vastPlayer) {
    if (this.useContentPlayerForAds) {
      this.vastPlayer = this.contentPlayer;
    } else {
      // we use existing rmp-ad-vast-video-player as it is already 
      // available and initialized (no need for user interaction)
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
  if (this.vastPlayer) {
    this.vastPlayer.volume = level;
  }
};

VASTPLAYER.getVolume = function () {
  if (this.vastPlayer) {
    return this.vastPlayer.volume;
  }
  return null;
};

VASTPLAYER.setMute = function (muted) {
  if (this.vastPlayer) {
    if (muted && !this.vastPlayer.muted) {
      this.vastPlayer.muted = true;
      _fwVast.FWVAST.dispatchPingEvent.call(this, 'mute');
    } else if (!muted && this.vastPlayer.muted) {
      this.vastPlayer.muted = false;
      _fwVast.FWVAST.dispatchPingEvent.call(this, 'unmute');
    }
  }
};

VASTPLAYER.getMute = function () {
  if (this.vastPlayer) {
    return this.vastPlayer.muted;
  }
  return null;
};

VASTPLAYER.play = function () {
  if (this.vastPlayer && this.vastPlayer.paused) {
    _fw.FW.playPromise(this.vastPlayer);
  }
};

VASTPLAYER.pause = function () {
  if (this.vastPlayer && !this.vastPlayer.paused) {
    this.vastPlayer.pause();
  }
};

VASTPLAYER.getDuration = function () {
  if (this.vastPlayer) {
    var duration = this.vastPlayer.duration;
    if (typeof duration === 'number' && Number.isFinite(duration)) {
      return Math.round(duration * 1000);
    }
  }
  return -1;
};

VASTPLAYER.getCurrentTime = function () {
  if (this.vastPlayer) {
    var currentTime = this.vastPlayer.currentTime;
    if (typeof currentTime === 'number' && Number.isFinite(currentTime)) {
      return Math.round(currentTime * 1000);
    }
  }
  return -1;
};

VASTPLAYER.resumeContent = function () {
  var _this3 = this;

  if (DEBUG) {
    _fw.FW.log('RMP-VAST: resumeContent');
  }
  // tick to let last ping events (complete/skip) to be sent
  setTimeout(function () {
    _destroyVastPlayer.call(_this3);
    // if this.contentPlayerCompleted = true - we are in a post-roll situation
    // in that case we must not resume content once the post-roll has completed
    // you can use setContentPlayerCompleted/getContentPlayerCompleted to support 
    // custom use-cases when dynamically changing source for content
    if (!_this3.contentPlayerCompleted) {
      _contentPlayer.CONTENTPLAYER.play.call(_this3);
    }
    _this3.contentPlayerCompleted = false;
  }, 100);
};

exports.VASTPLAYER = VASTPLAYER;

},{"../api/api":1,"../creatives/icons":2,"../creatives/linear":3,"../creatives/non-linear":4,"../fw/env":6,"../fw/fw":8,"../fw/fw-vast":7,"../players/content-player":10,"../players/vpaid":12,"../tracking/tracking-events":14,"../utils/reset":15,"../utils/vast-errors":16}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VPAID = undefined;

var _fw = require('../fw/fw');

var _env = require('../fw/env');

var _fwVast = require('../fw/fw-vast');

var _vastErrors = require('../utils/vast-errors');

var _api = require('../api/api');

var _ping = require('../tracking/ping');

var _vastPlayer = require('../players/vast-player');

var _icons = require('../creatives/icons');

var _trackingEvents = require('../tracking/tracking-events');

var _contentPlayer = require('../players/content-player');

var VPAID = {};

// vpaidCreative getters

VPAID.getAdWidth = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdWidth === 'function') {
    return this.vpaidCreative.getAdWidth();
  }
  return null;
};

VPAID.getAdHeight = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdHeight === 'function') {
    return this.vpaidCreative.getAdHeight();
  }
  return null;
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
  return null;
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
  return null;
};

VPAID.getAdSkippableState = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdSkippableState === 'function') {
    return this.vpaidCreative.getAdSkippableState();
  }
  return null;
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
  return null;
};

// VPAID creative events
var _onAdLoaded = function () {
  var _this = this;

  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdLoaded event');
  }
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
  this.startAdTimeout = setTimeout(function () {
    if (!_this.vpaidAdStarted) {
      _vastPlayer.VASTPLAYER.resumeContent.call(_this);
    }
    _this.vpaidAdStarted = false;
  }, this.params.creativeLoadTimeout);
  // pause content player
  _contentPlayer.CONTENTPLAYER.pause.call(this);
  this.adOnStage = true;
  this.vpaidCreative.startAd();
  _api.API.createEvent.call(this, 'adloaded');
};

var _onAdStarted = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdStarted event');
  }
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
  if (!VPAID.getAdIcons.call(this) && !this.useContentPlayerForAds && this.icons.length > 0) {
    _icons.ICONS.append.call(this);
  }
  if (typeof this.vpaidCreative.getAdLinear === 'function') {
    this.adIsLinear = this.vpaidCreative.getAdLinear();
    if (this.adIsLinear === false) {
      // we currently do not support Click-to-Linear Video Ad or non-linear VPAID ads
      VPAID.stopAd.call(this);
      return;
    }
  }
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'creativeView');
};

var _onAdStopped = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdStopped event');
  }
  if (this.adStoppedTimeout) {
    clearTimeout(this.adStoppedTimeout);
  }
  _vastPlayer.VASTPLAYER.resumeContent.call(this);
};

var _onAdSkipped = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdSkipped event');
  }
  if (this.adSkippedTimeout) {
    clearTimeout(this.adSkippedTimeout);
  }
  _api.API.createEvent.call(this, 'adskipped');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'skip');
};

var _onAdSkippableStateChange = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdSkippableStateChange event');
  }
  _api.API.createEvent.call(this, 'adskippablestatechanged');
};

var _onAdDurationChange = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdDurationChange event ' + VPAID.getAdDuration.call(this));
  }
  if (!this.vpaidCreative) {
    return;
  }
  if (typeof this.vpaidCreative.getAdRemainingTime === 'function') {
    var remainingTime = this.vpaidCreative.getAdRemainingTime();
    if (remainingTime >= 0) {
      this.vpaidRemainingTime = remainingTime;
    }
  }
  _api.API.createEvent.call(this, 'addurationchange');
};

var _onAdVolumeChange = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdVolumeChange event');
  }
  var newVolume = VPAID.getAdVolume.call(this);
  if (newVolume === null) {
    return;
  }
  if (this.vpaidCurrentVolume > 0 && newVolume === 0) {
    _fwVast.FWVAST.dispatchPingEvent.call(this, 'mute');
  } else if (this.vpaidCurrentVolume === 0 && newVolume > 0) {
    _fwVast.FWVAST.dispatchPingEvent.call(this, 'unmute');
  }
  this.vpaidCurrentVolume = newVolume;
  _api.API.createEvent.call(this, 'advolumechanged');
};

var _onAdImpression = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdImpression event');
  }
  _api.API.createEvent.call(this, 'adimpression');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'impression');
};

var _onAdVideoStart = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdVideoStart event');
  }
  this.vpaidPaused = false;
  var newVolume = VPAID.getAdVolume.call(this);
  if (newVolume === null) {
    newVolume = 1;
  }
  this.vpaidCurrentVolume = newVolume;
  _api.API.createEvent.call(this, 'adstarted');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'start');
};

var _onAdVideoFirstQuartile = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdVideoFirstQuartile event');
  }
  _api.API.createEvent.call(this, 'adfirstquartile');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'firstQuartile');
};

var _onAdVideoMidpoint = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdVideoMidpoint event');
  }
  _api.API.createEvent.call(this, 'admidpoint');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'midpoint');
};

var _onAdVideoThirdQuartile = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdVideoThirdQuartile event');
  }
  _api.API.createEvent.call(this, 'adthirdquartile');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'thirdQuartile');
};

var _onAdVideoComplete = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdVideoComplete event');
  }
  _api.API.createEvent.call(this, 'adcomplete');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'complete');
};

var _onAdClickThru = function (url, id, playerHandles) {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdClickThru event');
  }
  _api.API.createEvent.call(this, 'adclick');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'clickthrough');
  if (typeof playerHandles !== 'boolean') {
    return;
  }
  if (!playerHandles) {
    return;
  } else {
    var destUrl = void 0;
    if (url) {
      destUrl = url;
    } else if (this.clickThroughUrl) {
      destUrl = this.clickThroughUrl;
    }
    if (destUrl) {
      // for getClickThroughUrl API method
      this.clickThroughUrl = destUrl;
      window.open(this.clickThroughUrl, '_blank');
    }
  }
};

var _onAdPaused = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdPaused event');
  }
  this.vpaidPaused = true;
  _api.API.createEvent.call(this, 'adpaused');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'pause');
};

var _onAdPlaying = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdPlaying event');
  }
  this.vpaidPaused = false;
  _api.API.createEvent.call(this, 'adresumed');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'resume');
};

var _onAdLog = function (message) {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdLog event ' + message);
  }
};

var _onAdError = function (message) {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdError event ' + message);
  }
  _ping.PING.error.call(this, 901);
  _vastErrors.VASTERRORS.process.call(this, 901);
};

var _onAdInteraction = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdInteraction event');
  }
  _api.API.createEvent.call(this, 'adinteraction');
};

var _onAdUserAcceptInvitation = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdUserAcceptInvitation event');
  }
  _api.API.createEvent.call(this, 'aduseracceptinvitation');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'acceptInvitation');
};

var _onAdUserMinimize = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdUserMinimize event');
  }
  _api.API.createEvent.call(this, 'adcollapse');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'collapse');
};

var _onAdUserClose = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdUserClose event');
  }
  _api.API.createEvent.call(this, 'adclose');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'close');
};

var _onAdSizeChange = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdSizeChange event');
  }
  _api.API.createEvent.call(this, 'adsizechange');
};

var _onAdLinearChange = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdLinearChange event');
  }
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdLinear === 'function') {
    this.adIsLinear = this.vpaidCreative.getAdLinear();
    _api.API.createEvent.call(this, 'adlinearchange');
  }
};

var _onAdExpandedChange = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdExpandedChange event');
  }
  _api.API.createEvent.call(this, 'adexpandedchange');
};

var _onAdRemainingTimeChange = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID AdRemainingTimeChange event');
  }
  if (!this.vpaidCreative && typeof this.vpaidCreative.getAdRemainingTime === 'function') {
    var remainingTime = this.vpaidCreative.getAdRemainingTime();
    if (remainingTime >= 0) {
      this.vpaidRemainingTime = remainingTime;
    }
  }
  _api.API.createEvent.call(this, 'adremainingtimechange');
};

// vpaidCreative methods
VPAID.resizeAd = function (width, height, viewMode) {
  if (!this.vpaidCreative) {
    return;
  }
  if (typeof width !== 'number' || typeof height !== 'number' || typeof viewMode !== 'string') {
    return;
  }
  if (width <= 0 || height <= 0) {
    return;
  }
  var validViewMode = 'normal';
  if (viewMode === 'fullscreen') {
    validViewMode = viewMode;
  }
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID resizeAd with width ' + width + ' - height ' + height + ' - viewMode ' + viewMode);
  }
  this.vpaidCreative.resizeAd(width, height, validViewMode);
};

VPAID.stopAd = function () {
  var _this2 = this;

  if (!this.vpaidCreative) {
    return;
  }
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: stopAd');
  }
  // when stopAd is called we need to check a 
  // AdStopped event follows
  this.adStoppedTimeout = setTimeout(function () {
    _onAdStopped.call(_this2);
  }, this.params.creativeLoadTimeout);
  this.vpaidCreative.stopAd();
};

VPAID.pauseAd = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: pauseAd');
  }
  if (this.vpaidCreative && !this.vpaidPaused) {
    this.vpaidCreative.pauseAd();
  }
};

VPAID.resumeAd = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: resumeAd');
  }
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
  var _this3 = this;

  if (!this.vpaidCreative) {
    return;
  }
  // when skipAd is called we need to check a 
  // AdSkipped event follows
  this.adSkippedTimeout = setTimeout(function () {
    _onAdStopped.call(_this3);
  }, this.params.creativeLoadTimeout);
  this.vpaidCreative.skipAd();
};

VPAID.setAdVolume = function (volume) {
  if (this.vpaidCreative && typeof volume === 'number' && volume >= 0 && volume <= 1 && typeof this.vpaidCreative.setAdVolume === 'function') {
    this.vpaidCreative.setAdVolume(volume);
  }
};

var _setCallbacksForCreative = function () {
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
  var callbacksKeys = Object.keys(this.vpaidCallbacks);
  for (var i = 0, len = callbacksKeys.length; i < len; i++) {
    var currentKey = callbacksKeys[i];
    this.vpaidCreative.subscribe(this.vpaidCallbacks[currentKey], currentKey);
  }
};

var _unsetCallbacksForCreative = function () {
  if (!this.vpaidCreative) {
    return;
  }
  // Looping through the object and registering each of the callbacks with the creative
  var callbacksKeys = Object.keys(this.vpaidCallbacks);
  for (var i = 0, len = callbacksKeys.length; i < len; i++) {
    var currentKey = callbacksKeys[i];
    this.vpaidCreative.unsubscribe(this.vpaidCallbacks[currentKey], currentKey);
  }
};

var _isValidVPAID = function (creative) {
  if (typeof creative.initAd === 'function' && typeof creative.startAd === 'function' && typeof creative.stopAd === 'function' && typeof creative.skipAd === 'function' && typeof creative.resizeAd === 'function' && typeof creative.pauseAd === 'function' && typeof creative.resumeAd === 'function' && typeof creative.expandAd === 'function' && typeof creative.collapseAd === 'function' && typeof creative.subscribe === 'function' && typeof creative.unsubscribe === 'function') {
    return true;
  }
  return false;
};

var _onVPAIDAvailable = function () {
  var _this4 = this;

  if (this.vpaidAvailableInterval) {
    clearInterval(this.vpaidAvailableInterval);
  }
  if (this.vpaidLoadTimeout) {
    clearTimeout(this.vpaidLoadTimeout);
  }
  this.vpaidCreative = this.vpaidIframe.contentWindow.getVPAIDAd();
  if (this.vpaidCreative && typeof this.vpaidCreative.handshakeVersion === 'function') {
    // we need to insure handshakeVersion return
    var vpaidVersion = void 0;
    try {
      vpaidVersion = this.vpaidCreative.handshakeVersion('2.0');
    } catch (e) {
      _fw.FW.log(e);
      if (DEBUG) {
        _fw.FW.log('RMP-VAST: could not validate VPAID ad unit handshakeVersion');
      }
      _ping.PING.error.call(this, 901);
      _vastErrors.VASTERRORS.process.call(this, 901);
      return;
    }
    this.vpaidVersion = parseInt(vpaidVersion);
    if (this.vpaidVersion < 1) {
      if (DEBUG) {
        _fw.FW.log('RMP-VAST: unsupported VPAID version - exit');
      }
      _ping.PING.error.call(this, 901);
      _vastErrors.VASTERRORS.process.call(this, 901);
      return;
    }
    if (!_isValidVPAID(this.vpaidCreative)) {
      //The VPAID creative doesn't conform to the VPAID spec
      if (DEBUG) {
        _fw.FW.log('RMP-VAST: VPAID creative does not conform to VPAID spec - exit');
      }
      _ping.PING.error.call(this, 901);
      _vastErrors.VASTERRORS.process.call(this, 901);
      return;
    }
    // wire callback for VPAID events
    _setCallbacksForCreative.call(this);
    // wire tracking events for VAST pings
    _trackingEvents.TRACKINGEVENTS.wire.call(this);
    var creativeData = {};
    creativeData.AdParameters = this.adParametersData;
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: VPAID AdParameters follow');
      _fw.FW.log(this.adParametersData);
    }
    _fw.FW.show(this.adContainer);
    _fw.FW.show(this.vastPlayer);
    var environmentVars = {};
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
    this.initAdTimeout = setTimeout(function () {
      if (!_this4.vpaidAdLoaded) {
        if (DEBUG) {
          _fw.FW.log('RMP-VAST: initAdTimeout');
        }
        _vastPlayer.VASTPLAYER.resumeContent.call(_this4);
      }
      _this4.vpaidAdLoaded = false;
    }, this.params.creativeLoadTimeout * 10);
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: calling initAd on VPAID creative now');
    }
    this.vpaidCreative.initAd(this.initialWidth, this.initialHeight, this.initialViewMode, this.desiredBitrate, creativeData, environmentVars);
  }
};

var _onJSVPAIDLoaded = function () {
  var _this5 = this;

  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID JS loaded');
  }
  this.vpaidScript.removeEventListener('load', this.onJSVPAIDLoaded);
  var iframeWindow = this.vpaidIframe.contentWindow;
  if (typeof iframeWindow.getVPAIDAd === 'function') {
    _onVPAIDAvailable.call(this);
  } else {
    this.vpaidAvailableInterval = setInterval(function () {
      if (typeof iframeWindow.getVPAIDAd === 'function') {
        _onVPAIDAvailable.call(_this5);
      }
    }, 100);
  }
};

var _onJSVPAIDError = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VPAID JS error loading');
  }
  this.vpaidScript.removeEventListener('error', this.onJSVPAIDError);
  _ping.PING.error.call(this, 901);
  _vastErrors.VASTERRORS.process.call(this, 901);
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
      var existingVastPlayer = this.adContainer.getElementsByClassName('rmp-ad-vast-video-player')[0];
      if (!existingVastPlayer) {
        _vastErrors.VASTERRORS.process.call(this, 1004);
        return;
      }
      this.vastPlayer = existingVastPlayer;
    }
  }
  // create FiF 
  this.vpaidIframe = document.createElement('iframe');
  this.vpaidIframe.id = 'vpaid-frame';
  // do not use display: none;
  // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  this.vpaidIframe.style.visibility = 'hidden';
  this.vpaidIframe.style.width = '0px';
  this.vpaidIframe.style.height = '0px';
  this.vpaidIframe.style.border = 'none';
  // this is to adhere to Best Practices for Rich Media Ads 
  // in Asynchronous Ad Environments  http://www.iab.net/media/file/rich_media_ajax_best_practices.pdf
  var src = 'about:self';
  // ... however this does not work in Firefox (onload is never reached)
  // https://bugzilla.mozilla.org/show_bug.cgi?id=444165
  // about:self also causes protocol mis-match issues with iframes in iOS/macOS Safari
  // ... TL;DR iframes are troubles
  if (_env.ENV.isFirefox || this.useContentPlayerForAds) {
    src = '';
  }
  this.vpaidIframe.onload = function () {
    var _this6 = this;

    if (DEBUG) {
      _fw.FW.log('RMP-VAST: iframe.onload');
    }
    // we unwire listeners
    this.vpaidIframe.onload = this.vpaidIframe.onerror = _fw.FW.nullFn;
    if (!this.vpaidIframe.contentWindow || !this.vpaidIframe.contentWindow.document || !this.vpaidIframe.contentWindow.document.body) {
      // PING error and resume content
      _ping.PING.error.call(this, 901);
      _vastErrors.VASTERRORS.process.call(this, 901);
      return;
    }
    var iframeWindow = this.vpaidIframe.contentWindow;
    var iframeDocument = iframeWindow.document;
    var iframeBody = iframeDocument.body;
    this.vpaidScript = iframeDocument.createElement('script');

    this.vpaidLoadTimeout = setTimeout(function () {
      if (DEBUG) {
        _fw.FW.log('RMP-VAST: could not load VPAID JS Creative or getVPAIDAd in iframeWindow - resume content');
      }
      _this6.vpaidScript.removeEventListener('load', _this6.onJSVPAIDLoaded);
      _this6.vpaidScript.removeEventListener('error', _this6.onJSVPAIDError);
      _vastPlayer.VASTPLAYER.resumeContent.call(_this6);
    }, this.params.creativeLoadTimeout);
    this.onJSVPAIDLoaded = _onJSVPAIDLoaded.bind(this);
    this.onJSVPAIDError = _onJSVPAIDError.bind(this);
    this.vpaidScript.addEventListener('load', this.onJSVPAIDLoaded);
    this.vpaidScript.addEventListener('error', this.onJSVPAIDError);
    iframeBody.appendChild(this.vpaidScript);
    this.vpaidScript.src = this.vpaidCreativeUrl;
  }.bind(this);

  this.vpaidIframe.onerror = function () {
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: iframe.onerror');
    }
    // we unwire listeners
    this.vpaidIframe.onload = this.vpaidIframe.onerror = _fw.FW.nullFn;
    // PING error and resume content
    _ping.PING.error.call(this, 901);
    _vastErrors.VASTERRORS.process.call(this, 901);
  }.bind(this);

  this.vpaidIframe.src = src;
  this.adContainer.appendChild(this.vpaidIframe);
};

VPAID.destroy = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: destroy VPAID dependencies');
  }
  if (this.vpaidAvailableInterval) {
    clearInterval(this.vpaidAvailableInterval);
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
    this.vpaidScript.removeEventListener('load', this.onJSVPAIDLoaded);
    this.vpaidScript.removeEventListener('error', this.onJSVPAIDError);
  }
  if (this.vpaidSlot) {
    try {
      this.adContainer.removeChild(this.vpaidSlot);
    } catch (e) {
      _fw.FW.trace(e);
    }
  }
  if (this.vpaidIframe) {
    try {
      this.adContainer.removeChild(this.vpaidIframe);
    } catch (e) {
      _fw.FW.trace(e);
    }
  }
};

exports.VPAID = VPAID;

},{"../api/api":1,"../creatives/icons":2,"../fw/env":6,"../fw/fw":8,"../fw/fw-vast":7,"../players/content-player":10,"../players/vast-player":11,"../tracking/ping":13,"../tracking/tracking-events":14,"../utils/vast-errors":16}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PING = undefined;

var _fw = require('../fw/fw');

var _fwVast = require('../fw/fw-vast');

var _contentPlayer = require('../players/content-player');

var PING = {};

PING.events = ['impression', 'creativeView', 'start', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete', 'mute', 'unmute', 'pause', 'resume', 'fullscreen', 'exitFullscreen', 'skip', 'progress', 'clickthrough', 'close', 'collapse', 'acceptInvitation'];

var _replaceMacros = function (url, errorCode, assetUri) {
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

var _ping = function (url) {
  // we expect an image format for the tracker (generally a 1px GIF/PNG/JPG) as 
  // this is the most common format in the industry 
  // other format may produce errors and the related tracker may not be requested properly
  var img = new Image();
  img.addEventListener('load', function () {
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: VAST tracker successfully loaded ' + url);
    }
    img = null;
  });
  img.addEventListener('error', function () {
    if (DEBUG) {
      _fw.FW.log('RMP-VAST: VAST tracker failed loading ' + url);
    }
    img = null;
  });
  img.src = url;
};

PING.tracking = function (url, assetUri) {
  var trackingUrl = _replaceMacros.call(this, url, null, assetUri);
  _ping(trackingUrl);
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: VAST tracking requesting ping at URL ' + trackingUrl);
  }
};

PING.error = function (errorCode, errorTags) {
  // for each Error tag within an InLine or chain of Wrapper ping error URL
  if (errorTags && errorTags.length > 0) {
    for (var i = 0, len = errorTags.length; i < len; i++) {
      var errorUrl = _replaceMacros.call(this, errorTags[i].url, errorCode, null);
      _ping(errorUrl);
      if (DEBUG) {
        _fw.FW.log('RMP-VAST: VAST tracking requesting error at URL ' + errorUrl);
      }
    }
  }
};

exports.PING = PING;

},{"../fw/fw":8,"../fw/fw-vast":7,"../players/content-player":10}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TRACKINGEVENTS = undefined;

var _fw = require('../fw/fw');

var _fwVast = require('../fw/fw-vast');

var _ping = require('./ping');

var _api = require('../api/api');

var _vastPlayer = require('../players/vast-player');

var TRACKINGEVENTS = {};

var _pingTrackers = function (trackers) {
  var _this = this;

  trackers.forEach(function (element) {
    _ping.PING.tracking.call(_this, element.url, _this.getAdMediaUrl());
  });
};

var _onEventPingTracking = function (event) {
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
      _pingTrackers.call(this, trackers);
    }
  }
};

var _onVolumeChange = function () {
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

var _onTimeupdate = function () {
  var _this2 = this;

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
          _this2.progressEventOffsetsSeconds.push({
            offsetSeconds: _fwVast.FWVAST.convertOffsetToSeconds(element, _this2.vastPlayerDuration),
            offsetRaw: element
          });
        });
        this.progressEventOffsetsSeconds.sort(function (a, b) {
          return a.offsetSeconds - b.offsetSeconds;
        });
      }
      if (Array.isArray(this.progressEventOffsetsSeconds) && this.progressEventOffsetsSeconds.length > 0 && this.vastPlayerCurrentTime >= this.progressEventOffsetsSeconds[0].offsetSeconds * 1000) {
        _fwVast.FWVAST.dispatchPingEvent.call(this, 'progress-' + this.progressEventOffsetsSeconds[0].offsetRaw);
        this.progressEventOffsetsSeconds.shift();
      }
    }
  }
};

var _onPause = function () {
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

var _onPlay = function () {
  if (this.vastPlayerPaused) {
    this.vastPlayerPaused = false;
    _api.API.createEvent.call(this, 'adresumed');
    _fwVast.FWVAST.dispatchPingEvent.call(this, 'resume');
  }
};

var _onPlaying = function () {
  this.vastPlayer.removeEventListener('playing', this.onPlaying);
  _api.API.createEvent.call(this, 'adimpression');
  _api.API.createEvent.call(this, 'adstarted');
  _fwVast.FWVAST.dispatchPingEvent.call(this, ['impression', 'creativeView', 'start']);
};

var _onEnded = function () {
  this.vastPlayer.removeEventListener('ended', this.onEnded);
  _api.API.createEvent.call(this, 'adcomplete');
  _fwVast.FWVAST.dispatchPingEvent.call(this, 'complete');
};

TRACKINGEVENTS.wire = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: wire tracking events');
  }

  // we filter through all HTML5 video events and create new VAST events 
  // those VAST events are based on PING.events
  if (this.vastPlayer && this.adIsLinear && !this.isVPAID) {
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
  }

  // wire for VAST tracking events
  this.onEventPingTracking = _onEventPingTracking.bind(this);
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: detected VAST events follow');
    _fw.FW.log(this.trackingTags);
  }
  for (var i = 0, len = this.trackingTags.length; i < len; i++) {
    if (this.adIsLinear || this.isVPAID) {
      this.vastPlayer.addEventListener(this.trackingTags[i].event, this.onEventPingTracking);
    } else {
      // non linear
      this.nonLinearContainer.addEventListener(this.trackingTags[i].event, this.onEventPingTracking);
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
      if (this.isSkippableAd) {
        if (event === 'progress') {
          var offset = trackingTags[i].getAttribute('offset');
          if (offset === null || offset === '' || !_fwVast.FWVAST.isValidOffset(offset)) {
            // offset attribute is required on Tracking event="progress"
            continue;
          }
          this.progressEventOffsets.push(offset);
          event = event + '-' + offset;
        } else if (event === 'skip') {
          // we make sure we have a skip event - this is expected for skippable ads
          // but in case it is not there we still need to properly resume content
          this.hasSkipEvent = true;
        }
      }
      this.trackingTags.push({ event: event, url: url });
    }
  }
};

exports.TRACKINGEVENTS = TRACKINGEVENTS;

},{"../api/api":1,"../fw/fw":8,"../fw/fw-vast":7,"../players/vast-player":11,"./ping":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RESET = undefined;

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
  this.onContextMenu = null;
  // init internal variables
  this.vastDocument = null;
  this.adTagUrl = null;
  this.vastPlayer = null;
  this.vpaidSlot = null;
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
  this.vastErrorCode = -1;
  this.vastErrorMessage = 'Error getting VAST error';
  this.adSystem = null;
  this.adIsLinear = null;
  this.adContentType = null;
  this.adTitle = null;
  this.adDescription = null;
  this.adOnStage = false;
  this.clickThroughUrl = null;
  this.isWrapper = false;
  this.vastAdTagURI = null;
  this.redirectsFollowed = 0;
  this.icons = [];
  this.clickUIOnMobile = null;
  this.currentContentSrc = null;
  this.customPlaybackCurrentTime = 0;
  this.antiSeekLogicInterval = null;
  this.creativeLoadTimeoutCallback = null;
  // skip
  this.isSkippableAd = false;
  this.hasSkipEvent = false;
  this.skipoffset = '';
  this.progressEventOffsets = [];
  this.progressEventOffsetsSeconds = null;
  this.skipButton = null;
  this.skipWaiting = null;
  this.skipMessage = null;
  this.skipIcon = null;
  this.skippableAdCanBeSkipped = false;
  // non linear
  this.nonLinearContainer = null;
  this.nonLinearATag = null;
  this.nonLinearImg = null;
  this.onClickCloseNonLinear = null;
  this.nonLinearCreativeHeight = 0;
  this.nonLinearCreativeWidth = 0;
  this.nonLinearMinSuggestedDuration = 0;
  // VPAID
  this.isVPAID = false;
  this.vpaidCreative = null;
  this.vpaidScript = null;
  this.vpaidIframe = null;
  this.vpaidLoadTimeout = null;
  this.initAdTimeout = null;
  this.startAdTimeout = null;
  this.vpaidAvailableInterval = null;
  this.adStoppedTimeout = null;
  this.adSkippedTimeout = null;
  this.adParametersData = '';
  this.vpaidCurrentVolume = 1;
  this.vpaidPaused = true;
  this.vpaidCreativeUrl = '';
  this.vpaidRemainingTime = -1;
  this.vpaidVersion = -1;
  this.vpaid1AdDuration = -1;
  this.initialWidth = 640;
  this.initialHeight = 360;
  this.initialViewMode = 'normal';
  this.desiredBitrate = 500;
  this.vpaidAdLoaded = false;
  this.vpaidAdStarted = false;
  this.vpaidCallbacks = {};
  this.onJSVPAIDLoaded = _fw.FW.nullFn;
  this.onJSVPAIDError = _fw.FW.nullFn;
};

RESET.unwireVastPlayerEvents = function () {
  if (DEBUG) {
    _fw.FW.log('RMP-VAST: RESET unwireVastPlayerEvents');
  }
  if (this.nonLinearContainer) {
    this.nonLinearImg.removeEventListener('load', this.onNonLinearLoadSuccess);
    this.nonLinearImg.removeEventListener('error', this.onNonLinearLoadError);
    this.nonLinearATag.removeEventListener('click', this.onNonLinearClickThrough);
    this.nonLinearClose.removeEventListener('click', this.onClickCloseNonLinear);
    for (var i = 0, len = this.trackingTags.length; i < len; i++) {
      this.nonLinearContainer.removeEventListener(this.trackingTags[i].event, this.onEventPingTracking);
    }
  }
  if (this.vastPlayer) {
    this.vastPlayer.removeEventListener('error', this.onPlaybackError);
    // vastPlayer content pause/resume events
    this.vastPlayer.removeEventListener('durationchange', this.onDurationChange);
    this.vastPlayer.removeEventListener('loadedmetadata', this.onLoadedmetadataPlay);
    this.vastPlayer.removeEventListener('ended', this.onEndedResumeContent);
    this.vastPlayer.removeEventListener('contextmenu', this.onContextMenu);
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
    if (this.onClickThrough !== null) {
      this.vastPlayer.removeEventListener('click', this.onClickThrough);
    }
    // remove icons 
    if (this.onPlayingAppendIcons !== null) {
      this.vastPlayer.removeEventListener('playing', this.onPlayingAppendIcons);
    }
    // skip
    if (this.onTimeupdateCheckSkip !== null) {
      this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdateCheckSkip);
    }
    if (this.skipButton && this.onClickSkip !== null) {
      this.skipButton.removeEventListener('click', this.onClickSkip);
      this.skipButton.removeEventListener('touchend', this.onClickSkip);
    }
    // click UI on mobile
    if (this.clickUIOnMobile && this.onClickThrough !== null) {
      this.clickUIOnMobile.removeEventListener('click', this.onClickThrough);
    }
  }
  if (this.contentPlayer) {
    this.contentPlayer.removeEventListener('error', this.onPlaybackError);
  }
};

exports.RESET = RESET;

},{"../fw/fw":8}],16:[function(require,module,exports){
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

var _updateVastError = function (errorCode) {
  var error = VASTERRORS.list.filter(function (value) {
    return value.code === errorCode;
  });
  if (error.length > 0) {
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
  _updateVastError.call(this, errorCode);
  _api.API.createEvent.call(this, 'aderror');
  _vastPlayer.VASTPLAYER.resumeContent.call(this);
};

exports.VASTERRORS = VASTERRORS;

},{"../api/api":1,"../fw/fw":8,"../players/vast-player":11}],17:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
module.exports = require('../modules/_core').Promise;

},{"../modules/_core":40,"../modules/es6.object.to-string":110,"../modules/es6.promise":113,"../modules/es6.string.iterator":114,"../modules/web.dom.iterable":116}],18:[function(require,module,exports){
require('../../modules/es6.array.filter');
module.exports = require('../../modules/_core').Array.filter;

},{"../../modules/_core":40,"../../modules/es6.array.filter":101}],19:[function(require,module,exports){
require('../../modules/es6.array.for-each');
module.exports = require('../../modules/_core').Array.forEach;

},{"../../modules/_core":40,"../../modules/es6.array.for-each":102}],20:[function(require,module,exports){
require('../../modules/es6.array.index-of');
module.exports = require('../../modules/_core').Array.indexOf;

},{"../../modules/_core":40,"../../modules/es6.array.index-of":103}],21:[function(require,module,exports){
require('../../modules/es6.array.is-array');
module.exports = require('../../modules/_core').Array.isArray;

},{"../../modules/_core":40,"../../modules/es6.array.is-array":104}],22:[function(require,module,exports){
require('../../modules/es6.array.sort');
module.exports = require('../../modules/_core').Array.sort;

},{"../../modules/_core":40,"../../modules/es6.array.sort":106}],23:[function(require,module,exports){
require('../../modules/es6.function.bind');
module.exports = require('../../modules/_core').Function.bind;

},{"../../modules/_core":40,"../../modules/es6.function.bind":107}],24:[function(require,module,exports){
require('../../modules/es6.number.is-finite');
module.exports = require('../../modules/_core').Number.isFinite;

},{"../../modules/_core":40,"../../modules/es6.number.is-finite":108}],25:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/_core').Object.keys;

},{"../../modules/_core":40,"../../modules/es6.object.keys":109}],26:[function(require,module,exports){
require('../modules/es6.parse-float');
module.exports = require('../modules/_core').parseFloat;

},{"../modules/_core":40,"../modules/es6.parse-float":111}],27:[function(require,module,exports){
require('../modules/es6.parse-int');
module.exports = require('../modules/_core').parseInt;

},{"../modules/_core":40,"../modules/es6.parse-int":112}],28:[function(require,module,exports){
require('../../modules/es6.string.trim');
module.exports = require('../../modules/_core').String.trim;

},{"../../modules/_core":40,"../../modules/es6.string.trim":115}],29:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],30:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_hide":51,"./_wks":99}],31:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],32:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":58}],33:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":92,"./_to-iobject":94,"./_to-length":95}],34:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx');
var IObject = require('./_iobject');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":36,"./_ctx":41,"./_iobject":55,"./_to-length":95,"./_to-object":96}],35:[function(require,module,exports){
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-array":57,"./_is-object":58,"./_wks":99}],36:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":35}],37:[function(require,module,exports){
'use strict';
var aFunction = require('./_a-function');
var isObject = require('./_is-object');
var invoke = require('./_invoke');
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

},{"./_a-function":29,"./_invoke":54,"./_is-object":58}],38:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":39,"./_wks":99}],39:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],40:[function(require,module,exports){
var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],41:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":29}],42:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],43:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":47}],44:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":49,"./_is-object":58}],45:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],46:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":40,"./_ctx":41,"./_global":49,"./_hide":51,"./_redefine":81}],47:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],48:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":32,"./_ctx":41,"./_is-array-iter":56,"./_iter-call":59,"./_to-length":95,"./core.get-iterator-method":100}],49:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],50:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],51:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":43,"./_object-dp":69,"./_property-desc":79}],52:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":49}],53:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":43,"./_dom-create":44,"./_fails":47}],54:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],55:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":39}],56:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":64,"./_wks":99}],57:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":39}],58:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],59:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":32}],60:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":51,"./_object-create":68,"./_property-desc":79,"./_set-to-string-tag":83,"./_wks":99}],61:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var has = require('./_has');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = (!BUGGY && $native) || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":46,"./_has":50,"./_hide":51,"./_iter-create":60,"./_iterators":64,"./_library":65,"./_object-gpo":71,"./_redefine":81,"./_set-to-string-tag":83,"./_wks":99}],62:[function(require,module,exports){
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":99}],63:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],64:[function(require,module,exports){
module.exports = {};

},{}],65:[function(require,module,exports){
module.exports = false;

},{}],66:[function(require,module,exports){
var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_cof":39,"./_global":49,"./_task":91}],67:[function(require,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":29}],68:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":32,"./_dom-create":44,"./_enum-bug-keys":45,"./_html":52,"./_object-dps":70,"./_shared-key":84}],69:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":32,"./_descriptors":43,"./_ie8-dom-define":53,"./_to-primitive":97}],70:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":32,"./_descriptors":43,"./_object-dp":69,"./_object-keys":73}],71:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":50,"./_shared-key":84,"./_to-object":96}],72:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":33,"./_has":50,"./_shared-key":84,"./_to-iobject":94}],73:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":45,"./_object-keys-internal":72}],74:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_core":40,"./_export":46,"./_fails":47}],75:[function(require,module,exports){
var $parseFloat = require('./_global').parseFloat;
var $trim = require('./_string-trim').trim;

module.exports = 1 / $parseFloat(require('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

},{"./_global":49,"./_string-trim":89,"./_string-ws":90}],76:[function(require,module,exports){
var $parseInt = require('./_global').parseInt;
var $trim = require('./_string-trim').trim;
var ws = require('./_string-ws');
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

},{"./_global":49,"./_string-trim":89,"./_string-ws":90}],77:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],78:[function(require,module,exports){
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":32,"./_is-object":58,"./_new-promise-capability":67}],79:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],80:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":81}],81:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":40,"./_global":49,"./_has":50,"./_hide":51,"./_uid":98}],82:[function(require,module,exports){
'use strict';
var global = require('./_global');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_descriptors":43,"./_global":49,"./_object-dp":69,"./_wks":99}],83:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":50,"./_object-dp":69,"./_wks":99}],84:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":85,"./_uid":98}],85:[function(require,module,exports){
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":49}],86:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":29,"./_an-object":32,"./_wks":99}],87:[function(require,module,exports){
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":47}],88:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":42,"./_to-integer":93}],89:[function(require,module,exports){
var $export = require('./_export');
var defined = require('./_defined');
var fails = require('./_fails');
var spaces = require('./_string-ws');
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

},{"./_defined":42,"./_export":46,"./_fails":47,"./_string-ws":90}],90:[function(require,module,exports){
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],91:[function(require,module,exports){
var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":39,"./_ctx":41,"./_dom-create":44,"./_global":49,"./_html":52,"./_invoke":54}],92:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":93}],93:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],94:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":42,"./_iobject":55}],95:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":93}],96:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":42}],97:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":58}],98:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],99:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":49,"./_shared":85,"./_uid":98}],100:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":38,"./_core":40,"./_iterators":64,"./_wks":99}],101:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":34,"./_export":46,"./_strict-method":87}],102:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $forEach = require('./_array-methods')(0);
var STRICT = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":34,"./_export":46,"./_strict-method":87}],103:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $indexOf = require('./_array-includes')(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

},{"./_array-includes":33,"./_export":46,"./_strict-method":87}],104:[function(require,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', { isArray: require('./_is-array') });

},{"./_export":46,"./_is-array":57}],105:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":30,"./_iter-define":61,"./_iter-step":63,"./_iterators":64,"./_to-iobject":94}],106:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var fails = require('./_fails');
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});

},{"./_a-function":29,"./_export":46,"./_fails":47,"./_strict-method":87,"./_to-object":96}],107:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', { bind: require('./_bind') });

},{"./_bind":37,"./_export":46}],108:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export = require('./_export');
var _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

},{"./_export":46,"./_global":49}],109:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":73,"./_object-sap":74,"./_to-object":96}],110:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./_classof');
var test = {};
test[require('./_wks')('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  require('./_redefine')(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}

},{"./_classof":38,"./_redefine":81,"./_wks":99}],111:[function(require,module,exports){
var $export = require('./_export');
var $parseFloat = require('./_parse-float');
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });

},{"./_export":46,"./_parse-float":75}],112:[function(require,module,exports){
var $export = require('./_export');
var $parseInt = require('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });

},{"./_export":46,"./_parse-int":76}],113:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":29,"./_an-instance":31,"./_classof":38,"./_core":40,"./_ctx":41,"./_export":46,"./_for-of":48,"./_global":49,"./_is-object":58,"./_iter-detect":62,"./_library":65,"./_microtask":66,"./_new-promise-capability":67,"./_perform":77,"./_promise-resolve":78,"./_redefine-all":80,"./_set-species":82,"./_set-to-string-tag":83,"./_species-constructor":86,"./_task":91,"./_wks":99}],114:[function(require,module,exports){
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":61,"./_string-at":88}],115:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./_string-trim')('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});

},{"./_string-trim":89}],116:[function(require,module,exports){
var $iterators = require('./es6.array.iterator');
var getKeys = require('./_object-keys');
var redefine = require('./_redefine');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var wks = require('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./_global":49,"./_hide":51,"./_iterators":64,"./_object-keys":73,"./_redefine":81,"./_wks":99,"./es6.array.iterator":105}]},{},[9]);
