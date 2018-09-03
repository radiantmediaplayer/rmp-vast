/**
 * @license Copyright (c) 2017-2018 Radiant Media Player | https://www.radiantmediaplayer.com
 * rmp-vast 2.1.2
 * GitHub: https://github.com/radiantmediaplayer/rmp-vast
 * MIT License: https://github.com/radiantmediaplayer/rmp-vast/blob/master/LICENSE
 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @license Copyright (c) 2015-2018 Radiant Media Player 
 * rmp-connection 0.1.7 | https://github.com/radiantmediaplayer/rmp-connection
 */

var RMPCONNECTION = {};

var connectionType = null;

var _getConnectionType = function () {
  if (typeof navigator.connection.type === 'string' && navigator.connection.type !== '') {
    return navigator.connection.type;
  }
  return null;
};

var _getArbitraryBitrateData = function () {
  // we actually have indication here: http://wicg.github.io/netinfo/#effective-connection-types
  var equivalentMbpsArray = [0.025, 0.035, 0.35, 1.4];
  // if we are in a bluetooth/cellular connection.type with 4g assuming 1.4 Mbps is a bit high so we settle for 0.7 Mbps
  // for ethernet/wifi/wimax where available bandwidth is likely higher we settle for 2.1 Mbps
  if (connectionType) {
    switch (connectionType) {
      case 'bluetooth':
      case 'cellular':
        equivalentMbpsArray[3] = 0.7;
        break;
      case 'ethernet':
      case 'wifi':
      case 'wimax':
        equivalentMbpsArray[3] = 2.1;
        break;
      default:
        break;
    }
  }
  return equivalentMbpsArray;
};

RMPCONNECTION.getBandwidthEstimate = function () {
  // we are not in a supported environment - exit
  if (typeof window === 'undefined') {
    return -1;
  }
  // we are offline - exit
  if (typeof navigator.onLine !== 'undefined' && !navigator.onLine) {
    return -1;
  }
  // we do not have navigator.connection - exit
  // for support see https://caniuse.com/#feat=netinfo
  if (typeof navigator.connection === 'undefined') {
    return -1;
  }
  connectionType = _getConnectionType();
  // we do have navigator.connection.type but it reports no connection - exit
  if (connectionType && connectionType === 'none') {
    return -1;
  }
  // we have navigator.connection.downlink - this is our best estimate
  // Returns the effective bandwidth estimate in megabits per second, rounded to the nearest multiple of 25 kilobits per seconds.
  if (typeof navigator.connection.downlink === 'number' && navigator.connection.downlink > 0) {
    return navigator.connection.downlink;
  }
  // we have navigator.connection.effectiveType - this is our second best estimate
  // Returns the effective type of the connection meaning one of 'slow-2g', '2g', '3g', or '4g'. This value is determined using a combination of recently observed, round-trip time and downlink values.
  var arbitraryBitrateData = _getArbitraryBitrateData();
  if (typeof navigator.connection.effectiveType === 'string' && navigator.connection.effectiveType !== '') {
    switch (navigator.connection.effectiveType) {
      case 'slow-2g':
        return arbitraryBitrateData[0];
      case '2g':
        return arbitraryBitrateData[1];
      case '3g':
        return arbitraryBitrateData[2];
      case '4g':
        return arbitraryBitrateData[3];
      default:
        break;
    }
  }
  // finally we have navigator.connection.type - this won't help much 
  if (connectionType) {
    switch (connectionType) {
      case 'ethernet':
      case 'wifi':
      case 'wimax':
        return 1.4;
      case 'bluetooth':
        return 0.35;
      default:
        break;
    }
    // there is no point in guessing bandwidth when navigator.connection.type is cellular this can vary from 0 to 100 Mbps 
    // better to admit we do not know and find another way to detect bandwidth, this could include:
    // - context guess: user-agent detection (mobile vs desktop), device width or pixel ratio 
    // - AJAX/Fetch timing: this is outside rmp-connection scope
  }
  // nothing worked - exit
  return -1;
};

exports.default = RMPCONNECTION;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fw = require('../fw/fw');

var _fw2 = _interopRequireDefault(_fw);

var _env = require('../fw/env');

var _env2 = _interopRequireDefault(_env);

var _vastPlayer = require('../players/vast-player');

var _vastPlayer2 = _interopRequireDefault(_vastPlayer);

var _contentPlayer = require('../players/content-player');

var _contentPlayer2 = _interopRequireDefault(_contentPlayer);

var _vpaid = require('../players/vpaid');

var _vpaid2 = _interopRequireDefault(_vpaid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var API = {};

API.attach = function (RmpVast) {

  RmpVast.prototype.play = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        _vpaid2.default.resumeAd.call(this);
      } else {
        _vastPlayer2.default.play.call(this);
      }
    } else {
      _contentPlayer2.default.play.call(this);
    }
  };

  RmpVast.prototype.pause = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        _vpaid2.default.pauseAd.call(this);
      } else {
        _vastPlayer2.default.pause.call(this);
      }
    } else {
      _contentPlayer2.default.pause.call(this);
    }
  };

  RmpVast.prototype.getAdPaused = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        return _vpaid2.default.getAdPaused.call(this);
      } else {
        return this.vastPlayerPaused;
      }
    }
    return false;
  };

  RmpVast.prototype.setVolume = function (level) {
    if (!_fw2.default.isNumber(level)) {
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
        _vpaid2.default.setAdVolume.call(this, validatedLevel);
      }
      _vastPlayer2.default.setVolume.call(this, validatedLevel);
    }
    _contentPlayer2.default.setVolume.call(this, validatedLevel);
  };

  RmpVast.prototype.getVolume = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        return _vpaid2.default.getAdVolume.call(this);
      } else {
        return _vastPlayer2.default.getVolume.call(this);
      }
    }
    return _contentPlayer2.default.getVolume.call(this);
  };

  RmpVast.prototype.setMute = function (muted) {
    if (typeof muted !== 'boolean') {
      return;
    }
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        if (muted) {
          _vpaid2.default.setAdVolume.call(this, 0);
        } else {
          _vpaid2.default.setAdVolume.call(this, 1);
        }
      } else {
        _vastPlayer2.default.setMute.call(this, muted);
      }
    }
    _contentPlayer2.default.setMute.call(this, muted);
  };

  RmpVast.prototype.getMute = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        if (_vpaid2.default.getAdVolume.call(this) === 0) {
          return true;
        }
        return false;
      } else {
        return _vastPlayer2.default.getMute.call(this);
      }
    }
    return _contentPlayer2.default.getMute.call(this);
  };

  RmpVast.prototype.stopAds = function () {
    if (this.adOnStage) {
      if (this.isVPAID) {
        _vpaid2.default.stopAd.call(this);
      } else {
        // this will destroy ad
        _vastPlayer2.default.resumeContent.call(this);
      }
    }
  };

  RmpVast.prototype.getAdTagUrl = function () {
    return this.adTagUrl;
  };

  RmpVast.prototype.getAdMediaUrl = function () {
    if (this.adOnStage) {
      if (this.isVPAID) {
        return _vpaid2.default.getCreativeUrl.call(this);
      } else {
        return this.adMediaUrl;
      }
    }
    return null;
  };

  RmpVast.prototype.getAdLinear = function () {
    return this.adIsLinear;
  };

  RmpVast.prototype.getAdSystem = function () {
    return this.adSystem;
  };

  RmpVast.prototype.getAdContentType = function () {
    if (this.adOnStage) {
      if (this.adIsLinear || this.isVPAID) {
        return this.adContentType;
      } else {
        return this.nonLinearContentType;
      }
    }
    return '';
  };

  RmpVast.prototype.getAdTitle = function () {
    return this.adTitle;
  };

  RmpVast.prototype.getAdDescription = function () {
    return this.adDescription;
  };

  RmpVast.prototype.getAdDuration = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        var duration = _vpaid2.default.getAdDuration.call(this);
        if (duration > 0) {
          duration = duration * 1000;
        }
        return duration;
      } else {
        return _vastPlayer2.default.getDuration.call(this);
      }
    }
    return -1;
  };

  RmpVast.prototype.getAdCurrentTime = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        var remainingTime = _vpaid2.default.getAdRemainingTime.call(this);
        var duration = _vpaid2.default.getAdDuration.call(this);
        if (remainingTime === -1 || duration === -1 || remainingTime > duration) {
          return -1;
        }
        return (duration - remainingTime) * 1000;
      } else {
        return _vastPlayer2.default.getCurrentTime.call(this);
      }
    }
    return -1;
  };

  RmpVast.prototype.getAdRemainingTime = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        return _vpaid2.default.getAdRemainingTime.call(this);
      } else {
        var currentTime = _vastPlayer2.default.getCurrentTime.call(this);
        var duration = _vastPlayer2.default.getDuration.call(this);
        if (currentTime === -1 || duration === -1 || currentTime > duration) {
          return -1;
        }
        return (duration - currentTime) * 1000;
      }
    }
    return -1;
  };

  RmpVast.prototype.getAdOnStage = function () {
    return this.adOnStage;
  };

  RmpVast.prototype.getAdMediaWidth = function () {
    if (this.adOnStage) {
      if (this.isVPAID) {
        return _vpaid2.default.getAdWidth.call(this);
      } else if (this.adIsLinear) {
        return this.adMediaWidth;
      } else {
        return this.nonLinearCreativeWidth;
      }
    }
    return -1;
  };

  RmpVast.prototype.getAdMediaHeight = function () {
    if (this.adOnStage) {
      if (this.isVPAID) {
        return _vpaid2.default.getAdHeight.call(this);
      } else if (this.adIsLinear) {
        return this.adMediaHeight;
      } else {
        return this.nonLinearCreativeHeight;
      }
    }
    return -1;
  };

  RmpVast.prototype.getClickThroughUrl = function () {
    return this.clickThroughUrl;
  };

  RmpVast.prototype.getIsSkippableAd = function () {
    return this.isSkippableAd;
  };

  RmpVast.prototype.getContentPlayerCompleted = function () {
    return this.contentPlayerCompleted;
  };

  RmpVast.prototype.setContentPlayerCompleted = function (value) {
    if (typeof value === 'boolean') {
      this.contentPlayerCompleted = value;
    }
  };

  RmpVast.prototype.getAdErrorMessage = function () {
    return this.vastErrorMessage;
  };

  RmpVast.prototype.getAdVastErrorCode = function () {
    return this.vastErrorCode;
  };

  RmpVast.prototype.getAdErrorType = function () {
    return this.adErrorType;
  };

  RmpVast.prototype.getEnvironment = function () {
    return _env2.default;
  };

  RmpVast.prototype.getFramework = function () {
    return _fw2.default;
  };

  RmpVast.prototype.getVastPlayer = function () {
    return this.vastPlayer;
  };

  RmpVast.prototype.getContentPlayer = function () {
    return this.contentPlayer;
  };

  RmpVast.prototype.getVpaidCreative = function () {
    if (this.adOnStage && this.isVPAID) {
      return _vpaid2.default.getVpaidCreative.call(this);
    }
    return null;
  };

  RmpVast.prototype.getIsUsingContentPlayerForAds = function () {
    return this.useContentPlayerForAds;
  };

  RmpVast.prototype.initialize = function () {
    if (this.rmpVastInitialized) {
      if (DEBUG) {
        _fw2.default.log('rmp-vast already initialized');
      }
    } else {
      if (DEBUG) {
        _fw2.default.log('on user interaction - player needs to be initialized');
      }
      _vastPlayer2.default.init.call(this);
    }
  };

  RmpVast.prototype.getInitialized = function () {
    return this.rmpVastInitialized;
  };

  // adpod 
  RmpVast.prototype.getAdPodInfo = function () {
    if (this.adPodApiInfo.length > 0) {
      var result = {};
      result.adPodCurrentIndex = this.adPodCurrentIndex;
      result.adPodLength = this.adPodApiInfo.length;
      return result;
    }
    return null;
  };

  // VPAID methods
  RmpVast.prototype.resizeAd = function (width, height, viewMode) {
    if (this.adOnStage && this.isVPAID) {
      _vpaid2.default.resizeAd.call(this, width, height, viewMode);
    }
  };

  RmpVast.prototype.expandAd = function () {
    if (this.adOnStage && this.isVPAID) {
      _vpaid2.default.expandAd.call(this);
    }
  };

  RmpVast.prototype.collapseAd = function () {
    if (this.adOnStage && this.isVPAID) {
      _vpaid2.default.collapseAd.call(this);
    }
  };

  RmpVast.prototype.skipAd = function () {
    if (this.adOnStage && this.isVPAID) {
      _vpaid2.default.skipAd.call(this);
    }
  };

  RmpVast.prototype.getAdExpanded = function () {
    if (this.adOnStage && this.isVPAID) {
      _vpaid2.default.getAdExpanded.call(this);
    }
    return false;
  };

  RmpVast.prototype.getAdSkippableState = function () {
    if (this.adOnStage && this.isVPAID) {
      _vpaid2.default.getAdSkippableState.call(this);
    }
    return false;
  };

  RmpVast.prototype.getAdCompanions = function () {
    if (this.adOnStage && this.isVPAID) {
      _vpaid2.default.getAdCompanions.call(this);
    }
    return '';
  };
};

exports.default = API;

},{"../fw/env":7,"../fw/fw":8,"../players/content-player":10,"../players/vast-player":11,"../players/vpaid":12}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fw = require('../fw/fw');

var _fw2 = _interopRequireDefault(_fw);

var _ping = require('../tracking/ping');

var _ping2 = _interopRequireDefault(_ping);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ICONS = {};

ICONS.destroy = function () {
  if (DEBUG) {
    _fw2.default.log('start destroying icons');
  }
  var icons = this.adContainer.querySelectorAll('.rmp-ad-container-icons');
  if (icons.length > 0) {
    for (var i = 0, len = icons.length; i < len; i++) {
      _fw2.default.removeElement(icons[i]);
    }
  }
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
    _fw2.default.log('start parsing for icons');
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
    var staticResourceUrl = _fw2.default.getNodeValue(staticResource[0], true);
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
    var iconViewTrackingUrl = _fw2.default.getNodeValue(iconViewTracking[0], true);
    if (iconViewTrackingUrl !== null) {
      iconData.iconViewTrackingUrl = iconViewTrackingUrl;
    }
    //optional IconClicks
    var iconClicks = currentIcon.getElementsByTagName('IconClicks');
    if (iconClicks.length > 0) {
      var iconClickThrough = iconClicks[0].getElementsByTagName('IconClickThrough');
      var iconClickThroughUrl = _fw2.default.getNodeValue(iconClickThrough[0], true);
      if (iconClickThroughUrl !== null) {
        iconData.iconClickThroughUrl = iconClickThroughUrl;
        var iconClickTracking = iconClicks[0].getElementsByTagName('IconClickTracking');
        if (iconClickTracking.length > 0) {
          iconData.iconClickTrackingUrl = [];
          for (var _i = 0, _len = iconClickTracking.length; _i < _len; _i++) {
            var iconClickTrackingUrl = _fw2.default.getNodeValue(iconClickTracking[_i], true);
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
    _fw2.default.log('validated parsed icons follows');
    _fw2.default.log(this.icons);
  }
};

var _onIconClickThrough = function (index, event) {
  var _this = this;

  if (DEBUG) {
    _fw2.default.log('click on icon with index ' + index);
  }
  if (event) {
    event.stopPropagation();
    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }
  _fw2.default.openWindow(this.icons[index].iconClickThroughUrl);
  // send trackers if any for IconClickTracking
  if (typeof this.icons[index].iconClickTrackingUrl !== 'undefined') {
    var iconClickTrackingUrl = this.icons[index].iconClickTrackingUrl;
    if (iconClickTrackingUrl.length > 0) {
      iconClickTrackingUrl.forEach(function (element) {
        _ping2.default.tracking.call(_this, element, null);
      });
    }
  }
};

var _onIconLoadPingTracking = function (index) {
  if (DEBUG) {
    _fw2.default.log('IconViewTracking for icon at index ' + index);
  }
  _ping2.default.tracking.call(this, this.icons[index].iconViewTrackingUrl, null);
};

var _onPlayingAppendIcons = function () {
  if (DEBUG) {
    _fw2.default.log('playing states has been reached - append icons');
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
      icon.addEventListener('touchend', _onIconClickThrough.bind(this, i));
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

exports.default = ICONS;

},{"../fw/fw":8,"../tracking/ping":13}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fw = require('../fw/fw');

var _fw2 = _interopRequireDefault(_fw);

var _env = require('../fw/env');

var _env2 = _interopRequireDefault(_env);

var _helpers = require('../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _ping = require('../tracking/ping');

var _ping2 = _interopRequireDefault(_ping);

var _contentPlayer = require('../players/content-player');

var _contentPlayer2 = _interopRequireDefault(_contentPlayer);

var _vastPlayer = require('../players/vast-player');

var _vastPlayer2 = _interopRequireDefault(_vastPlayer);

var _vpaid = require('../players/vpaid');

var _vpaid2 = _interopRequireDefault(_vpaid);

var _skip = require('./skip');

var _skip2 = _interopRequireDefault(_skip);

var _icons = require('./icons');

var _icons2 = _interopRequireDefault(_icons);

var _vastErrors = require('../utils/vast-errors');

var _vastErrors2 = _interopRequireDefault(_vastErrors);

var _rmpConnection = require('../../../externals/rmp-connection');

var _rmpConnection2 = _interopRequireDefault(_rmpConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LINEAR = {};

var VPAID_PATTERN = /vpaid/i;
var JS_PATTERN = /\/javascript/i;
var HLS_PATTERN = /(application\/vnd\.apple\.mpegurl|x-mpegurl)/i;
var DASH_PATTERN = /application\/dash\+xml/i;
var html5MediaErrorTypes = ['MEDIA_ERR_CUSTOM', 'MEDIA_ERR_ABORTED', 'MEDIA_ERR_NETWORK', 'MEDIA_ERR_DECODE', 'MEDIA_ERR_SRC_NOT_SUPPORTED', 'MEDIA_ERR_ENCRYPTED'];
var testCommonVideoFormats = ['video/webm', 'video/mp4', 'video/ogg', 'video/3gpp'];

var _onDurationChange = function () {
  if (DEBUG) {
    _fw2.default.log('durationchange for VAST player reached');
  }
  this.vastPlayer.removeEventListener('durationchange', this.onDurationChange);
  this.vastPlayerDuration = _vastPlayer2.default.getDuration.call(this);
  _helpers2.default.createApiEvent.call(this, 'addurationchange');
};

var _onLoadedmetadataPlay = function () {
  if (DEBUG) {
    _fw2.default.log('loadedmetadata for VAST player reached');
  }
  this.vastPlayer.removeEventListener('loadedmetadata', this.onLoadedmetadataPlay);
  clearTimeout(this.creativeLoadTimeoutCallback);
  _helpers2.default.createApiEvent.call(this, 'adloaded');
  if (DEBUG) {
    _fw2.default.log('pause content player');
  }
  _contentPlayer2.default.pause.call(this);
  // show ad container holding vast player
  _fw2.default.show(this.adContainer);
  _fw2.default.show(this.vastPlayer);
  this.adOnStage = true;
  // play VAST player
  if (DEBUG) {
    _fw2.default.log('play VAST player');
  }
  _vastPlayer2.default.play.call(this, this.firstVastPlayerPlayRequest);
  if (this.firstVastPlayerPlayRequest) {
    this.firstVastPlayerPlayRequest = false;
  }
};

var _onClickThrough = function (event) {
  if (event) {
    event.stopPropagation();
  }
  if (DEBUG) {
    _fw2.default.log('onClickThrough');
  }
  if (!_env2.default.isMobile) {
    _fw2.default.openWindow(this.clickThroughUrl);
  }
  if (this.params.pauseOnClick) {
    this.pause();
  }
  _helpers2.default.createApiEvent.call(this, 'adclick');
  _helpers2.default.dispatchPingEvent.call(this, 'clickthrough');
};

var _onPlaybackError = function (event) {
  // https://www.w3.org/TR/html50/embedded-content-0.html#mediaerror
  // MEDIA_ERR_SRC_NOT_SUPPORTED is sign of fatal error
  // other errors may produce non-fatal error in the browser so we do not 
  // act upon them
  if (event && event.target) {
    var videoElement = event.target;
    if (_fw2.default.isObject(videoElement.error) && _fw2.default.isNumber(videoElement.error.code)) {
      var errorCode = videoElement.error.code;
      var errorMessage = '';
      if (typeof videoElement.error.message === 'string') {
        errorMessage = videoElement.error.message;
      }
      if (DEBUG) {
        _fw2.default.log('error on video element with code ' + errorCode.toString() + ' and message ' + errorMessage);
        if (html5MediaErrorTypes[errorCode]) {
          _fw2.default.log('error type is ' + html5MediaErrorTypes[errorCode]);
        }
      }
      // EDIA_ERR_SRC_NOT_SUPPORTED (numeric value 4)
      if (errorCode === 4) {
        _ping2.default.error.call(this, 401);
        _vastErrors2.default.process.call(this, 401);
      }
    }
  }
};

var _appendClickUIOnMobile = function () {
  // we create a <a> tag rather than using window.open 
  // because it works better in standalone mode and WebView
  this.clickUIOnMobile = document.createElement('a');
  this.clickUIOnMobile.className = 'rmp-ad-click-ui-mobile';
  this.clickUIOnMobile.textContent = this.params.textForClickUIOnMobile;
  this.clickUIOnMobile.addEventListener('touchend', this.onClickThrough);
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
    _fw2.default.log('update vast player for linear creative of type ' + type + ' located at ' + url);
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
  this.creativeLoadTimeoutCallback = setTimeout(function () {
    _ping2.default.error.call(_this, 402);
    _vastErrors2.default.process.call(_this, 402);
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
    if (_env2.default.isMobile) {
      _appendClickUIOnMobile.call(this);
    } else {
      this.vastPlayer.addEventListener('click', this.onClickThrough);
    }
  }

  // skippable - only where vast player is different from 
  // content player
  if (this.isSkippableAd) {
    _skip2.default.append.call(this);
  }
};

LINEAR.parse = function (linear) {
  // we have an InLine Linear which is not a Wrapper - process MediaFiles
  this.adIsLinear = true;
  if (DEBUG) {
    var duration = linear[0].getElementsByTagName('Duration');
    if (duration.length === 0) {
      if (DEBUG) {
        _fw2.default.log('missing Duration tag child of Linear tag - this is not a VAST 3 spec compliant adTag - continuing anyway (same as IMA)');
      }
    }
  }
  var mediaFiles = linear[0].getElementsByTagName('MediaFiles');
  if (mediaFiles.length === 0) {
    // 1 MediaFiles element must be present otherwise VAST document is not spec compliant 
    _ping2.default.error.call(this, 101);
    _vastErrors2.default.process.call(this, 101);
    return;
  }
  // Industry Icons - currently we only support one icon
  var icons = linear[0].getElementsByTagName('Icons');
  if (icons.length > 0) {
    _icons2.default.parse.call(this, icons);
  }
  // check for AdParameters tag in case we have a VPAID creative
  var adParameters = linear[0].getElementsByTagName('AdParameters');
  this.adParametersData = '';
  if (adParameters.length > 0) {
    this.adParametersData = _fw2.default.getNodeValue(adParameters[0], false);
  }
  var mediaFile = mediaFiles[0].getElementsByTagName('MediaFile');
  if (mediaFile.length === 0) {
    // at least 1 MediaFile element must be present otherwise VAST document is not spec compliant 
    _ping2.default.error.call(this, 101);
    _vastErrors2.default.process.call(this, 101);
    return;
  }
  var mediaFileItems = [];
  var mediaFileToRemove = [];
  for (var i = 0, len = mediaFile.length; i < len; i++) {
    mediaFileItems[i] = {};
    // required per VAST3 spec CDATA URL location to media, delivery, type, width, height
    var currentMediaFile = mediaFile[i];
    var mediaFileValue = _fw2.default.getNodeValue(currentMediaFile, true);
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
    var codec = currentMediaFile.getAttribute('codec');
    if (codec !== null && codec !== '') {
      mediaFileItems[i].codec = codec;
    }
    // check for potential VPAID
    var apiFramework = mediaFileItems[i].apiFramework = currentMediaFile.getAttribute('apiFramework');
    // we have a VPAID JS - we break
    // for VPAID we may not have a width, height or delivery
    if (this.params.enableVpaid && apiFramework && VPAID_PATTERN.test(apiFramework) && JS_PATTERN.test(type)) {
      if (DEBUG) {
        _fw2.default.log('VPAID creative detected');
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
    var width = currentMediaFile.getAttribute('width');
    if (width === null || width === '') {
      if (DEBUG) {
        _fw2.default.log('missing required width attribute on MediaFile tag - this is not a VAST 3 spec compliant adTag - continuing anyway (same as IMA)');
      }
      width = 0;
    }
    var height = currentMediaFile.getAttribute('height');
    if (height === null || height === '') {
      if (DEBUG) {
        _fw2.default.log('missing required height attribute on MediaFile tag - this is not a VAST 3 spec compliant adTag - continuing anyway (same as IMA)');
      }
      height = 0;
    }
    var bitrate = currentMediaFile.getAttribute('bitrate');
    if (bitrate === null || bitrate === '' || bitrate < 10) {
      bitrate = 0;
    }
    mediaFileItems[i].width = parseInt(width);
    mediaFileItems[i].height = parseInt(height);
    mediaFileItems[i].bitrate = parseInt(bitrate);
  }
  // remove MediaFile items that do not hold VAST spec-compliant attributes or data
  if (mediaFileToRemove.length > 0) {
    for (var _i = mediaFileToRemove.length - 1; _i >= 0; _i--) {
      mediaFileItems.splice(mediaFileToRemove[_i], 1);
    }
  }
  // we support HLS; MP4; WebM: VPAID so let us fecth for those
  var creatives = [];
  for (var _i2 = 0, _len = mediaFileItems.length; _i2 < _len; _i2++) {
    var currentMediaFileItem = mediaFileItems[_i2];
    var _type = currentMediaFileItem.type;
    var url = currentMediaFileItem.url;
    if (this.isVPAID && url) {
      _vpaid2.default.loadCreative.call(this, url, this.params.vpaidSettings);
      this.adContentType = _type;
      return;
    }
    // we have HLS or DASH and it is natively supported - display ad with HLS in priority
    if (HLS_PATTERN.test(_type) && _env2.default.okHls) {
      _vastPlayer2.default.append.call(this, url, _type);
      this.adContentType = _type;
      return;
    }
    if (DASH_PATTERN.test(_type) && _env2.default.okDash) {
      _vastPlayer2.default.append.call(this, url, _type);
      this.adContentType = _type;
      return;
    }
    // we gather MP4, WebM, OGG and remaining files
    creatives.push(currentMediaFileItem);
  }
  var retainedCreatives = [];
  // first we check for the common formats below ... 
  var __filterCommonCreatives = function (i, creative) {
    if (creative.codec && creative.type === testCommonVideoFormats[i]) {
      return _env2.default.canPlayType(creative.type, creative.codec);
    } else if (creative.type === testCommonVideoFormats[i]) {
      return _env2.default.canPlayType(creative.type);
    }
    return false;
  };
  for (var _i3 = 0, _len2 = testCommonVideoFormats.length; _i3 < _len2; _i3++) {
    retainedCreatives = creatives.filter(__filterCommonCreatives.bind(null, _i3));
    if (retainedCreatives.length > 0) {
      break;
    }
  }
  // ... if none of the common format work, then we check for exotic format
  // first we check for those with codec information as it provides more accurate support indication ...
  if (retainedCreatives.length === 0) {
    var __filterCodecCreatives = function (codec, type, creative) {
      return creative.codec === codec && creative.type === type;
    };
    for (var _i4 = 0, _len3 = creatives.length; _i4 < _len3; _i4++) {
      var thisCreative = creatives[_i4];
      if (thisCreative.codec && thisCreative.type && _env2.default.canPlayType(thisCreative.type, thisCreative.codec)) {
        retainedCreatives = creatives.filter(__filterCodecCreatives.bind(null, thisCreative.codec, thisCreative.type));
      }
    }
  }
  // ... if codec information are not available then we go first type matching
  if (retainedCreatives.length === 0) {
    var __filterTypeCreatives = function (type, creative) {
      return creative.type === type;
    };
    for (var _i5 = 0, _len4 = creatives.length; _i5 < _len4; _i5++) {
      var _thisCreative = creatives[_i5];
      if (_thisCreative.type && _env2.default.canPlayType(_thisCreative.type)) {
        retainedCreatives = creatives.filter(__filterTypeCreatives.bind(null, _thisCreative.type));
      }
    }
  }

  // still no match for supported format - we exit
  if (retainedCreatives.length === 0) {
    // None of the MediaFile provided are supported by the player
    _ping2.default.error.call(this, 403);
    _vastErrors2.default.process.call(this, 403);
    return;
  }

  // sort supported creatives by width
  retainedCreatives.sort(function (a, b) {
    return a.width - b.width;
  });

  if (DEBUG) {
    _fw2.default.log('available linear creative follows');
    _fw2.default.log(retainedCreatives);
  }

  // we have files matching device capabilities
  // select the best one based on player current width
  var finalCreative = void 0;
  var validCreativesByWidth = [];
  var validCreativesByBitrate = [];
  if (retainedCreatives.length > 1) {
    var containerWidth = _fw2.default.getWidth(this.container) * _env2.default.devicePixelRatio;
    var containerHeight = _fw2.default.getHeight(this.container) * _env2.default.devicePixelRatio;
    if (containerWidth > 0 && containerHeight > 0) {
      validCreativesByWidth = retainedCreatives.filter(function (creative) {
        return containerWidth >= creative.width && containerHeight >= creative.height;
      });
    }

    // if no match by size 
    if (validCreativesByWidth.length === 0) {
      validCreativesByWidth = [retainedCreatives[0]];
    }

    // filter by bitrate to provide best quality
    var availableBandwidth = _rmpConnection2.default.getBandwidthEstimate();
    if (availableBandwidth > -1 && validCreativesByWidth.length > 1) {
      // sort supported creatives by bitrates
      validCreativesByWidth.sort(function (a, b) {
        return a.bitrate - b.bitrate;
      });
      // convert to kbps
      availableBandwidth = Math.round(availableBandwidth * 1000);
      validCreativesByBitrate = validCreativesByWidth.filter(function (creative) {
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
      retainedCreatives.sort(function (a, b) {
        return a.bitrate - b.bitrate;
      });
      finalCreative = retainedCreatives[retainedCreatives.length - 1];
    }
  }

  if (DEBUG) {
    _fw2.default.log('selected linear creative follows');
    _fw2.default.log(finalCreative);
  }
  this.adMediaUrl = finalCreative.url;
  this.adMediaHeight = finalCreative.height;
  this.adMediaWidth = finalCreative.width;
  this.adContentType = finalCreative.type;
  _vastPlayer2.default.append.call(this, finalCreative.url, finalCreative.type);
};

exports.default = LINEAR;

},{"../../../externals/rmp-connection":1,"../fw/env":7,"../fw/fw":8,"../players/content-player":10,"../players/vast-player":11,"../players/vpaid":12,"../tracking/ping":13,"../utils/helpers":16,"../utils/vast-errors":17,"./icons":3,"./skip":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fw = require('../fw/fw');

var _fw2 = _interopRequireDefault(_fw);

var _env = require('../fw/env');

var _env2 = _interopRequireDefault(_env);

var _helpers = require('../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _ping = require('../tracking/ping');

var _ping2 = _interopRequireDefault(_ping);

var _vastPlayer = require('../players/vast-player');

var _vastPlayer2 = _interopRequireDefault(_vastPlayer);

var _contentPlayer = require('../players/content-player');

var _contentPlayer2 = _interopRequireDefault(_contentPlayer);

var _vastErrors = require('../utils/vast-errors');

var _vastErrors2 = _interopRequireDefault(_vastErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NONLINEAR = {};

var _onNonLinearLoadError = function () {
  _ping2.default.error.call(this, 502);
  _vastErrors2.default.process.call(this, 502);
};

var _onNonLinearLoadSuccess = function () {
  if (DEBUG) {
    _fw2.default.log('success loading non-linear creative at ' + this.adMediaUrl);
  }
  this.adOnStage = true;
  _helpers2.default.createApiEvent.call(this, 'adloaded');
  _helpers2.default.createApiEvent.call(this, 'adimpression');
  _helpers2.default.createApiEvent.call(this, 'adstarted');
  _helpers2.default.dispatchPingEvent.call(this, ['impression', 'creativeView', 'start']);
};

var _onNonLinearClickThrough = function (event) {
  try {
    if (event) {
      event.stopPropagation();
    }
    if (this.params.pauseOnClick) {
      this.pause();
    }
    _helpers2.default.createApiEvent.call(this, 'adclick');
    _helpers2.default.dispatchPingEvent.call(this, 'clickthrough');
  } catch (e) {
    _fw2.default.trace(e);
  }
};

var _onClickCloseNonLinear = function (event) {
  if (event) {
    event.stopPropagation();
    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }
  this.nonLinearContainer.style.display = 'none';
  _helpers2.default.createApiEvent.call(this, 'adclosed');
  _helpers2.default.dispatchPingEvent.call(this, 'close');
};

var _appendCloseButton = function () {
  var _this = this;

  this.nonLinearClose = document.createElement('div');
  this.nonLinearClose.className = 'rmp-ad-non-linear-close';
  _helpers2.default.accessibleButton(this.nonLinearClose, 'close ad button');
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
  this.nonLinearClose.addEventListener('touchend', this.onClickCloseNonLinear);
  this.nonLinearClose.addEventListener('click', this.onClickCloseNonLinear);
  this.nonLinearContainer.appendChild(this.nonLinearClose);
};

NONLINEAR.update = function () {
  if (DEBUG) {
    _fw2.default.log('appending non-linear creative to .rmp-ad-container element');
  }

  // non-linear ad container
  this.nonLinearContainer = document.createElement('div');
  this.nonLinearContainer.className = 'rmp-ad-non-linear-container';
  this.nonLinearContainer.style.width = this.nonLinearCreativeWidth.toString() + 'px';
  this.nonLinearContainer.style.height = this.nonLinearCreativeHeight.toString() + 'px';

  // a tag to handle click - a tag is best for WebView support
  this.nonLinearATag = document.createElement('a');
  this.nonLinearATag.className = 'rmp-ad-non-linear-anchor';
  if (this.clickThroughUrl) {
    this.nonLinearATag.href = this.clickThroughUrl;
    this.nonLinearATag.target = '_blank';
    this.onNonLinearClickThrough = _onNonLinearClickThrough.bind(this);
    if (_env2.default.isMobile) {
      this.nonLinearATag.addEventListener('touchend', this.onNonLinearClickThrough);
    } else {
      this.nonLinearATag.addEventListener('click', this.onNonLinearClickThrough);
    }
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

  _fw2.default.show(this.adContainer);
  _contentPlayer2.default.play.call(this, this.firstContentPlayerPlayRequest);
  if (this.firstContentPlayerPlayRequest) {
    this.firstContentPlayerPlayRequest = false;
  }
};

NONLINEAR.parse = function (nonLinearAds) {
  if (DEBUG) {
    _fw2.default.log('start parsing NonLinearAds');
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
      _ping2.default.error.call(this, 101);
      _vastErrors2.default.process.call(this, 101);
      continue;
    }
    var height = currentNonLinear.getAttribute('height');
    // height attribute is also required
    if (height === null || height === '') {
      _ping2.default.error.call(this, 101);
      _vastErrors2.default.process.call(this, 101);
      continue;
    }
    width = parseInt(width);
    height = parseInt(height);
    if (width <= 0 || height <= 0) {
      continue;
    }
    // get minSuggestedDuration (optional)
    var minSuggestedDuration = currentNonLinear.getAttribute('minSuggestedDuration');
    if (minSuggestedDuration !== null && minSuggestedDuration !== '' && _fw2.default.isValidDuration(minSuggestedDuration)) {
      this.nonLinearMinSuggestedDuration = _fw2.default.convertDurationToSeconds(minSuggestedDuration);
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
      if (width > _fw2.default.getWidth(this.container)) {
        isDimensionError = true;
        continue;
      }
      adMediaUrl = _fw2.default.getNodeValue(currentStaticResource, true);
      break;
    }
    // we have a valid NonLinear/StaticResource with supported creativeType - we break
    if (adMediaUrl !== '') {
      this.adMediaUrl = adMediaUrl;
      this.nonLinearCreativeWidth = width;
      this.nonLinearCreativeHeight = height;
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
    _ping2.default.error.call(this, vastErrorCode);
    _vastErrors2.default.process.call(this, vastErrorCode);
    return;
  }
  var nonLinearClickThrough = currentNonLinear.getElementsByTagName('NonLinearClickThrough');
  // if NonLinearClickThrough is present we expect one tag
  if (nonLinearClickThrough.length > 0) {
    this.clickThroughUrl = _fw2.default.getNodeValue(nonLinearClickThrough[0], true);
    var nonLinearClickTracking = nonLinear[0].getElementsByTagName('NonLinearClickTracking');
    if (nonLinearClickTracking.length > 0) {
      for (var _i2 = 0, _len2 = nonLinearClickTracking.length; _i2 < _len2; _i2++) {
        var nonLinearClickTrackingUrl = _fw2.default.getNodeValue(nonLinearClickTracking[_i2], true);
        if (nonLinearClickTrackingUrl !== null) {
          this.trackingTags.push({ event: 'clickthrough', url: nonLinearClickTrackingUrl });
        }
      }
    }
  }
  _vastPlayer2.default.append.call(this);
};

exports.default = NONLINEAR;

},{"../fw/env":7,"../fw/fw":8,"../players/content-player":10,"../players/vast-player":11,"../tracking/ping":13,"../utils/helpers":16,"../utils/vast-errors":17}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fw = require('../fw/fw');

var _fw2 = _interopRequireDefault(_fw);

var _helpers = require('../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _vastPlayer = require('../players/vast-player');

var _vastPlayer2 = _interopRequireDefault(_vastPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  if (_fw2.default.isNumber(this.vastPlayerCurrentTime) && this.vastPlayerCurrentTime > 0) {
    var skipoffsetSeconds = _fw2.default.convertOffsetToSeconds(this.skipoffset, this.vastPlayerDuration);
    if (this.vastPlayerCurrentTime >= skipoffsetSeconds) {
      this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdateCheckSkip);
      _setCanBeSkippedUI.call(this);
      this.skippableAdCanBeSkipped = true;
      _helpers2.default.createApiEvent.call(this, 'adskippablestatechanged');
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
    _helpers2.default.createApiEvent.call(this, 'adskipped');
    // request ping for skip event
    if (this.hasSkipEvent) {
      _helpers2.default.dispatchPingEvent.call(this, 'skip');
    }
    // resume content
    _vastPlayer2.default.resumeContent.call(this);
  }
};

SKIP.append = function () {
  this.skipButton = document.createElement('div');
  this.skipButton.className = 'rmp-ad-container-skip';
  this.skipButton.style.display = 'none';
  _helpers2.default.accessibleButton(this.skipButton, 'skip ad button');

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

exports.default = SKIP;

},{"../fw/fw":8,"../players/vast-player":11,"../utils/helpers":16}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fw = require('./fw');

var _fw2 = _interopRequireDefault(_fw);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENV = {};

var testVideo = document.createElement('video');

var _hasTouchEvents = function () {
  if (typeof window.ontouchstart !== 'undefined' || window.DocumentTouch && document instanceof window.DocumentTouch) {
    return true;
  }
  return false;
};
var hasTouchEvents = _hasTouchEvents();

var _getUserAgent = function () {
  if (window.navigator && window.navigator.userAgent) {
    return window.navigator.userAgent;
  }
  return null;
};
var userAgent = _getUserAgent();

var _filterVersion = function (pattern) {
  if (userAgent !== null) {
    var versionArray = userAgent.match(pattern);
    if (Array.isArray(versionArray) && typeof versionArray[1] !== 'undefined') {
      return parseInt(versionArray[1], 10);
    }
  }
  return -1;
};

var IOS_PATTERN = /(ipad|iphone|ipod)/i;
var IOS_VERSION_PATTERN = /os\s+(\d+)_/i;
var _isIos = function () {
  var support = [false, -1];
  if (!hasTouchEvents) {
    return support;
  }
  if (IOS_PATTERN.test(userAgent)) {
    support = [true, _filterVersion(IOS_VERSION_PATTERN)];
  }
  return support;
};
var isIos = _isIos();

var MACOS_PATTERN = /(macintosh|mac\s+os)/i;
var _isMacOSX = function () {
  if (!isIos[0] && MACOS_PATTERN.test(userAgent)) {
    return true;
  }
  return false;
};

var SAFARI_PATTERN = /safari\/[.0-9]*/i;
var SAFARI_VERSION_PATTERN = /version\/(\d+)\./i;
var NO_SAFARI_PATTERN = /(chrome|chromium|android|crios|fxios)/i;
var _isSafari = function () {
  var isSafari = false;
  var safariVersion = -1;
  if (SAFARI_PATTERN.test(userAgent) && !NO_SAFARI_PATTERN.test(userAgent)) {
    isSafari = true;
    safariVersion = _filterVersion(SAFARI_VERSION_PATTERN);
  }
  return [isSafari, safariVersion];
};

var ANDROID_PATTERN = /android/i;
var ANDROID_VERSION_PATTERN = /android\s*(\d+)\./i;
var _isAndroid = function () {
  var support = [false, -1];
  if (isIos[0] || !hasTouchEvents) {
    return support;
  }
  if (ANDROID_PATTERN.test(userAgent)) {
    support = [true, _filterVersion(ANDROID_VERSION_PATTERN)];
  }
  return support;
};

// from https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
var FIREFOX_PATTERN = /firefox\//i;
var SEAMONKEY_PATTERN = /seamonkey\//i;
var _isFirefox = function () {
  if (FIREFOX_PATTERN.test(userAgent) && !SEAMONKEY_PATTERN.test(userAgent)) {
    return true;
  }
  return false;
};

var _video5 = function () {
  return typeof testVideo.canPlayType !== 'undefined';
};
var html5VideoSupport = _video5();

var MP4_H264_AAC_BASELINE_MIME_PATTERN = 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"';
var _okMp4 = function () {
  if (html5VideoSupport) {
    var canPlayType = testVideo.canPlayType(MP4_H264_AAC_BASELINE_MIME_PATTERN);
    if (canPlayType !== '') {
      return true;
    }
  }
  return false;
};
var okMp4 = _okMp4();

var _okHls = function () {
  if (html5VideoSupport && okMp4) {
    var isSupp1 = testVideo.canPlayType('application/vnd.apple.mpegurl');
    var isSupp2 = testVideo.canPlayType('application/x-mpegurl');
    if (isSupp1 !== '' || isSupp2 !== '') {
      return true;
    }
  }
  return false;
};

var _okDash = function () {
  if (html5VideoSupport) {
    var dashSupport = testVideo.canPlayType('application/dash+xml');
    if (dashSupport !== '') {
      return true;
    }
  }
  return false;
};

var _hasNativeFullscreenSupport = function () {
  var doc = document.documentElement;
  if (doc) {
    if (typeof doc.requestFullscreen !== 'undefined' || typeof doc.webkitRequestFullscreen !== 'undefined' || typeof doc.mozRequestFullScreen !== 'undefined' || typeof doc.msRequestFullscreen !== 'undefined' || typeof testVideo.webkitEnterFullscreen !== 'undefined') {
      return true;
    }
  }
  return false;
};

var _getDevicePixelRatio = function () {
  var pixelRatio = 1;
  if (_fw2.default.isNumber(window.devicePixelRatio) && window.devicePixelRatio > 1) {
    pixelRatio = window.devicePixelRatio;
  }
  return pixelRatio;
};

ENV.isIos = isIos;
ENV.isAndroid = _isAndroid();
ENV.isMacOSX = _isMacOSX();
ENV.isSafari = _isSafari();
ENV.isFirefox = _isFirefox();
ENV.isMobile = false;
if (ENV.isIos[0] || ENV.isAndroid[0]) {
  ENV.isMobile = true;
}

ENV.okMp4 = okMp4;
ENV.okHls = _okHls();
ENV.okDash = _okDash();
ENV.canPlayType = function (type, codec) {
  if (html5VideoSupport) {
    if (type && codec) {
      var canPlayType = testVideo.canPlayType(type + '; codecs="' + codec + '"');
      if (canPlayType !== '') {
        return true;
      }
    } else if (type && !codec) {
      var _canPlayType = testVideo.canPlayType(type);
      if (_canPlayType !== '') {
        return true;
      }
    }
  }
  return false;
};

ENV.hasNativeFullscreenSupport = _hasNativeFullscreenSupport();
ENV.devicePixelRatio = _getDevicePixelRatio();

exports.default = ENV;

},{"./fw":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var FW = {};

/* FW from Radiant Media Player core */

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
    if (FW.isNumber(element.offsetWidth) && element.offsetWidth !== 0) {
      return element.offsetWidth;
    } else {
      return _getStyleAttributeData(element, 'width');
    }
  }
  return 0;
};

FW.getHeight = function (element) {
  if (element) {
    if (FW.isNumber(element.offsetHeight) && element.offsetHeight !== 0) {
      return element.offsetHeight;
    } else {
      return _getStyleAttributeData(element, 'height');
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

FW.removeElement = function (element) {
  if (element && element.parentNode) {
    try {
      element.parentNode.removeChild(element);
    } catch (e) {
      FW.trace(e);
    }
  }
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
        if (FW.isNumber(xhr.status) && xhr.status >= 200 && xhr.status < 300) {
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
        FW.log('XMLHttpRequest timeout');
        reject();
      };
      xhr.send(null);
    } else {
      reject();
    }
  });
};

FW.log = function (data) {
  if (window.console && window.console.log) {
    if (typeof data === 'string') {
      window.console.log('rmp-vast: ' + data);
    } else {
      window.console.log(data);
    }
  }
};

FW.trace = function (data) {
  if (DEBUG) {
    if (data && window.console && window.console.trace) {
      window.console.trace(data);
    }
  }
};

/* FW specific to rmp-vast */
FW.hasDOMParser = function () {
  if (typeof window.DOMParser !== 'undefined') {
    return true;
  }
  return false;
};

FW.vastReadableTime = function (time) {
  if (FW.isNumber(time) && time >= 0) {
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

FW.generateCacheBusting = function () {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

FW.getNodeValue = function (element, http) {
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

FW.RFC3986EncodeURIComponent = function (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
};

FW.isValidDuration = function (duration) {
  // HH:MM:SS or HH:MM:SS.mmm
  var skipPattern = /^\d+:\d+:\d+(\.\d+)?$/i;
  if (skipPattern.test(duration)) {
    return true;
  }
  return false;
};

FW.convertDurationToSeconds = function (duration) {
  // duration is HH:MM:SS or HH:MM:SS.mmm
  // remove .mmm
  var splitNoMS = duration.split('.');
  splitNoMS = splitNoMS[0];
  var splitTime = splitNoMS.split(':');
  var seconds = 0;
  seconds = parseInt(splitTime[0]) * 60 * 60 + parseInt(splitTime[1]) * 60 + parseInt(splitTime[2]);
  return seconds;
};

// HH:MM:SS or HH:MM:SS.mmm
var skipPattern1 = /^\d+:\d+:\d+(\.\d+)?$/i;
// n%
var skipPattern2 = /^\d+%$/i;
FW.isValidOffset = function (offset) {
  if (skipPattern1.test(offset) || skipPattern2.test(offset)) {
    return true;
  }
  return false;
};

FW.convertOffsetToSeconds = function (offset, duration) {
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

FW.logVideoEvents = function (video, type) {
  var events = ['loadstart', 'durationchange', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'];
  events.forEach(function (value) {
    video.addEventListener(value, function (e) {
      if (e && e.type) {
        FW.log(type + ' player event - ' + e.type);
      }
    });
  });
};

FW.isNumber = function (n) {
  if (typeof n !== 'undefined' && typeof n === 'number' && Number.isFinite(n)) {
    return true;
  }
  return false;
};

FW.isObject = function (obj) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj === 'object') {
    return true;
  }
  return false;
};

FW.openWindow = function (link) {
  try {
    // I would like to use named window here to have better performance like 
    // window.open(link, 'rmpVastAdPageArea'); but focus is not set on updated window with such approach
    // in MS Edge and FF - so _blank it is
    window.open(link, '_blank');
  } catch (e) {
    FW.trace(e);
  }
};

exports.default = FW;

},{}],9:[function(require,module,exports){
'use strict';

require('core-js/modules/es6.typed.array-buffer');

require('core-js/modules/es6.typed.data-view');

require('core-js/modules/es6.typed.int8-array');

require('core-js/modules/es6.typed.uint8-array');

require('core-js/modules/es6.typed.uint8-clamped-array');

require('core-js/modules/es6.typed.int16-array');

require('core-js/modules/es6.typed.uint16-array');

require('core-js/modules/es6.typed.int32-array');

require('core-js/modules/es6.typed.uint32-array');

require('core-js/modules/es6.typed.float32-array');

require('core-js/modules/es6.typed.float64-array');

require('core-js/modules/es6.map');

require('core-js/modules/es6.set');

require('core-js/modules/es6.weak-map');

require('core-js/modules/es6.weak-set');

require('core-js/modules/es6.reflect.apply');

require('core-js/modules/es6.reflect.construct');

require('core-js/modules/es6.reflect.define-property');

require('core-js/modules/es6.reflect.delete-property');

require('core-js/modules/es6.reflect.get');

require('core-js/modules/es6.reflect.get-own-property-descriptor');

require('core-js/modules/es6.reflect.get-prototype-of');

require('core-js/modules/es6.reflect.has');

require('core-js/modules/es6.reflect.is-extensible');

require('core-js/modules/es6.reflect.own-keys');

require('core-js/modules/es6.reflect.prevent-extensions');

require('core-js/modules/es6.reflect.set');

require('core-js/modules/es6.reflect.set-prototype-of');

require('core-js/modules/es6.promise');

require('core-js/modules/es6.symbol');

require('core-js/modules/es6.object.freeze');

require('core-js/modules/es6.object.seal');

require('core-js/modules/es6.object.prevent-extensions');

require('core-js/modules/es6.object.is-frozen');

require('core-js/modules/es6.object.is-sealed');

require('core-js/modules/es6.object.is-extensible');

require('core-js/modules/es6.object.get-own-property-descriptor');

require('core-js/modules/es6.object.get-prototype-of');

require('core-js/modules/es6.object.keys');

require('core-js/modules/es6.object.get-own-property-names');

require('core-js/modules/es6.object.assign');

require('core-js/modules/es6.object.is');

require('core-js/modules/es6.object.set-prototype-of');

require('core-js/modules/es6.function.name');

require('core-js/modules/es6.string.raw');

require('core-js/modules/es6.string.from-code-point');

require('core-js/modules/es6.string.code-point-at');

require('core-js/modules/es6.string.repeat');

require('core-js/modules/es6.string.starts-with');

require('core-js/modules/es6.string.ends-with');

require('core-js/modules/es6.string.includes');

require('core-js/modules/es6.regexp.flags');

require('core-js/modules/es6.regexp.match');

require('core-js/modules/es6.regexp.replace');

require('core-js/modules/es6.regexp.split');

require('core-js/modules/es6.regexp.search');

require('core-js/modules/es6.array.from');

require('core-js/modules/es6.array.of');

require('core-js/modules/es6.array.copy-within');

require('core-js/modules/es6.array.find');

require('core-js/modules/es6.array.find-index');

require('core-js/modules/es6.array.fill');

require('core-js/modules/es6.array.iterator');

require('core-js/modules/es6.number.is-finite');

require('core-js/modules/es6.number.is-integer');

require('core-js/modules/es6.number.is-safe-integer');

require('core-js/modules/es6.number.is-nan');

require('core-js/modules/es6.number.epsilon');

require('core-js/modules/es6.number.min-safe-integer');

require('core-js/modules/es6.number.max-safe-integer');

require('core-js/modules/es6.math.acosh');

require('core-js/modules/es6.math.asinh');

require('core-js/modules/es6.math.atanh');

require('core-js/modules/es6.math.cbrt');

require('core-js/modules/es6.math.clz32');

require('core-js/modules/es6.math.cosh');

require('core-js/modules/es6.math.expm1');

require('core-js/modules/es6.math.fround');

require('core-js/modules/es6.math.hypot');

require('core-js/modules/es6.math.imul');

require('core-js/modules/es6.math.log1p');

require('core-js/modules/es6.math.log10');

require('core-js/modules/es6.math.log2');

require('core-js/modules/es6.math.sign');

require('core-js/modules/es6.math.sinh');

require('core-js/modules/es6.math.tanh');

require('core-js/modules/es6.math.trunc');

require('core-js/modules/web.timers');

require('core-js/modules/web.immediate');

require('core-js/modules/web.dom.iterable');

var _fw = require('./fw/fw');

var _fw2 = _interopRequireDefault(_fw);

var _env = require('./fw/env');

var _env2 = _interopRequireDefault(_env);

var _helpers = require('./utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _ping = require('./tracking/ping');

var _ping2 = _interopRequireDefault(_ping);

var _linear = require('./creatives/linear');

var _linear2 = _interopRequireDefault(_linear);

var _nonLinear = require('./creatives/non-linear');

var _nonLinear2 = _interopRequireDefault(_nonLinear);

var _trackingEvents2 = require('./tracking/tracking-events');

var _trackingEvents3 = _interopRequireDefault(_trackingEvents2);

var _api = require('./api/api');

var _api2 = _interopRequireDefault(_api);

var _contentPlayer = require('./players/content-player');

var _contentPlayer2 = _interopRequireDefault(_contentPlayer);

var _default = require('./utils/default');

var _default2 = _interopRequireDefault(_default);

var _vastErrors = require('./utils/vast-errors');

var _vastErrors2 = _interopRequireDefault(_vastErrors);

var _icons = require('./creatives/icons');

var _icons2 = _interopRequireDefault(_icons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* module:begins */

/* module:ends */


/* module:begins */
(function () {

  'use strict';

  window.DEBUG = true;

  if (typeof window === 'undefined' || typeof window.document === 'undefined') {
    if (DEBUG) {
      _fw2.default.log('cannot use rmp-vast in this environment - missing window or document object');
    }
    return;
  }

  if (typeof window.RmpVast !== 'undefined') {
    if (DEBUG) {
      _fw2.default.log('RmpVast constructor already exists - no need to load it twice - exiting');
    }
    return;
  }
  /* module:ends */

  window.RmpVast = function (id, params) {
    if (typeof id !== 'string' || id === '') {
      if (DEBUG) {
        _fw2.default.log('invalid id to create new instance - exit');
      }
      return;
    }
    this.id = id;
    this.container = document.getElementById(this.id);
    this.contentWrapper = this.container.querySelector('.rmp-content');
    this.contentPlayer = this.container.querySelector('.rmp-video');
    if (this.container === null || this.contentWrapper === null || this.contentPlayer === null) {
      if (DEBUG) {
        _fw2.default.log('invalid DOM layout - exit');
      }
      return;
    }
    if (DEBUG) {
      _fw2.default.log('creating new RmpVast instance');
      _fw2.default.logVideoEvents(this.contentPlayer, 'content');
    }
    // reset instance variables - once per session
    _default2.default.instanceVariables.call(this);
    // reset loadAds variables - this is reset at addestroyed 
    // so that next loadAds is cleared
    _default2.default.loadAdsVariables.call(this);
    // handle fullscreen events
    _default2.default.fullscreen.call(this);
    // filter input params
    _helpers2.default.filterParams.call(this, params);
    if (DEBUG) {
      _fw2.default.log('filtered params follow');
      _fw2.default.log(this.params);
      _fw2.default.log('detected environment follows');
      var keys = Object.keys(_env2.default);
      var filteredEnv = {};
      for (var i = 0, len = keys.length; i < len; i++) {
        var currentEnvItem = _env2.default[keys[i]];
        if (typeof currentEnvItem !== 'undefined' && typeof currentEnvItem !== 'function' && currentEnvItem !== null) {
          filteredEnv[keys[i]] = currentEnvItem;
        }
      }
      _fw2.default.log(filteredEnv);
    }
  };

  // enrich RmpVast prototype with API methods
  _api2.default.attach(window.RmpVast);

  var _execRedirect = function () {
    if (DEBUG) {
      _fw2.default.log('adfollowingredirect');
    }
    _helpers2.default.createApiEvent.call(this, 'adfollowingredirect');
    var redirectUrl = _fw2.default.getNodeValue(this.vastAdTagURI[0], true);
    if (DEBUG) {
      _fw2.default.log('redirect URL is ' + redirectUrl);
    }
    if (redirectUrl !== null) {
      if (this.params.maxNumRedirects > this.redirectsFollowed) {
        this.redirectsFollowed++;
        if (this.runningAdPod) {
          this.adPodItemWrapper = true;
        }
        this.loadAds(redirectUrl);
      } else {
        // Wrapper limit reached, as defined by maxNumRedirects
        _ping2.default.error.call(this, 302);
        _vastErrors2.default.process.call(this, 302);
      }
    } else {
      // not a valid redirect URI - ping for error
      _ping2.default.error.call(this, 300);
      _vastErrors2.default.process.call(this, 300);
    }
  };

  var _parseCreatives = function (creative) {
    if (DEBUG) {
      _fw2.default.log('_parseCreatives');
      _fw2.default.log(creative);
    }
    for (var i = 0, len = creative.length; i < len; i++) {
      var currentCreative = creative[i];
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
        _ping2.default.error.call(this, 101);
        _vastErrors2.default.process.call(this, 101);
        return;
      }
      if (nonLinearAds.length > 0) {
        var trackingEvents = nonLinearAds[0].getElementsByTagName('TrackingEvents');
        // if TrackingEvents tag
        if (trackingEvents.length > 0) {
          _trackingEvents3.default.filterPush.call(this, trackingEvents);
        }
        if (this.isWrapper) {
          _execRedirect.call(this);
          return;
        }
        _nonLinear2.default.parse.call(this, nonLinearAds);
        return;
      } else if (linear.length > 0) {
        // check for skippable ads (Linear skipoffset)
        var skipoffset = linear[0].getAttribute('skipoffset');
        // if we have a wrapper we ignore skipoffset in case it is present
        if (!this.isWrapper && this.params.skipMessage !== '' && skipoffset !== null && skipoffset !== '' && _fw2.default.isValidOffset(skipoffset)) {
          if (DEBUG) {
            _fw2.default.log('skippable ad detected with offset ' + skipoffset);
          }
          this.isSkippableAd = true;
          this.skipoffset = skipoffset;
          // we  do not display skippable ads when on is iOS < 10
          if (_env2.default.isIos[0] && _env2.default.isIos[1] < 10) {
            _ping2.default.error.call(this, 200);
            _vastErrors2.default.process.call(this, 200);
            return;
          }
        }

        // TrackingEvents
        var _trackingEvents = linear[0].getElementsByTagName('TrackingEvents');
        // if present TrackingEvents
        if (_trackingEvents.length > 0) {
          _trackingEvents3.default.filterPush.call(this, _trackingEvents);
        }

        // VideoClicks for linear
        var videoClicks = linear[0].getElementsByTagName('VideoClicks');
        if (videoClicks.length > 0) {
          var clickThrough = videoClicks[0].getElementsByTagName('ClickThrough');
          var clickTracking = videoClicks[0].getElementsByTagName('ClickTracking');
          if (clickThrough.length > 0) {
            this.clickThroughUrl = _fw2.default.getNodeValue(clickThrough[0], true);
          }
          if (clickTracking.length > 0) {
            for (var _i = 0, _len = clickTracking.length; _i < _len; _i++) {
              var clickTrackingUrl = _fw2.default.getNodeValue(clickTracking[_i], true);
              if (clickTrackingUrl !== null) {
                this.trackingTags.push({
                  event: 'clickthrough',
                  url: clickTrackingUrl
                });
              }
            }
          }
        }

        // return on wrapper
        if (this.isWrapper) {
          // if icons are presents then we push valid icons
          var icons = linear[0].getElementsByTagName('Icons');
          if (icons.length > 0) {
            _icons2.default.parse.call(this, icons);
          }
          _execRedirect.call(this);
          return;
        }
        _linear2.default.parse.call(this, linear);
        return;
      }
    }
    // in case wrapper with creative CompanionAds we still need to _execRedirect
    if (this.isWrapper) {
      _execRedirect.call(this);
      return;
    }
  };

  var _filterAdPod = function (ad) {
    if (DEBUG) {
      _fw2.default.log('_filterAdPod');
    }
    // filter Ad and AdPod
    var retainedAd = void 0;
    // a pod already exists and is being processed - the current Ad item is InLine
    if (this.adPod.length > 0 && !this.adPodItemWrapper) {
      if (DEBUG) {
        _fw2.default.log('loading next ad in pod');
      }
      retainedAd = ad[0];
      this.adPodCurrentIndex++;
      this.adPod.shift();
    } else if (this.adPod.length > 0 && this.adPodItemWrapper) {
      if (DEBUG) {
        _fw2.default.log('running ad pod Ad is a wrapper');
      }
      // we are in a pod but the running Ad item is a wrapper
      this.adPodItemWrapper = false;
      for (var i = 0, len = ad.length; i < len; i++) {
        var sequence = ad[i].getAttribute('sequence');
        if (sequence === '' || sequence === null) {
          retainedAd = ad[i];
          break;
        }
      }
    } else {
      // we are not in a pod yet ... see if one exists or not
      var standaloneAds = [];
      for (var _i2 = 0, _len2 = ad.length; _i2 < _len2; _i2++) {
        var _sequence = ad[_i2].getAttribute('sequence');
        if (_sequence === '' || _sequence === null) {
          // standalone ads
          standaloneAds.push(ad[_i2]);
        } else {
          // if it has sequence attribute then push to adPod array
          this.adPod.push(ad[_i2]);
        }
      }
      if (this.adPod.length === 0 && standaloneAds.length > 0) {
        // we are not in an ad pod - we only load the first standalone ad
        retainedAd = standaloneAds[0];
      } else if (this.adPod.length > 0) {
        if (DEBUG) {
          _fw2.default.log('ad pod detected');
        }
        this.runningAdPod = true;
        // clone array for purpose of API exposure
        this.adPodApiInfo = [].concat(_toConsumableArray(this.adPod));
        // so we are in a pod but it may come from a wrapper so we need to ping 
        // wrapper trackings for each Ad of the pod
        this.adPodWrapperTrackings = [].concat(_toConsumableArray(this.trackingTags));
        // reduced adPod length to maxNumItemsInAdPod
        if (this.adPod.length > this.params.maxNumItemsInAdPod) {
          this.adPod.length = this.params.maxNumItemsInAdPod;
        }
        this.standaloneAdsInPod = standaloneAds;
        // sort adPod in case sequence attr are unordered
        this.adPod.sort(function (a, b) {
          var sequence1 = parseInt(a.getAttribute('sequence'));
          var sequence2 = parseInt(b.getAttribute('sequence'));
          return sequence1 - sequence2;
        });
        retainedAd = this.adPod[0];
        this.adPod.shift();
        var __onAdDestroyLoadNextAdInPod = function () {
          if (DEBUG) {
            _fw2.default.log('addestroyed - checking for ads left in pod');
            if (this.adPod.length > 0) {
              _fw2.default.log(this.adPod);
            } else {
              _fw2.default.log('no ad left in pod');
            }
          }
          this.adPodItemWrapper = false;
          if (this.adPod.length > 0) {
            _filterAdPod.call(this, this.adPod);
          } else {
            this.container.removeEventListener('addestroyed', this.onAdDestroyLoadNextAdInPod);
            this.adPod = [];
            this.standaloneAdsInPod = [];
            this.runningAdPod = false;
            this.adPodCurrentIndex = 0;
            this.adPodApiInfo = [];
            this.adPodWrapperTrackings = [];
            _helpers2.default.createApiEvent.call(this, 'adpodcompleted');
          }
        };
        this.onAdDestroyLoadNextAdInPod = __onAdDestroyLoadNextAdInPod.bind(this);
        this.container.addEventListener('addestroyed', this.onAdDestroyLoadNextAdInPod);
      }
    }

    if (!retainedAd) {
      // in case this is a wrapper we need to ping for errors on originating tags
      _ping2.default.error.call(this, 200);
      _vastErrors2.default.process.call(this, 200);
      return;
    }

    var inline = retainedAd.getElementsByTagName('InLine');
    var wrapper = retainedAd.getElementsByTagName('Wrapper');
    // 1 InLine or Wrapper element must be present 
    if (inline.length === 0 && wrapper.length === 0) {
      // in case this is a wrapper we need to ping for errors on originating tags
      _ping2.default.error.call(this, 101);
      _vastErrors2.default.process.call(this, 101);
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
    var errorNode = inlineOrWrapper[0].getElementsByTagName('Error');
    if (errorNode.length > 0) {
      var errorUrl = _fw2.default.getNodeValue(errorNode[0], true);
      if (errorUrl !== null) {
        this.inlineOrWrapperErrorTags.push({
          event: 'error',
          url: errorUrl
        });
      }
    }
    var adTitle = inlineOrWrapper[0].getElementsByTagName('AdTitle');
    var adDescription = inlineOrWrapper[0].getElementsByTagName('Description');
    var creatives = inlineOrWrapper[0].getElementsByTagName('Creatives');

    // Required InLine Elements are AdSystem, AdTitle, Impression, Creatives
    // Required Wrapper Elements are AdSystem, vastAdTagURI, Impression
    // however in real word some adTag do not have impression or adSystem/adTitle tags 
    // especially in the context of multiple redirects - since the IMA SDK allows those tags 
    // to render we should do the same even if those adTags are not VAST-compliant
    // so we only check and exit if missing required information to display ads 
    if (this.isWrapper) {
      if (this.vastAdTagURI.length === 0) {
        _ping2.default.error.call(this, 101);
        _vastErrors2.default.process.call(this, 101);
        return;
      }
    } else {
      if (creatives.length === 0) {
        _ping2.default.error.call(this, 101);
        _vastErrors2.default.process.call(this, 101);
        return;
      }
    }

    var creative = void 0;
    if (creatives.length > 0) {
      creative = creatives[0].getElementsByTagName('Creative');
      // at least one creative tag is expected for InLine
      if (!this.isWrapper && creative.length === 0) {
        _ping2.default.error.call(this, 101);
        _vastErrors2.default.process.call(this, 101);
        return;
      }
    }
    if (adTitle.length > 0) {
      this.adSystem = _fw2.default.getNodeValue(adSystem[0], false);
    }
    if (impression.length > 0) {
      for (var _i3 = 0, _len3 = impression.length; _i3 < _len3; _i3++) {
        var impressionUrl = _fw2.default.getNodeValue(impression[_i3], true);
        if (impressionUrl !== null) {
          this.trackingTags.push({
            event: 'impression',
            url: impressionUrl
          });
        }
      }
    }
    if (!this.isWrapper) {
      if (adTitle.length > 0) {
        this.adTitle = _fw2.default.getNodeValue(adTitle[0], false);
      }
      if (adDescription.length > 0) {
        this.adDescription = _fw2.default.getNodeValue(adDescription[0], false);
      }
    }
    // in case no Creative with Wrapper we make our redirect call here
    if (this.isWrapper && !creative) {
      _execRedirect.call(this);
      return;
    }
    _parseCreatives.call(this, creative);
  };

  var _onXmlAvailable = function (xml) {
    // if VMAP we abort
    var vmap = xml.getElementsByTagName('vmap:VMAP');
    if (vmap.length > 0) {
      _vastErrors2.default.process.call(this, 200);
      return;
    }
    // check for VAST node
    var vastTag = xml.getElementsByTagName('VAST');
    if (vastTag.length === 0) {
      // in case this is a wrapper we need to ping for errors on originating tags
      _ping2.default.error.call(this, 100);
      _vastErrors2.default.process.call(this, 100);
      return;
    }
    var vastDocument = vastTag[0];
    // VAST/Error node
    var errorNode = vastDocument.getElementsByTagName('Error');
    if (errorNode.length > 0) {
      for (var i = 0, len = errorNode.length; i < len; i++) {
        // we need to make sure those Error tags are directly beneath VAST tag. See 2.2.5.1 VAST 3 spec
        if (errorNode[i].parentNode === vastDocument) {
          var errorUrl = _fw2.default.getNodeValue(errorNode[i], true);
          if (errorUrl !== null) {
            // we use an array here for vastErrorTags but we only have item in it
            // this is to be able to use PING.error for both vastErrorTags and inlineOrWrapperErrorTags
            this.vastErrorTags.push({
              event: 'error',
              url: errorUrl
            });
          }
        }
      }
    }
    //check for VAST version 2, 3 or 4 (we support VAST 4 in the limit of what is supported in VAST 3)
    var pattern = /^(2|3|4)\./i;
    var version = vastDocument.getAttribute('version');
    if (!pattern.test(version)) {
      // in case this is a wrapper we need to ping for errors on originating tags
      _ping2.default.error.call(this, 102);
      _vastErrors2.default.process.call(this, 102);
      return;
    }
    // if empty VAST return
    var ad = vastDocument.getElementsByTagName('Ad');
    if (ad.length === 0) {
      _ping2.default.error.call(this, 303);
      _vastErrors2.default.process.call(this, 303);
      return;
    }
    _filterAdPod.call(this, ad);
  };

  var _makeAjaxRequest = function (vastUrl) {
    var _this = this;

    // we check for required VAST URL and API here
    // as we need to have this.currentContentSrc available for iOS
    if (typeof vastUrl !== 'string' || vastUrl === '') {
      _vastErrors2.default.process.call(this, 1001);
      return;
    }
    if (!_fw2.default.hasDOMParser()) {
      _vastErrors2.default.process.call(this, 1002);
      return;
    }
    _helpers2.default.createApiEvent.call(this, 'adtagstartloading');
    this.isWrapper = false;
    this.vastAdTagURI = null;
    this.adTagUrl = vastUrl;
    if (DEBUG) {
      _fw2.default.log('try to load VAST tag at ' + this.adTagUrl);
    }
    _fw2.default.ajax(this.adTagUrl, this.params.ajaxTimeout, true, this.params.ajaxWithCredentials).then(function (data) {
      if (DEBUG) {
        _fw2.default.log('VAST loaded from ' + _this.adTagUrl);
      }
      _helpers2.default.createApiEvent.call(_this, 'adtagloaded');
      var xml = void 0;
      try {
        // Parse XML
        var parser = new DOMParser();
        xml = parser.parseFromString(data, 'text/xml');
        if (DEBUG) {
          _fw2.default.log('parsed XML document follows');
          _fw2.default.log(xml);
        }
      } catch (e) {
        _fw2.default.trace(e);
        // in case this is a wrapper we need to ping for errors on originating tags
        _ping2.default.error.call(_this, 100);
        _vastErrors2.default.process.call(_this, 100);
        return;
      }
      _onXmlAvailable.call(_this, xml);
    }).catch(function (e) {
      _fw2.default.trace(e);
      // in case this is a wrapper we need to ping for errors on originating tags
      _ping2.default.error.call(_this, 1000);
      _vastErrors2.default.process.call(_this, 1000);
    });
  };

  var _onDestroyLoadAds = function (vastUrl) {
    this.container.removeEventListener('addestroyed', this.onDestroyLoadAds);
    this.loadAds(vastUrl);
  };

  window.RmpVast.prototype.loadAds = function (vastUrl) {
    if (DEBUG) {
      _fw2.default.log('loadAds starts');
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
    // for useContentPlayerForAds we need to know early what is the content src
    // so that we can resume content when ad finishes or on aderror
    var contentCurrentTime = _contentPlayer2.default.getCurrentTime.call(this);
    if (this.useContentPlayerForAds) {
      this.currentContentSrc = this.contentPlayer.src;
      if (DEBUG) {
        _fw2.default.log('currentContentSrc is ' + this.currentContentSrc);
      }
      this.currentContentCurrentTime = contentCurrentTime;
      if (DEBUG) {
        _fw2.default.log('currentContentCurrentTime is ' + this.currentContentCurrentTime);
      }
      // on iOS we need to prevent seeking when linear ad is on stage
      _contentPlayer2.default.preventSeekingForCustomPlayback.call(this);
    }
    _makeAjaxRequest.call(this, vastUrl);
  };
  /* module:begins */
})();
/* module:ends */
/* module:export */

},{"./api/api":2,"./creatives/icons":3,"./creatives/linear":4,"./creatives/non-linear":5,"./fw/env":7,"./fw/fw":8,"./players/content-player":10,"./tracking/ping":13,"./tracking/tracking-events":14,"./utils/default":15,"./utils/helpers":16,"./utils/vast-errors":17,"core-js/modules/es6.array.copy-within":122,"core-js/modules/es6.array.fill":123,"core-js/modules/es6.array.find":125,"core-js/modules/es6.array.find-index":124,"core-js/modules/es6.array.from":126,"core-js/modules/es6.array.iterator":127,"core-js/modules/es6.array.of":128,"core-js/modules/es6.function.name":129,"core-js/modules/es6.map":130,"core-js/modules/es6.math.acosh":131,"core-js/modules/es6.math.asinh":132,"core-js/modules/es6.math.atanh":133,"core-js/modules/es6.math.cbrt":134,"core-js/modules/es6.math.clz32":135,"core-js/modules/es6.math.cosh":136,"core-js/modules/es6.math.expm1":137,"core-js/modules/es6.math.fround":138,"core-js/modules/es6.math.hypot":139,"core-js/modules/es6.math.imul":140,"core-js/modules/es6.math.log10":141,"core-js/modules/es6.math.log1p":142,"core-js/modules/es6.math.log2":143,"core-js/modules/es6.math.sign":144,"core-js/modules/es6.math.sinh":145,"core-js/modules/es6.math.tanh":146,"core-js/modules/es6.math.trunc":147,"core-js/modules/es6.number.epsilon":148,"core-js/modules/es6.number.is-finite":149,"core-js/modules/es6.number.is-integer":150,"core-js/modules/es6.number.is-nan":151,"core-js/modules/es6.number.is-safe-integer":152,"core-js/modules/es6.number.max-safe-integer":153,"core-js/modules/es6.number.min-safe-integer":154,"core-js/modules/es6.object.assign":155,"core-js/modules/es6.object.freeze":156,"core-js/modules/es6.object.get-own-property-descriptor":157,"core-js/modules/es6.object.get-own-property-names":158,"core-js/modules/es6.object.get-prototype-of":159,"core-js/modules/es6.object.is":163,"core-js/modules/es6.object.is-extensible":160,"core-js/modules/es6.object.is-frozen":161,"core-js/modules/es6.object.is-sealed":162,"core-js/modules/es6.object.keys":164,"core-js/modules/es6.object.prevent-extensions":165,"core-js/modules/es6.object.seal":166,"core-js/modules/es6.object.set-prototype-of":167,"core-js/modules/es6.promise":168,"core-js/modules/es6.reflect.apply":169,"core-js/modules/es6.reflect.construct":170,"core-js/modules/es6.reflect.define-property":171,"core-js/modules/es6.reflect.delete-property":172,"core-js/modules/es6.reflect.get":175,"core-js/modules/es6.reflect.get-own-property-descriptor":173,"core-js/modules/es6.reflect.get-prototype-of":174,"core-js/modules/es6.reflect.has":176,"core-js/modules/es6.reflect.is-extensible":177,"core-js/modules/es6.reflect.own-keys":178,"core-js/modules/es6.reflect.prevent-extensions":179,"core-js/modules/es6.reflect.set":181,"core-js/modules/es6.reflect.set-prototype-of":180,"core-js/modules/es6.regexp.flags":182,"core-js/modules/es6.regexp.match":183,"core-js/modules/es6.regexp.replace":184,"core-js/modules/es6.regexp.search":185,"core-js/modules/es6.regexp.split":186,"core-js/modules/es6.set":187,"core-js/modules/es6.string.code-point-at":188,"core-js/modules/es6.string.ends-with":189,"core-js/modules/es6.string.from-code-point":190,"core-js/modules/es6.string.includes":191,"core-js/modules/es6.string.raw":192,"core-js/modules/es6.string.repeat":193,"core-js/modules/es6.string.starts-with":194,"core-js/modules/es6.symbol":195,"core-js/modules/es6.typed.array-buffer":196,"core-js/modules/es6.typed.data-view":197,"core-js/modules/es6.typed.float32-array":198,"core-js/modules/es6.typed.float64-array":199,"core-js/modules/es6.typed.int16-array":200,"core-js/modules/es6.typed.int32-array":201,"core-js/modules/es6.typed.int8-array":202,"core-js/modules/es6.typed.uint16-array":203,"core-js/modules/es6.typed.uint32-array":204,"core-js/modules/es6.typed.uint8-array":205,"core-js/modules/es6.typed.uint8-clamped-array":206,"core-js/modules/es6.weak-map":207,"core-js/modules/es6.weak-set":208,"core-js/modules/web.dom.iterable":209,"core-js/modules/web.immediate":210,"core-js/modules/web.timers":211}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fw = require('../fw/fw');

var _fw2 = _interopRequireDefault(_fw);

var _helpers = require('../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CONTENTPLAYER = {};

CONTENTPLAYER.play = function (firstContentPlayerPlayRequest) {
  if (this.contentPlayer && this.contentPlayer.paused) {
    _helpers2.default.playPromise.call(this, 'content', firstContentPlayerPlayRequest);
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
  return -1;
};

CONTENTPLAYER.getMute = function () {
  if (this.contentPlayer) {
    return this.contentPlayer.muted;
  }
  return false;
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
    if (_fw2.default.isNumber(duration)) {
      return Math.round(duration * 1000);
    }
  }
  return -1;
};

CONTENTPLAYER.getCurrentTime = function () {
  if (this.contentPlayer) {
    var currentTime = this.contentPlayer.currentTime;
    if (_fw2.default.isNumber(currentTime)) {
      return Math.round(currentTime * 1000);
    }
  }
  return -1;
};

CONTENTPLAYER.seekTo = function (msSeek) {
  if (!_fw2.default.isNumber(msSeek)) {
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

exports.default = CONTENTPLAYER;

},{"../fw/fw":8,"../utils/helpers":16}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fw = require('../fw/fw');

var _fw2 = _interopRequireDefault(_fw);

var _env = require('../fw/env');

var _env2 = _interopRequireDefault(_env);

var _helpers = require('../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _contentPlayer = require('../players/content-player');

var _contentPlayer2 = _interopRequireDefault(_contentPlayer);

var _vpaid = require('../players/vpaid');

var _vpaid2 = _interopRequireDefault(_vpaid);

var _icons = require('../creatives/icons');

var _icons2 = _interopRequireDefault(_icons);

var _default = require('../utils/default');

var _default2 = _interopRequireDefault(_default);

var _trackingEvents = require('../tracking/tracking-events');

var _trackingEvents2 = _interopRequireDefault(_trackingEvents);

var _nonLinear = require('../creatives/non-linear');

var _nonLinear2 = _interopRequireDefault(_nonLinear);

var _linear = require('../creatives/linear');

var _linear2 = _interopRequireDefault(_linear);

var _vastErrors = require('../utils/vast-errors');

var _vastErrors2 = _interopRequireDefault(_vastErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VASTPLAYER = {};

var _unwireVastPlayerEvents = function () {
  if (DEBUG) {
    _fw2.default.log('reset - unwireVastPlayerEvents');
  }
  if (this.nonLinearContainer) {
    this.nonLinearImg.removeEventListener('load', this.onNonLinearLoadSuccess);
    this.nonLinearImg.removeEventListener('error', this.onNonLinearLoadError);
    this.nonLinearATag.removeEventListener('click', this.onNonLinearClickThrough);
    this.nonLinearATag.removeEventListener('touchend', this.onNonLinearClickThrough);
    this.nonLinearClose.removeEventListener('click', this.onClickCloseNonLinear);
    this.nonLinearClose.removeEventListener('touchend', this.onClickCloseNonLinear);
    for (var i = 0, len = this.trackingTags.length; i < len; i++) {
      this.nonLinearContainer.removeEventListener(this.trackingTags[i].event, this.onEventPingTracking);
    }
  }
  if (this.vastPlayer) {
    this.vastPlayer.removeEventListener('error', this.onPlaybackError);
    // vastPlayer content pause/resume events
    this.vastPlayer.removeEventListener('durationchange', this.onDurationChange);
    this.vastPlayer.removeEventListener('loadedmetadata', this.onLoadedmetadataPlay);
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
      this.clickUIOnMobile.removeEventListener('touchend', this.onClickThrough);
    }
  }
  if (this.contentPlayer) {
    this.contentPlayer.removeEventListener('error', this.onPlaybackError);
  }
};

var _destroyVastPlayer = function () {
  var _this = this;

  if (DEBUG) {
    _fw2.default.log('start destroying vast player');
  }
  // destroy icons if any 
  if (this.icons.length > 0) {
    _icons2.default.destroy.call(this);
  }
  if (this.isVPAID) {
    _vpaid2.default.destroy.call(this);
  }
  // unwire events
  _unwireVastPlayerEvents.call(this);
  // remove clickUI on mobile
  if (this.clickUIOnMobile) {
    _fw2.default.removeElement(this.clickUIOnMobile);
  }
  if (this.isSkippableAd) {
    _fw2.default.removeElement(this.skipButton);
  }
  // hide rmp-ad-container
  _fw2.default.hide(this.adContainer);
  // unwire anti-seek logic (iOS)
  clearInterval(this.antiSeekLogicInterval);
  // reset creativeLoadTimeout
  clearTimeout(this.creativeLoadTimeoutCallback);
  if (this.useContentPlayerForAds) {
    if (!this.params.outstream) {
      if (this.nonLinearContainer) {
        _fw2.default.removeElement(this.nonLinearContainer);
      } else {
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
                _contentPlayer2.default.seekTo.call(_this, _this.currentContentCurrentTime);
              }
            });
          }
        }
        if (DEBUG) {
          _fw2.default.log('recovering content with src ' + this.currentContentSrc + ' - at time: ' + this.currentContentCurrentTime);
        }
        this.contentPlayer.src = this.currentContentSrc;
      }
    } else {
      // specific handling for outstream ad === flush buffer and do not attempt to resume content
      try {
        if (this.contentPlayer) {
          this.contentPlayer.pause();
          // empty buffer
          this.contentPlayer.removeAttribute('src');
          this.contentPlayer.load();
          if (DEBUG) {
            _fw2.default.log('flushing contentPlayer buffer after outstream ad');
          }
        }
      } catch (e) {
        _fw2.default.trace(e);
      }
    }
  } else {
    // flush vastPlayer
    try {
      if (this.vastPlayer) {
        this.vastPlayer.pause();
        // empty buffer
        this.vastPlayer.removeAttribute('src');
        this.vastPlayer.load();
        _fw2.default.hide(this.vastPlayer);
        if (DEBUG) {
          _fw2.default.log('flushing vastPlayer buffer after ad');
        }
      }
      if (this.nonLinearContainer) {
        _fw2.default.removeElement(this.nonLinearContainer);
      }
    } catch (e) {
      _fw2.default.trace(e);
    }
  }
  _default2.default.loadAdsVariables.call(this);
  _helpers2.default.createApiEvent.call(this, 'addestroyed');
};

VASTPLAYER.init = function () {
  var _this2 = this;

  if (DEBUG) {
    _fw2.default.log('init called');
  }
  this.adContainer = document.createElement('div');
  this.adContainer.className = 'rmp-ad-container';
  this.contentWrapper.appendChild(this.adContainer);
  _fw2.default.hide(this.adContainer);
  if (!this.useContentPlayerForAds) {
    this.vastPlayer = document.createElement('video');
    if (DEBUG) {
      _fw2.default.logVideoEvents(this.vastPlayer, 'vast');
    }
    // disable casting of video ads for Android
    if (_env2.default.isAndroid[0] && typeof this.vastPlayer.disableRemotePlayback !== 'undefined') {
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
    // note to myself: we use setAttribute for non-standard attribute (instead of . notation)
    this.vastPlayer.setAttribute('x-webkit-airplay', 'allow');
    if (typeof this.contentPlayer.playsInline === 'boolean' && this.contentPlayer.playsInline) {
      this.vastPlayer.playsInline = true;
    } else if (_env2.default.isMobile) {
      // this is for iOS/Android WebView where webkit-playsinline may be available
      this.vastPlayer.setAttribute('webkit-playsinline', true);
    }
    this.vastPlayer.defaultPlaybackRate = 1;
    // append to rmp-ad-container
    _fw2.default.hide(this.vastPlayer);
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
  // we need to preload as much creative data as possible
  // also on macOS and iOS Safari we need to force preload to avoid 
  // playback issues
  this.vastPlayer.preload = 'auto';
  // we need to init the vast player video tag
  // according to https://developers.google.com/interactive-media-ads/docs/sdks/html5/mobile_video
  // to initialize the content element, a call to the load() method is sufficient.
  if (_env2.default.isMobile) {
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
      var existingVastPlayer = this.adContainer.querySelector('.rmp-ad-vast-video-player');
      if (existingVastPlayer === null) {
        _vastErrors2.default.process.call(this, 1004);
        return;
      }
      this.vastPlayer = existingVastPlayer;
    }
  }
  if (!this.adIsLinear) {
    // we do not display non-linear ads with outstream ad 
    // they won't fit the format
    if (this.params.outstream) {
      if (DEBUG) {
        _fw2.default.log('non-linear creative detected for outstream ad mode - discarding creative');
      }
      _vastErrors2.default.process.call(this, 201);
      return;
    } else {
      _nonLinear2.default.update.call(this);
    }
  } else {
    if (url && type) {
      _linear2.default.update.call(this, url, type);
    }
  }
  // wire tracking events
  _trackingEvents2.default.wire.call(this);

  // append icons - only where vast player is different from 
  // content player
  if (!this.useContentPlayerForAds && this.icons.length > 0) {
    _icons2.default.append.call(this);
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
  return -1;
};

VASTPLAYER.setMute = function (muted) {
  if (this.vastPlayer) {
    if (muted && !this.vastPlayer.muted) {
      this.vastPlayer.muted = true;
      _helpers2.default.dispatchPingEvent.call(this, 'mute');
    } else if (!muted && this.vastPlayer.muted) {
      this.vastPlayer.muted = false;
      _helpers2.default.dispatchPingEvent.call(this, 'unmute');
    }
  }
};

VASTPLAYER.getMute = function () {
  if (this.vastPlayer) {
    return this.vastPlayer.muted;
  }
  return false;
};

VASTPLAYER.play = function (firstVastPlayerPlayRequest) {
  if (this.vastPlayer && this.vastPlayer.paused) {
    _helpers2.default.playPromise.call(this, 'vast', firstVastPlayerPlayRequest);
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
    if (_fw2.default.isNumber(duration)) {
      return Math.round(duration * 1000);
    }
  }
  return -1;
};

VASTPLAYER.getCurrentTime = function () {
  if (this.vastPlayer) {
    var currentTime = this.vastPlayer.currentTime;
    if (_fw2.default.isNumber(currentTime)) {
      return Math.round(currentTime * 1000);
    }
  }
  return -1;
};

VASTPLAYER.resumeContent = function () {
  if (DEBUG) {
    _fw2.default.log('resumeContent');
  }
  _destroyVastPlayer.call(this);
  // if this.contentPlayerCompleted = true - we are in a post-roll situation
  // in that case we must not resume content once the post-roll has completed
  // you can use setContentPlayerCompleted/getContentPlayerCompleted to support 
  // custom use-cases when dynamically changing source for content
  // no need to resume content for outstream ads
  if (!this.contentPlayerCompleted && !this.params.outstream) {
    _contentPlayer2.default.play.call(this);
  }
  this.contentPlayerCompleted = false;
};

exports.default = VASTPLAYER;

},{"../creatives/icons":3,"../creatives/linear":4,"../creatives/non-linear":5,"../fw/env":7,"../fw/fw":8,"../players/content-player":10,"../players/vpaid":12,"../tracking/tracking-events":14,"../utils/default":15,"../utils/helpers":16,"../utils/vast-errors":17}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fw = require('../fw/fw');

var _fw2 = _interopRequireDefault(_fw);

var _env = require('../fw/env');

var _env2 = _interopRequireDefault(_env);

var _helpers = require('../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _vastErrors = require('../utils/vast-errors');

var _vastErrors2 = _interopRequireDefault(_vastErrors);

var _ping = require('../tracking/ping');

var _ping2 = _interopRequireDefault(_ping);

var _vastPlayer = require('../players/vast-player');

var _vastPlayer2 = _interopRequireDefault(_vastPlayer);

var _icons = require('../creatives/icons');

var _icons2 = _interopRequireDefault(_icons);

var _trackingEvents = require('../tracking/tracking-events');

var _trackingEvents2 = _interopRequireDefault(_trackingEvents);

var _contentPlayer = require('../players/content-player');

var _contentPlayer2 = _interopRequireDefault(_contentPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VPAID = {};

// vpaidCreative getters

VPAID.getAdWidth = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdWidth === 'function') {
    return this.vpaidCreative.getAdWidth();
  }
  return -1;
};

VPAID.getAdHeight = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdHeight === 'function') {
    return this.vpaidCreative.getAdHeight();
  }
  return -1;
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
  return '';
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
  return false;
};

VPAID.getAdSkippableState = function () {
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdSkippableState === 'function') {
    return this.vpaidCreative.getAdSkippableState();
  }
  return false;
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
  return '';
};

// VPAID creative events
var _onAdLoaded = function () {
  var _this = this;

  if (DEBUG) {
    _fw2.default.log('VPAID AdLoaded event');
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
      _vastPlayer2.default.resumeContent.call(_this);
    }
    _this.vpaidAdStarted = false;
  }, this.params.creativeLoadTimeout);
  // pause content player
  _contentPlayer2.default.pause.call(this);
  this.adOnStage = true;
  this.vpaidCreative.startAd();
  _helpers2.default.createApiEvent.call(this, 'adloaded');
};

var _onAdStarted = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdStarted event');
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
    _icons2.default.append.call(this);
  }
  if (typeof this.vpaidCreative.getAdLinear === 'function') {
    this.adIsLinear = this.vpaidCreative.getAdLinear();
  }
  _helpers2.default.dispatchPingEvent.call(this, 'creativeView');
};

var _onAdStopped = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdStopped event');
  }
  if (this.adStoppedTimeout) {
    clearTimeout(this.adStoppedTimeout);
  }
  _vastPlayer2.default.resumeContent.call(this);
};

var _onAdSkipped = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdSkipped event');
  }
  if (this.adSkippedTimeout) {
    clearTimeout(this.adSkippedTimeout);
  }
  _helpers2.default.createApiEvent.call(this, 'adskipped');
  _helpers2.default.dispatchPingEvent.call(this, 'skip');
};

var _onAdSkippableStateChange = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdSkippableStateChange event');
  }
  _helpers2.default.createApiEvent.call(this, 'adskippablestatechanged');
};

var _onAdDurationChange = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdDurationChange event ' + VPAID.getAdDuration.call(this));
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
  _helpers2.default.createApiEvent.call(this, 'addurationchange');
};

var _onAdVolumeChange = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdVolumeChange event');
  }
  var newVolume = VPAID.getAdVolume.call(this);
  if (newVolume === null) {
    return;
  }
  if (this.vpaidCurrentVolume > 0 && newVolume === 0) {
    _helpers2.default.dispatchPingEvent.call(this, 'mute');
  } else if (this.vpaidCurrentVolume === 0 && newVolume > 0) {
    _helpers2.default.dispatchPingEvent.call(this, 'unmute');
  }
  this.vpaidCurrentVolume = newVolume;
  _helpers2.default.createApiEvent.call(this, 'advolumechanged');
};

var _onAdImpression = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdImpression event');
  }
  _helpers2.default.createApiEvent.call(this, 'adimpression');
  _helpers2.default.dispatchPingEvent.call(this, 'impression');
};

var _onAdVideoStart = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdVideoStart event');
  }
  this.vpaidPaused = false;
  var newVolume = VPAID.getAdVolume.call(this);
  if (newVolume === null) {
    newVolume = 1;
  }
  this.vpaidCurrentVolume = newVolume;
  _helpers2.default.createApiEvent.call(this, 'adstarted');
  _helpers2.default.dispatchPingEvent.call(this, 'start');
};

var _onAdVideoFirstQuartile = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdVideoFirstQuartile event');
  }
  _helpers2.default.createApiEvent.call(this, 'adfirstquartile');
  _helpers2.default.dispatchPingEvent.call(this, 'firstQuartile');
};

var _onAdVideoMidpoint = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdVideoMidpoint event');
  }
  _helpers2.default.createApiEvent.call(this, 'admidpoint');
  _helpers2.default.dispatchPingEvent.call(this, 'midpoint');
};

var _onAdVideoThirdQuartile = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdVideoThirdQuartile event');
  }
  _helpers2.default.createApiEvent.call(this, 'adthirdquartile');
  _helpers2.default.dispatchPingEvent.call(this, 'thirdQuartile');
};

var _onAdVideoComplete = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdVideoComplete event');
  }
  _helpers2.default.createApiEvent.call(this, 'adcomplete');
  _helpers2.default.dispatchPingEvent.call(this, 'complete');
};

var _onAdClickThru = function (url, id, playerHandles) {
  if (DEBUG) {
    _fw2.default.log('VPAID AdClickThru event');
  }
  _helpers2.default.createApiEvent.call(this, 'adclick');
  _helpers2.default.dispatchPingEvent.call(this, 'clickthrough');
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
      _fw2.default.openWindow(this.clickThroughUrl);
    }
  }
};

var _onAdPaused = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdPaused event');
  }
  this.vpaidPaused = true;
  _helpers2.default.createApiEvent.call(this, 'adpaused');
  _helpers2.default.dispatchPingEvent.call(this, 'pause');
};

var _onAdPlaying = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdPlaying event');
  }
  this.vpaidPaused = false;
  _helpers2.default.createApiEvent.call(this, 'adresumed');
  _helpers2.default.dispatchPingEvent.call(this, 'resume');
};

var _onAdLog = function (message) {
  if (DEBUG) {
    _fw2.default.log('VPAID AdLog event ' + message);
  }
};

var _onAdError = function (message) {
  if (DEBUG) {
    _fw2.default.log('VPAID AdError event ' + message);
  }
  _ping2.default.error.call(this, 901);
  _vastErrors2.default.process.call(this, 901);
};

var _onAdInteraction = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdInteraction event');
  }
  _helpers2.default.createApiEvent.call(this, 'adinteraction');
};

var _onAdUserAcceptInvitation = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdUserAcceptInvitation event');
  }
  _helpers2.default.createApiEvent.call(this, 'aduseracceptinvitation');
  _helpers2.default.dispatchPingEvent.call(this, 'acceptInvitation');
};

var _onAdUserMinimize = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdUserMinimize event');
  }
  _helpers2.default.createApiEvent.call(this, 'adcollapse');
  _helpers2.default.dispatchPingEvent.call(this, 'collapse');
};

var _onAdUserClose = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdUserClose event');
  }
  _helpers2.default.createApiEvent.call(this, 'adclose');
  _helpers2.default.dispatchPingEvent.call(this, 'close');
};

var _onAdSizeChange = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdSizeChange event');
  }
  _helpers2.default.createApiEvent.call(this, 'adsizechange');
};

var _onAdLinearChange = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdLinearChange event');
  }
  if (this.vpaidCreative && typeof this.vpaidCreative.getAdLinear === 'function') {
    this.adIsLinear = this.vpaidCreative.getAdLinear();
    _helpers2.default.createApiEvent.call(this, 'adlinearchange');
  }
};

var _onAdExpandedChange = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdExpandedChange event');
  }
  _helpers2.default.createApiEvent.call(this, 'adexpandedchange');
};

var _onAdRemainingTimeChange = function () {
  if (DEBUG) {
    _fw2.default.log('VPAID AdRemainingTimeChange event');
  }
  if (!this.vpaidCreative && typeof this.vpaidCreative.getAdRemainingTime === 'function') {
    var remainingTime = this.vpaidCreative.getAdRemainingTime();
    if (remainingTime >= 0) {
      this.vpaidRemainingTime = remainingTime;
    }
  }
  _helpers2.default.createApiEvent.call(this, 'adremainingtimechange');
};

// vpaidCreative methods
VPAID.resizeAd = function (width, height, viewMode) {
  if (!this.vpaidCreative) {
    return;
  }
  if (!_fw2.default.isNumber(width) || !_fw2.default.isNumber(height) || typeof viewMode !== 'string') {
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
    _fw2.default.log('VPAID resizeAd with width ' + width + ' - height ' + height + ' - viewMode ' + viewMode);
  }
  this.vpaidCreative.resizeAd(width, height, validViewMode);
};

VPAID.stopAd = function () {
  var _this2 = this;

  if (!this.vpaidCreative) {
    return;
  }
  if (DEBUG) {
    _fw2.default.log('stopAd');
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
    _fw2.default.log('pauseAd');
  }
  if (this.vpaidCreative && !this.vpaidPaused) {
    this.vpaidCreative.pauseAd();
  }
};

VPAID.resumeAd = function () {
  if (DEBUG) {
    _fw2.default.log('resumeAd');
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
  if (this.vpaidCreative && _fw2.default.isNumber(volume) && volume >= 0 && volume <= 1 && typeof this.vpaidCreative.setAdVolume === 'function') {
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
      _fw2.default.trace(e);
      if (DEBUG) {
        _fw2.default.log('could not validate VPAID ad unit handshakeVersion');
      }
      _ping2.default.error.call(this, 901);
      _vastErrors2.default.process.call(this, 901);
      return;
    }
    this.vpaidVersion = parseInt(vpaidVersion);
    if (this.vpaidVersion < 1) {
      if (DEBUG) {
        _fw2.default.log('unsupported VPAID version - exit');
      }
      _ping2.default.error.call(this, 901);
      _vastErrors2.default.process.call(this, 901);
      return;
    }
    if (!_isValidVPAID(this.vpaidCreative)) {
      //The VPAID creative doesn't conform to the VPAID spec
      if (DEBUG) {
        _fw2.default.log('VPAID creative does not conform to VPAID spec - exit');
      }
      _ping2.default.error.call(this, 901);
      _vastErrors2.default.process.call(this, 901);
      return;
    }
    // wire callback for VPAID events
    _setCallbacksForCreative.call(this);
    // wire tracking events for VAST pings
    _trackingEvents2.default.wire.call(this);
    var creativeData = {};
    creativeData.AdParameters = this.adParametersData;
    if (DEBUG) {
      _fw2.default.log('VPAID AdParameters follow');
      _fw2.default.log(this.adParametersData);
    }
    _fw2.default.show(this.adContainer);
    _fw2.default.show(this.vastPlayer);
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
          _fw2.default.log('initAdTimeout');
        }
        _vastPlayer2.default.resumeContent.call(_this4);
      }
      _this4.vpaidAdLoaded = false;
    }, this.params.creativeLoadTimeout * 10);
    if (DEBUG) {
      _fw2.default.log('calling initAd on VPAID creative now');
    }
    this.vpaidCreative.initAd(this.initialWidth, this.initialHeight, this.initialViewMode, this.desiredBitrate, creativeData, environmentVars);
  }
};

var _onJSVPAIDLoaded = function () {
  var _this5 = this;

  if (DEBUG) {
    _fw2.default.log('VPAID JS loaded');
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
    _fw2.default.log('VPAID JS error loading');
  }
  this.vpaidScript.removeEventListener('error', this.onJSVPAIDError);
  _ping2.default.error.call(this, 901);
  _vastErrors2.default.process.call(this, 901);
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
      var existingVastPlayer = this.adContainer.querySelector('.rmp-ad-vast-video-player');
      if (existingVastPlayer === null) {
        _vastErrors2.default.process.call(this, 1004);
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
  if (_env2.default.isFirefox || this.useContentPlayerForAds) {
    src = '';
  }
  this.vpaidIframe.onload = function () {
    var _this6 = this;

    if (DEBUG) {
      _fw2.default.log('iframe.onload');
    }
    // we unwire listeners
    this.vpaidIframe.onload = this.vpaidIframe.onerror = _fw2.default.nullFn;
    if (!this.vpaidIframe.contentWindow || !this.vpaidIframe.contentWindow.document || !this.vpaidIframe.contentWindow.document.body) {
      // PING error and resume content
      _ping2.default.error.call(this, 901);
      _vastErrors2.default.process.call(this, 901);
      return;
    }
    var iframeWindow = this.vpaidIframe.contentWindow;
    var iframeDocument = iframeWindow.document;
    var iframeBody = iframeDocument.body;
    this.vpaidScript = iframeDocument.createElement('script');

    this.vpaidLoadTimeout = setTimeout(function () {
      if (DEBUG) {
        _fw2.default.log('could not load VPAID JS Creative or getVPAIDAd in iframeWindow - resume content');
      }
      _this6.vpaidScript.removeEventListener('load', _this6.onJSVPAIDLoaded);
      _this6.vpaidScript.removeEventListener('error', _this6.onJSVPAIDError);
      _vastPlayer2.default.resumeContent.call(_this6);
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
      _fw2.default.log('iframe.onerror');
    }
    // we unwire listeners
    this.vpaidIframe.onload = this.vpaidIframe.onerror = _fw2.default.nullFn;
    // PING error and resume content
    _ping2.default.error.call(this, 901);
    _vastErrors2.default.process.call(this, 901);
  }.bind(this);

  this.vpaidIframe.src = src;
  this.adContainer.appendChild(this.vpaidIframe);
};

VPAID.destroy = function () {
  if (DEBUG) {
    _fw2.default.log('destroy VPAID dependencies');
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
    _fw2.default.removeElement(this.vpaidSlot);
  }
  if (this.vpaidIframe) {
    _fw2.default.removeElement(this.vpaidIframe);
  }
};

exports.default = VPAID;

},{"../creatives/icons":3,"../fw/env":7,"../fw/fw":8,"../players/content-player":10,"../players/vast-player":11,"../tracking/ping":13,"../tracking/tracking-events":14,"../utils/helpers":16,"../utils/vast-errors":17}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fw = require('../fw/fw');

var _fw2 = _interopRequireDefault(_fw);

var _contentPlayer = require('../players/content-player');

var _contentPlayer2 = _interopRequireDefault(_contentPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var PING = {};

PING.events = ['impression', 'creativeView', 'start', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete', 'mute', 'unmute', 'pause', 'resume', 'fullscreen', 'exitFullscreen', 'skip', 'progress', 'clickthrough', 'close', 'collapse', 'acceptInvitation'];

var _replaceMacros = function (url, errorCode, assetUri) {
  var pattern1 = /\[CACHEBUSTING\]/gi;
  var finalString = url;
  if (pattern1.test(finalString)) {
    finalString = finalString.replace(pattern1, _fw2.default.generateCacheBusting());
  }
  var pattern2 = /\[ERRORCODE\]/gi;
  if (pattern2.test(finalString) && _fw2.default.isNumber(errorCode) && errorCode > 0 && errorCode < 1000) {
    finalString = finalString.replace(pattern2, errorCode);
  }
  var pattern3 = /\[CONTENTPLAYHEAD\]/gi;
  var currentTime = _contentPlayer2.default.getCurrentTime.call(this);
  if (pattern3.test(finalString) && currentTime > -1) {
    currentTime = _fw2.default.vastReadableTime(currentTime);
    finalString = finalString.replace(pattern3, _fw2.default.RFC3986EncodeURIComponent(currentTime));
  }
  var pattern4 = /\[ASSETURI\]/gi;
  if (pattern4.test(finalString) && typeof assetUri === 'string' && assetUri !== '') {
    finalString = finalString.replace(pattern4, _fw2.default.RFC3986EncodeURIComponent(assetUri));
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
      _fw2.default.log('VAST tracker successfully loaded ' + url);
    }
    img = null;
  });
  img.addEventListener('error', function () {
    if (DEBUG) {
      _fw2.default.log('VAST tracker failed loading ' + url);
    }
    img = null;
  });
  img.src = url;
};

PING.tracking = function (url, assetUri) {
  var trackingUrl = _replaceMacros.call(this, url, null, assetUri);
  _ping(trackingUrl);
  if (DEBUG) {
    _fw2.default.log('VAST tracking requesting ping at URL ' + trackingUrl);
  }
};

PING.error = function (errorCode) {
  // for each Error tag within an InLine or chain of Wrapper ping error URL
  var errorTags = this.inlineOrWrapperErrorTags;
  if (errorCode === 303 && this.vastErrorTags.length > 0) {
    // here we ping vastErrorTags with error code 303 according to spec
    // concat array thus
    errorTags = [].concat(_toConsumableArray(errorTags), _toConsumableArray(this.vastErrorTags));
  }
  if (errorTags.length > 0) {
    for (var i = 0, len = errorTags.length; i < len; i++) {
      var errorUrl = _replaceMacros.call(this, errorTags[i].url, errorCode, null);
      _ping(errorUrl);
      if (DEBUG) {
        _fw2.default.log('VAST tracking requesting error at URL ' + errorUrl);
      }
    }
  }
};

exports.default = PING;

},{"../fw/fw":8,"../players/content-player":10}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fw = require('../fw/fw');

var _fw2 = _interopRequireDefault(_fw);

var _ping = require('./ping');

var _ping2 = _interopRequireDefault(_ping);

var _helpers = require('../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _vastPlayer = require('../players/vast-player');

var _vastPlayer2 = _interopRequireDefault(_vastPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TRACKINGEVENTS = {};

var _pingTrackers = function (trackers) {
  var _this = this;

  trackers.forEach(function (element) {
    _ping2.default.tracking.call(_this, element.url, _this.getAdMediaUrl());
  });
};

var _onEventPingTracking = function (event) {
  if (event && event.type) {
    if (DEBUG) {
      _fw2.default.log('ping tracking for ' + event.type + ' VAST event');
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
    _helpers2.default.createApiEvent.call(this, 'advolumemuted');
    _helpers2.default.dispatchPingEvent.call(this, 'mute');
    this.vastPlayerMuted = true;
  } else {
    if (this.vastPlayerMuted) {
      _helpers2.default.dispatchPingEvent.call(this, 'unmute');
      this.vastPlayerMuted = false;
    }
  }
  _helpers2.default.createApiEvent.call(this, 'advolumechanged');
};

var _onTimeupdate = function () {
  var _this2 = this;

  this.vastPlayerCurrentTime = _vastPlayer2.default.getCurrentTime.call(this);
  if (this.vastPlayerCurrentTime > 0) {
    if (this.vastPlayerDuration > 0 && this.vastPlayerDuration > this.vastPlayerCurrentTime) {
      if (this.vastPlayerCurrentTime >= this.vastPlayerDuration * 0.25 && !this.firstQuartileEventFired) {
        this.firstQuartileEventFired = true;
        _helpers2.default.createApiEvent.call(this, 'adfirstquartile');
        _helpers2.default.dispatchPingEvent.call(this, 'firstQuartile');
      } else if (this.vastPlayerCurrentTime >= this.vastPlayerDuration * 0.5 && !this.midpointEventFired) {
        this.midpointEventFired = true;
        _helpers2.default.createApiEvent.call(this, 'admidpoint');
        _helpers2.default.dispatchPingEvent.call(this, 'midpoint');
      } else if (this.vastPlayerCurrentTime >= this.vastPlayerDuration * 0.75 && !this.thirdQuartileEventFired) {
        this.thirdQuartileEventFired = true;
        _helpers2.default.createApiEvent.call(this, 'adthirdquartile');
        _helpers2.default.dispatchPingEvent.call(this, 'thirdQuartile');
      }
    }
    if (this.isSkippableAd) {
      // progress event for skippable ads
      if (this.progressEventOffsetsSeconds === null) {
        this.progressEventOffsetsSeconds = [];
        this.progressEventOffsets.forEach(function (element) {
          _this2.progressEventOffsetsSeconds.push({
            offsetSeconds: _fw2.default.convertOffsetToSeconds(element, _this2.vastPlayerDuration),
            offsetRaw: element
          });
        });
        this.progressEventOffsetsSeconds.sort(function (a, b) {
          return a.offsetSeconds - b.offsetSeconds;
        });
      }
      if (Array.isArray(this.progressEventOffsetsSeconds) && this.progressEventOffsetsSeconds.length > 0 && this.vastPlayerCurrentTime >= this.progressEventOffsetsSeconds[0].offsetSeconds * 1000) {
        _helpers2.default.dispatchPingEvent.call(this, 'progress-' + this.progressEventOffsetsSeconds[0].offsetRaw);
        this.progressEventOffsetsSeconds.shift();
      }
    }
  }
};

var _onPause = function () {
  if (!this.vastPlayerPaused) {
    this.vastPlayerPaused = true;
    _helpers2.default.createApiEvent.call(this, 'adpaused');
    // do not dispatchPingEvent for pause event here if it is already in this.trackingTags
    for (var i = 0, len = this.trackingTags.length; i < len; i++) {
      if (this.trackingTags[i].event === 'pause') {
        return;
      }
    }
    _helpers2.default.dispatchPingEvent.call(this, 'pause');
  }
};

var _onPlay = function () {
  if (this.vastPlayerPaused) {
    this.vastPlayerPaused = false;
    _helpers2.default.createApiEvent.call(this, 'adresumed');
    _helpers2.default.dispatchPingEvent.call(this, 'resume');
  }
};

var _onPlaying = function () {
  this.vastPlayer.removeEventListener('playing', this.onPlaying);
  _helpers2.default.createApiEvent.call(this, 'adimpression');
  _helpers2.default.createApiEvent.call(this, 'adstarted');
  _helpers2.default.dispatchPingEvent.call(this, ['impression', 'creativeView', 'start']);
};

var _onEnded = function () {
  this.vastPlayer.removeEventListener('ended', this.onEnded);
  _helpers2.default.createApiEvent.call(this, 'adcomplete');
  _helpers2.default.dispatchPingEvent.call(this, 'complete');
  _vastPlayer2.default.resumeContent.call(this);
};

TRACKINGEVENTS.wire = function () {
  if (DEBUG) {
    _fw2.default.log('wire tracking events');
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
    _fw2.default.log('detected VAST events follow');
    _fw2.default.log(this.trackingTags);
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

TRACKINGEVENTS.filterPush = function (trackingEvents) {
  var trackingTags = trackingEvents[0].getElementsByTagName('Tracking');
  // in case we are in a pod
  if (this.adPodWrapperTrackings.length > 0) {
    this.trackingTags = this.adPodWrapperTrackings;
  }
  // collect supported tracking events with valid event names and tracking urls
  for (var i = 0, len = trackingTags.length; i < len; i++) {
    var event = trackingTags[i].getAttribute('event');
    var url = _fw2.default.getNodeValue(trackingTags[i], true);
    if (event !== null && event !== '' && _ping2.default.events.indexOf(event) > -1 && url !== null) {
      if (this.isSkippableAd) {
        if (event === 'progress') {
          var offset = trackingTags[i].getAttribute('offset');
          if (offset === null || offset === '' || !_fw2.default.isValidOffset(offset)) {
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

exports.default = TRACKINGEVENTS;

},{"../fw/fw":8,"../players/vast-player":11,"../utils/helpers":16,"./ping":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fw = require('../fw/fw');

var _fw2 = _interopRequireDefault(_fw);

var _env = require('../fw/env');

var _env2 = _interopRequireDefault(_env);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT = {};

DEFAULT.instanceVariables = function () {
  this.adContainer = null;
  this.rmpVastInitialized = false;
  this.useContentPlayerForAds = false;
  this.contentPlayerCompleted = false;
  this.currentContentSrc = '';
  this.currentContentCurrentTime = -1;
  this.needsSeekAdjust = false;
  this.seekAdjustAttached = false;
  this.onDestroyLoadAds = null;
  this.firstVastPlayerPlayRequest = true;
  this.firstContentPlayerPlayRequest = true;
  this.params = {};
  // adpod 
  this.adPod = [];
  this.standaloneAdsInPod = [];
  this.onAdDestroyLoadNextAdInPod = _fw2.default.nullFn;
  this.runningAdPod = false;
  this.adPodItemWrapper = false;
  this.adPodCurrentIndex = 0;
  this.adPodApiInfo = [];
  this.adPodWrapperTrackings = [];
  // on iOS and macOS Safari we use content player to play ads
  // to avoid issues related to fullscreen management and autoplay
  // as fullscreen on iOS is handled by the default OS player
  if (_env2.default.isIos[0] || _env2.default.isMacOSX && _env2.default.isSafari[0]) {
    this.useContentPlayerForAds = true;
    if (DEBUG) {
      _fw2.default.log('vast player will be content player');
    }
  }
};

DEFAULT.loadAdsVariables = function () {
  // init internal methods 
  this.onLoadedmetadataPlay = null;
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
  this.adTagUrl = '';
  this.vastPlayer = null;
  this.vpaidSlot = null;
  this.trackingTags = [];
  this.vastErrorTags = [];
  this.inlineOrWrapperErrorTags = [];
  this.adMediaUrl = '';
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
  this.adErrorType = '';
  this.vastErrorMessage = '';
  this.adSystem = '';
  this.adIsLinear = false;
  this.adContentType = '';
  this.adTitle = '';
  this.adDescription = '';
  this.adOnStage = false;
  this.clickThroughUrl = '';
  this.isWrapper = false;
  this.vastAdTagURI = null;
  this.redirectsFollowed = 0;
  this.icons = [];
  this.clickUIOnMobile = null;
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
  this.nonLinearContentType = '';
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
  this.onJSVPAIDLoaded = _fw2.default.nullFn;
  this.onJSVPAIDError = _fw2.default.nullFn;
};

DEFAULT.fullscreen = function () {
  // attach fullscreen states
  // this assumes we have a polyfill for fullscreenchange event 
  // see app/js/app.js
  // we need this to handle VAST fullscreen events
  var isInFullscreen = false;
  var _onFullscreenchange = function (event) {
    if (event && event.type) {
      if (DEBUG) {
        _fw2.default.log('event is ' + event.type);
      }
      if (event.type === 'fullscreenchange') {
        if (isInFullscreen) {
          isInFullscreen = false;
          if (this.adOnStage && this.adIsLinear) {
            _helpers2.default.dispatchPingEvent.call(this, 'exitFullscreen');
          }
        } else {
          isInFullscreen = true;
          if (this.adOnStage && this.adIsLinear) {
            _helpers2.default.dispatchPingEvent.call(this, 'fullscreen');
          }
        }
      } else if (event.type === 'webkitbeginfullscreen') {
        // iOS uses webkitbeginfullscreen
        if (this.adOnStage && this.adIsLinear) {
          _helpers2.default.dispatchPingEvent.call(this, 'fullscreen');
        }
      } else if (event.type === 'webkitendfullscreen') {
        // iOS uses webkitendfullscreen
        if (this.adOnStage && this.adIsLinear) {
          _helpers2.default.dispatchPingEvent.call(this, 'exitFullscreen');
        }
      }
    }
  };
  // if we have native fullscreen support we handle fullscreen events
  if (_env2.default.hasNativeFullscreenSupport) {
    var onFullscreenchange = _onFullscreenchange.bind(this);
    // for our beloved iOS 
    if (_env2.default.isIos[0]) {
      this.contentPlayer.addEventListener('webkitbeginfullscreen', onFullscreenchange);
      this.contentPlayer.addEventListener('webkitendfullscreen', onFullscreenchange);
    } else {
      document.addEventListener('fullscreenchange', onFullscreenchange);
    }
  }
};

exports.default = DEFAULT;

},{"../fw/env":7,"../fw/fw":8,"./helpers":16}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fw = require('../fw/fw');

var _fw2 = _interopRequireDefault(_fw);

var _vastErrors = require('./vast-errors');

var _vastErrors2 = _interopRequireDefault(_vastErrors);

var _ping = require('../tracking/ping');

var _ping2 = _interopRequireDefault(_ping);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HELPERS = {};

HELPERS.filterParams = function (inputParams) {
  var defaultParams = {
    ajaxTimeout: 5000,
    creativeLoadTimeout: 8000,
    ajaxWithCredentials: false,
    maxNumRedirects: 4,
    maxNumItemsInAdPod: 10,
    pauseOnClick: true,
    skipMessage: 'Skip ad',
    skipWaitingMessage: 'Skip ad in',
    textForClickUIOnMobile: 'Learn more',
    enableVpaid: true,
    outstream: false,
    vpaidSettings: {
      width: 640,
      height: 360,
      viewMode: 'normal',
      desiredBitrate: 500
    }
  };
  this.params = defaultParams;
  if (_fw2.default.isObject(inputParams)) {
    var keys = Object.keys(inputParams);
    for (var i = 0, len = keys.length; i < len; i++) {
      var prop = keys[i];
      if (typeof inputParams[prop] === typeof this.params[prop]) {
        if (_fw2.default.isNumber(inputParams[prop]) && inputParams[prop] > 0 || typeof inputParams[prop] !== 'number') {
          if (prop === 'vpaidSettings') {
            if (_fw2.default.isNumber(inputParams.vpaidSettings.width) && inputParams.vpaidSettings.width > 0) {
              this.params.vpaidSettings.width = inputParams.vpaidSettings.width;
            }
            if (_fw2.default.isNumber(inputParams.vpaidSettings.height) && inputParams.vpaidSettings.height > 0) {
              this.params.vpaidSettings.height = inputParams.vpaidSettings.height;
            }
            if (typeof inputParams.vpaidSettings.viewMode === 'string' && inputParams.vpaidSettings.viewMode === 'fullscreen') {
              this.params.vpaidSettings.viewMode = inputParams.vpaidSettings.viewMode;
            }
            if (_fw2.default.isNumber(inputParams.vpaidSettings.desiredBitrate) && inputParams.vpaidSettings.desiredBitrate > 0) {
              this.params.vpaidSettings.desiredBitrate = inputParams.vpaidSettings.desiredBitrate;
            }
          } else {
            this.params[prop] = inputParams[prop];
          }
        }
      }
    }
    // we need to avoid infinite wrapper loops scenario 
    // so we cap maxNumRedirects to 30 
    if (this.params.maxNumRedirects > 30) {
      this.params.maxNumRedirects = 30;
    }
  }
};

HELPERS.createApiEvent = function (event) {
  // adloaded, addurationchange, adclick, adimpression, adstarted, 
  // adtagloaded, adtagstartloading, adpaused, adresumed 
  // advolumemuted, advolumechanged, adcomplete, adskipped, 
  // adskippablestatechanged, adclosed
  // adfirstquartile, admidpoint, adthirdquartile, aderror, 
  // adfollowingredirect, addestroyed
  // adlinearchange, adexpandedchange, adremainingtimechange 
  // adinteraction, adsizechange
  if (typeof event === 'string' && event !== '') {
    _fw2.default.createStdEvent(event, this.container);
  }
};

HELPERS.dispatchPingEvent = function (event) {
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
          _fw2.default.createStdEvent(currentEvent, element);
        });
      } else {
        _fw2.default.createStdEvent(event, element);
      }
    }
  }
};

HELPERS.playPromise = function (whichPlayer, firstPlayerPlayRequest) {
  var _this = this;

  var targetPlayer = void 0;
  switch (whichPlayer) {
    case 'content':
      targetPlayer = this.contentPlayer;
      break;
    case 'vast':
      targetPlayer = this.vastPlayer;
      break;
    default:
      break;
  }
  if (targetPlayer) {
    var playPromise = targetPlayer.play();
    // most modern browsers support play as a Promise
    // this lets us handle autoplay rejection 
    // https://developers.google.com/web/updates/2016/03/play-returns-promise
    if (playPromise !== undefined) {
      playPromise.then(function () {
        if (firstPlayerPlayRequest) {
          if (DEBUG) {
            _fw2.default.log('initial play promise on ' + whichPlayer + ' player has succeeded');
          }
          HELPERS.createApiEvent.call(_this, 'adinitialplayrequestsucceeded');
        }
      }).catch(function (e) {
        if (firstPlayerPlayRequest && whichPlayer === 'vast' && _this.adIsLinear) {
          if (DEBUG) {
            _fw2.default.log(e);
            _fw2.default.log('initial play promise on VAST player has been rejected for linear asset - likely autoplay is being blocked');
          }
          _ping2.default.error.call(_this, 400);
          _vastErrors2.default.process.call(_this, 400);
          HELPERS.createApiEvent.call(_this, 'adinitialplayrequestfailed');
        } else if (firstPlayerPlayRequest && whichPlayer === 'content' && !_this.adIsLinear) {
          if (DEBUG) {
            _fw2.default.log(e);
            _fw2.default.log('initial play promise on content player has been rejected for non-linear asset - likely autoplay is being blocked');
          }
          HELPERS.createApiEvent.call(_this, 'adinitialplayrequestfailed');
        } else {
          if (DEBUG) {
            _fw2.default.log(e);
            _fw2.default.log('playPromise on ' + whichPlayer + ' player has been rejected');
          }
        }
      });
    }
  }
};

HELPERS.accessibleButton = function (element, ariaLabel) {
  // make skip button accessible
  element.tabIndex = 0;
  element.setAttribute('role', 'button');
  element.addEventListener('keyup', function (event) {
    var code = event.which;
    // 13 = Return, 32 = Space
    if (code === 13 || code === 32) {
      event.stopPropagation();
      event.preventDefault();
      _fw2.default.createStdEvent('click', element);
    }
  });
  if (ariaLabel) {
    element.setAttribute('aria-label', ariaLabel);
  }
};

exports.default = HELPERS;

},{"../fw/fw":8,"../tracking/ping":13,"./vast-errors":17}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fw = require('../fw/fw');

var _fw2 = _interopRequireDefault(_fw);

var _helpers = require('../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _vastPlayer = require('../players/vast-player');

var _vastPlayer2 = _interopRequireDefault(_vastPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VASTERRORS = {};

// Indicates that the error was encountered when the ad was being loaded. 
// Possible causes: there was no response from the ad server, malformed ad response was returned ...
var loadErrorList = [100, 101, 102, 300, 301, 302, 303, 900, 1000, 1001];

// Indicates that the error was encountered after the ad loaded, during ad play. 
// Possible causes: ad assets could not be loaded, etc.
var playErrorList = [200, 201, 202, 203, 400, 401, 402, 403, 405, 500, 501, 502, 503, 600, 601, 602, 603, 604, 901, 1002, 1003, 1004];

var vastErrorsList = [{
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
  var error = vastErrorsList.filter(function (value) {
    return value.code === errorCode;
  });
  if (error.length > 0) {
    this.vastErrorCode = error[0].code;
    this.vastErrorMessage = error[0].description;
  } else {
    this.vastErrorCode = -1;
    this.vastErrorMessage = 'Error getting VAST error';
  }
  if (this.vastErrorCode > -1) {
    if (loadErrorList.indexOf(this.vastErrorCode) > -1) {
      this.adErrorType = 'adLoadError';
    } else if (playErrorList.indexOf(this.vastErrorCode) > -1) {
      this.adErrorType = 'adPlayError';
    }
  }
  if (DEBUG) {
    _fw2.default.log('VAST error code is ' + this.vastErrorCode);
    _fw2.default.log('VAST error message is ' + this.vastErrorMessage);
    _fw2.default.log('Ad error type is ' + this.adErrorType);
  }
};

VASTERRORS.process = function (errorCode) {
  _updateVastError.call(this, errorCode);
  _helpers2.default.createApiEvent.call(this, 'aderror');
  _vastPlayer2.default.resumeContent.call(this);
};

exports.default = VASTERRORS;

},{"../fw/fw":8,"../players/vast-player":11,"../utils/helpers":16}],18:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],19:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_hide":50,"./_wks":120}],20:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],21:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":59}],22:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};

},{"./_to-absolute-index":105,"./_to-length":109,"./_to-object":110}],23:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"./_to-absolute-index":105,"./_to-length":109,"./_to-object":110}],24:[function(require,module,exports){
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

},{"./_to-absolute-index":105,"./_to-iobject":108,"./_to-length":109}],25:[function(require,module,exports){
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

},{"./_array-species-create":27,"./_ctx":36,"./_iobject":55,"./_to-length":109,"./_to-object":110}],26:[function(require,module,exports){
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

},{"./_is-array":57,"./_is-object":59,"./_wks":120}],27:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":26}],28:[function(require,module,exports){
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

},{"./_a-function":18,"./_invoke":54,"./_is-object":59}],29:[function(require,module,exports){
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

},{"./_cof":30,"./_wks":120}],30:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],31:[function(require,module,exports){
'use strict';
var dP = require('./_object-dp').f;
var create = require('./_object-create');
var redefineAll = require('./_redefine-all');
var ctx = require('./_ctx');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var $iterDefine = require('./_iter-define');
var step = require('./_iter-step');
var setSpecies = require('./_set-species');
var DESCRIPTORS = require('./_descriptors');
var fastKey = require('./_meta').fastKey;
var validate = require('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":20,"./_ctx":36,"./_descriptors":38,"./_for-of":47,"./_iter-define":63,"./_iter-step":65,"./_meta":72,"./_object-create":76,"./_object-dp":77,"./_redefine-all":92,"./_set-species":96,"./_validate-collection":117}],32:[function(require,module,exports){
'use strict';
var redefineAll = require('./_redefine-all');
var getWeak = require('./_meta').getWeak;
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var createArrayMethod = require('./_array-methods');
var $has = require('./_has');
var validate = require('./_validate-collection');
var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

},{"./_an-instance":20,"./_an-object":21,"./_array-methods":25,"./_for-of":47,"./_has":49,"./_is-object":59,"./_meta":72,"./_redefine-all":92,"./_validate-collection":117}],33:[function(require,module,exports){
'use strict';
var global = require('./_global');
var $export = require('./_export');
var redefine = require('./_redefine');
var redefineAll = require('./_redefine-all');
var meta = require('./_meta');
var forOf = require('./_for-of');
var anInstance = require('./_an-instance');
var isObject = require('./_is-object');
var fails = require('./_fails');
var $iterDetect = require('./_iter-detect');
var setToStringTag = require('./_set-to-string-tag');
var inheritIfRequired = require('./_inherit-if-required');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":20,"./_export":42,"./_fails":44,"./_for-of":47,"./_global":48,"./_inherit-if-required":53,"./_is-object":59,"./_iter-detect":64,"./_meta":72,"./_redefine":93,"./_redefine-all":92,"./_set-to-string-tag":97}],34:[function(require,module,exports){
var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],35:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":77,"./_property-desc":91}],36:[function(require,module,exports){
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

},{"./_a-function":18}],37:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],38:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":44}],39:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":48,"./_is-object":59}],40:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],41:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":82,"./_object-keys":85,"./_object-pie":86}],42:[function(require,module,exports){
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

},{"./_core":34,"./_ctx":36,"./_global":48,"./_hide":50,"./_redefine":93}],43:[function(require,module,exports){
var MATCH = require('./_wks')('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};

},{"./_wks":120}],44:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],45:[function(require,module,exports){
'use strict';
var hide = require('./_hide');
var redefine = require('./_redefine');
var fails = require('./_fails');
var defined = require('./_defined');
var wks = require('./_wks');

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

},{"./_defined":37,"./_fails":44,"./_hide":50,"./_redefine":93,"./_wks":120}],46:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"./_an-object":21}],47:[function(require,module,exports){
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

},{"./_an-object":21,"./_ctx":36,"./_is-array-iter":56,"./_iter-call":61,"./_to-length":109,"./core.get-iterator-method":121}],48:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],49:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],50:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":38,"./_object-dp":77,"./_property-desc":91}],51:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":48}],52:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":38,"./_dom-create":39,"./_fails":44}],53:[function(require,module,exports){
var isObject = require('./_is-object');
var setPrototypeOf = require('./_set-proto').set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"./_is-object":59,"./_set-proto":95}],54:[function(require,module,exports){
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

},{"./_cof":30}],56:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":66,"./_wks":120}],57:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":30}],58:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object');
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"./_is-object":59}],59:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],60:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object');
var cof = require('./_cof');
var MATCH = require('./_wks')('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

},{"./_cof":30,"./_is-object":59,"./_wks":120}],61:[function(require,module,exports){
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

},{"./_an-object":21}],62:[function(require,module,exports){
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

},{"./_hide":50,"./_object-create":76,"./_property-desc":91,"./_set-to-string-tag":97,"./_wks":120}],63:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
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
  var $default = $native || getMethod(DEFAULT);
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
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
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

},{"./_export":42,"./_hide":50,"./_iter-create":62,"./_iterators":66,"./_library":67,"./_object-gpo":83,"./_redefine":93,"./_set-to-string-tag":97,"./_wks":120}],64:[function(require,module,exports){
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

},{"./_wks":120}],65:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],66:[function(require,module,exports){
module.exports = {};

},{}],67:[function(require,module,exports){
module.exports = false;

},{}],68:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

},{}],69:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var sign = require('./_math-sign');
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

module.exports = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

},{"./_math-sign":71}],70:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

},{}],71:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

},{}],72:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":44,"./_has":49,"./_is-object":59,"./_object-dp":77,"./_uid":115}],73:[function(require,module,exports){
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
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
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

},{"./_cof":30,"./_global":48,"./_task":104}],74:[function(require,module,exports){
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

},{"./_a-function":18}],75:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_fails":44,"./_iobject":55,"./_object-gops":82,"./_object-keys":85,"./_object-pie":86,"./_to-object":110}],76:[function(require,module,exports){
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

},{"./_an-object":21,"./_dom-create":39,"./_enum-bug-keys":40,"./_html":51,"./_object-dps":78,"./_shared-key":98}],77:[function(require,module,exports){
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

},{"./_an-object":21,"./_descriptors":38,"./_ie8-dom-define":52,"./_to-primitive":111}],78:[function(require,module,exports){
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

},{"./_an-object":21,"./_descriptors":38,"./_object-dp":77,"./_object-keys":85}],79:[function(require,module,exports){
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":38,"./_has":49,"./_ie8-dom-define":52,"./_object-pie":86,"./_property-desc":91,"./_to-iobject":108,"./_to-primitive":111}],80:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":81,"./_to-iobject":108}],81:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":40,"./_object-keys-internal":84}],82:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],83:[function(require,module,exports){
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

},{"./_has":49,"./_shared-key":98,"./_to-object":110}],84:[function(require,module,exports){
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

},{"./_array-includes":24,"./_has":49,"./_shared-key":98,"./_to-iobject":108}],85:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":40,"./_object-keys-internal":84}],86:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],87:[function(require,module,exports){
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

},{"./_core":34,"./_export":42,"./_fails":44}],88:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var gOPN = require('./_object-gopn');
var gOPS = require('./_object-gops');
var anObject = require('./_an-object');
var Reflect = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

},{"./_an-object":21,"./_global":48,"./_object-gopn":81,"./_object-gops":82}],89:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],90:[function(require,module,exports){
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

},{"./_an-object":21,"./_is-object":59,"./_new-promise-capability":74}],91:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],92:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":93}],93:[function(require,module,exports){
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

},{"./_core":34,"./_global":48,"./_has":49,"./_hide":50,"./_uid":115}],94:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

},{}],95:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object');
var anObject = require('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_an-object":21,"./_ctx":36,"./_is-object":59,"./_object-gopd":79}],96:[function(require,module,exports){
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

},{"./_descriptors":38,"./_global":48,"./_object-dp":77,"./_wks":120}],97:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":49,"./_object-dp":77,"./_wks":120}],98:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":99,"./_uid":115}],99:[function(require,module,exports){
var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":34,"./_global":48,"./_library":67}],100:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":18,"./_an-object":21,"./_wks":120}],101:[function(require,module,exports){
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

},{"./_defined":37,"./_to-integer":107}],102:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp');
var defined = require('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

},{"./_defined":37,"./_is-regexp":60}],103:[function(require,module,exports){
'use strict';
var toInteger = require('./_to-integer');
var defined = require('./_defined');

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};

},{"./_defined":37,"./_to-integer":107}],104:[function(require,module,exports){
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

},{"./_cof":30,"./_ctx":36,"./_dom-create":39,"./_global":48,"./_html":51,"./_invoke":54}],105:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":107}],106:[function(require,module,exports){
// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};

},{"./_to-integer":107,"./_to-length":109}],107:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],108:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":37,"./_iobject":55}],109:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":107}],110:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":37}],111:[function(require,module,exports){
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

},{"./_is-object":59}],112:[function(require,module,exports){
'use strict';
if (require('./_descriptors')) {
  var LIBRARY = require('./_library');
  var global = require('./_global');
  var fails = require('./_fails');
  var $export = require('./_export');
  var $typed = require('./_typed');
  var $buffer = require('./_typed-buffer');
  var ctx = require('./_ctx');
  var anInstance = require('./_an-instance');
  var propertyDesc = require('./_property-desc');
  var hide = require('./_hide');
  var redefineAll = require('./_redefine-all');
  var toInteger = require('./_to-integer');
  var toLength = require('./_to-length');
  var toIndex = require('./_to-index');
  var toAbsoluteIndex = require('./_to-absolute-index');
  var toPrimitive = require('./_to-primitive');
  var has = require('./_has');
  var classof = require('./_classof');
  var isObject = require('./_is-object');
  var toObject = require('./_to-object');
  var isArrayIter = require('./_is-array-iter');
  var create = require('./_object-create');
  var getPrototypeOf = require('./_object-gpo');
  var gOPN = require('./_object-gopn').f;
  var getIterFn = require('./core.get-iterator-method');
  var uid = require('./_uid');
  var wks = require('./_wks');
  var createArrayMethod = require('./_array-methods');
  var createArrayIncludes = require('./_array-includes');
  var speciesConstructor = require('./_species-constructor');
  var ArrayIterators = require('./es6.array.iterator');
  var Iterators = require('./_iterators');
  var $iterDetect = require('./_iter-detect');
  var setSpecies = require('./_set-species');
  var arrayFill = require('./_array-fill');
  var arrayCopyWithin = require('./_array-copy-within');
  var $DP = require('./_object-dp');
  var $GOPD = require('./_object-gopd');
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };

},{"./_an-instance":20,"./_array-copy-within":22,"./_array-fill":23,"./_array-includes":24,"./_array-methods":25,"./_classof":29,"./_ctx":36,"./_descriptors":38,"./_export":42,"./_fails":44,"./_global":48,"./_has":49,"./_hide":50,"./_is-array-iter":56,"./_is-object":59,"./_iter-detect":64,"./_iterators":66,"./_library":67,"./_object-create":76,"./_object-dp":77,"./_object-gopd":79,"./_object-gopn":81,"./_object-gpo":83,"./_property-desc":91,"./_redefine-all":92,"./_set-species":96,"./_species-constructor":100,"./_to-absolute-index":105,"./_to-index":106,"./_to-integer":107,"./_to-length":109,"./_to-object":110,"./_to-primitive":111,"./_typed":114,"./_typed-buffer":113,"./_uid":115,"./_wks":120,"./core.get-iterator-method":121,"./es6.array.iterator":127}],113:[function(require,module,exports){
'use strict';
var global = require('./_global');
var DESCRIPTORS = require('./_descriptors');
var LIBRARY = require('./_library');
var $typed = require('./_typed');
var hide = require('./_hide');
var redefineAll = require('./_redefine-all');
var fails = require('./_fails');
var anInstance = require('./_an-instance');
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
var toIndex = require('./_to-index');
var gOPN = require('./_object-gopn').f;
var dP = require('./_object-dp').f;
var arrayFill = require('./_array-fill');
var setToStringTag = require('./_set-to-string-tag');
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = new Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(new Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

},{"./_an-instance":20,"./_array-fill":23,"./_descriptors":38,"./_fails":44,"./_global":48,"./_hide":50,"./_library":67,"./_object-dp":77,"./_object-gopn":81,"./_redefine-all":92,"./_set-to-string-tag":97,"./_to-index":106,"./_to-integer":107,"./_to-length":109,"./_typed":114}],114:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var uid = require('./_uid');
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};

},{"./_global":48,"./_hide":50,"./_uid":115}],115:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],116:[function(require,module,exports){
var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":48}],117:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":59}],118:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":34,"./_global":48,"./_library":67,"./_object-dp":77,"./_wks-ext":119}],119:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":120}],120:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":48,"./_shared":99,"./_uid":115}],121:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":29,"./_core":34,"./_iterators":66,"./_wks":120}],122:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { copyWithin: require('./_array-copy-within') });

require('./_add-to-unscopables')('copyWithin');

},{"./_add-to-unscopables":19,"./_array-copy-within":22,"./_export":42}],123:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { fill: require('./_array-fill') });

require('./_add-to-unscopables')('fill');

},{"./_add-to-unscopables":19,"./_array-fill":23,"./_export":42}],124:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":19,"./_array-methods":25,"./_export":42}],125:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":19,"./_array-methods":25,"./_export":42}],126:[function(require,module,exports){
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":35,"./_ctx":36,"./_export":42,"./_is-array-iter":56,"./_iter-call":61,"./_iter-detect":64,"./_to-length":109,"./_to-object":110,"./core.get-iterator-method":121}],127:[function(require,module,exports){
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

},{"./_add-to-unscopables":19,"./_iter-define":63,"./_iter-step":65,"./_iterators":66,"./_to-iobject":108}],128:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var createProperty = require('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});

},{"./_create-property":35,"./_export":42,"./_fails":44}],129:[function(require,module,exports){
var dP = require('./_object-dp').f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

},{"./_descriptors":38,"./_object-dp":77}],130:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = require('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":33,"./_collection-strong":31,"./_validate-collection":117}],131:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./_export');
var log1p = require('./_math-log1p');
var sqrt = Math.sqrt;
var $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

},{"./_export":42,"./_math-log1p":70}],132:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./_export');
var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });

},{"./_export":42}],133:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./_export');
var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

},{"./_export":42}],134:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export');
var sign = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

},{"./_export":42,"./_math-sign":71}],135:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

},{"./_export":42}],136:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./_export');
var exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

},{"./_export":42}],137:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./_export');
var $expm1 = require('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });

},{"./_export":42,"./_math-expm1":68}],138:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export = require('./_export');

$export($export.S, 'Math', { fround: require('./_math-fround') });

},{"./_export":42,"./_math-fround":69}],139:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./_export');
var abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

},{"./_export":42}],140:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export');
var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

},{"./_export":42,"./_fails":44}],141:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});

},{"./_export":42}],142:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', { log1p: require('./_math-log1p') });

},{"./_export":42,"./_math-log1p":70}],143:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});

},{"./_export":42}],144:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', { sign: require('./_math-sign') });

},{"./_export":42,"./_math-sign":71}],145:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

},{"./_export":42,"./_fails":44,"./_math-expm1":68}],146:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

},{"./_export":42,"./_math-expm1":68}],147:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

},{"./_export":42}],148:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });

},{"./_export":42}],149:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export = require('./_export');
var _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

},{"./_export":42,"./_global":48}],150:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', { isInteger: require('./_is-integer') });

},{"./_export":42,"./_is-integer":58}],151:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

},{"./_export":42}],152:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export = require('./_export');
var isInteger = require('./_is-integer');
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

},{"./_export":42,"./_is-integer":58}],153:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

},{"./_export":42}],154:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

},{"./_export":42}],155:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":42,"./_object-assign":75}],156:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

},{"./_is-object":59,"./_meta":72,"./_object-sap":87}],157:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./_to-iobject');
var $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

},{"./_object-gopd":79,"./_object-sap":87,"./_to-iobject":108}],158:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function () {
  return require('./_object-gopn-ext').f;
});

},{"./_object-gopn-ext":80,"./_object-sap":87}],159:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./_to-object');
var $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

},{"./_object-gpo":83,"./_object-sap":87,"./_to-object":110}],160:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./_is-object');

require('./_object-sap')('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

},{"./_is-object":59,"./_object-sap":87}],161:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./_is-object');

require('./_object-sap')('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

},{"./_is-object":59,"./_object-sap":87}],162:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./_is-object');

require('./_object-sap')('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

},{"./_is-object":59,"./_object-sap":87}],163:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', { is: require('./_same-value') });

},{"./_export":42,"./_same-value":94}],164:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":85,"./_object-sap":87,"./_to-object":110}],165:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

},{"./_is-object":59,"./_meta":72,"./_object-sap":87}],166:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

},{"./_is-object":59,"./_meta":72,"./_object-sap":87}],167:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":42,"./_set-proto":95}],168:[function(require,module,exports){
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
var userAgent = require('./_user-agent');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
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
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
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
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
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

},{"./_a-function":18,"./_an-instance":20,"./_classof":29,"./_core":34,"./_ctx":36,"./_export":42,"./_for-of":47,"./_global":48,"./_is-object":59,"./_iter-detect":64,"./_library":67,"./_microtask":73,"./_new-promise-capability":74,"./_perform":89,"./_promise-resolve":90,"./_redefine-all":92,"./_set-species":96,"./_set-to-string-tag":97,"./_species-constructor":100,"./_task":104,"./_user-agent":116,"./_wks":120}],169:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = require('./_export');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var rApply = (require('./_global').Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !require('./_fails')(function () {
  rApply(function () { /* empty */ });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target);
    var L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

},{"./_a-function":18,"./_an-object":21,"./_export":42,"./_fails":44,"./_global":48}],170:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = require('./_export');
var create = require('./_object-create');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var fails = require('./_fails');
var bind = require('./_bind');
var rConstruct = (require('./_global').Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () { /* empty */ });
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

},{"./_a-function":18,"./_an-object":21,"./_bind":28,"./_export":42,"./_fails":44,"./_global":48,"./_is-object":59,"./_object-create":76}],171:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = require('./_object-dp');
var $export = require('./_export');
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":21,"./_export":42,"./_fails":44,"./_object-dp":77,"./_to-primitive":111}],172:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = require('./_export');
var gOPD = require('./_object-gopd').f;
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

},{"./_an-object":21,"./_export":42,"./_object-gopd":79}],173:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = require('./_object-gopd');
var $export = require('./_export');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});

},{"./_an-object":21,"./_export":42,"./_object-gopd":79}],174:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export = require('./_export');
var getProto = require('./_object-gpo');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});

},{"./_an-object":21,"./_export":42,"./_object-gpo":83}],175:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var isObject = require('./_is-object');
var anObject = require('./_an-object');

function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });

},{"./_an-object":21,"./_export":42,"./_has":49,"./_is-object":59,"./_object-gopd":79,"./_object-gpo":83}],176:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

},{"./_export":42}],177:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

},{"./_an-object":21,"./_export":42}],178:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', { ownKeys: require('./_own-keys') });

},{"./_export":42,"./_own-keys":88}],179:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":21,"./_export":42}],180:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = require('./_export');
var setProto = require('./_set-proto');

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_export":42,"./_set-proto":95}],181:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = require('./_object-dp');
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var createDesc = require('./_property-desc');
var anObject = require('./_an-object');
var isObject = require('./_is-object');

function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = gOPD.f(anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    if (existingDescriptor = gOPD.f(receiver, propertyKey)) {
      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      existingDescriptor.value = V;
      dP.f(receiver, propertyKey, existingDescriptor);
    } else dP.f(receiver, propertyKey, createDesc(0, V));
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });

},{"./_an-object":21,"./_export":42,"./_has":49,"./_is-object":59,"./_object-dp":77,"./_object-gopd":79,"./_object-gpo":83,"./_property-desc":91}],182:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});

},{"./_descriptors":38,"./_flags":46,"./_object-dp":77}],183:[function(require,module,exports){
// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

},{"./_fix-re-wks":45}],184:[function(require,module,exports){
// @@replace logic
require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

},{"./_fix-re-wks":45}],185:[function(require,module,exports){
// @@search logic
require('./_fix-re-wks')('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});

},{"./_fix-re-wks":45}],186:[function(require,module,exports){
// @@split logic
require('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split) {
  'use strict';
  var isRegExp = require('./_is-regexp');
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

},{"./_fix-re-wks":45,"./_is-regexp":60}],187:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = require('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":33,"./_collection-strong":31,"./_validate-collection":117}],188:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $at = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});

},{"./_export":42,"./_string-at":101}],189:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

},{"./_export":42,"./_fails-is-regexp":43,"./_string-context":102,"./_to-length":109}],190:[function(require,module,exports){
var $export = require('./_export');
var toAbsoluteIndex = require('./_to-absolute-index');
var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});

},{"./_export":42,"./_to-absolute-index":105}],191:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export = require('./_export');
var context = require('./_string-context');
var INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"./_export":42,"./_fails-is-regexp":43,"./_string-context":102}],192:[function(require,module,exports){
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    } return res.join('');
  }
});

},{"./_export":42,"./_to-iobject":108,"./_to-length":109}],193:[function(require,module,exports){
var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});

},{"./_export":42,"./_string-repeat":103}],194:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

},{"./_export":42,"./_fails-is-regexp":43,"./_string-context":102,"./_to-length":109}],195:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":21,"./_descriptors":38,"./_enum-keys":41,"./_export":42,"./_fails":44,"./_global":48,"./_has":49,"./_hide":50,"./_is-array":57,"./_is-object":59,"./_library":67,"./_meta":72,"./_object-create":76,"./_object-dp":77,"./_object-gopd":79,"./_object-gopn":81,"./_object-gopn-ext":80,"./_object-gops":82,"./_object-keys":85,"./_object-pie":86,"./_property-desc":91,"./_redefine":93,"./_set-to-string-tag":97,"./_shared":99,"./_to-iobject":108,"./_to-primitive":111,"./_uid":115,"./_wks":120,"./_wks-define":118,"./_wks-ext":119}],196:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $typed = require('./_typed');
var buffer = require('./_typed-buffer');
var anObject = require('./_an-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
var isObject = require('./_is-object');
var ArrayBuffer = require('./_global').ArrayBuffer;
var speciesConstructor = require('./_species-constructor');
var $ArrayBuffer = buffer.ArrayBuffer;
var $DataView = buffer.DataView;
var $isView = $typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = $typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, len);
    var fin = toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(fin - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < fin) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);

},{"./_an-object":21,"./_export":42,"./_fails":44,"./_global":48,"./_is-object":59,"./_set-species":96,"./_species-constructor":100,"./_to-absolute-index":105,"./_to-length":109,"./_typed":114,"./_typed-buffer":113}],197:[function(require,module,exports){
var $export = require('./_export');
$export($export.G + $export.W + $export.F * !require('./_typed').ABV, {
  DataView: require('./_typed-buffer').DataView
});

},{"./_export":42,"./_typed":114,"./_typed-buffer":113}],198:[function(require,module,exports){
require('./_typed-array')('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":112}],199:[function(require,module,exports){
require('./_typed-array')('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":112}],200:[function(require,module,exports){
require('./_typed-array')('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":112}],201:[function(require,module,exports){
require('./_typed-array')('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":112}],202:[function(require,module,exports){
require('./_typed-array')('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":112}],203:[function(require,module,exports){
require('./_typed-array')('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":112}],204:[function(require,module,exports){
require('./_typed-array')('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":112}],205:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":112}],206:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

},{"./_typed-array":112}],207:[function(require,module,exports){
'use strict';
var each = require('./_array-methods')(0);
var redefine = require('./_redefine');
var meta = require('./_meta');
var assign = require('./_object-assign');
var weak = require('./_collection-weak');
var isObject = require('./_is-object');
var fails = require('./_fails');
var validate = require('./_validate-collection');
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var tmp = {};
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')(WEAK_MAP, wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (fails(function () { return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7; })) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}

},{"./_array-methods":25,"./_collection":33,"./_collection-weak":32,"./_fails":44,"./_is-object":59,"./_meta":72,"./_object-assign":75,"./_redefine":93,"./_validate-collection":117}],208:[function(require,module,exports){
'use strict';
var weak = require('./_collection-weak');
var validate = require('./_validate-collection');
var WEAK_SET = 'WeakSet';

// 23.4 WeakSet Objects
require('./_collection')(WEAK_SET, function (get) {
  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(validate(this, WEAK_SET), value, true);
  }
}, weak, false, true);

},{"./_collection":33,"./_collection-weak":32,"./_validate-collection":117}],209:[function(require,module,exports){
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

},{"./_global":48,"./_hide":50,"./_iterators":66,"./_object-keys":85,"./_redefine":93,"./_wks":120,"./es6.array.iterator":127}],210:[function(require,module,exports){
var $export = require('./_export');
var $task = require('./_task');
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});

},{"./_export":42,"./_task":104}],211:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global = require('./_global');
var $export = require('./_export');
var userAgent = require('./_user-agent');
var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
var wrap = function (set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

},{"./_export":42,"./_global":48,"./_user-agent":116}]},{},[9]);
