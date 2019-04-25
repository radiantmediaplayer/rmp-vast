/**
 * @license Copyright (c) 2017-2019 Radiant Media Player | https://www.radiantmediaplayer.com
 * rmp-vast 2.3.3
 * GitHub: https://github.com/radiantmediaplayer/rmp-vast
 * MIT License: https://github.com/radiantmediaplayer/rmp-vast/blob/master/LICENSE
 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @license Copyright (c) 2015-2019 Radiant Media Player 
 * rmp-connection 0.2.0 | https://github.com/radiantmediaplayer/rmp-connection
 */
var RMPCONNECTION = {};
var connectionType = null;

var _getConnectionType = function _getConnectionType() {
  if (typeof navigator.connection.type === 'string' && navigator.connection.type !== '') {
    return navigator.connection.type;
  }

  return null;
};

var _getArbitraryBitrateData = function _getArbitraryBitrateData() {
  // we actually have indication here: http://wicg.github.io/netinfo/#effective-connection-types
  var equivalentMbpsArray = [0.025, 0.035, 0.35, 1.4]; // if we are in a bluetooth/cellular connection.type with 4g assuming 1.4 Mbps is a bit high so we settle for 0.7 Mbps
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
  } // we are offline - exit


  if (typeof navigator.onLine !== 'undefined' && !navigator.onLine) {
    return -1;
  } // we do not have navigator.connection - exit
  // for support see https://caniuse.com/#feat=netinfo


  if (typeof navigator.connection === 'undefined') {
    return -1;
  }

  connectionType = _getConnectionType(); // we do have navigator.connection.type but it reports no connection - exit

  if (connectionType && connectionType === 'none') {
    return -1;
  } // we have navigator.connection.downlink - this is our best estimate
  // Returns the effective bandwidth estimate in megabits per second, rounded to the nearest multiple of 25 kilobits per seconds.


  if (typeof navigator.connection.downlink === 'number' && navigator.connection.downlink > 0) {
    return navigator.connection.downlink;
  } // we have navigator.connection.effectiveType - this is our second best estimate
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
  } // finally we have navigator.connection.type - this won't help much 


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
    } // there is no point in guessing bandwidth when navigator.connection.type is cellular this can vary from 0 to 100 Mbps 
    // better to admit we do not know and find another way to detect bandwidth, this could include:
    // - context guess: user-agent detection (mobile vs desktop), device width or pixel ratio 
    // - AJAX/Fetch timing: this is outside rmp-connection scope

  } // nothing worked - exit


  return -1;
};

var _default = RMPCONNECTION;
exports.default = _default;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fw = _interopRequireDefault(require("../fw/fw"));

var _env = _interopRequireDefault(require("../fw/env"));

var _vastPlayer = _interopRequireDefault(require("../players/vast-player"));

var _contentPlayer = _interopRequireDefault(require("../players/content-player"));

var _vpaid = _interopRequireDefault(require("../players/vpaid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var API = {};

API.attach = function (RmpVast) {
  RmpVast.prototype.play = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        _vpaid.default.resumeAd.call(this);
      } else {
        _vastPlayer.default.play.call(this);
      }
    } else {
      _contentPlayer.default.play.call(this);
    }
  };

  RmpVast.prototype.pause = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        _vpaid.default.pauseAd.call(this);
      } else {
        _vastPlayer.default.pause.call(this);
      }
    } else {
      _contentPlayer.default.pause.call(this);
    }
  };

  RmpVast.prototype.getAdPaused = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        return _vpaid.default.getAdPaused.call(this);
      } else {
        return this.vastPlayerPaused;
      }
    }

    return false;
  };

  RmpVast.prototype.setVolume = function (level) {
    if (!_fw.default.isNumber(level)) {
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
        _vpaid.default.setAdVolume.call(this, validatedLevel);
      }

      _vastPlayer.default.setVolume.call(this, validatedLevel);
    }

    _contentPlayer.default.setVolume.call(this, validatedLevel);
  };

  RmpVast.prototype.getVolume = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        return _vpaid.default.getAdVolume.call(this);
      } else {
        return _vastPlayer.default.getVolume.call(this);
      }
    }

    return _contentPlayer.default.getVolume.call(this);
  };

  RmpVast.prototype.setMute = function (muted) {
    if (typeof muted !== 'boolean') {
      return;
    }

    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        if (muted) {
          _vpaid.default.setAdVolume.call(this, 0);
        } else {
          _vpaid.default.setAdVolume.call(this, 1);
        }
      } else {
        _vastPlayer.default.setMute.call(this, muted);
      }
    }

    _contentPlayer.default.setMute.call(this, muted);
  };

  RmpVast.prototype.getMute = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        if (_vpaid.default.getAdVolume.call(this) === 0) {
          return true;
        }

        return false;
      } else {
        return _vastPlayer.default.getMute.call(this);
      }
    }

    return _contentPlayer.default.getMute.call(this);
  };

  RmpVast.prototype.stopAds = function () {
    if (this.adOnStage) {
      if (this.isVPAID) {
        _vpaid.default.stopAd.call(this);
      } else {
        // this will destroy ad
        _vastPlayer.default.resumeContent.call(this);
      }
    }
  };

  RmpVast.prototype.skipAd = function () {
    if (this.adOnStage && this.getAdSkippableState()) {
      if (this.isVPAID) {
        _vpaid.default.skipAd.call(this);
      } else {
        // this will destroy ad
        _vastPlayer.default.resumeContent.call(this);
      }
    }
  };

  RmpVast.prototype.getAdTagUrl = function () {
    return this.adTagUrl;
  };

  RmpVast.prototype.getAdMediaUrl = function () {
    if (this.adOnStage) {
      if (this.isVPAID) {
        return _vpaid.default.getCreativeUrl.call(this);
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
        var duration = _vpaid.default.getAdDuration.call(this);

        if (duration > 0) {
          duration = duration * 1000;
        }

        return duration;
      } else {
        return _vastPlayer.default.getDuration.call(this);
      }
    }

    return -1;
  };

  RmpVast.prototype.getAdCurrentTime = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        var remainingTime = _vpaid.default.getAdRemainingTime.call(this);

        var duration = _vpaid.default.getAdDuration.call(this);

        if (remainingTime === -1 || duration === -1 || remainingTime > duration) {
          return -1;
        }

        return (duration - remainingTime) * 1000;
      } else {
        return _vastPlayer.default.getCurrentTime.call(this);
      }
    }

    return -1;
  };

  RmpVast.prototype.getAdRemainingTime = function () {
    if (this.adOnStage && this.adIsLinear) {
      if (this.isVPAID) {
        return _vpaid.default.getAdRemainingTime.call(this);
      } else {
        var currentTime = _vastPlayer.default.getCurrentTime.call(this);

        var duration = _vastPlayer.default.getDuration.call(this);

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
        return _vpaid.default.getAdWidth.call(this);
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
        return _vpaid.default.getAdHeight.call(this);
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
    return _env.default;
  };

  RmpVast.prototype.getFramework = function () {
    return _fw.default;
  };

  RmpVast.prototype.getVastPlayer = function () {
    return this.vastPlayer;
  };

  RmpVast.prototype.getContentPlayer = function () {
    return this.contentPlayer;
  };

  RmpVast.prototype.getVpaidCreative = function () {
    if (this.adOnStage && this.isVPAID) {
      return _vpaid.default.getVpaidCreative.call(this);
    }

    return null;
  };

  RmpVast.prototype.getIsUsingContentPlayerForAds = function () {
    return this.useContentPlayerForAds;
  };

  RmpVast.prototype.getAdSkippableState = function () {
    if (this.adOnStage) {
      if (this.isVPAID) {
        return _vpaid.default.getAdSkippableState.call(this);
      } else {
        if (this.getIsSkippableAd()) {
          return this.skippableAdCanBeSkipped;
        }
      }
    }

    return false;
  };

  RmpVast.prototype.initialize = function () {
    if (this.rmpVastInitialized) {
      if (DEBUG) {
        _fw.default.log('rmp-vast already initialized');
      }
    } else {
      if (DEBUG) {
        _fw.default.log('on user interaction - player needs to be initialized');
      }

      _vastPlayer.default.init.call(this);
    }
  };

  RmpVast.prototype.getInitialized = function () {
    return this.rmpVastInitialized;
  }; // adpod 


  RmpVast.prototype.getAdPodInfo = function () {
    if (this.adPodApiInfo.length > 0) {
      var result = {};
      result.adPodCurrentIndex = this.adPodCurrentIndex;
      result.adPodLength = this.adPodApiInfo.length;
      return result;
    }

    return null;
  }; // VPAID methods


  RmpVast.prototype.resizeAd = function (width, height, viewMode) {
    if (this.adOnStage && this.isVPAID) {
      _vpaid.default.resizeAd.call(this, width, height, viewMode);
    }
  };

  RmpVast.prototype.expandAd = function () {
    if (this.adOnStage && this.isVPAID) {
      _vpaid.default.expandAd.call(this);
    }
  };

  RmpVast.prototype.collapseAd = function () {
    if (this.adOnStage && this.isVPAID) {
      _vpaid.default.collapseAd.call(this);
    }
  };

  RmpVast.prototype.getAdExpanded = function () {
    if (this.adOnStage && this.isVPAID) {
      _vpaid.default.getAdExpanded.call(this);
    }

    return false;
  };

  RmpVast.prototype.getAdCompanions = function () {
    if (this.adOnStage && this.isVPAID) {
      _vpaid.default.getAdCompanions.call(this);
    }

    return '';
  };
};

var _default = API;
exports.default = _default;

},{"../fw/env":7,"../fw/fw":8,"../players/content-player":10,"../players/vast-player":11,"../players/vpaid":12}],3:[function(require,module,exports){
"use strict";

require("core-js/modules/es.parse-int");

require("core-js/modules/web.dom-collections.for-each");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fw = _interopRequireDefault(require("../fw/fw"));

var _ping = _interopRequireDefault(require("../tracking/ping"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ICONS = {};

ICONS.destroy = function () {
  if (DEBUG) {
    _fw.default.log('start destroying icons');
  }

  var icons = this.adContainer.querySelectorAll('.rmp-ad-container-icons');

  if (icons.length > 0) {
    for (var i = 0, len = icons.length; i < len; i++) {
      _fw.default.removeElement(icons[i]);
    }
  }
};

var _programAlreadyPresent = function _programAlreadyPresent(program) {
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
    _fw.default.log('start parsing for icons');
  }

  var icon = icons[0].getElementsByTagName('Icon');

  for (var i = 0, len = icon.length; i < len; i++) {
    var currentIcon = icon[i];
    var program = currentIcon.getAttribute('program'); // program is required attribute ignore the current icon if not present

    if (program === null || program === '') {
      continue;
    } // width, height, xPosition, yPosition are all required attributes
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

    var staticResource = currentIcon.getElementsByTagName('StaticResource'); // we only support StaticResource (IFrameResource HTMLResource not supported)

    if (staticResource.length === 0) {
      continue;
    } // in StaticResource we only support images (application/x-javascript and application/x-shockwave-flash not supported)


    var creativeType = staticResource[0].getAttribute('creativeType');
    var imagePattern = /^image\/(gif|jpeg|jpg|png)$/i;

    if (creativeType === null || creativeType === '' || !imagePattern.test(creativeType)) {
      continue;
    }

    var staticResourceUrl = _fw.default.getNodeValue(staticResource[0], true);

    if (staticResourceUrl === null) {
      continue;
    } // if program already present we delete it


    _programAlreadyPresent.call(this, program);

    var iconData = {
      program: program,
      width: width,
      height: height,
      xPosition: xPosition,
      yPosition: yPosition,
      staticResourceUrl: staticResourceUrl
    }; // optional IconViewTracking

    var iconViewTracking = currentIcon.getElementsByTagName('IconViewTracking');

    var iconViewTrackingUrl = _fw.default.getNodeValue(iconViewTracking[0], true);

    if (iconViewTrackingUrl !== null) {
      iconData.iconViewTrackingUrl = iconViewTrackingUrl;
    } //optional IconClicks


    var iconClicks = currentIcon.getElementsByTagName('IconClicks');

    if (iconClicks.length > 0) {
      var iconClickThrough = iconClicks[0].getElementsByTagName('IconClickThrough');

      var iconClickThroughUrl = _fw.default.getNodeValue(iconClickThrough[0], true);

      if (iconClickThroughUrl !== null) {
        iconData.iconClickThroughUrl = iconClickThroughUrl;
        var iconClickTracking = iconClicks[0].getElementsByTagName('IconClickTracking');

        if (iconClickTracking.length > 0) {
          iconData.iconClickTrackingUrl = [];

          for (var _i = 0, _len = iconClickTracking.length; _i < _len; _i++) {
            var iconClickTrackingUrl = _fw.default.getNodeValue(iconClickTracking[_i], true);

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
    _fw.default.log('validated parsed icons follows');

    _fw.default.log(this.icons);
  }
};

var _onIconClickThrough = function _onIconClickThrough(index, event) {
  var _this = this;

  if (DEBUG) {
    _fw.default.log('click on icon with index ' + index);
  }

  if (event) {
    event.stopPropagation();

    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }

  _fw.default.openWindow(this.icons[index].iconClickThroughUrl); // send trackers if any for IconClickTracking


  if (typeof this.icons[index].iconClickTrackingUrl !== 'undefined') {
    var iconClickTrackingUrl = this.icons[index].iconClickTrackingUrl;

    if (iconClickTrackingUrl.length > 0) {
      iconClickTrackingUrl.forEach(function (element) {
        _ping.default.tracking.call(_this, element, null);
      });
    }
  }
};

var _onIconLoadPingTracking = function _onIconLoadPingTracking(index) {
  if (DEBUG) {
    _fw.default.log('IconViewTracking for icon at index ' + index);
  }

  _ping.default.tracking.call(this, this.icons[index].iconViewTrackingUrl, null);
};

var _onPlayingAppendIcons = function _onPlayingAppendIcons() {
  if (DEBUG) {
    _fw.default.log('playing states has been reached - append icons');
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
  this.onPlayingAppendIcons = _onPlayingAppendIcons.bind(this); // as per VAST 3 spec only append icon when ad starts playing

  this.vastPlayer.addEventListener('playing', this.onPlayingAppendIcons);
};

var _default = ICONS;
exports.default = _default;

},{"../fw/fw":8,"../tracking/ping":13,"core-js/modules/es.parse-int":136,"core-js/modules/web.dom-collections.for-each":147}],4:[function(require,module,exports){
"use strict";

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.sort");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.parse-int");

require("core-js/modules/es.regexp.to-string");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fw = _interopRequireDefault(require("../fw/fw"));

var _env = _interopRequireDefault(require("../fw/env"));

var _helpers = _interopRequireDefault(require("../utils/helpers"));

var _ping = _interopRequireDefault(require("../tracking/ping"));

var _contentPlayer = _interopRequireDefault(require("../players/content-player"));

var _vastPlayer = _interopRequireDefault(require("../players/vast-player"));

var _vpaid = _interopRequireDefault(require("../players/vpaid"));

var _skip = _interopRequireDefault(require("./skip"));

var _icons = _interopRequireDefault(require("./icons"));

var _vastErrors = _interopRequireDefault(require("../utils/vast-errors"));

var _rmpConnection = _interopRequireDefault(require("../../../externals/rmp-connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LINEAR = {};
var VPAID_PATTERN = /vpaid/i;
var JS_PATTERN = /\/javascript/i;
var HLS_PATTERN = /(application\/vnd\.apple\.mpegurl|x-mpegurl)/i;
var DASH_PATTERN = /application\/dash\+xml/i;
var html5MediaErrorTypes = ['MEDIA_ERR_CUSTOM', 'MEDIA_ERR_ABORTED', 'MEDIA_ERR_NETWORK', 'MEDIA_ERR_DECODE', 'MEDIA_ERR_SRC_NOT_SUPPORTED', 'MEDIA_ERR_ENCRYPTED'];
var testCommonVideoFormats = ['video/webm', 'video/mp4', 'video/ogg', 'video/3gpp'];

var _onDurationChange = function _onDurationChange() {
  if (DEBUG) {
    _fw.default.log('durationchange for VAST player reached');
  }

  this.vastPlayer.removeEventListener('durationchange', this.onDurationChange);
  this.vastPlayerDuration = _vastPlayer.default.getDuration.call(this);

  _helpers.default.createApiEvent.call(this, 'addurationchange');
};

var _onLoadedmetadataPlay = function _onLoadedmetadataPlay() {
  if (DEBUG) {
    _fw.default.log('loadedmetadata for VAST player reached');
  }

  this.vastPlayer.removeEventListener('loadedmetadata', this.onLoadedmetadataPlay);
  clearTimeout(this.creativeLoadTimeoutCallback);

  _helpers.default.createApiEvent.call(this, 'adloaded');

  if (DEBUG) {
    _fw.default.log('pause content player');
  }

  _contentPlayer.default.pause.call(this); // show ad container holding vast player


  _fw.default.show(this.adContainer);

  _fw.default.show(this.vastPlayer);

  this.adOnStage = true; // play VAST player

  if (DEBUG) {
    _fw.default.log('play VAST player');
  }

  _vastPlayer.default.play.call(this, this.firstVastPlayerPlayRequest);

  if (this.firstVastPlayerPlayRequest) {
    this.firstVastPlayerPlayRequest = false;
  }
};

var _onClickThrough = function _onClickThrough(event) {
  if (event) {
    event.stopPropagation();
  }

  if (DEBUG) {
    _fw.default.log('onClickThrough');
  }

  if (!_env.default.isMobile) {
    _fw.default.openWindow(this.clickThroughUrl);
  }

  if (this.params.pauseOnClick) {
    this.pause();
  }

  _helpers.default.createApiEvent.call(this, 'adclick');

  _helpers.default.dispatchPingEvent.call(this, 'clickthrough');
};

var _onPlaybackError = function _onPlaybackError(event) {
  // https://www.w3.org/TR/html50/embedded-content-0.html#mediaerror
  // MEDIA_ERR_SRC_NOT_SUPPORTED is sign of fatal error
  // other errors may produce non-fatal error in the browser so we do not 
  // act upon them
  if (event && event.target) {
    var videoElement = event.target;

    if (_fw.default.isObject(videoElement.error) && _fw.default.isNumber(videoElement.error.code)) {
      var errorCode = videoElement.error.code;
      var errorMessage = '';

      if (typeof videoElement.error.message === 'string') {
        errorMessage = videoElement.error.message;
      }

      if (DEBUG) {
        _fw.default.log('error on video element with code ' + errorCode.toString() + ' and message ' + errorMessage);

        if (html5MediaErrorTypes[errorCode]) {
          _fw.default.log('error type is ' + html5MediaErrorTypes[errorCode]);
        }
      } // EDIA_ERR_SRC_NOT_SUPPORTED (numeric value 4)


      if (errorCode === 4) {
        _ping.default.error.call(this, 401);

        _vastErrors.default.process.call(this, 401);
      }
    }
  }
};

var _appendClickUIOnMobile = function _appendClickUIOnMobile() {
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

var _onContextMenu = function _onContextMenu(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
};

LINEAR.update = function (url, type) {
  var _this = this;

  if (DEBUG) {
    _fw.default.log('update vast player for linear creative of type ' + type + ' located at ' + url);
  }

  this.onDurationChange = _onDurationChange.bind(this);
  this.vastPlayer.addEventListener('durationchange', this.onDurationChange); // when creative is loaded play it 

  this.onLoadedmetadataPlay = _onLoadedmetadataPlay.bind(this);
  this.vastPlayer.addEventListener('loadedmetadata', this.onLoadedmetadataPlay); // prevent built in menu to show on right click

  this.onContextMenu = _onContextMenu.bind(this);
  this.vastPlayer.addEventListener('contextmenu', this.onContextMenu);
  this.onPlaybackError = _onPlaybackError.bind(this); // start creativeLoadTimeout

  this.creativeLoadTimeoutCallback = setTimeout(function () {
    _ping.default.error.call(_this, 402);

    _vastErrors.default.process.call(_this, 402);
  }, this.params.creativeLoadTimeout); // load ad asset

  if (this.useContentPlayerForAds) {
    this.contentPlayer.addEventListener('error', this.onPlaybackError);
    this.contentPlayer.src = url;
  } else {
    this.vastPlayer.addEventListener('error', this.onPlaybackError);
    this.vastPlayer.src = url; // we need this extra load for Chrome data saver mode in mobile or desktop

    this.vastPlayer.load();
  } // clickthrough interaction


  this.onClickThrough = _onClickThrough.bind(this);

  if (this.clickThroughUrl) {
    if (_env.default.isMobile) {
      _appendClickUIOnMobile.call(this);
    } else {
      this.vastPlayer.addEventListener('click', this.onClickThrough);
    }
  } // skippable - only where vast player is different from 
  // content player


  if (this.isSkippableAd) {
    _skip.default.append.call(this);
  }
};

LINEAR.parse = function (linear) {
  // we have an InLine Linear which is not a Wrapper - process MediaFiles
  this.adIsLinear = true;

  if (DEBUG) {
    var duration = linear[0].getElementsByTagName('Duration');

    if (duration.length === 0) {
      if (DEBUG) {
        _fw.default.log('missing Duration tag child of Linear tag - this is not a VAST 3 spec compliant adTag - continuing anyway (same as IMA)');
      }
    }
  }

  var mediaFiles = linear[0].getElementsByTagName('MediaFiles');

  if (mediaFiles.length === 0) {
    // 1 MediaFiles element must be present otherwise VAST document is not spec compliant 
    _ping.default.error.call(this, 101);

    _vastErrors.default.process.call(this, 101);

    return;
  } // Industry Icons - currently we only support one icon


  var icons = linear[0].getElementsByTagName('Icons');

  if (icons.length > 0) {
    _icons.default.parse.call(this, icons);
  } // check for AdParameters tag in case we have a VPAID creative


  var adParameters = linear[0].getElementsByTagName('AdParameters');
  this.adParametersData = '';

  if (adParameters.length > 0) {
    this.adParametersData = _fw.default.getNodeValue(adParameters[0], false);
  }

  var mediaFile = mediaFiles[0].getElementsByTagName('MediaFile');

  if (mediaFile.length === 0) {
    // at least 1 MediaFile element must be present otherwise VAST document is not spec compliant 
    _ping.default.error.call(this, 101);

    _vastErrors.default.process.call(this, 101);

    return;
  }

  var mediaFileItems = [];
  var mediaFileToRemove = [];

  for (var i = 0, len = mediaFile.length; i < len; i++) {
    mediaFileItems[i] = {}; // required per VAST3 spec CDATA URL location to media, delivery, type, width, height

    var currentMediaFile = mediaFile[i];

    var mediaFileValue = _fw.default.getNodeValue(currentMediaFile, true);

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
    } // check for potential VPAID


    var apiFramework = mediaFileItems[i].apiFramework = currentMediaFile.getAttribute('apiFramework'); // we have a VPAID JS - we break
    // for VPAID we may not have a width, height or delivery

    if (this.params.enableVpaid && apiFramework && VPAID_PATTERN.test(apiFramework) && JS_PATTERN.test(type)) {
      if (DEBUG) {
        _fw.default.log('VPAID creative detected');
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
        _fw.default.log('missing required width attribute on MediaFile tag - this is not a VAST 3 spec compliant adTag - continuing anyway (same as IMA)');
      }

      width = 0;
    }

    var height = currentMediaFile.getAttribute('height');

    if (height === null || height === '') {
      if (DEBUG) {
        _fw.default.log('missing required height attribute on MediaFile tag - this is not a VAST 3 spec compliant adTag - continuing anyway (same as IMA)');
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
  } // remove MediaFile items that do not hold VAST spec-compliant attributes or data


  if (mediaFileToRemove.length > 0) {
    for (var _i = mediaFileToRemove.length - 1; _i >= 0; _i--) {
      mediaFileItems.splice(mediaFileToRemove[_i], 1);
    }
  } // we support HLS; MP4; WebM: VPAID so let us fecth for those


  var creatives = [];

  for (var _i2 = 0, _len = mediaFileItems.length; _i2 < _len; _i2++) {
    var currentMediaFileItem = mediaFileItems[_i2];
    var _type = currentMediaFileItem.type;
    var url = currentMediaFileItem.url;

    if (this.isVPAID && url) {
      _vpaid.default.loadCreative.call(this, url, this.params.vpaidSettings);

      this.adContentType = _type;
      return;
    } // we have HLS or DASH and it is natively supported - display ad with HLS in priority


    if (HLS_PATTERN.test(_type) && _env.default.okHls) {
      _vastPlayer.default.append.call(this, url, _type);

      this.adContentType = _type;
      return;
    }

    if (DASH_PATTERN.test(_type) && _env.default.okDash) {
      _vastPlayer.default.append.call(this, url, _type);

      this.adContentType = _type;
      return;
    } // we gather MP4, WebM, OGG and remaining files


    creatives.push(currentMediaFileItem);
  }

  var retainedCreatives = []; // first we check for the common formats below ... 

  var __filterCommonCreatives = function __filterCommonCreatives(i, creative) {
    if (creative.codec && creative.type === testCommonVideoFormats[i]) {
      return _env.default.canPlayType(creative.type, creative.codec);
    } else if (creative.type === testCommonVideoFormats[i]) {
      return _env.default.canPlayType(creative.type);
    }

    return false;
  };

  for (var _i3 = 0, _len2 = testCommonVideoFormats.length; _i3 < _len2; _i3++) {
    retainedCreatives = creatives.filter(__filterCommonCreatives.bind(null, _i3));

    if (retainedCreatives.length > 0) {
      break;
    }
  } // ... if none of the common format work, then we check for exotic format
  // first we check for those with codec information as it provides more accurate support indication ...


  if (retainedCreatives.length === 0) {
    var __filterCodecCreatives = function __filterCodecCreatives(codec, type, creative) {
      return creative.codec === codec && creative.type === type;
    };

    for (var _i4 = 0, _len3 = creatives.length; _i4 < _len3; _i4++) {
      var thisCreative = creatives[_i4];

      if (thisCreative.codec && thisCreative.type && _env.default.canPlayType(thisCreative.type, thisCreative.codec)) {
        retainedCreatives = creatives.filter(__filterCodecCreatives.bind(null, thisCreative.codec, thisCreative.type));
      }
    }
  } // ... if codec information are not available then we go first type matching


  if (retainedCreatives.length === 0) {
    var __filterTypeCreatives = function __filterTypeCreatives(type, creative) {
      return creative.type === type;
    };

    for (var _i5 = 0, _len4 = creatives.length; _i5 < _len4; _i5++) {
      var _thisCreative = creatives[_i5];

      if (_thisCreative.type && _env.default.canPlayType(_thisCreative.type)) {
        retainedCreatives = creatives.filter(__filterTypeCreatives.bind(null, _thisCreative.type));
      }
    }
  } // still no match for supported format - we exit


  if (retainedCreatives.length === 0) {
    // None of the MediaFile provided are supported by the player
    _ping.default.error.call(this, 403);

    _vastErrors.default.process.call(this, 403);

    return;
  } // sort supported creatives by width


  retainedCreatives.sort(function (a, b) {
    return a.width - b.width;
  });

  if (DEBUG) {
    _fw.default.log('available linear creative follows');

    _fw.default.log(retainedCreatives);
  } // we have files matching device capabilities
  // select the best one based on player current width


  var finalCreative;
  var validCreativesByWidth = [];
  var validCreativesByBitrate = [];

  if (retainedCreatives.length > 1) {
    var containerWidth = _fw.default.getWidth(this.container) * _env.default.devicePixelRatio;

    var containerHeight = _fw.default.getHeight(this.container) * _env.default.devicePixelRatio;

    if (containerWidth > 0 && containerHeight > 0) {
      validCreativesByWidth = retainedCreatives.filter(function (creative) {
        return containerWidth >= creative.width && containerHeight >= creative.height;
      });
    } // if no match by size 


    if (validCreativesByWidth.length === 0) {
      validCreativesByWidth = [retainedCreatives[0]];
    } // filter by bitrate to provide best quality


    var availableBandwidth = _rmpConnection.default.getBandwidthEstimate();

    if (availableBandwidth > -1 && validCreativesByWidth.length > 1) {
      // sort supported creatives by bitrates
      validCreativesByWidth.sort(function (a, b) {
        return a.bitrate - b.bitrate;
      }); // convert to kbps

      availableBandwidth = Math.round(availableBandwidth * 1000);
      validCreativesByBitrate = validCreativesByWidth.filter(function (creative) {
        return availableBandwidth >= creative.bitrate;
      }); // pick max available bitrate

      finalCreative = validCreativesByBitrate[validCreativesByBitrate.length - 1];
    }
  } // if no match by bitrate 


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
    _fw.default.log('selected linear creative follows');

    _fw.default.log(finalCreative);
  }

  this.adMediaUrl = finalCreative.url;
  this.adMediaHeight = finalCreative.height;
  this.adMediaWidth = finalCreative.width;
  this.adContentType = finalCreative.type;

  _vastPlayer.default.append.call(this, finalCreative.url, finalCreative.type);
};

var _default = LINEAR;
exports.default = _default;

},{"../../../externals/rmp-connection":1,"../fw/env":7,"../fw/fw":8,"../players/content-player":10,"../players/vast-player":11,"../players/vpaid":12,"../tracking/ping":13,"../utils/helpers":16,"../utils/vast-errors":17,"./icons":3,"./skip":6,"core-js/modules/es.array.filter":125,"core-js/modules/es.array.sort":129,"core-js/modules/es.array.splice":130,"core-js/modules/es.object.to-string":134,"core-js/modules/es.parse-int":136,"core-js/modules/es.regexp.to-string":138}],5:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.parse-int");

require("core-js/modules/es.regexp.to-string");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fw = _interopRequireDefault(require("../fw/fw"));

var _env = _interopRequireDefault(require("../fw/env"));

var _helpers = _interopRequireDefault(require("../utils/helpers"));

var _ping = _interopRequireDefault(require("../tracking/ping"));

var _vastPlayer = _interopRequireDefault(require("../players/vast-player"));

var _contentPlayer = _interopRequireDefault(require("../players/content-player"));

var _vastErrors = _interopRequireDefault(require("../utils/vast-errors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NONLINEAR = {};

var _onNonLinearLoadError = function _onNonLinearLoadError() {
  _ping.default.error.call(this, 502);

  _vastErrors.default.process.call(this, 502);
};

var _onNonLinearLoadSuccess = function _onNonLinearLoadSuccess() {
  if (DEBUG) {
    _fw.default.log('success loading non-linear creative at ' + this.adMediaUrl);
  }

  this.adOnStage = true;

  _helpers.default.createApiEvent.call(this, 'adloaded');

  _helpers.default.createApiEvent.call(this, 'adimpression');

  _helpers.default.createApiEvent.call(this, 'adstarted');

  _helpers.default.dispatchPingEvent.call(this, ['impression', 'creativeView', 'start']);
};

var _onNonLinearClickThrough = function _onNonLinearClickThrough(event) {
  try {
    if (event) {
      event.stopPropagation();
    }

    if (this.params.pauseOnClick) {
      this.pause();
    }

    _helpers.default.createApiEvent.call(this, 'adclick');

    _helpers.default.dispatchPingEvent.call(this, 'clickthrough');
  } catch (e) {
    _fw.default.trace(e);
  }
};

var _onClickCloseNonLinear = function _onClickCloseNonLinear(event) {
  if (event) {
    event.stopPropagation();

    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }

  this.nonLinearContainer.style.display = 'none';

  _helpers.default.createApiEvent.call(this, 'adclosed');

  _helpers.default.dispatchPingEvent.call(this, 'close');
};

var _appendCloseButton = function _appendCloseButton() {
  var _this = this;

  this.nonLinearClose = document.createElement('div');
  this.nonLinearClose.className = 'rmp-ad-non-linear-close';

  _helpers.default.accessibleButton(this.nonLinearClose, 'close ad button');

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
    _fw.default.log('appending non-linear creative to .rmp-ad-container element');
  } // non-linear ad container


  this.nonLinearContainer = document.createElement('div');
  this.nonLinearContainer.className = 'rmp-ad-non-linear-container';
  this.nonLinearContainer.style.width = this.nonLinearCreativeWidth.toString() + 'px';
  this.nonLinearContainer.style.height = this.nonLinearCreativeHeight.toString() + 'px'; // a tag to handle click - a tag is best for WebView support

  this.nonLinearATag = document.createElement('a');
  this.nonLinearATag.className = 'rmp-ad-non-linear-anchor';

  if (this.clickThroughUrl) {
    this.nonLinearATag.href = this.clickThroughUrl;
    this.nonLinearATag.target = '_blank';
    this.onNonLinearClickThrough = _onNonLinearClickThrough.bind(this);

    if (_env.default.isMobile) {
      this.nonLinearATag.addEventListener('touchend', this.onNonLinearClickThrough);
    } else {
      this.nonLinearATag.addEventListener('click', this.onNonLinearClickThrough);
    }
  } // non-linear creative image


  this.nonLinearImg = document.createElement('img');
  this.nonLinearImg.className = 'rmp-ad-non-linear-img';
  this.onNonLinearLoadError = _onNonLinearLoadError.bind(this);
  this.nonLinearImg.addEventListener('error', this.onNonLinearLoadError);
  this.onNonLinearLoadSuccess = _onNonLinearLoadSuccess.bind(this);
  this.nonLinearImg.addEventListener('load', this.onNonLinearLoadSuccess);
  this.nonLinearImg.src = this.adMediaUrl; // append to adContainer

  this.nonLinearATag.appendChild(this.nonLinearImg);
  this.nonLinearContainer.appendChild(this.nonLinearATag);
  this.adContainer.appendChild(this.nonLinearContainer); // display a close button when non-linear ad has reached minSuggestedDuration

  _appendCloseButton.call(this);

  _fw.default.show(this.adContainer);

  _contentPlayer.default.play.call(this, this.firstContentPlayerPlayRequest);

  if (this.firstContentPlayerPlayRequest) {
    this.firstContentPlayerPlayRequest = false;
  }
};

NONLINEAR.parse = function (nonLinearAds) {
  if (DEBUG) {
    _fw.default.log('start parsing NonLinearAds');
  }

  this.adIsLinear = false;
  var nonLinear = nonLinearAds[0].getElementsByTagName('NonLinear'); // at least 1 NonLinear is expected to continue
  // but according to spec this should not trigger an error
  // 2.3.4 One or more <NonLinear> ads may be included within a <NonLinearAds> element.

  if (nonLinear.length === 0) {
    return;
  }

  var currentNonLinear;
  var adMediaUrl = '';
  var isDimensionError = false; // The video player should poll each <NonLinear> element to determine 
  // which creative is offered in a format the video player can support.

  for (var i = 0, len = nonLinear.length; i < len; i++) {
    isDimensionError = false;
    currentNonLinear = nonLinear[i];
    var width = currentNonLinear.getAttribute('width'); // width attribute is required

    if (width === null || width === '') {
      _ping.default.error.call(this, 101);

      _vastErrors.default.process.call(this, 101);

      continue;
    }

    var height = currentNonLinear.getAttribute('height'); // height attribute is also required

    if (height === null || height === '') {
      _ping.default.error.call(this, 101);

      _vastErrors.default.process.call(this, 101);

      continue;
    }

    width = parseInt(width);
    height = parseInt(height);

    if (width <= 0 || height <= 0) {
      continue;
    } // get minSuggestedDuration (optional)


    var minSuggestedDuration = currentNonLinear.getAttribute('minSuggestedDuration');

    if (minSuggestedDuration !== null && minSuggestedDuration !== '' && _fw.default.isValidDuration(minSuggestedDuration)) {
      this.nonLinearMinSuggestedDuration = _fw.default.convertDurationToSeconds(minSuggestedDuration);
    }

    var staticResource = currentNonLinear.getElementsByTagName('StaticResource'); // we expect at least one StaticResource tag
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
      } // we only support images for StaticResource


      var imagePattern = /^image\/(png|jpeg|jpg|gif)$/i;

      if (!imagePattern.test(creativeType)) {
        continue;
      } // if width of non-linear creative does not fit within current player container width 
      // we should skip this creative


      if (width > _fw.default.getWidth(this.container)) {
        isDimensionError = true;
        continue;
      }

      adMediaUrl = _fw.default.getNodeValue(currentStaticResource, true);
      break;
    } // we have a valid NonLinear/StaticResource with supported creativeType - we break


    if (adMediaUrl !== '') {
      this.adMediaUrl = adMediaUrl;
      this.nonLinearCreativeWidth = width;
      this.nonLinearCreativeHeight = height;
      this.nonLinearContentType = creativeType;
      break;
    }
  } // if not supported NonLinear type ping for error


  if (!this.adMediaUrl || !currentNonLinear) {
    var vastErrorCode = 503;

    if (isDimensionError) {
      vastErrorCode = 501;
    }

    _ping.default.error.call(this, vastErrorCode);

    _vastErrors.default.process.call(this, vastErrorCode);

    return;
  }

  var nonLinearClickThrough = currentNonLinear.getElementsByTagName('NonLinearClickThrough'); // if NonLinearClickThrough is present we expect one tag

  if (nonLinearClickThrough.length > 0) {
    this.clickThroughUrl = _fw.default.getNodeValue(nonLinearClickThrough[0], true);
    var nonLinearClickTracking = nonLinear[0].getElementsByTagName('NonLinearClickTracking');

    if (nonLinearClickTracking.length > 0) {
      for (var _i2 = 0, _len2 = nonLinearClickTracking.length; _i2 < _len2; _i2++) {
        var nonLinearClickTrackingUrl = _fw.default.getNodeValue(nonLinearClickTracking[_i2], true);

        if (nonLinearClickTrackingUrl !== null) {
          this.trackingTags.push({
            event: 'clickthrough',
            url: nonLinearClickTrackingUrl
          });
        }
      }
    }
  }

  _vastPlayer.default.append.call(this);
};

var _default = NONLINEAR;
exports.default = _default;

},{"../fw/env":7,"../fw/fw":8,"../players/content-player":10,"../players/vast-player":11,"../tracking/ping":13,"../utils/helpers":16,"../utils/vast-errors":17,"core-js/modules/es.object.to-string":134,"core-js/modules/es.parse-int":136,"core-js/modules/es.regexp.to-string":138}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fw = _interopRequireDefault(require("../fw/fw"));

var _helpers = _interopRequireDefault(require("../utils/helpers"));

var _vastPlayer = _interopRequireDefault(require("../players/vast-player"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  if (_fw.default.isNumber(this.vastPlayerCurrentTime) && this.vastPlayerCurrentTime > 0) {
    var skipoffsetSeconds = _fw.default.convertOffsetToSeconds(this.skipoffset, this.vastPlayerDuration);

    if (this.vastPlayerCurrentTime >= skipoffsetSeconds) {
      this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdateCheckSkip);

      _setCanBeSkippedUI.call(this);

      this.skippableAdCanBeSkipped = true;

      _helpers.default.createApiEvent.call(this, 'adskippablestatechanged');
    } else if (skipoffsetSeconds - this.vastPlayerCurrentTime > 0) {
      _updateWaitingForCanBeSkippedUI.call(this, skipoffsetSeconds - this.vastPlayerCurrentTime);
    }
  }
};

var _onClickSkip = function _onClickSkip(event) {
  if (event) {
    event.stopPropagation();

    if (event.type === 'touchend') {
      event.preventDefault();
    }
  }

  if (this.skippableAdCanBeSkipped) {
    // create API event 
    _helpers.default.createApiEvent.call(this, 'adskipped'); // request ping for skip event


    if (this.hasSkipEvent) {
      _helpers.default.dispatchPingEvent.call(this, 'skip');
    } // resume content


    _vastPlayer.default.resumeContent.call(this);
  }
};

SKIP.append = function () {
  this.skipButton = document.createElement('div');
  this.skipButton.className = 'rmp-ad-container-skip';
  this.skipButton.style.display = 'none';

  _helpers.default.accessibleButton(this.skipButton, 'skip ad button');

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

var _default = SKIP;
exports.default = _default;

},{"../fw/fw":8,"../players/vast-player":11,"../utils/helpers":16}],7:[function(require,module,exports){
"use strict";

require("core-js/modules/es.parse-int");

require("core-js/modules/es.string.match");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fw = _interopRequireDefault(require("./fw"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENV = {};
var testVideo = document.createElement('video');

var _hasTouchEvents = function _hasTouchEvents() {
  if (typeof window.ontouchstart !== 'undefined' || window.DocumentTouch && document instanceof window.DocumentTouch) {
    return true;
  }

  return false;
};

var hasTouchEvents = _hasTouchEvents();

var _getUserAgent = function _getUserAgent() {
  if (window.navigator && window.navigator.userAgent) {
    return window.navigator.userAgent;
  }

  return null;
};

var userAgent = _getUserAgent();

var _filterVersion = function _filterVersion(pattern) {
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

var _isIos = function _isIos() {
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

var _isMacOSX = function _isMacOSX() {
  if (!isIos[0] && MACOS_PATTERN.test(userAgent)) {
    return true;
  }

  return false;
};

var SAFARI_PATTERN = /safari\/[.0-9]*/i;
var SAFARI_VERSION_PATTERN = /version\/(\d+)\./i;
var NO_SAFARI_PATTERN = /(chrome|chromium|android|crios|fxios)/i;

var _isSafari = function _isSafari() {
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

var _isAndroid = function _isAndroid() {
  var support = [false, -1];

  if (isIos[0] || !hasTouchEvents) {
    return support;
  }

  if (ANDROID_PATTERN.test(userAgent)) {
    support = [true, _filterVersion(ANDROID_VERSION_PATTERN)];
  }

  return support;
}; // from https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent


var FIREFOX_PATTERN = /firefox\//i;
var SEAMONKEY_PATTERN = /seamonkey\//i;

var _isFirefox = function _isFirefox() {
  if (FIREFOX_PATTERN.test(userAgent) && !SEAMONKEY_PATTERN.test(userAgent)) {
    return true;
  }

  return false;
};

var _video5 = function _video5() {
  return typeof testVideo.canPlayType !== 'undefined';
};

var html5VideoSupport = _video5();

var MP4_H264_AAC_BASELINE_MIME_PATTERN = 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"';

var _okMp4 = function _okMp4() {
  if (html5VideoSupport) {
    var canPlayType = testVideo.canPlayType(MP4_H264_AAC_BASELINE_MIME_PATTERN);

    if (canPlayType !== '') {
      return true;
    }
  }

  return false;
};

var okMp4 = _okMp4();

var _okHls = function _okHls() {
  if (html5VideoSupport && okMp4) {
    var isSupp1 = testVideo.canPlayType('application/vnd.apple.mpegurl');
    var isSupp2 = testVideo.canPlayType('application/x-mpegurl');

    if (isSupp1 !== '' || isSupp2 !== '') {
      return true;
    }
  }

  return false;
};

var _okDash = function _okDash() {
  if (html5VideoSupport) {
    var dashSupport = testVideo.canPlayType('application/dash+xml');

    if (dashSupport !== '') {
      return true;
    }
  }

  return false;
};

var _hasNativeFullscreenSupport = function _hasNativeFullscreenSupport() {
  var doc = document.documentElement;

  if (doc) {
    if (typeof doc.requestFullscreen !== 'undefined' || typeof doc.webkitRequestFullscreen !== 'undefined' || typeof doc.mozRequestFullScreen !== 'undefined' || typeof doc.msRequestFullscreen !== 'undefined' || typeof testVideo.webkitEnterFullscreen !== 'undefined') {
      return true;
    }
  }

  return false;
};

var _getDevicePixelRatio = function _getDevicePixelRatio() {
  var pixelRatio = 1;

  if (_fw.default.isNumber(window.devicePixelRatio) && window.devicePixelRatio > 1) {
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
var _default = ENV;
exports.default = _default;

},{"./fw":8,"core-js/modules/es.parse-int":136,"core-js/modules/es.string.match":140}],8:[function(require,module,exports){
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.number.constructor");

require("core-js/modules/es.number.is-finite");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.parse-float");

require("core-js/modules/es.parse-int");

require("core-js/modules/es.promise");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.replace");

require("core-js/modules/es.string.split");

require("core-js/modules/es.string.trim");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
  var event;

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

var _getComputedStyle = function _getComputedStyle(element, style) {
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

var _getStyleAttributeData = function _getStyleAttributeData(element, style) {
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

var consoleStyleOne = 'color: white; background-color: #00ACC1; padding:1px 3px; border-radius: 3px; margin-right: 7px';

FW.log = function (data) {
  if (window.console && window.console.log) {
    if (typeof data === 'string') {
      window.console.log('%crmp-vast%c' + data, consoleStyleOne, '');
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
  var value = ''; // sometimes we have may several nodes - some of which may hold whitespaces

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
}; // HH:MM:SS or HH:MM:SS.mmm


var skipPattern1 = /^\d+:\d+:\d+(\.\d+)?$/i; // n%

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
  if (typeof obj !== 'undefined' && obj !== null && _typeof(obj) === 'object') {
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

var _default = FW;
exports.default = _default;

},{"core-js/modules/es.array.index-of":127,"core-js/modules/es.array.iterator":128,"core-js/modules/es.number.constructor":131,"core-js/modules/es.number.is-finite":132,"core-js/modules/es.object.to-string":134,"core-js/modules/es.parse-float":135,"core-js/modules/es.parse-int":136,"core-js/modules/es.promise":137,"core-js/modules/es.regexp.to-string":138,"core-js/modules/es.string.iterator":139,"core-js/modules/es.string.replace":141,"core-js/modules/es.string.split":142,"core-js/modules/es.string.trim":143,"core-js/modules/es.symbol":146,"core-js/modules/es.symbol.description":144,"core-js/modules/es.symbol.iterator":145,"core-js/modules/web.dom-collections.iterator":148}],9:[function(require,module,exports){
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.sort");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.parse-int");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

var _fw = _interopRequireDefault(require("./fw/fw"));

var _env = _interopRequireDefault(require("./fw/env"));

var _helpers = _interopRequireDefault(require("./utils/helpers"));

var _ping = _interopRequireDefault(require("./tracking/ping"));

var _linear = _interopRequireDefault(require("./creatives/linear"));

var _nonLinear = _interopRequireDefault(require("./creatives/non-linear"));

var _trackingEvents2 = _interopRequireDefault(require("./tracking/tracking-events"));

var _api = _interopRequireDefault(require("./api/api"));

var _contentPlayer = _interopRequireDefault(require("./players/content-player"));

var _default = _interopRequireDefault(require("./utils/default"));

var _vastErrors = _interopRequireDefault(require("./utils/vast-errors"));

var _icons = _interopRequireDefault(require("./creatives/icons"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* module:begins */
(function () {
  'use strict';

  window.DEBUG = true;

  if (typeof window === 'undefined' || typeof window.document === 'undefined') {
    if (DEBUG) {
      _fw.default.log('cannot use rmp-vast in this environment - missing window or document object');
    }

    return;
  }

  if (typeof window.RmpVast !== 'undefined') {
    if (DEBUG) {
      _fw.default.log('RmpVast constructor already exists - no need to load it twice - exiting');
    }

    return;
  }
  /* module:ends */


  window.RmpVast = function (id, params) {
    if (typeof id !== 'string' || id === '') {
      if (DEBUG) {
        _fw.default.log('invalid id to create new instance - exit');
      }

      return;
    }

    this.id = id;
    this.container = document.getElementById(this.id);
    this.contentWrapper = this.container.querySelector('.rmp-content');
    this.contentPlayer = this.container.querySelector('.rmp-video');

    if (this.container === null || this.contentWrapper === null || this.contentPlayer === null) {
      if (DEBUG) {
        _fw.default.log('invalid DOM layout - exit');
      }

      return;
    }

    if (DEBUG) {
      _fw.default.log('creating new RmpVast instance');

      _fw.default.logVideoEvents(this.contentPlayer, 'content');
    } // reset instance variables - once per session


    _default.default.instanceVariables.call(this); // reset loadAds variables - this is reset at addestroyed 
    // so that next loadAds is cleared


    _default.default.loadAdsVariables.call(this); // handle fullscreen events


    _default.default.fullscreen.call(this); // filter input params


    _helpers.default.filterParams.call(this, params);

    if (DEBUG) {
      _fw.default.log('filtered params follow');

      _fw.default.log(this.params);

      _fw.default.log('detected environment follows');

      var keys = Object.keys(_env.default);
      var filteredEnv = {};

      for (var i = 0, len = keys.length; i < len; i++) {
        var currentEnvItem = _env.default[keys[i]];

        if (typeof currentEnvItem !== 'undefined' && typeof currentEnvItem !== 'function' && currentEnvItem !== null) {
          filteredEnv[keys[i]] = currentEnvItem;
        }
      }

      _fw.default.log(filteredEnv);
    }
  }; // enrich RmpVast prototype with API methods


  _api.default.attach(window.RmpVast);

  var _execRedirect = function _execRedirect() {
    if (DEBUG) {
      _fw.default.log('adfollowingredirect');
    }

    _helpers.default.createApiEvent.call(this, 'adfollowingredirect');

    var redirectUrl = _fw.default.getNodeValue(this.vastAdTagURI[0], true);

    if (DEBUG) {
      _fw.default.log('redirect URL is ' + redirectUrl);
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
        _ping.default.error.call(this, 302);

        _vastErrors.default.process.call(this, 302);
      }
    } else {
      // not a valid redirect URI - ping for error
      _ping.default.error.call(this, 300);

      _vastErrors.default.process.call(this, 300);
    }
  };

  var _parseCreatives = function _parseCreatives(creative) {
    if (DEBUG) {
      _fw.default.log('_parseCreatives');

      _fw.default.log(creative);
    }

    for (var i = 0, len = creative.length; i < len; i++) {
      var currentCreative = creative[i]; // we only pick the first creative that is either Linear or NonLinearAds

      var nonLinearAds = currentCreative.getElementsByTagName('NonLinearAds');
      var linear = currentCreative.getElementsByTagName('Linear'); // for now we ignore CreativeExtensions tag
      //let creativeExtensions = currentCreative.getElementsByTagName('CreativeExtensions');

      var companionAds = currentCreative.getElementsByTagName('CompanionAds');

      if (companionAds.length > 0) {
        continue;
      } // we expect 1 Linear or NonLinearAds tag 


      if (nonLinearAds.length === 0 && linear.length === 0) {
        _ping.default.error.call(this, 101);

        _vastErrors.default.process.call(this, 101);

        return;
      }

      if (nonLinearAds.length > 0) {
        var trackingEvents = nonLinearAds[0].getElementsByTagName('TrackingEvents'); // if TrackingEvents tag

        if (trackingEvents.length > 0) {
          _trackingEvents2.default.filterPush.call(this, trackingEvents);
        }

        if (this.isWrapper) {
          _execRedirect.call(this);

          return;
        }

        _nonLinear.default.parse.call(this, nonLinearAds);

        return;
      } else if (linear.length > 0) {
        // check for skippable ads (Linear skipoffset)
        var skipoffset = linear[0].getAttribute('skipoffset'); // if we have a wrapper we ignore skipoffset in case it is present

        if (!this.isWrapper && this.params.skipMessage !== '' && skipoffset !== null && skipoffset !== '' && _fw.default.isValidOffset(skipoffset)) {
          if (DEBUG) {
            _fw.default.log('skippable ad detected with offset ' + skipoffset);
          }

          this.isSkippableAd = true;
          this.skipoffset = skipoffset; // we  do not display skippable ads when on is iOS < 10

          if (_env.default.isIos[0] && _env.default.isIos[1] < 10) {
            _ping.default.error.call(this, 200);

            _vastErrors.default.process.call(this, 200);

            return;
          }
        } // TrackingEvents


        var _trackingEvents = linear[0].getElementsByTagName('TrackingEvents'); // if present TrackingEvents


        if (_trackingEvents.length > 0) {
          _trackingEvents2.default.filterPush.call(this, _trackingEvents);
        } // VideoClicks for linear


        var videoClicks = linear[0].getElementsByTagName('VideoClicks');

        if (videoClicks.length > 0) {
          var clickThrough = videoClicks[0].getElementsByTagName('ClickThrough');
          var clickTracking = videoClicks[0].getElementsByTagName('ClickTracking');

          if (clickThrough.length > 0) {
            this.clickThroughUrl = _fw.default.getNodeValue(clickThrough[0], true);
          }

          if (clickTracking.length > 0) {
            for (var _i = 0, _len = clickTracking.length; _i < _len; _i++) {
              var clickTrackingUrl = _fw.default.getNodeValue(clickTracking[_i], true);

              if (clickTrackingUrl !== null) {
                this.trackingTags.push({
                  event: 'clickthrough',
                  url: clickTrackingUrl
                });
              }
            }
          }
        } // return on wrapper


        if (this.isWrapper) {
          // if icons are presents then we push valid icons
          var icons = linear[0].getElementsByTagName('Icons');

          if (icons.length > 0) {
            _icons.default.parse.call(this, icons);
          }

          _execRedirect.call(this);

          return;
        }

        _linear.default.parse.call(this, linear);

        return;
      }
    } // in case wrapper with creative CompanionAds we still need to _execRedirect


    if (this.isWrapper) {
      _execRedirect.call(this);

      return;
    }
  };

  var _filterAdPod = function _filterAdPod(ad) {
    if (DEBUG) {
      _fw.default.log('_filterAdPod');
    } // filter Ad and AdPod


    var retainedAd; // a pod already exists and is being processed - the current Ad item is InLine

    if (this.adPod.length > 0 && !this.adPodItemWrapper) {
      if (DEBUG) {
        _fw.default.log('loading next ad in pod');
      }

      retainedAd = ad[0];
      this.adPodCurrentIndex++;
      this.adPod.shift();
    } else if (this.adPod.length > 0 && this.adPodItemWrapper) {
      if (DEBUG) {
        _fw.default.log('running ad pod Ad is a wrapper');
      } // we are in a pod but the running Ad item is a wrapper


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
          _fw.default.log('ad pod detected');
        }

        this.runningAdPod = true; // clone array for purpose of API exposure

        this.adPodApiInfo = _toConsumableArray(this.adPod); // so we are in a pod but it may come from a wrapper so we need to ping 
        // wrapper trackings for each Ad of the pod

        this.adPodWrapperTrackings = _toConsumableArray(this.trackingTags); // reduced adPod length to maxNumItemsInAdPod

        if (this.adPod.length > this.params.maxNumItemsInAdPod) {
          this.adPod.length = this.params.maxNumItemsInAdPod;
        }

        this.standaloneAdsInPod = standaloneAds; // sort adPod in case sequence attr are unordered

        this.adPod.sort(function (a, b) {
          var sequence1 = parseInt(a.getAttribute('sequence'));
          var sequence2 = parseInt(b.getAttribute('sequence'));
          return sequence1 - sequence2;
        });
        retainedAd = this.adPod[0];
        this.adPod.shift();

        var __onAdDestroyLoadNextAdInPod = function __onAdDestroyLoadNextAdInPod() {
          if (DEBUG) {
            _fw.default.log('addestroyed - checking for ads left in pod');

            if (this.adPod.length > 0) {
              _fw.default.log(this.adPod);
            } else {
              _fw.default.log('no ad left in pod');
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

            _helpers.default.createApiEvent.call(this, 'adpodcompleted');
          }
        };

        this.onAdDestroyLoadNextAdInPod = __onAdDestroyLoadNextAdInPod.bind(this);
        this.container.addEventListener('addestroyed', this.onAdDestroyLoadNextAdInPod);
      }
    }

    if (!retainedAd) {
      // in case this is a wrapper we need to ping for errors on originating tags
      _ping.default.error.call(this, 200);

      _vastErrors.default.process.call(this, 200);

      return;
    }

    var inline = retainedAd.getElementsByTagName('InLine');
    var wrapper = retainedAd.getElementsByTagName('Wrapper'); // 1 InLine or Wrapper element must be present 

    if (inline.length === 0 && wrapper.length === 0) {
      // in case this is a wrapper we need to ping for errors on originating tags
      _ping.default.error.call(this, 101);

      _vastErrors.default.process.call(this, 101);

      return;
    }

    var inlineOrWrapper;

    if (wrapper.length > 0) {
      this.isWrapper = true;
      inlineOrWrapper = wrapper;
      this.vastAdTagURI = inlineOrWrapper[0].getElementsByTagName('VASTAdTagURI');
    } else {
      inlineOrWrapper = inline;
    }

    var adSystem = inlineOrWrapper[0].getElementsByTagName('AdSystem');
    var impression = inlineOrWrapper[0].getElementsByTagName('Impression'); // VAST/Ad/InLine/Error node

    var errorNode = inlineOrWrapper[0].getElementsByTagName('Error');

    if (errorNode.length > 0) {
      var errorUrl = _fw.default.getNodeValue(errorNode[0], true);

      if (errorUrl !== null) {
        this.inlineOrWrapperErrorTags.push({
          event: 'error',
          url: errorUrl
        });
      }
    }

    var adTitle = inlineOrWrapper[0].getElementsByTagName('AdTitle');
    var adDescription = inlineOrWrapper[0].getElementsByTagName('Description');
    var creatives = inlineOrWrapper[0].getElementsByTagName('Creatives'); // Required InLine Elements are AdSystem, AdTitle, Impression, Creatives
    // Required Wrapper Elements are AdSystem, vastAdTagURI, Impression
    // however in real word some adTag do not have impression or adSystem/adTitle tags 
    // especially in the context of multiple redirects - since the IMA SDK allows those tags 
    // to render we should do the same even if those adTags are not VAST-compliant
    // so we only check and exit if missing required information to display ads 

    if (this.isWrapper) {
      if (this.vastAdTagURI.length === 0) {
        _ping.default.error.call(this, 101);

        _vastErrors.default.process.call(this, 101);

        return;
      }
    } else {
      if (creatives.length === 0) {
        _ping.default.error.call(this, 101);

        _vastErrors.default.process.call(this, 101);

        return;
      }
    }

    var creative;

    if (creatives.length > 0) {
      creative = creatives[0].getElementsByTagName('Creative'); // at least one creative tag is expected for InLine

      if (!this.isWrapper && creative.length === 0) {
        _ping.default.error.call(this, 101);

        _vastErrors.default.process.call(this, 101);

        return;
      }
    }

    if (adTitle.length > 0) {
      this.adSystem = _fw.default.getNodeValue(adSystem[0], false);
    }

    if (impression.length > 0) {
      for (var _i3 = 0, _len3 = impression.length; _i3 < _len3; _i3++) {
        var impressionUrl = _fw.default.getNodeValue(impression[_i3], true);

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
        this.adTitle = _fw.default.getNodeValue(adTitle[0], false);
      }

      if (adDescription.length > 0) {
        this.adDescription = _fw.default.getNodeValue(adDescription[0], false);
      }
    } // in case no Creative with Wrapper we make our redirect call here


    if (this.isWrapper && !creative) {
      _execRedirect.call(this);

      return;
    }

    _parseCreatives.call(this, creative);
  };

  var _onXmlAvailable = function _onXmlAvailable(xml) {
    // if VMAP we abort
    var vmap = xml.getElementsByTagName('vmap:VMAP');

    if (vmap.length > 0) {
      _vastErrors.default.process.call(this, 200);

      return;
    } // check for VAST node


    var vastTag = xml.getElementsByTagName('VAST');

    if (vastTag.length === 0) {
      // in case this is a wrapper we need to ping for errors on originating tags
      _ping.default.error.call(this, 100);

      _vastErrors.default.process.call(this, 100);

      return;
    }

    var vastDocument = vastTag[0]; // VAST/Error node

    var errorNode = vastDocument.getElementsByTagName('Error');

    if (errorNode.length > 0) {
      for (var i = 0, len = errorNode.length; i < len; i++) {
        // we need to make sure those Error tags are directly beneath VAST tag. See 2.2.5.1 VAST 3 spec
        if (errorNode[i].parentNode === vastDocument) {
          var errorUrl = _fw.default.getNodeValue(errorNode[i], true);

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
    } //check for VAST version 2, 3 or 4 (we support VAST 4 in the limit of what is supported in VAST 3)


    var pattern = /^(2|3|4)\./i;
    var version = vastDocument.getAttribute('version');

    if (!pattern.test(version)) {
      // in case this is a wrapper we need to ping for errors on originating tags
      _ping.default.error.call(this, 102);

      _vastErrors.default.process.call(this, 102);

      return;
    } // if empty VAST return


    var ad = vastDocument.getElementsByTagName('Ad');

    if (ad.length === 0) {
      _ping.default.error.call(this, 303);

      _vastErrors.default.process.call(this, 303);

      return;
    }

    _filterAdPod.call(this, ad);
  };

  var _makeAjaxRequest = function _makeAjaxRequest(vastUrl) {
    var _this = this;

    // we check for required VAST URL and API here
    // as we need to have this.currentContentSrc available for iOS
    if (typeof vastUrl !== 'string' || vastUrl === '') {
      _vastErrors.default.process.call(this, 1001);

      return;
    }

    if (!_fw.default.hasDOMParser()) {
      _vastErrors.default.process.call(this, 1002);

      return;
    }

    _helpers.default.createApiEvent.call(this, 'adtagstartloading');

    this.isWrapper = false;
    this.vastAdTagURI = null;
    this.adTagUrl = vastUrl;

    if (DEBUG) {
      _fw.default.log('try to load VAST tag at ' + this.adTagUrl);
    }

    _fw.default.ajax(this.adTagUrl, this.params.ajaxTimeout, true, this.params.ajaxWithCredentials).then(function (data) {
      if (DEBUG) {
        _fw.default.log('VAST loaded from ' + _this.adTagUrl);
      }

      _helpers.default.createApiEvent.call(_this, 'adtagloaded');

      var xml;

      try {
        // Parse XML
        var parser = new DOMParser();
        xml = parser.parseFromString(data, 'text/xml');

        if (DEBUG) {
          _fw.default.log('parsed XML document follows');

          _fw.default.log(xml);
        }
      } catch (e) {
        _fw.default.trace(e); // in case this is a wrapper we need to ping for errors on originating tags


        _ping.default.error.call(_this, 100);

        _vastErrors.default.process.call(_this, 100);

        return;
      }

      _onXmlAvailable.call(_this, xml);
    }).catch(function (e) {
      _fw.default.trace(e); // in case this is a wrapper we need to ping for errors on originating tags


      _ping.default.error.call(_this, 1000);

      _vastErrors.default.process.call(_this, 1000);
    });
  };

  var _onDestroyLoadAds = function _onDestroyLoadAds(vastUrl) {
    this.container.removeEventListener('addestroyed', this.onDestroyLoadAds);
    this.loadAds(vastUrl);
  };

  window.RmpVast.prototype.loadAds = function (vastUrl) {
    if (DEBUG) {
      _fw.default.log('loadAds starts');
    } // if player is not initialized - this must be done now


    if (!this.rmpVastInitialized) {
      this.initialize();
    } // if an ad is already on stage we need to clear it first before we can accept another ad request


    if (this.getAdOnStage()) {
      this.onDestroyLoadAds = _onDestroyLoadAds.bind(this, vastUrl);
      this.container.addEventListener('addestroyed', this.onDestroyLoadAds);
      this.stopAds();
      return;
    } // for useContentPlayerForAds we need to know early what is the content src
    // so that we can resume content when ad finishes or on aderror


    var contentCurrentTime = _contentPlayer.default.getCurrentTime.call(this);

    if (this.useContentPlayerForAds) {
      this.currentContentSrc = this.contentPlayer.src;

      if (DEBUG) {
        _fw.default.log('currentContentSrc is ' + this.currentContentSrc);
      }

      this.currentContentCurrentTime = contentCurrentTime;

      if (DEBUG) {
        _fw.default.log('currentContentCurrentTime is ' + this.currentContentCurrentTime);
      } // on iOS we need to prevent seeking when linear ad is on stage


      _contentPlayer.default.preventSeekingForCustomPlayback.call(this);
    }

    _makeAjaxRequest.call(this, vastUrl);
  };
  /* module:begins */

})();
/* module:ends */

/* module:export */

},{"./api/api":2,"./creatives/icons":3,"./creatives/linear":4,"./creatives/non-linear":5,"./fw/env":7,"./fw/fw":8,"./players/content-player":10,"./tracking/ping":13,"./tracking/tracking-events":14,"./utils/default":15,"./utils/helpers":16,"./utils/vast-errors":17,"core-js/modules/es.array.from":126,"core-js/modules/es.array.iterator":128,"core-js/modules/es.array.sort":129,"core-js/modules/es.object.keys":133,"core-js/modules/es.object.to-string":134,"core-js/modules/es.parse-int":136,"core-js/modules/es.regexp.to-string":138,"core-js/modules/es.string.iterator":139,"core-js/modules/es.symbol":146,"core-js/modules/es.symbol.description":144,"core-js/modules/es.symbol.iterator":145,"core-js/modules/web.dom-collections.iterator":148}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fw = _interopRequireDefault(require("../fw/fw"));

var _helpers = _interopRequireDefault(require("../utils/helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CONTENTPLAYER = {};

CONTENTPLAYER.play = function (firstContentPlayerPlayRequest) {
  if (this.contentPlayer && this.contentPlayer.paused) {
    _helpers.default.playPromise.call(this, 'content', firstContentPlayerPlayRequest);
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

    if (_fw.default.isNumber(duration)) {
      return Math.round(duration * 1000);
    }
  }

  return -1;
};

CONTENTPLAYER.getCurrentTime = function () {
  if (this.contentPlayer) {
    var currentTime = this.contentPlayer.currentTime;

    if (_fw.default.isNumber(currentTime)) {
      return Math.round(currentTime * 1000);
    }
  }

  return -1;
};

CONTENTPLAYER.seekTo = function (msSeek) {
  if (!_fw.default.isNumber(msSeek)) {
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

var _default = CONTENTPLAYER;
exports.default = _default;

},{"../fw/fw":8,"../utils/helpers":16}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fw = _interopRequireDefault(require("../fw/fw"));

var _env = _interopRequireDefault(require("../fw/env"));

var _helpers = _interopRequireDefault(require("../utils/helpers"));

var _contentPlayer = _interopRequireDefault(require("../players/content-player"));

var _vpaid = _interopRequireDefault(require("../players/vpaid"));

var _icons = _interopRequireDefault(require("../creatives/icons"));

var _default2 = _interopRequireDefault(require("../utils/default"));

var _trackingEvents = _interopRequireDefault(require("../tracking/tracking-events"));

var _nonLinear = _interopRequireDefault(require("../creatives/non-linear"));

var _linear = _interopRequireDefault(require("../creatives/linear"));

var _vastErrors = _interopRequireDefault(require("../utils/vast-errors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VASTPLAYER = {};

var _unwireVastPlayerEvents = function _unwireVastPlayerEvents() {
  if (DEBUG) {
    _fw.default.log('reset - unwireVastPlayerEvents');
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
    this.vastPlayer.removeEventListener('error', this.onPlaybackError); // vastPlayer content pause/resume events

    this.vastPlayer.removeEventListener('durationchange', this.onDurationChange);
    this.vastPlayer.removeEventListener('loadedmetadata', this.onLoadedmetadataPlay);
    this.vastPlayer.removeEventListener('contextmenu', this.onContextMenu); // unwire HTML5 video events

    this.vastPlayer.removeEventListener('pause', this.onPause);
    this.vastPlayer.removeEventListener('play', this.onPlay);
    this.vastPlayer.removeEventListener('playing', this.onPlaying);
    this.vastPlayer.removeEventListener('ended', this.onEnded);
    this.vastPlayer.removeEventListener('volumechange', this.onVolumeChange);
    this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdate); // unwire HTML5 VAST events

    for (var _i = 0, _len = this.trackingTags.length; _i < _len; _i++) {
      this.vastPlayer.removeEventListener(this.trackingTags[_i].event, this.onEventPingTracking);
    } // remove clicktrough handling


    if (this.onClickThrough !== null) {
      this.vastPlayer.removeEventListener('click', this.onClickThrough);
    } // remove icons 


    if (this.onPlayingAppendIcons !== null) {
      this.vastPlayer.removeEventListener('playing', this.onPlayingAppendIcons);
    } // skip


    if (this.onTimeupdateCheckSkip !== null) {
      this.vastPlayer.removeEventListener('timeupdate', this.onTimeupdateCheckSkip);
    }

    if (this.skipButton && this.onClickSkip !== null) {
      this.skipButton.removeEventListener('click', this.onClickSkip);
      this.skipButton.removeEventListener('touchend', this.onClickSkip);
    } // click UI on mobile


    if (this.clickUIOnMobile && this.onClickThrough !== null) {
      this.clickUIOnMobile.removeEventListener('touchend', this.onClickThrough);
    }
  }

  if (this.contentPlayer) {
    this.contentPlayer.removeEventListener('error', this.onPlaybackError);
  }
};

var _destroyVastPlayer = function _destroyVastPlayer() {
  var _this = this;

  if (DEBUG) {
    _fw.default.log('start destroying vast player');
  } // destroy icons if any 


  if (this.icons.length > 0) {
    _icons.default.destroy.call(this);
  }

  if (this.isVPAID) {
    _vpaid.default.destroy.call(this);
  } // unwire events


  _unwireVastPlayerEvents.call(this); // remove clickUI on mobile


  if (this.clickUIOnMobile) {
    _fw.default.removeElement(this.clickUIOnMobile);
  }

  if (this.isSkippableAd) {
    _fw.default.removeElement(this.skipButton);
  } // hide rmp-ad-container


  _fw.default.hide(this.adContainer); // unwire anti-seek logic (iOS)


  clearInterval(this.antiSeekLogicInterval); // reset creativeLoadTimeout

  clearTimeout(this.creativeLoadTimeoutCallback);

  if (this.useContentPlayerForAds) {
    if (!this.params.outstream) {
      if (this.nonLinearContainer) {
        _fw.default.removeElement(this.nonLinearContainer);
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

                _contentPlayer.default.seekTo.call(_this, _this.currentContentCurrentTime);
              }
            });
          }
        }

        if (DEBUG) {
          _fw.default.log('recovering content with src ' + this.currentContentSrc + ' - at time: ' + this.currentContentCurrentTime);
        }

        this.contentPlayer.src = this.currentContentSrc;
      }
    } else {
      // specific handling for outstream ad === flush buffer and do not attempt to resume content
      try {
        if (this.contentPlayer) {
          this.contentPlayer.pause(); // empty buffer

          this.contentPlayer.removeAttribute('src');
          this.contentPlayer.load();

          if (DEBUG) {
            _fw.default.log('flushing contentPlayer buffer after outstream ad');
          }
        }
      } catch (e) {
        _fw.default.trace(e);
      }
    }
  } else {
    // flush vastPlayer
    try {
      if (this.vastPlayer) {
        this.vastPlayer.pause(); // empty buffer

        this.vastPlayer.removeAttribute('src');
        this.vastPlayer.load();

        _fw.default.hide(this.vastPlayer);

        if (DEBUG) {
          _fw.default.log('flushing vastPlayer buffer after ad');
        }
      }

      if (this.nonLinearContainer) {
        _fw.default.removeElement(this.nonLinearContainer);
      }
    } catch (e) {
      _fw.default.trace(e);
    }
  }

  _default2.default.loadAdsVariables.call(this);

  _helpers.default.createApiEvent.call(this, 'addestroyed');
};

VASTPLAYER.init = function () {
  var _this2 = this;

  if (DEBUG) {
    _fw.default.log('init called');
  }

  this.adContainer = document.createElement('div');
  this.adContainer.className = 'rmp-ad-container';
  this.contentWrapper.appendChild(this.adContainer);

  _fw.default.hide(this.adContainer);

  if (!this.useContentPlayerForAds) {
    this.vastPlayer = document.createElement('video');

    if (DEBUG) {
      _fw.default.logVideoEvents(this.vastPlayer, 'vast');
    } // disable casting of video ads for Android


    if (_env.default.isAndroid[0] && typeof this.vastPlayer.disableRemotePlayback !== 'undefined') {
      this.vastPlayer.disableRemotePlayback = true;
    }

    this.vastPlayer.className = 'rmp-ad-vast-video-player';
    this.vastPlayer.controls = false; // this.contentPlayer.muted may not be set because of a bug in some version of Chromium

    if (this.contentPlayer.hasAttribute('muted')) {
      this.contentPlayer.muted = true;
    }

    if (this.contentPlayer.muted) {
      this.vastPlayer.muted = true;
    } // black poster based 64 png


    this.vastPlayer.poster = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='; // note to myself: we use setAttribute for non-standard attribute (instead of . notation)

    this.vastPlayer.setAttribute('x-webkit-airplay', 'allow');

    if (typeof this.contentPlayer.playsInline === 'boolean' && this.contentPlayer.playsInline) {
      this.vastPlayer.playsInline = true;
    } else if (_env.default.isMobile) {
      // this is for iOS/Android WebView where webkit-playsinline may be available
      this.vastPlayer.setAttribute('webkit-playsinline', true);
    }

    this.vastPlayer.defaultPlaybackRate = 1; // append to rmp-ad-container

    _fw.default.hide(this.vastPlayer);

    this.adContainer.appendChild(this.vastPlayer);
  } else {
    this.vastPlayer = this.contentPlayer;
  } // we track ended state for content player


  this.contentPlayer.addEventListener('ended', function () {
    if (_this2.adOnStage) {
      return;
    }

    _this2.contentPlayerCompleted = true;
  }); // we need to preload as much creative data as possible
  // also on macOS and iOS Safari we need to force preload to avoid 
  // playback issues

  this.vastPlayer.preload = 'auto'; // we need to init the vast player video tag
  // according to https://developers.google.com/interactive-media-ads/docs/sdks/html5/mobile_video
  // to initialize the content element, a call to the load() method is sufficient.

  if (_env.default.isMobile) {
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
        _vastErrors.default.process.call(this, 1004);

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
        _fw.default.log('non-linear creative detected for outstream ad mode - discarding creative');
      }

      _vastErrors.default.process.call(this, 201);

      return;
    } else {
      _nonLinear.default.update.call(this);
    }
  } else {
    if (url && type) {
      _linear.default.update.call(this, url, type);
    }
  } // wire tracking events


  _trackingEvents.default.wire.call(this); // append icons - only where vast player is different from 
  // content player


  if (!this.useContentPlayerForAds && this.icons.length > 0) {
    _icons.default.append.call(this);
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
    } else if (!muted && this.vastPlayer.muted) {
      this.vastPlayer.muted = false;
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
    _helpers.default.playPromise.call(this, 'vast', firstVastPlayerPlayRequest);
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

    if (_fw.default.isNumber(duration)) {
      return Math.round(duration * 1000);
    }
  }

  return -1;
};

VASTPLAYER.getCurrentTime = function () {
  if (this.vastPlayer) {
    var currentTime = this.vastPlayer.currentTime;

    if (_fw.default.isNumber(currentTime)) {
      return Math.round(currentTime * 1000);
    }
  }

  return -1;
};

VASTPLAYER.resumeContent = function () {
  if (DEBUG) {
    _fw.default.log('resumeContent');
  }

  _destroyVastPlayer.call(this); // if this.contentPlayerCompleted = true - we are in a post-roll situation
  // in that case we must not resume content once the post-roll has completed
  // you can use setContentPlayerCompleted/getContentPlayerCompleted to support 
  // custom use-cases when dynamically changing source for content
  // no need to resume content for outstream ads


  if (!this.contentPlayerCompleted && !this.params.outstream) {
    _contentPlayer.default.play.call(this);
  }

  this.contentPlayerCompleted = false;
};

var _default = VASTPLAYER;
exports.default = _default;

},{"../creatives/icons":3,"../creatives/linear":4,"../creatives/non-linear":5,"../fw/env":7,"../fw/fw":8,"../players/content-player":10,"../players/vpaid":12,"../tracking/tracking-events":14,"../utils/default":15,"../utils/helpers":16,"../utils/vast-errors":17}],12:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.keys");

require("core-js/modules/es.parse-int");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fw = _interopRequireDefault(require("../fw/fw"));

var _env = _interopRequireDefault(require("../fw/env"));

var _helpers = _interopRequireDefault(require("../utils/helpers"));

var _vastErrors = _interopRequireDefault(require("../utils/vast-errors"));

var _ping = _interopRequireDefault(require("../tracking/ping"));

var _vastPlayer = _interopRequireDefault(require("../players/vast-player"));

var _icons = _interopRequireDefault(require("../creatives/icons"));

var _trackingEvents = _interopRequireDefault(require("../tracking/tracking-events"));

var _contentPlayer = _interopRequireDefault(require("../players/content-player"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VPAID = {}; // vpaidCreative getters

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
}; // VPAID creative events


var _onAdLoaded = function _onAdLoaded() {
  var _this = this;

  if (DEBUG) {
    _fw.default.log('VPAID AdLoaded event');
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
  } // when we call startAd we expect AdStarted event to follow closely
  // otherwise we need to resume content


  this.startAdTimeout = setTimeout(function () {
    if (!_this.vpaidAdStarted) {
      _vastPlayer.default.resumeContent.call(_this);
    }

    _this.vpaidAdStarted = false;
  }, this.params.creativeLoadTimeout); // pause content player

  _contentPlayer.default.pause.call(this);

  this.adOnStage = true;
  this.vpaidCreative.startAd();

  _helpers.default.createApiEvent.call(this, 'adloaded');
};

var _onAdStarted = function _onAdStarted() {
  if (DEBUG) {
    _fw.default.log('VPAID AdStarted event');
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
  } // update duration for VPAID 1.*


  if (this.vpaidVersion === 1) {
    this.vpaid1AdDuration = VPAID.getAdRemainingTime.call(this);
  } // append icons - if VPAID does not handle them


  if (!VPAID.getAdIcons.call(this) && !this.useContentPlayerForAds && this.icons.length > 0) {
    _icons.default.append.call(this);
  }

  if (typeof this.vpaidCreative.getAdLinear === 'function') {
    this.adIsLinear = this.vpaidCreative.getAdLinear();
  }

  _helpers.default.dispatchPingEvent.call(this, 'creativeView');
};

var _onAdStopped = function _onAdStopped() {
  if (DEBUG) {
    _fw.default.log('VPAID AdStopped event');
  }

  if (this.adStoppedTimeout) {
    clearTimeout(this.adStoppedTimeout);
  }

  _vastPlayer.default.resumeContent.call(this);
};

var _onAdSkipped = function _onAdSkipped() {
  if (DEBUG) {
    _fw.default.log('VPAID AdSkipped event');
  }

  if (this.adSkippedTimeout) {
    clearTimeout(this.adSkippedTimeout);
  }

  _helpers.default.createApiEvent.call(this, 'adskipped');

  _helpers.default.dispatchPingEvent.call(this, 'skip');
};

var _onAdSkippableStateChange = function _onAdSkippableStateChange() {
  if (DEBUG) {
    _fw.default.log('VPAID AdSkippableStateChange event');
  }

  _helpers.default.createApiEvent.call(this, 'adskippablestatechanged');
};

var _onAdDurationChange = function _onAdDurationChange() {
  if (DEBUG) {
    _fw.default.log('VPAID AdDurationChange event ' + VPAID.getAdDuration.call(this));
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

  _helpers.default.createApiEvent.call(this, 'addurationchange');
};

var _onAdVolumeChange = function _onAdVolumeChange() {
  if (DEBUG) {
    _fw.default.log('VPAID AdVolumeChange event');
  }

  var newVolume = VPAID.getAdVolume.call(this);

  if (newVolume === null) {
    return;
  }

  if (this.vpaidCurrentVolume > 0 && newVolume === 0) {
    _helpers.default.dispatchPingEvent.call(this, 'mute');
  } else if (this.vpaidCurrentVolume === 0 && newVolume > 0) {
    _helpers.default.dispatchPingEvent.call(this, 'unmute');
  }

  this.vpaidCurrentVolume = newVolume;

  _helpers.default.createApiEvent.call(this, 'advolumechanged');
};

var _onAdImpression = function _onAdImpression() {
  if (DEBUG) {
    _fw.default.log('VPAID AdImpression event');
  }

  _helpers.default.createApiEvent.call(this, 'adimpression');

  _helpers.default.dispatchPingEvent.call(this, 'impression');
};

var _onAdVideoStart = function _onAdVideoStart() {
  if (DEBUG) {
    _fw.default.log('VPAID AdVideoStart event');
  }

  this.vpaidPaused = false;
  var newVolume = VPAID.getAdVolume.call(this);

  if (newVolume === null) {
    newVolume = 1;
  }

  this.vpaidCurrentVolume = newVolume;

  _helpers.default.createApiEvent.call(this, 'adstarted');

  _helpers.default.dispatchPingEvent.call(this, 'start');
};

var _onAdVideoFirstQuartile = function _onAdVideoFirstQuartile() {
  if (DEBUG) {
    _fw.default.log('VPAID AdVideoFirstQuartile event');
  }

  _helpers.default.createApiEvent.call(this, 'adfirstquartile');

  _helpers.default.dispatchPingEvent.call(this, 'firstQuartile');
};

var _onAdVideoMidpoint = function _onAdVideoMidpoint() {
  if (DEBUG) {
    _fw.default.log('VPAID AdVideoMidpoint event');
  }

  _helpers.default.createApiEvent.call(this, 'admidpoint');

  _helpers.default.dispatchPingEvent.call(this, 'midpoint');
};

var _onAdVideoThirdQuartile = function _onAdVideoThirdQuartile() {
  if (DEBUG) {
    _fw.default.log('VPAID AdVideoThirdQuartile event');
  }

  _helpers.default.createApiEvent.call(this, 'adthirdquartile');

  _helpers.default.dispatchPingEvent.call(this, 'thirdQuartile');
};

var _onAdVideoComplete = function _onAdVideoComplete() {
  if (DEBUG) {
    _fw.default.log('VPAID AdVideoComplete event');
  }

  _helpers.default.createApiEvent.call(this, 'adcomplete');

  _helpers.default.dispatchPingEvent.call(this, 'complete');
};

var _onAdClickThru = function _onAdClickThru(url, id, playerHandles) {
  if (DEBUG) {
    _fw.default.log('VPAID AdClickThru event');
  }

  _helpers.default.createApiEvent.call(this, 'adclick');

  _helpers.default.dispatchPingEvent.call(this, 'clickthrough');

  if (typeof playerHandles !== 'boolean') {
    return;
  }

  if (!playerHandles) {
    return;
  } else {
    var destUrl;

    if (url) {
      destUrl = url;
    } else if (this.clickThroughUrl) {
      destUrl = this.clickThroughUrl;
    }

    if (destUrl) {
      // for getClickThroughUrl API method
      this.clickThroughUrl = destUrl;

      _fw.default.openWindow(this.clickThroughUrl);
    }
  }
};

var _onAdPaused = function _onAdPaused() {
  if (DEBUG) {
    _fw.default.log('VPAID AdPaused event');
  }

  this.vpaidPaused = true;

  _helpers.default.createApiEvent.call(this, 'adpaused');

  _helpers.default.dispatchPingEvent.call(this, 'pause');
};

var _onAdPlaying = function _onAdPlaying() {
  if (DEBUG) {
    _fw.default.log('VPAID AdPlaying event');
  }

  this.vpaidPaused = false;

  _helpers.default.createApiEvent.call(this, 'adresumed');

  _helpers.default.dispatchPingEvent.call(this, 'resume');
};

var _onAdLog = function _onAdLog(message) {
  if (DEBUG) {
    _fw.default.log('VPAID AdLog event ' + message);
  }
};

var _onAdError = function _onAdError(message) {
  if (DEBUG) {
    _fw.default.log('VPAID AdError event ' + message);
  }

  _ping.default.error.call(this, 901);

  _vastErrors.default.process.call(this, 901);
};

var _onAdInteraction = function _onAdInteraction() {
  if (DEBUG) {
    _fw.default.log('VPAID AdInteraction event');
  }

  _helpers.default.createApiEvent.call(this, 'adinteraction');
};

var _onAdUserAcceptInvitation = function _onAdUserAcceptInvitation() {
  if (DEBUG) {
    _fw.default.log('VPAID AdUserAcceptInvitation event');
  }

  _helpers.default.createApiEvent.call(this, 'aduseracceptinvitation');

  _helpers.default.dispatchPingEvent.call(this, 'acceptInvitation');
};

var _onAdUserMinimize = function _onAdUserMinimize() {
  if (DEBUG) {
    _fw.default.log('VPAID AdUserMinimize event');
  }

  _helpers.default.createApiEvent.call(this, 'adcollapse');

  _helpers.default.dispatchPingEvent.call(this, 'collapse');
};

var _onAdUserClose = function _onAdUserClose() {
  if (DEBUG) {
    _fw.default.log('VPAID AdUserClose event');
  }

  _helpers.default.createApiEvent.call(this, 'adclose');

  _helpers.default.dispatchPingEvent.call(this, 'close');
};

var _onAdSizeChange = function _onAdSizeChange() {
  if (DEBUG) {
    _fw.default.log('VPAID AdSizeChange event');
  }

  _helpers.default.createApiEvent.call(this, 'adsizechange');
};

var _onAdLinearChange = function _onAdLinearChange() {
  if (DEBUG) {
    _fw.default.log('VPAID AdLinearChange event');
  }

  if (this.vpaidCreative && typeof this.vpaidCreative.getAdLinear === 'function') {
    this.adIsLinear = this.vpaidCreative.getAdLinear();

    _helpers.default.createApiEvent.call(this, 'adlinearchange');
  }
};

var _onAdExpandedChange = function _onAdExpandedChange() {
  if (DEBUG) {
    _fw.default.log('VPAID AdExpandedChange event');
  }

  _helpers.default.createApiEvent.call(this, 'adexpandedchange');
};

var _onAdRemainingTimeChange = function _onAdRemainingTimeChange() {
  if (DEBUG) {
    _fw.default.log('VPAID AdRemainingTimeChange event');
  }

  if (!this.vpaidCreative && typeof this.vpaidCreative.getAdRemainingTime === 'function') {
    var remainingTime = this.vpaidCreative.getAdRemainingTime();

    if (remainingTime >= 0) {
      this.vpaidRemainingTime = remainingTime;
    }
  }

  _helpers.default.createApiEvent.call(this, 'adremainingtimechange');
}; // vpaidCreative methods


VPAID.resizeAd = function (width, height, viewMode) {
  if (!this.vpaidCreative) {
    return;
  }

  if (!_fw.default.isNumber(width) || !_fw.default.isNumber(height) || typeof viewMode !== 'string') {
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
    _fw.default.log('VPAID resizeAd with width ' + width + ' - height ' + height + ' - viewMode ' + viewMode);
  }

  this.vpaidCreative.resizeAd(width, height, validViewMode);
};

VPAID.stopAd = function () {
  var _this2 = this;

  if (!this.vpaidCreative) {
    return;
  }

  if (DEBUG) {
    _fw.default.log('stopAd');
  } // when stopAd is called we need to check a 
  // AdStopped event follows


  this.adStoppedTimeout = setTimeout(function () {
    _onAdStopped.call(_this2);
  }, this.params.creativeLoadTimeout);
  this.vpaidCreative.stopAd();
};

VPAID.pauseAd = function () {
  if (DEBUG) {
    _fw.default.log('pauseAd');
  }

  if (this.vpaidCreative && !this.vpaidPaused) {
    this.vpaidCreative.pauseAd();
  }
};

VPAID.resumeAd = function () {
  if (DEBUG) {
    _fw.default.log('resumeAd');
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
  } // when skipAd is called we need to check a 
  // AdSkipped event follows


  this.adSkippedTimeout = setTimeout(function () {
    _onAdStopped.call(_this3);
  }, this.params.creativeLoadTimeout);
  this.vpaidCreative.skipAd();
};

VPAID.setAdVolume = function (volume) {
  if (this.vpaidCreative && _fw.default.isNumber(volume) && volume >= 0 && volume <= 1 && typeof this.vpaidCreative.setAdVolume === 'function') {
    this.vpaidCreative.setAdVolume(volume);
  }
};

var _setCallbacksForCreative = function _setCallbacksForCreative() {
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
  }; // Looping through the object and registering each of the callbacks with the creative

  var callbacksKeys = Object.keys(this.vpaidCallbacks);

  for (var i = 0, len = callbacksKeys.length; i < len; i++) {
    var currentKey = callbacksKeys[i];
    this.vpaidCreative.subscribe(this.vpaidCallbacks[currentKey], currentKey);
  }
};

var _unsetCallbacksForCreative = function _unsetCallbacksForCreative() {
  if (!this.vpaidCreative) {
    return;
  } // Looping through the object and registering each of the callbacks with the creative


  var callbacksKeys = Object.keys(this.vpaidCallbacks);

  for (var i = 0, len = callbacksKeys.length; i < len; i++) {
    var currentKey = callbacksKeys[i];
    this.vpaidCreative.unsubscribe(this.vpaidCallbacks[currentKey], currentKey);
  }
};

var _isValidVPAID = function _isValidVPAID(creative) {
  if (typeof creative.initAd === 'function' && typeof creative.startAd === 'function' && typeof creative.stopAd === 'function' && typeof creative.skipAd === 'function' && typeof creative.resizeAd === 'function' && typeof creative.pauseAd === 'function' && typeof creative.resumeAd === 'function' && typeof creative.expandAd === 'function' && typeof creative.collapseAd === 'function' && typeof creative.subscribe === 'function' && typeof creative.unsubscribe === 'function') {
    return true;
  }

  return false;
};

var _onVPAIDAvailable = function _onVPAIDAvailable() {
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
    var vpaidVersion;

    try {
      vpaidVersion = this.vpaidCreative.handshakeVersion('2.0');
    } catch (e) {
      _fw.default.trace(e);

      if (DEBUG) {
        _fw.default.log('could not validate VPAID ad unit handshakeVersion');
      }

      _ping.default.error.call(this, 901);

      _vastErrors.default.process.call(this, 901);

      return;
    }

    this.vpaidVersion = parseInt(vpaidVersion);

    if (this.vpaidVersion < 1) {
      if (DEBUG) {
        _fw.default.log('unsupported VPAID version - exit');
      }

      _ping.default.error.call(this, 901);

      _vastErrors.default.process.call(this, 901);

      return;
    }

    if (!_isValidVPAID(this.vpaidCreative)) {
      //The VPAID creative doesn't conform to the VPAID spec
      if (DEBUG) {
        _fw.default.log('VPAID creative does not conform to VPAID spec - exit');
      }

      _ping.default.error.call(this, 901);

      _vastErrors.default.process.call(this, 901);

      return;
    } // wire callback for VPAID events


    _setCallbacksForCreative.call(this); // wire tracking events for VAST pings


    _trackingEvents.default.wire.call(this);

    var creativeData = {};
    creativeData.AdParameters = this.adParametersData;

    if (DEBUG) {
      _fw.default.log('VPAID AdParameters follow');

      _fw.default.log(this.adParametersData);
    }

    _fw.default.show(this.adContainer);

    _fw.default.show(this.vastPlayer);

    var environmentVars = {}; // we create a new slot for VPAID creative - using adContainer can cause some VPAID to ill-render
    // from spec:
    // The 'environmentVars' object contains a reference, 'slot', to the HTML element
    // on the page in which the ad is to be rendered. The ad unit essentially gets
    // control of that element. 

    this.vpaidSlot = document.createElement('div');
    this.vpaidSlot.className = 'rmp-vpaid-container';
    this.adContainer.appendChild(this.vpaidSlot);
    environmentVars.slot = this.vpaidSlot;
    environmentVars.videoSlot = this.vastPlayer; // we assume we can autoplay (or at least muted autoplay) because this.vastPlayer 
    // has been init

    environmentVars.videoSlotCanAutoPlay = true; // when we call initAd we expect AdLoaded event to follow closely
    // if not we need to resume content

    this.initAdTimeout = setTimeout(function () {
      if (!_this4.vpaidAdLoaded) {
        if (DEBUG) {
          _fw.default.log('initAdTimeout');
        }

        _vastPlayer.default.resumeContent.call(_this4);
      }

      _this4.vpaidAdLoaded = false;
    }, this.params.creativeLoadTimeout * 10);

    if (DEBUG) {
      _fw.default.log('calling initAd on VPAID creative now');
    }

    this.vpaidCreative.initAd(this.initialWidth, this.initialHeight, this.initialViewMode, this.desiredBitrate, creativeData, environmentVars);
  }
};

var _onJSVPAIDLoaded = function _onJSVPAIDLoaded() {
  var _this5 = this;

  if (DEBUG) {
    _fw.default.log('VPAID JS loaded');
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

var _onJSVPAIDError = function _onJSVPAIDError() {
  if (DEBUG) {
    _fw.default.log('VPAID JS error loading');
  }

  this.vpaidScript.removeEventListener('error', this.onJSVPAIDError);

  _ping.default.error.call(this, 901);

  _vastErrors.default.process.call(this, 901);
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
        _vastErrors.default.process.call(this, 1004);

        return;
      }

      this.vastPlayer = existingVastPlayer;
    }
  } // create FiF 


  this.vpaidIframe = document.createElement('iframe');
  this.vpaidIframe.id = 'vpaid-frame'; // do not use display: none;
  // https://bugzilla.mozilla.org/show_bug.cgi?id=548397

  this.vpaidIframe.style.visibility = 'hidden';
  this.vpaidIframe.style.width = '0px';
  this.vpaidIframe.style.height = '0px';
  this.vpaidIframe.style.border = 'none'; // this is to adhere to Best Practices for Rich Media Ads 
  // in Asynchronous Ad Environments  http://www.iab.net/media/file/rich_media_ajax_best_practices.pdf

  var src = 'about:self'; // ... however this does not work in Firefox (onload is never reached)
  // https://bugzilla.mozilla.org/show_bug.cgi?id=444165
  // about:self also causes protocol mis-match issues with iframes in iOS/macOS Safari
  // ... TL;DR iframes are troubles

  if (_env.default.isFirefox || this.useContentPlayerForAds) {
    src = '';
  }

  this.vpaidIframe.onload = function () {
    var _this6 = this;

    if (DEBUG) {
      _fw.default.log('iframe.onload');
    } // we unwire listeners


    this.vpaidIframe.onload = this.vpaidIframe.onerror = _fw.default.nullFn;

    if (!this.vpaidIframe.contentWindow || !this.vpaidIframe.contentWindow.document || !this.vpaidIframe.contentWindow.document.body) {
      // PING error and resume content
      _ping.default.error.call(this, 901);

      _vastErrors.default.process.call(this, 901);

      return;
    }

    var iframeWindow = this.vpaidIframe.contentWindow;
    var iframeDocument = iframeWindow.document;
    var iframeBody = iframeDocument.body;
    this.vpaidScript = iframeDocument.createElement('script');
    this.vpaidLoadTimeout = setTimeout(function () {
      if (DEBUG) {
        _fw.default.log('could not load VPAID JS Creative or getVPAIDAd in iframeWindow - resume content');
      }

      _this6.vpaidScript.removeEventListener('load', _this6.onJSVPAIDLoaded);

      _this6.vpaidScript.removeEventListener('error', _this6.onJSVPAIDError);

      _vastPlayer.default.resumeContent.call(_this6);
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
      _fw.default.log('iframe.onerror');
    } // we unwire listeners


    this.vpaidIframe.onload = this.vpaidIframe.onerror = _fw.default.nullFn; // PING error and resume content

    _ping.default.error.call(this, 901);

    _vastErrors.default.process.call(this, 901);
  }.bind(this);

  this.vpaidIframe.src = src;
  this.adContainer.appendChild(this.vpaidIframe);
};

VPAID.destroy = function () {
  if (DEBUG) {
    _fw.default.log('destroy VPAID dependencies');
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
    _fw.default.removeElement(this.vpaidSlot);
  }

  if (this.vpaidIframe) {
    _fw.default.removeElement(this.vpaidIframe);
  }
};

var _default = VPAID;
exports.default = _default;

},{"../creatives/icons":3,"../fw/env":7,"../fw/fw":8,"../players/content-player":10,"../players/vast-player":11,"../tracking/ping":13,"../tracking/tracking-events":14,"../utils/helpers":16,"../utils/vast-errors":17,"core-js/modules/es.object.keys":133,"core-js/modules/es.parse-int":136}],13:[function(require,module,exports){
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.replace");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fw = _interopRequireDefault(require("../fw/fw"));

var _contentPlayer = _interopRequireDefault(require("../players/content-player"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var PING = {};
PING.events = ['impression', 'creativeView', 'start', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete', 'mute', 'unmute', 'pause', 'resume', 'fullscreen', 'exitFullscreen', 'skip', 'progress', 'clickthrough', 'close', 'collapse', 'acceptInvitation'];

var _replaceMacros = function _replaceMacros(url, errorCode, assetUri) {
  var pattern1 = /\[CACHEBUSTING\]/gi;
  var finalString = url;

  if (pattern1.test(finalString)) {
    finalString = finalString.replace(pattern1, _fw.default.generateCacheBusting());
  }

  var pattern2 = /\[ERRORCODE\]/gi;

  if (pattern2.test(finalString) && _fw.default.isNumber(errorCode) && errorCode > 0 && errorCode < 1000) {
    finalString = finalString.replace(pattern2, errorCode);
  }

  var pattern3 = /\[CONTENTPLAYHEAD\]/gi;

  var currentTime = _contentPlayer.default.getCurrentTime.call(this);

  if (pattern3.test(finalString) && currentTime > -1) {
    currentTime = _fw.default.vastReadableTime(currentTime);
    finalString = finalString.replace(pattern3, _fw.default.RFC3986EncodeURIComponent(currentTime));
  }

  var pattern4 = /\[ASSETURI\]/gi;

  if (pattern4.test(finalString) && typeof assetUri === 'string' && assetUri !== '') {
    finalString = finalString.replace(pattern4, _fw.default.RFC3986EncodeURIComponent(assetUri));
  }

  return finalString;
};

var _ping = function _ping(url) {
  // we expect an image format for the tracker (generally a 1px GIF/PNG/JPG) as 
  // this is the most common format in the industry 
  // other format may produce errors and the related tracker may not be requested properly
  var img = new Image();
  img.addEventListener('load', function () {
    if (DEBUG) {
      _fw.default.log('VAST tracker successfully loaded ' + url);
    }

    img = null;
  });
  img.addEventListener('error', function () {
    if (DEBUG) {
      _fw.default.log('VAST tracker failed loading ' + url);
    }

    img = null;
  });
  img.src = url;
};

PING.tracking = function (url, assetUri) {
  var trackingUrl = _replaceMacros.call(this, url, null, assetUri);

  _ping(trackingUrl);

  if (DEBUG) {
    _fw.default.log('VAST tracking requesting ping at URL ' + trackingUrl);
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
        _fw.default.log('VAST tracking requesting error at URL ' + errorUrl);
      }
    }
  }
};

var _default = PING;
exports.default = _default;

},{"../fw/fw":8,"../players/content-player":10,"core-js/modules/es.array.concat":124,"core-js/modules/es.array.from":126,"core-js/modules/es.array.iterator":128,"core-js/modules/es.object.to-string":134,"core-js/modules/es.regexp.to-string":138,"core-js/modules/es.string.iterator":139,"core-js/modules/es.string.replace":141,"core-js/modules/es.symbol":146,"core-js/modules/es.symbol.description":144,"core-js/modules/es.symbol.iterator":145,"core-js/modules/web.dom-collections.iterator":148}],14:[function(require,module,exports){
"use strict";

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.sort");

require("core-js/modules/web.dom-collections.for-each");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fw = _interopRequireDefault(require("../fw/fw"));

var _ping = _interopRequireDefault(require("./ping"));

var _helpers = _interopRequireDefault(require("../utils/helpers"));

var _vastPlayer = _interopRequireDefault(require("../players/vast-player"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TRACKINGEVENTS = {};

var _pingTrackers = function _pingTrackers(trackers) {
  var _this = this;

  trackers.forEach(function (element) {
    _ping.default.tracking.call(_this, element.url, _this.getAdMediaUrl());
  });
};

var _onEventPingTracking = function _onEventPingTracking(event) {
  if (event && event.type) {
    if (DEBUG) {
      _fw.default.log('ping tracking for ' + event.type + ' VAST event');
    } // filter trackers - may return multiple urls for same event as allowed by VAST spec


    var trackers = this.trackingTags.filter(function (value) {
      return event.type === value.event;
    }); // send ping for each valid tracker

    if (trackers.length > 0) {
      _pingTrackers.call(this, trackers);
    }
  }
};

var _onVolumeChange = function _onVolumeChange() {
  if (this.vastPlayer.muted || this.vastPlayer.volume === 0) {
    _helpers.default.createApiEvent.call(this, 'advolumemuted');

    _helpers.default.dispatchPingEvent.call(this, 'mute');

    this.vastPlayerMuted = true;
  } else {
    if (this.vastPlayerMuted) {
      _helpers.default.dispatchPingEvent.call(this, 'unmute');

      this.vastPlayerMuted = false;
    }
  }

  _helpers.default.createApiEvent.call(this, 'advolumechanged');
};

var _onTimeupdate = function _onTimeupdate() {
  var _this2 = this;

  this.vastPlayerCurrentTime = _vastPlayer.default.getCurrentTime.call(this);

  if (this.vastPlayerCurrentTime > 0) {
    if (this.vastPlayerDuration > 0 && this.vastPlayerDuration > this.vastPlayerCurrentTime) {
      if (this.vastPlayerCurrentTime >= this.vastPlayerDuration * 0.25 && !this.firstQuartileEventFired) {
        this.firstQuartileEventFired = true;

        _helpers.default.createApiEvent.call(this, 'adfirstquartile');

        _helpers.default.dispatchPingEvent.call(this, 'firstQuartile');
      } else if (this.vastPlayerCurrentTime >= this.vastPlayerDuration * 0.5 && !this.midpointEventFired) {
        this.midpointEventFired = true;

        _helpers.default.createApiEvent.call(this, 'admidpoint');

        _helpers.default.dispatchPingEvent.call(this, 'midpoint');
      } else if (this.vastPlayerCurrentTime >= this.vastPlayerDuration * 0.75 && !this.thirdQuartileEventFired) {
        this.thirdQuartileEventFired = true;

        _helpers.default.createApiEvent.call(this, 'adthirdquartile');

        _helpers.default.dispatchPingEvent.call(this, 'thirdQuartile');
      }
    }

    if (this.isSkippableAd) {
      // progress event for skippable ads
      if (this.progressEventOffsetsSeconds === null) {
        this.progressEventOffsetsSeconds = [];
        this.progressEventOffsets.forEach(function (element) {
          _this2.progressEventOffsetsSeconds.push({
            offsetSeconds: _fw.default.convertOffsetToSeconds(element, _this2.vastPlayerDuration),
            offsetRaw: element
          });
        });
        this.progressEventOffsetsSeconds.sort(function (a, b) {
          return a.offsetSeconds - b.offsetSeconds;
        });
      }

      if (Array.isArray(this.progressEventOffsetsSeconds) && this.progressEventOffsetsSeconds.length > 0 && this.vastPlayerCurrentTime >= this.progressEventOffsetsSeconds[0].offsetSeconds * 1000) {
        _helpers.default.dispatchPingEvent.call(this, 'progress-' + this.progressEventOffsetsSeconds[0].offsetRaw);

        this.progressEventOffsetsSeconds.shift();
      }
    }
  }
};

var _onPause = function _onPause() {
  if (!this.vastPlayerPaused) {
    this.vastPlayerPaused = true;

    _helpers.default.createApiEvent.call(this, 'adpaused'); // do not dispatchPingEvent for pause event here if it is already in this.trackingTags


    for (var i = 0, len = this.trackingTags.length; i < len; i++) {
      if (this.trackingTags[i].event === 'pause') {
        return;
      }
    }

    _helpers.default.dispatchPingEvent.call(this, 'pause');
  }
};

var _onPlay = function _onPlay() {
  if (this.vastPlayerPaused) {
    this.vastPlayerPaused = false;

    _helpers.default.createApiEvent.call(this, 'adresumed');

    _helpers.default.dispatchPingEvent.call(this, 'resume');
  }
};

var _onPlaying = function _onPlaying() {
  this.vastPlayer.removeEventListener('playing', this.onPlaying);

  _helpers.default.createApiEvent.call(this, 'adimpression');

  _helpers.default.createApiEvent.call(this, 'adstarted');

  _helpers.default.dispatchPingEvent.call(this, ['impression', 'creativeView', 'start']);
};

var _onEnded = function _onEnded() {
  this.vastPlayer.removeEventListener('ended', this.onEnded);

  _helpers.default.createApiEvent.call(this, 'adcomplete');

  _helpers.default.dispatchPingEvent.call(this, 'complete');

  _vastPlayer.default.resumeContent.call(this);
};

TRACKINGEVENTS.wire = function () {
  if (DEBUG) {
    _fw.default.log('wire tracking events');
  } // we filter through all HTML5 video events and create new VAST events 
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
  } // wire for VAST tracking events


  this.onEventPingTracking = _onEventPingTracking.bind(this);

  if (DEBUG) {
    _fw.default.log('detected VAST events follow');

    _fw.default.log(this.trackingTags);
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
  var trackingTags = trackingEvents[0].getElementsByTagName('Tracking'); // in case we are in a pod

  if (this.adPodWrapperTrackings.length > 0) {
    this.trackingTags = this.adPodWrapperTrackings;
  } // collect supported tracking events with valid event names and tracking urls


  for (var i = 0, len = trackingTags.length; i < len; i++) {
    var event = trackingTags[i].getAttribute('event');

    var url = _fw.default.getNodeValue(trackingTags[i], true);

    if (event !== null && event !== '' && _ping.default.events.indexOf(event) > -1 && url !== null) {
      if (this.isSkippableAd) {
        if (event === 'progress') {
          var offset = trackingTags[i].getAttribute('offset');

          if (offset === null || offset === '' || !_fw.default.isValidOffset(offset)) {
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

      this.trackingTags.push({
        event: event,
        url: url
      });
    }
  }
};

var _default = TRACKINGEVENTS;
exports.default = _default;

},{"../fw/fw":8,"../players/vast-player":11,"../utils/helpers":16,"./ping":13,"core-js/modules/es.array.filter":125,"core-js/modules/es.array.index-of":127,"core-js/modules/es.array.sort":129,"core-js/modules/web.dom-collections.for-each":147}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fw = _interopRequireDefault(require("../fw/fw"));

var _env = _interopRequireDefault(require("../fw/env"));

var _helpers = _interopRequireDefault(require("./helpers"));

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
  this.params = {}; // adpod 

  this.adPod = [];
  this.standaloneAdsInPod = [];
  this.onAdDestroyLoadNextAdInPod = _fw.default.nullFn;
  this.runningAdPod = false;
  this.adPodItemWrapper = false;
  this.adPodCurrentIndex = 0;
  this.adPodApiInfo = [];
  this.adPodWrapperTrackings = []; // on iOS and macOS Safari we use content player to play ads
  // to avoid issues related to fullscreen management and autoplay
  // as fullscreen on iOS is handled by the default OS player

  if (_env.default.isIos[0] || _env.default.isMacOSX && _env.default.isSafari[0]) {
    this.useContentPlayerForAds = true;

    if (DEBUG) {
      _fw.default.log('vast player will be content player');
    }
  }
};

DEFAULT.loadAdsVariables = function () {
  // init internal methods 
  this.onLoadedmetadataPlay = null;
  this.onPlaybackError = null; // init internal tracking events methods

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
  this.onContextMenu = null; // init internal variables

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
  this.creativeLoadTimeoutCallback = null; // skip

  this.isSkippableAd = false;
  this.hasSkipEvent = false;
  this.skipoffset = '';
  this.progressEventOffsets = [];
  this.progressEventOffsetsSeconds = null;
  this.skipButton = null;
  this.skipWaiting = null;
  this.skipMessage = null;
  this.skipIcon = null;
  this.skippableAdCanBeSkipped = false; // non linear

  this.nonLinearContainer = null;
  this.nonLinearATag = null;
  this.nonLinearImg = null;
  this.onClickCloseNonLinear = null;
  this.nonLinearCreativeHeight = 0;
  this.nonLinearCreativeWidth = 0;
  this.nonLinearContentType = '';
  this.nonLinearMinSuggestedDuration = 0; // VPAID

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
  this.onJSVPAIDLoaded = _fw.default.nullFn;
  this.onJSVPAIDError = _fw.default.nullFn;
};

DEFAULT.fullscreen = function () {
  // attach fullscreen states
  // this assumes we have a polyfill for fullscreenchange event 
  // see app/js/app.js
  // we need this to handle VAST fullscreen events
  var isInFullscreen = false;

  var _onFullscreenchange = function _onFullscreenchange(event) {
    if (event && event.type) {
      if (DEBUG) {
        _fw.default.log('event is ' + event.type);
      }

      if (event.type === 'fullscreenchange') {
        if (isInFullscreen) {
          isInFullscreen = false;

          if (this.adOnStage && this.adIsLinear) {
            _helpers.default.dispatchPingEvent.call(this, 'exitFullscreen');
          }
        } else {
          isInFullscreen = true;

          if (this.adOnStage && this.adIsLinear) {
            _helpers.default.dispatchPingEvent.call(this, 'fullscreen');
          }
        }
      } else if (event.type === 'webkitbeginfullscreen') {
        // iOS uses webkitbeginfullscreen
        if (this.adOnStage && this.adIsLinear) {
          _helpers.default.dispatchPingEvent.call(this, 'fullscreen');
        }
      } else if (event.type === 'webkitendfullscreen') {
        // iOS uses webkitendfullscreen
        if (this.adOnStage && this.adIsLinear) {
          _helpers.default.dispatchPingEvent.call(this, 'exitFullscreen');
        }
      }
    }
  }; // if we have native fullscreen support we handle fullscreen events


  if (_env.default.hasNativeFullscreenSupport) {
    var onFullscreenchange = _onFullscreenchange.bind(this); // for our beloved iOS 


    if (_env.default.isIos[0]) {
      this.contentPlayer.addEventListener('webkitbeginfullscreen', onFullscreenchange);
      this.contentPlayer.addEventListener('webkitendfullscreen', onFullscreenchange);
    } else {
      document.addEventListener('fullscreenchange', onFullscreenchange);
    }
  }
};

var _default = DEFAULT;
exports.default = _default;

},{"../fw/env":7,"../fw/fw":8,"./helpers":16}],16:[function(require,module,exports){
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fw = _interopRequireDefault(require("../fw/fw"));

var _vastErrors = _interopRequireDefault(require("./vast-errors"));

var _ping = _interopRequireDefault(require("../tracking/ping"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

  if (_fw.default.isObject(inputParams)) {
    var keys = Object.keys(inputParams);

    for (var i = 0, len = keys.length; i < len; i++) {
      var prop = keys[i];

      if (_typeof(inputParams[prop]) === _typeof(this.params[prop])) {
        if (_fw.default.isNumber(inputParams[prop]) && inputParams[prop] > 0 || typeof inputParams[prop] !== 'number') {
          if (prop === 'vpaidSettings') {
            if (_fw.default.isNumber(inputParams.vpaidSettings.width) && inputParams.vpaidSettings.width > 0) {
              this.params.vpaidSettings.width = inputParams.vpaidSettings.width;
            }

            if (_fw.default.isNumber(inputParams.vpaidSettings.height) && inputParams.vpaidSettings.height > 0) {
              this.params.vpaidSettings.height = inputParams.vpaidSettings.height;
            }

            if (typeof inputParams.vpaidSettings.viewMode === 'string' && inputParams.vpaidSettings.viewMode === 'fullscreen') {
              this.params.vpaidSettings.viewMode = inputParams.vpaidSettings.viewMode;
            }

            if (_fw.default.isNumber(inputParams.vpaidSettings.desiredBitrate) && inputParams.vpaidSettings.desiredBitrate > 0) {
              this.params.vpaidSettings.desiredBitrate = inputParams.vpaidSettings.desiredBitrate;
            }
          } else {
            this.params[prop] = inputParams[prop];
          }
        }
      }
    } // we need to avoid infinite wrapper loops scenario 
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
    _fw.default.createStdEvent(event, this.container);
  }
};

HELPERS.dispatchPingEvent = function (event) {
  if (event) {
    var element;

    if (this.adIsLinear && this.vastPlayer) {
      element = this.vastPlayer;
    } else if (!this.adIsLinear && this.nonLinearContainer) {
      element = this.nonLinearContainer;
    }

    if (element) {
      if (Array.isArray(event)) {
        event.forEach(function (currentEvent) {
          _fw.default.createStdEvent(currentEvent, element);
        });
      } else {
        _fw.default.createStdEvent(event, element);
      }
    }
  }
};

HELPERS.playPromise = function (whichPlayer, firstPlayerPlayRequest) {
  var _this = this;

  var targetPlayer;

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
    var playPromise = targetPlayer.play(); // most modern browsers support play as a Promise
    // this lets us handle autoplay rejection 
    // https://developers.google.com/web/updates/2016/03/play-returns-promise

    if (playPromise !== undefined) {
      playPromise.then(function () {
        if (firstPlayerPlayRequest) {
          if (DEBUG) {
            _fw.default.log('initial play promise on ' + whichPlayer + ' player has succeeded');
          }

          HELPERS.createApiEvent.call(_this, 'adinitialplayrequestsucceeded');
        }
      }).catch(function (e) {
        if (firstPlayerPlayRequest && whichPlayer === 'vast' && _this.adIsLinear) {
          if (DEBUG) {
            _fw.default.log(e);

            _fw.default.log('initial play promise on VAST player has been rejected for linear asset - likely autoplay is being blocked');
          }

          _ping.default.error.call(_this, 400);

          _vastErrors.default.process.call(_this, 400);

          HELPERS.createApiEvent.call(_this, 'adinitialplayrequestfailed');
        } else if (firstPlayerPlayRequest && whichPlayer === 'content' && !_this.adIsLinear) {
          if (DEBUG) {
            _fw.default.log(e);

            _fw.default.log('initial play promise on content player has been rejected for non-linear asset - likely autoplay is being blocked');
          }

          HELPERS.createApiEvent.call(_this, 'adinitialplayrequestfailed');
        } else {
          if (DEBUG) {
            _fw.default.log(e);

            _fw.default.log('playPromise on ' + whichPlayer + ' player has been rejected');
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
    var code = event.which; // 13 = Return, 32 = Space

    if (code === 13 || code === 32) {
      event.stopPropagation();
      event.preventDefault();

      _fw.default.createStdEvent('click', element);
    }
  });

  if (ariaLabel) {
    element.setAttribute('aria-label', ariaLabel);
  }
};

var _default = HELPERS;
exports.default = _default;

},{"../fw/fw":8,"../tracking/ping":13,"./vast-errors":17,"core-js/modules/es.array.iterator":128,"core-js/modules/es.object.keys":133,"core-js/modules/es.object.to-string":134,"core-js/modules/es.string.iterator":139,"core-js/modules/es.symbol":146,"core-js/modules/es.symbol.description":144,"core-js/modules/es.symbol.iterator":145,"core-js/modules/web.dom-collections.for-each":147,"core-js/modules/web.dom-collections.iterator":148}],17:[function(require,module,exports){
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.index-of");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fw = _interopRequireDefault(require("../fw/fw"));

var _helpers = _interopRequireDefault(require("../utils/helpers"));

var _vastPlayer = _interopRequireDefault(require("../players/vast-player"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VASTERRORS = {}; // Indicates that the error was encountered when the ad was being loaded. 
// Possible causes: there was no response from the ad server, malformed ad response was returned ...

var loadErrorList = [100, 101, 102, 300, 301, 302, 303, 900, 1000, 1001]; // Indicates that the error was encountered after the ad loaded, during ad play. 
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

var _updateVastError = function _updateVastError(errorCode) {
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
    _fw.default.log('VAST error code is ' + this.vastErrorCode);

    _fw.default.log('VAST error message is ' + this.vastErrorMessage);

    _fw.default.log('Ad error type is ' + this.adErrorType);
  }
};

VASTERRORS.process = function (errorCode) {
  _updateVastError.call(this, errorCode);

  _helpers.default.createApiEvent.call(this, 'aderror');

  _vastPlayer.default.resumeContent.call(this);
};

var _default = VASTERRORS;
exports.default = _default;

},{"../fw/fw":8,"../players/vast-player":11,"../utils/helpers":16,"core-js/modules/es.array.filter":125,"core-js/modules/es.array.index-of":127,"core-js/modules/es.symbol":146,"core-js/modules/es.symbol.description":144}],18:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

},{}],19:[function(require,module,exports){
var UNSCOPABLES = require('../internals/well-known-symbol')('unscopables');
var create = require('../internals/object-create');
var hide = require('../internals/hide');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  hide(ArrayPrototype, UNSCOPABLES, create(null));
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

},{"../internals/hide":56,"../internals/object-create":77,"../internals/well-known-symbol":121}],20:[function(require,module,exports){
'use strict';
var codePointAt = require('../internals/string-at');

// `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? codePointAt(S, index, true).length : 1);
};

},{"../internals/string-at":109}],21:[function(require,module,exports){
module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

},{}],22:[function(require,module,exports){
var isObject = require('../internals/is-object');

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

},{"../internals/is-object":66}],23:[function(require,module,exports){
'use strict';
var nativeForEach = [].forEach;
var internalForEach = require('../internals/array-methods')(0);

var SLOPPY_METHOD = require('../internals/sloppy-array-method')('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
module.exports = SLOPPY_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return internalForEach(this, callbackfn, arguments[1]);
} : nativeForEach;

},{"../internals/array-methods":27,"../internals/sloppy-array-method":107}],24:[function(require,module,exports){
'use strict';
var bind = require('../internals/bind-context');
var toObject = require('../internals/to-object');
var callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var toLength = require('../internals/to-length');
var createProperty = require('../internals/create-property');
var getIteratorMethod = require('../internals/get-iterator-method');

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var index = 0;
  var iteratorMethod = getIteratorMethod(O);
  var length, result, step, iterator;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    result = new C();
    for (;!(step = iterator.next()).done; index++) {
      createProperty(result, index, mapping
        ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true)
        : step.value
      );
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
    }
  }
  result.length = index;
  return result;
};

},{"../internals/bind-context":29,"../internals/call-with-safe-iteration-closing":30,"../internals/create-property":38,"../internals/get-iterator-method":52,"../internals/is-array-iterator-method":63,"../internals/to-length":115,"../internals/to-object":116}],25:[function(require,module,exports){
var toIndexedObject = require('../internals/to-indexed-object');
var toLength = require('../internals/to-length');
var toAbsoluteIndex = require('../internals/to-absolute-index');

// `Array.prototype.{ indexOf, includes }` methods implementation
// false -> Array#indexOf
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
// true  -> Array#includes
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
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

},{"../internals/to-absolute-index":112,"../internals/to-indexed-object":113,"../internals/to-length":115}],26:[function(require,module,exports){
var fails = require('../internals/fails');
var SPECIES = require('../internals/well-known-symbol')('species');

module.exports = function (METHOD_NAME) {
  return !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

},{"../internals/fails":47,"../internals/well-known-symbol":121}],27:[function(require,module,exports){
var bind = require('../internals/bind-context');
var IndexedObject = require('../internals/indexed-object');
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var arraySpeciesCreate = require('../internals/array-species-create');

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
// 0 -> Array#forEach
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
// 1 -> Array#map
// https://tc39.github.io/ecma262/#sec-array.prototype.map
// 2 -> Array#filter
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// 3 -> Array#some
// https://tc39.github.io/ecma262/#sec-array.prototype.some
// 4 -> Array#every
// https://tc39.github.io/ecma262/#sec-array.prototype.every
// 5 -> Array#find
// https://tc39.github.io/ecma262/#sec-array.prototype.find
// 6 -> Array#findIndex
// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
module.exports = function (TYPE, specificCreate) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = specificCreate || arraySpeciesCreate;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: target.push(value);       // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

},{"../internals/array-species-create":28,"../internals/bind-context":29,"../internals/indexed-object":60,"../internals/to-length":115,"../internals/to-object":116}],28:[function(require,module,exports){
var isObject = require('../internals/is-object');
var isArray = require('../internals/is-array');
var SPECIES = require('../internals/well-known-symbol')('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

},{"../internals/is-array":64,"../internals/is-object":66,"../internals/well-known-symbol":121}],29:[function(require,module,exports){
var aFunction = require('../internals/a-function');

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
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

},{"../internals/a-function":18}],30:[function(require,module,exports){
var anObject = require('../internals/an-object');

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};

},{"../internals/an-object":22}],31:[function(require,module,exports){
var ITERATOR = require('../internals/well-known-symbol')('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

},{"../internals/well-known-symbol":121}],32:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],33:[function(require,module,exports){
var classofRaw = require('../internals/classof-raw');
var TO_STRING_TAG = require('../internals/well-known-symbol')('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

},{"../internals/classof-raw":32,"../internals/well-known-symbol":121}],34:[function(require,module,exports){
var has = require('../internals/has');
var ownKeys = require('../internals/own-keys');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

},{"../internals/has":54,"../internals/object-define-property":79,"../internals/object-get-own-property-descriptor":80,"../internals/own-keys":90}],35:[function(require,module,exports){
module.exports = !require('../internals/fails')(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

},{"../internals/fails":47}],36:[function(require,module,exports){
'use strict';
var IteratorPrototype = require('../internals/iterators-core').IteratorPrototype;
var create = require('../internals/object-create');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var setToStringTag = require('../internals/set-to-string-tag');
var Iterators = require('../internals/iterators');

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};

},{"../internals/create-property-descriptor":37,"../internals/iterators":71,"../internals/iterators-core":70,"../internals/object-create":77,"../internals/set-to-string-tag":104}],37:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],38:[function(require,module,exports){
'use strict';
var toPrimitive = require('../internals/to-primitive');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

},{"../internals/create-property-descriptor":37,"../internals/object-define-property":79,"../internals/to-primitive":117}],39:[function(require,module,exports){
'use strict';
var $export = require('../internals/export');
var createIteratorConstructor = require('../internals/create-iterator-constructor');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var setToStringTag = require('../internals/set-to-string-tag');
var hide = require('../internals/hide');
var redefine = require('../internals/redefine');
var IS_PURE = require('../internals/is-pure');
var ITERATOR = require('../internals/well-known-symbol')('iterator');
var Iterators = require('../internals/iterators');
var IteratorsCore = require('../internals/iterators-core');
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          hide(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    hide(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};

},{"../internals/create-iterator-constructor":36,"../internals/export":46,"../internals/hide":56,"../internals/is-pure":67,"../internals/iterators":71,"../internals/iterators-core":70,"../internals/object-get-prototype-of":84,"../internals/object-set-prototype-of":88,"../internals/redefine":97,"../internals/set-to-string-tag":104,"../internals/well-known-symbol":121}],40:[function(require,module,exports){
var path = require('../internals/path');
var has = require('../internals/has');
var wrappedWellKnownSymbolModule = require('../internals/wrapped-well-known-symbol');
var defineProperty = require('../internals/object-define-property').f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};

},{"../internals/has":54,"../internals/object-define-property":79,"../internals/path":93,"../internals/wrapped-well-known-symbol":123}],41:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('../internals/fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"../internals/fails":47}],42:[function(require,module,exports){
var isObject = require('../internals/is-object');
var document = require('../internals/global').document;
// typeof document.createElement is 'object' in old IE
var exist = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return exist ? document.createElement(it) : {};
};

},{"../internals/global":53,"../internals/is-object":66}],43:[function(require,module,exports){
// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

},{}],44:[function(require,module,exports){
// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

},{}],45:[function(require,module,exports){
var objectKeys = require('../internals/object-keys');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');

// all enumerable object keys, includes symbols
module.exports = function (it) {
  var result = objectKeys(it);
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  if (getOwnPropertySymbols) {
    var symbols = getOwnPropertySymbols(it);
    var propertyIsEnumerable = propertyIsEnumerableModule.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (propertyIsEnumerable.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"../internals/object-get-own-property-symbols":83,"../internals/object-keys":86,"../internals/object-property-is-enumerable":87}],46:[function(require,module,exports){
var global = require('../internals/global');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var hide = require('../internals/hide');
var redefine = require('../internals/redefine');
var setGlobal = require('../internals/set-global');
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var isForced = require('../internals/is-forced');

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      hide(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

},{"../internals/copy-constructor-properties":34,"../internals/global":53,"../internals/hide":56,"../internals/is-forced":65,"../internals/object-get-own-property-descriptor":80,"../internals/redefine":97,"../internals/set-global":102}],47:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

},{}],48:[function(require,module,exports){
'use strict';
var hide = require('../internals/hide');
var redefine = require('../internals/redefine');
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var regexpExec = require('../internals/regexp-exec');

var SPECIES = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

module.exports = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };

    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
    if (sham) hide(RegExp.prototype[SYMBOL], 'sham', true);
  }
};

},{"../internals/fails":47,"../internals/hide":56,"../internals/redefine":97,"../internals/regexp-exec":99,"../internals/well-known-symbol":121}],49:[function(require,module,exports){
var fails = require('../internals/fails');
var whitespaces = require('../internals/whitespaces');
var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
module.exports = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};

},{"../internals/fails":47,"../internals/whitespaces":122}],50:[function(require,module,exports){
module.exports = require('../internals/shared')('native-function-to-string', Function.toString);

},{"../internals/shared":106}],51:[function(require,module,exports){
var path = require('../internals/path');
var global = require('../internals/global');

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};

},{"../internals/global":53,"../internals/path":93}],52:[function(require,module,exports){
var classof = require('../internals/classof');
var ITERATOR = require('../internals/well-known-symbol')('iterator');
var Iterators = require('../internals/iterators');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"../internals/classof":33,"../internals/iterators":71,"../internals/well-known-symbol":121}],53:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports = typeof window == 'object' && window && window.Math == Math ? window
  : typeof self == 'object' && self && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();

},{}],54:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],55:[function(require,module,exports){
module.exports = {};

},{}],56:[function(require,module,exports){
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = require('../internals/descriptors') ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"../internals/create-property-descriptor":37,"../internals/descriptors":41,"../internals/object-define-property":79}],57:[function(require,module,exports){
var global = require('../internals/global');

module.exports = function (a, b) {
  var console = global.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};

},{"../internals/global":53}],58:[function(require,module,exports){
var document = require('../internals/global').document;

module.exports = document && document.documentElement;

},{"../internals/global":53}],59:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('../internals/descriptors') && !require('../internals/fails')(function () {
  return Object.defineProperty(require('../internals/document-create-element')('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

},{"../internals/descriptors":41,"../internals/document-create-element":42,"../internals/fails":47}],60:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var fails = require('../internals/fails');
var classof = require('../internals/classof-raw');
var split = ''.split;

module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

},{"../internals/classof-raw":32,"../internals/fails":47}],61:[function(require,module,exports){
var isObject = require('../internals/is-object');
var setPrototypeOf = require('../internals/object-set-prototype-of');

module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"../internals/is-object":66,"../internals/object-set-prototype-of":88}],62:[function(require,module,exports){
var NATIVE_WEAK_MAP = require('../internals/native-weak-map');
var isObject = require('../internals/is-object');
var hide = require('../internals/hide');
var objectHas = require('../internals/has');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');
var WeakMap = require('../internals/global').WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP) {
  var store = new WeakMap();
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    hide(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

},{"../internals/global":53,"../internals/has":54,"../internals/hidden-keys":55,"../internals/hide":56,"../internals/is-object":66,"../internals/native-weak-map":74,"../internals/shared-key":105}],63:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('../internals/iterators');
var ITERATOR = require('../internals/well-known-symbol')('iterator');
var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};

},{"../internals/iterators":71,"../internals/well-known-symbol":121}],64:[function(require,module,exports){
var classof = require('../internals/classof-raw');

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};

},{"../internals/classof-raw":32}],65:[function(require,module,exports){
var fails = require('../internals/fails');
var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;

},{"../internals/fails":47}],66:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],67:[function(require,module,exports){
module.exports = false;

},{}],68:[function(require,module,exports){
var isObject = require('../internals/is-object');
var classof = require('../internals/classof-raw');
var MATCH = require('../internals/well-known-symbol')('match');

// `IsRegExp` abstract operation
// https://tc39.github.io/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};

},{"../internals/classof-raw":32,"../internals/is-object":66,"../internals/well-known-symbol":121}],69:[function(require,module,exports){
var anObject = require('../internals/an-object');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var toLength = require('../internals/to-length');
var bind = require('../internals/bind-context');
var getIteratorMethod = require('../internals/get-iterator-method');
var callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing');
var BREAK = {};

var exports = module.exports = function (iterable, fn, that, ENTRIES, ITERATOR) {
  var boundFunction = bind(fn, that, ENTRIES ? 2 : 1);
  var iterator, iterFn, index, length, result, step;

  if (ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = ENTRIES ? boundFunction(anObject(step = iterable[index])[0], step[1]) : boundFunction(iterable[index]);
        if (result === BREAK) return BREAK;
      } return;
    }
    iterator = iterFn.call(iterable);
  }

  while (!(step = iterator.next()).done) {
    if (callWithSafeIterationClosing(iterator, boundFunction, step.value, ENTRIES) === BREAK) return BREAK;
  }
};

exports.BREAK = BREAK;

},{"../internals/an-object":22,"../internals/bind-context":29,"../internals/call-with-safe-iteration-closing":30,"../internals/get-iterator-method":52,"../internals/is-array-iterator-method":63,"../internals/to-length":115}],70:[function(require,module,exports){
'use strict';
var getPrototypeOf = require('../internals/object-get-prototype-of');
var hide = require('../internals/hide');
var has = require('../internals/has');
var IS_PURE = require('../internals/is-pure');
var ITERATOR = require('../internals/well-known-symbol')('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

},{"../internals/has":54,"../internals/hide":56,"../internals/is-pure":67,"../internals/object-get-prototype-of":84,"../internals/well-known-symbol":121}],71:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"dup":55}],72:[function(require,module,exports){
var global = require('../internals/global');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var classof = require('../internals/classof-raw');
var macrotask = require('../internals/task').set;
var userAgent = require('../internals/user-agent');
var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var IS_NODE = classof(process) == 'process';
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  } else if (MutationObserver && !/(iPhone|iPod|iPad).*AppleWebKit/i.test(userAgent)) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
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
}

module.exports = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};

},{"../internals/classof-raw":32,"../internals/global":53,"../internals/object-get-own-property-descriptor":80,"../internals/task":111,"../internals/user-agent":119}],73:[function(require,module,exports){
// Chrome 38 Symbol has incorrect toString conversion
module.exports = !require('../internals/fails')(function () {
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});

},{"../internals/fails":47}],74:[function(require,module,exports){
var nativeFunctionToString = require('../internals/function-to-string');
var WeakMap = require('../internals/global').WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(nativeFunctionToString.call(WeakMap));

},{"../internals/function-to-string":50,"../internals/global":53}],75:[function(require,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('../internals/a-function');

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"../internals/a-function":18}],76:[function(require,module,exports){
var globalIsFinite = require('../internals/global').isFinite;

// `Number.isFinite` method
// https://tc39.github.io/ecma262/#sec-number.isfinite
module.exports = Number.isFinite || function isFinite(it) {
  return typeof it == 'number' && globalIsFinite(it);
};

},{"../internals/global":53}],77:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('../internals/an-object');
var defineProperties = require('../internals/object-define-properties');
var enumBugKeys = require('../internals/enum-bug-keys');
var html = require('../internals/html');
var documentCreateElement = require('../internals/document-create-element');
var IE_PROTO = require('../internals/shared-key')('IE_PROTO');
var PROTOTYPE = 'prototype';
var Empty = function () { /* empty */ };

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var length = enumBugKeys.length;
  var lt = '<';
  var script = 'script';
  var gt = '>';
  var js = 'java' + script + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = String(js);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
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
  return Properties === undefined ? result : defineProperties(result, Properties);
};

require('../internals/hidden-keys')[IE_PROTO] = true;

},{"../internals/an-object":22,"../internals/document-create-element":42,"../internals/enum-bug-keys":44,"../internals/hidden-keys":55,"../internals/html":58,"../internals/object-define-properties":78,"../internals/shared-key":105}],78:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var definePropertyModule = require('../internals/object-define-property');
var anObject = require('../internals/an-object');
var objectKeys = require('../internals/object-keys');

module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var key;
  while (length > i) definePropertyModule.f(O, key = keys[i++], Properties[key]);
  return O;
};

},{"../internals/an-object":22,"../internals/descriptors":41,"../internals/object-define-property":79,"../internals/object-keys":86}],79:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');
var anObject = require('../internals/an-object');
var toPrimitive = require('../internals/to-primitive');
var nativeDefineProperty = Object.defineProperty;

exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"../internals/an-object":22,"../internals/descriptors":41,"../internals/ie8-dom-define":59,"../internals/to-primitive":117}],80:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var toIndexedObject = require('../internals/to-indexed-object');
var toPrimitive = require('../internals/to-primitive');
var has = require('../internals/has');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');
var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};

},{"../internals/create-property-descriptor":37,"../internals/descriptors":41,"../internals/has":54,"../internals/ie8-dom-define":59,"../internals/object-property-is-enumerable":87,"../internals/to-indexed-object":113,"../internals/to-primitive":117}],81:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIndexedObject = require('../internals/to-indexed-object');
var nativeGetOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return nativeGetOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]'
    ? getWindowNames(it)
    : nativeGetOwnPropertyNames(toIndexedObject(it));
};

},{"../internals/object-get-own-property-names":82,"../internals/to-indexed-object":113}],82:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var internalObjectKeys = require('../internals/object-keys-internal');
var hiddenKeys = require('../internals/enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

},{"../internals/enum-bug-keys":44,"../internals/object-keys-internal":85}],83:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],84:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('../internals/has');
var toObject = require('../internals/to-object');
var IE_PROTO = require('../internals/shared-key')('IE_PROTO');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');
var ObjectPrototype = Object.prototype;

module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};

},{"../internals/correct-prototype-getter":35,"../internals/has":54,"../internals/shared-key":105,"../internals/to-object":116}],85:[function(require,module,exports){
var has = require('../internals/has');
var toIndexedObject = require('../internals/to-indexed-object');
var arrayIndexOf = require('../internals/array-includes')(false);
var hiddenKeys = require('../internals/hidden-keys');

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"../internals/array-includes":25,"../internals/has":54,"../internals/hidden-keys":55,"../internals/to-indexed-object":113}],86:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

},{"../internals/enum-bug-keys":44,"../internals/object-keys-internal":85}],87:[function(require,module,exports){
'use strict';
var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = nativeGetOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = nativeGetOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;

},{}],88:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var validateSetPrototypeOfArguments = require('../internals/validate-set-prototype-of-arguments');

module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var correctSetter = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    correctSetter = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    validateSetPrototypeOfArguments(O, proto);
    if (correctSetter) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

},{"../internals/validate-set-prototype-of-arguments":120}],89:[function(require,module,exports){
'use strict';
var classof = require('../internals/classof');
var TO_STRING_TAG = require('../internals/well-known-symbol')('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
module.exports = String(test) !== '[object z]' ? function toString() {
  return '[object ' + classof(this) + ']';
} : test.toString;

},{"../internals/classof":33,"../internals/well-known-symbol":121}],90:[function(require,module,exports){
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var anObject = require('../internals/an-object');
var Reflect = require('../internals/global').Reflect;

// all object keys, includes non-enumerable and symbols
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

},{"../internals/an-object":22,"../internals/global":53,"../internals/object-get-own-property-names":82,"../internals/object-get-own-property-symbols":83}],91:[function(require,module,exports){
var nativeParseFloat = require('../internals/global').parseFloat;
var internalStringTrim = require('../internals/string-trim');
var whitespaces = require('../internals/whitespaces');
var FORCED = 1 / nativeParseFloat(whitespaces + '-0') !== -Infinity;

module.exports = FORCED ? function parseFloat(str) {
  var string = internalStringTrim(String(str), 3);
  var result = nativeParseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : nativeParseFloat;

},{"../internals/global":53,"../internals/string-trim":110,"../internals/whitespaces":122}],92:[function(require,module,exports){
var nativeParseInt = require('../internals/global').parseInt;
var internalStringTrim = require('../internals/string-trim');
var whitespaces = require('../internals/whitespaces');
var hex = /^[-+]?0[xX]/;
var FORCED = nativeParseInt(whitespaces + '08') !== 8 || nativeParseInt(whitespaces + '0x16') !== 22;

module.exports = FORCED ? function parseInt(str, radix) {
  var string = internalStringTrim(String(str), 3);
  return nativeParseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : nativeParseInt;

},{"../internals/global":53,"../internals/string-trim":110,"../internals/whitespaces":122}],93:[function(require,module,exports){
module.exports = require('../internals/global');

},{"../internals/global":53}],94:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};

},{}],95:[function(require,module,exports){
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var newPromiseCapability = require('../internals/new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"../internals/an-object":22,"../internals/is-object":66,"../internals/new-promise-capability":75}],96:[function(require,module,exports){
var redefine = require('../internals/redefine');

module.exports = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

},{"../internals/redefine":97}],97:[function(require,module,exports){
var global = require('../internals/global');
var hide = require('../internals/hide');
var has = require('../internals/has');
var setGlobal = require('../internals/set-global');
var nativeFunctionToString = require('../internals/function-to-string');
var InternalStateModule = require('../internals/internal-state');
var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(nativeFunctionToString).split('toString');

require('../internals/shared')('inspectSource', function (it) {
  return nativeFunctionToString.call(it);
});

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) hide(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else hide(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || nativeFunctionToString.call(this);
});

},{"../internals/function-to-string":50,"../internals/global":53,"../internals/has":54,"../internals/hide":56,"../internals/internal-state":62,"../internals/set-global":102,"../internals/shared":106}],98:[function(require,module,exports){
var classof = require('./classof-raw');
var regexpExec = require('./regexp-exec');

// `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classof(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};


},{"./classof-raw":32,"./regexp-exec":99}],99:[function(require,module,exports){
'use strict';

var regexpFlags = require('./regexp-flags');

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;

},{"./regexp-flags":100}],100:[function(require,module,exports){
'use strict';
var anObject = require('../internals/an-object');

// `RegExp.prototype.flags` getter implementation
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
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

},{"../internals/an-object":22}],101:[function(require,module,exports){
// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

},{}],102:[function(require,module,exports){
var global = require('../internals/global');
var hide = require('../internals/hide');

module.exports = function (key, value) {
  try {
    hide(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};

},{"../internals/global":53,"../internals/hide":56}],103:[function(require,module,exports){
'use strict';
var getBuiltIn = require('../internals/get-built-in');
var definePropertyModule = require('../internals/object-define-property');
var DESCRIPTORS = require('../internals/descriptors');
var SPECIES = require('../internals/well-known-symbol')('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var C = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;
  if (DESCRIPTORS && C && !C[SPECIES]) defineProperty(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"../internals/descriptors":41,"../internals/get-built-in":51,"../internals/object-define-property":79,"../internals/well-known-symbol":121}],104:[function(require,module,exports){
var defineProperty = require('../internals/object-define-property').f;
var has = require('../internals/has');
var TO_STRING_TAG = require('../internals/well-known-symbol')('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

},{"../internals/has":54,"../internals/object-define-property":79,"../internals/well-known-symbol":121}],105:[function(require,module,exports){
var shared = require('../internals/shared')('keys');
var uid = require('../internals/uid');

module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"../internals/shared":106,"../internals/uid":118}],106:[function(require,module,exports){
var global = require('../internals/global');
var setGlobal = require('../internals/set-global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.0.1',
  mode: require('../internals/is-pure') ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});

},{"../internals/global":53,"../internals/is-pure":67,"../internals/set-global":102}],107:[function(require,module,exports){
'use strict';
var fails = require('../internals/fails');

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !method || !fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

},{"../internals/fails":47}],108:[function(require,module,exports){
var anObject = require('../internals/an-object');
var aFunction = require('../internals/a-function');
var SPECIES = require('../internals/well-known-symbol')('species');

// `SpeciesConstructor` abstract operation
// https://tc39.github.io/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);
};

},{"../internals/a-function":18,"../internals/an-object":22,"../internals/well-known-symbol":121}],109:[function(require,module,exports){
var toInteger = require('../internals/to-integer');
var requireObjectCoercible = require('../internals/require-object-coercible');
// CONVERT_TO_STRING: true  -> String#at
// CONVERT_TO_STRING: false -> String#codePointAt
module.exports = function (that, pos, CONVERT_TO_STRING) {
  var S = String(requireObjectCoercible(that));
  var position = toInteger(pos);
  var size = S.length;
  var first, second;
  if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
  first = S.charCodeAt(position);
  return first < 0xD800 || first > 0xDBFF || position + 1 === size
    || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
      ? CONVERT_TO_STRING ? S.charAt(position) : first
      : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
};

},{"../internals/require-object-coercible":101,"../internals/to-integer":114}],110:[function(require,module,exports){
var requireObjectCoercible = require('../internals/require-object-coercible');
var whitespace = '[' + require('../internals/whitespaces') + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// 1 -> String#trimStart
// 2 -> String#trimEnd
// 3 -> String#trim
module.exports = function (string, TYPE) {
  string = String(requireObjectCoercible(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

},{"../internals/require-object-coercible":101,"../internals/whitespaces":122}],111:[function(require,module,exports){
var global = require('../internals/global');
var classof = require('../internals/classof-raw');
var bind = require('../internals/bind-context');
var html = require('../internals/html');
var createElement = require('../internals/document-create-element');
var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
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
if (!set || !clear) {
  set = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (classof(process) == 'process') {
    defer = function (id) {
      process.nextTick(bind(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(bind(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(bind(run, id, 1), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};

},{"../internals/bind-context":29,"../internals/classof-raw":32,"../internals/document-create-element":42,"../internals/global":53,"../internals/html":58}],112:[function(require,module,exports){
var toInteger = require('../internals/to-integer');
var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

},{"../internals/to-integer":114}],113:[function(require,module,exports){
// toObject with fallback for non-array-like ES3 strings
var IndexedObject = require('../internals/indexed-object');
var requireObjectCoercible = require('../internals/require-object-coercible');

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

},{"../internals/indexed-object":60,"../internals/require-object-coercible":101}],114:[function(require,module,exports){
var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

},{}],115:[function(require,module,exports){
var toInteger = require('../internals/to-integer');
var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

},{"../internals/to-integer":114}],116:[function(require,module,exports){
var requireObjectCoercible = require('../internals/require-object-coercible');

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};

},{"../internals/require-object-coercible":101}],117:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('../internals/is-object');
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

},{"../internals/is-object":66}],118:[function(require,module,exports){
var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + postfix).toString(36));
};

},{}],119:[function(require,module,exports){
var global = require('../internals/global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"../internals/global":53}],120:[function(require,module,exports){
var isObject = require('../internals/is-object');
var anObject = require('../internals/an-object');

module.exports = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) {
    throw TypeError("Can't set " + String(proto) + ' as a prototype');
  }
};

},{"../internals/an-object":22,"../internals/is-object":66}],121:[function(require,module,exports){
var store = require('../internals/shared')('wks');
var uid = require('../internals/uid');
var Symbol = require('../internals/global').Symbol;
var NATIVE_SYMBOL = require('../internals/native-symbol');

module.exports = function (name) {
  return store[name] || (store[name] = NATIVE_SYMBOL && Symbol[name]
    || (NATIVE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

},{"../internals/global":53,"../internals/native-symbol":73,"../internals/shared":106,"../internals/uid":118}],122:[function(require,module,exports){
// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],123:[function(require,module,exports){
exports.f = require('../internals/well-known-symbol');

},{"../internals/well-known-symbol":121}],124:[function(require,module,exports){
'use strict';
var isArray = require('../internals/is-array');
var isObject = require('../internals/is-object');
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var createProperty = require('../internals/create-property');
var arraySpeciesCreate = require('../internals/array-species-create');
var IS_CONCAT_SPREADABLE = require('../internals/well-known-symbol')('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

var IS_CONCAT_SPREADABLE_SUPPORT = !require('../internals/fails')(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = require('../internals/array-method-has-species-support')('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
require('../internals/export')({ target: 'Array', proto: true, forced: FORCED }, {
  concat: function concat(arg) { // eslint-disable-line no-unused-vars
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

},{"../internals/array-method-has-species-support":26,"../internals/array-species-create":28,"../internals/create-property":38,"../internals/export":46,"../internals/fails":47,"../internals/is-array":64,"../internals/is-object":66,"../internals/to-length":115,"../internals/to-object":116,"../internals/well-known-symbol":121}],125:[function(require,module,exports){
'use strict';
var internalFilter = require('../internals/array-methods')(2);

var SPECIES_SUPPORT = require('../internals/array-method-has-species-support')('filter');

// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
require('../internals/export')({ target: 'Array', proto: true, forced: !SPECIES_SUPPORT }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return internalFilter(this, callbackfn, arguments[1]);
  }
});

},{"../internals/array-method-has-species-support":26,"../internals/array-methods":27,"../internals/export":46}],126:[function(require,module,exports){
var INCORRECT_ITERATION = !require('../internals/check-correctness-of-iteration')(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
require('../internals/export')({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: require('../internals/array-from')
});

},{"../internals/array-from":24,"../internals/check-correctness-of-iteration":31,"../internals/export":46}],127:[function(require,module,exports){
'use strict';
var internalIndexOf = require('../internals/array-includes')(false);
var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var SLOPPY_METHOD = require('../internals/sloppy-array-method')('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
require('../internals/export')({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || SLOPPY_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : internalIndexOf(this, searchElement, arguments[1]);
  }
});

},{"../internals/array-includes":25,"../internals/export":46,"../internals/sloppy-array-method":107}],128:[function(require,module,exports){
'use strict';
var toIndexedObject = require('../internals/to-indexed-object');
var addToUnscopables = require('../internals/add-to-unscopables');
var Iterators = require('../internals/iterators');
var InternalStateModule = require('../internals/internal-state');
var defineIterator = require('../internals/define-iterator');
var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"../internals/add-to-unscopables":19,"../internals/define-iterator":39,"../internals/internal-state":62,"../internals/iterators":71,"../internals/to-indexed-object":113}],129:[function(require,module,exports){
'use strict';
var aFunction = require('../internals/a-function');
var toObject = require('../internals/to-object');
var fails = require('../internals/fails');
var nativeSort = [].sort;
var test = [1, 2, 3];

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test.sort(null);
});
// Old WebKit
var SLOPPY_METHOD = require('../internals/sloppy-array-method')('sort');

var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || SLOPPY_METHOD;

// `Array.prototype.sort` method
// https://tc39.github.io/ecma262/#sec-array.prototype.sort
require('../internals/export')({ target: 'Array', proto: true, forced: FORCED }, {
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? nativeSort.call(toObject(this))
      : nativeSort.call(toObject(this), aFunction(comparefn));
  }
});

},{"../internals/a-function":18,"../internals/export":46,"../internals/fails":47,"../internals/sloppy-array-method":107,"../internals/to-object":116}],130:[function(require,module,exports){
'use strict';
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toInteger = require('../internals/to-integer');
var toLength = require('../internals/to-length');
var toObject = require('../internals/to-object');
var arraySpeciesCreate = require('../internals/array-species-create');
var createProperty = require('../internals/create-property');
var max = Math.max;
var min = Math.min;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

var SPECIES_SUPPORT = require('../internals/array-method-has-species-support')('splice');

// `Array.prototype.splice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.splice
// with adding support of @@species
require('../internals/export')({ target: 'Array', proto: true, forced: !SPECIES_SUPPORT }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});

},{"../internals/array-method-has-species-support":26,"../internals/array-species-create":28,"../internals/create-property":38,"../internals/export":46,"../internals/to-absolute-index":112,"../internals/to-integer":114,"../internals/to-length":115,"../internals/to-object":116}],131:[function(require,module,exports){
'use strict';
var global = require('../internals/global');
var isForced = require('../internals/is-forced');
var has = require('../internals/has');
var classof = require('../internals/classof-raw');
var inheritIfRequired = require('../internals/inherit-if-required');
var toPrimitive = require('../internals/to-primitive');
var fails = require('../internals/fails');
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var defineProperty = require('../internals/object-define-property').f;
var internalStringTrim = require('../internals/string-trim');
var NUMBER = 'Number';
var NativeNumber = global[NUMBER];
var NumberPrototype = NativeNumber.prototype;

// Opera ~12 has broken Object#toString
var BROKEN_CLASSOF = classof(require('../internals/object-create')(NumberPrototype)) == NUMBER;
var NATIVE_TRIM = 'trim' in String.prototype;

// `ToNumber` abstract operation
// https://tc39.github.io/ecma262/#sec-tonumber
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  var first, third, radix, maxCode, digits, length, i, code;
  if (typeof it == 'string' && it.length > 2) {
    it = NATIVE_TRIM ? it.trim() : internalStringTrim(it, 3);
    first = it.charCodeAt(0);
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = it.slice(2);
      length = digits.length;
      for (i = 0; i < length; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.github.io/ecma262/#sec-number-constructor
if (isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof NumberWrapper
      // check on 1..constructor(foo) case
      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(that); }) : classof(that) != NUMBER)
        ? inheritIfRequired(new NativeNumber(toNumber(it)), that, NumberWrapper) : toNumber(it);
  };
  for (var keys = require('../internals/descriptors') ? getOwnPropertyNames(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(NativeNumber, key = keys[j]) && !has(NumberWrapper, key)) {
      defineProperty(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  require('../internals/redefine')(global, NUMBER, NumberWrapper);
}

},{"../internals/classof-raw":32,"../internals/descriptors":41,"../internals/fails":47,"../internals/global":53,"../internals/has":54,"../internals/inherit-if-required":61,"../internals/is-forced":65,"../internals/object-create":77,"../internals/object-define-property":79,"../internals/object-get-own-property-descriptor":80,"../internals/object-get-own-property-names":82,"../internals/redefine":97,"../internals/string-trim":110,"../internals/to-primitive":117}],132:[function(require,module,exports){
// `Number.isFinite` method
// https://tc39.github.io/ecma262/#sec-number.isfinite
require('../internals/export')({ target: 'Number', stat: true }, {
  isFinite: require('../internals/number-is-finite')
});

},{"../internals/export":46,"../internals/number-is-finite":76}],133:[function(require,module,exports){
var toObject = require('../internals/to-object');
var nativeKeys = require('../internals/object-keys');
var FAILS_ON_PRIMITIVES = require('../internals/fails')(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
require('../internals/export')({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});

},{"../internals/export":46,"../internals/fails":47,"../internals/object-keys":86,"../internals/to-object":116}],134:[function(require,module,exports){
var toString = require('../internals/object-to-string');
var ObjectPrototype = Object.prototype;

// `Object.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
if (toString !== ObjectPrototype.toString) {
  require('../internals/redefine')(ObjectPrototype, 'toString', toString, { unsafe: true });
}

},{"../internals/object-to-string":89,"../internals/redefine":97}],135:[function(require,module,exports){
var parseFloatImplementation = require('../internals/parse-float');

// `parseFloat` method
// https://tc39.github.io/ecma262/#sec-parsefloat-string
require('../internals/export')({ global: true, forced: parseFloat != parseFloatImplementation }, {
  parseFloat: parseFloatImplementation
});

},{"../internals/export":46,"../internals/parse-float":91}],136:[function(require,module,exports){
var parseIntImplementation = require('../internals/parse-int');

// `parseInt` method
// https://tc39.github.io/ecma262/#sec-parseint-string-radix
require('../internals/export')({ global: true, forced: parseInt != parseIntImplementation }, {
  parseInt: parseIntImplementation
});

},{"../internals/export":46,"../internals/parse-int":92}],137:[function(require,module,exports){
'use strict';
var PROMISE = 'Promise';
var IS_PURE = require('../internals/is-pure');
var global = require('../internals/global');
var $export = require('../internals/export');
var isObject = require('../internals/is-object');
var aFunction = require('../internals/a-function');
var anInstance = require('../internals/an-instance');
var classof = require('../internals/classof-raw');
var iterate = require('../internals/iterate');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var speciesConstructor = require('../internals/species-constructor');
var task = require('../internals/task').set;
var microtask = require('../internals/microtask');
var promiseResolve = require('../internals/promise-resolve');
var hostReportErrors = require('../internals/host-report-errors');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var perform = require('../internals/perform');
var userAgent = require('../internals/user-agent');
var SPECIES = require('../internals/well-known-symbol')('species');
var InternalStateModule = require('../internals/internal-state');
var isForced = require('../internals/is-forced');
var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var PromiseConstructor = global[PROMISE];
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var $fetch = global.fetch;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;
var IS_NODE = classof(process) == 'process';
var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper;

var FORCED = isForced(PROMISE, function () {
  // correct subclassing with @@species support
  var promise = PromiseConstructor.resolve(1);
  var empty = function () { /* empty */ };
  var FakePromise = (promise.constructor = {})[SPECIES] = function (exec) {
    exec(empty, empty);
  };
  // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  return !((IS_NODE || typeof PromiseRejectionEvent == 'function')
    && (!IS_PURE || promise['finally'])
    && promise.then(empty) instanceof FakePromise
    // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // we can't detect it synchronously, so just check versions
    && v8.indexOf('6.6') !== 0
    && userAgent.indexOf('Chrome/66') === -1);
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify = function (promise, state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
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
            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
            state.rejection = HANDLED;
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
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(promise, state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (handler = global['on' + name]) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (promise, state) {
  task.call(global, function () {
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (promise, state) {
  task.call(global, function () {
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, promise, state, unwrap) {
  return function (value) {
    fn(promise, state, value, unwrap);
  };
};

var internalReject = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(promise, state, true);
};

var internalResolve = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, promise, wrapper, state),
            bind(internalReject, promise, wrapper, state)
          );
        } catch (error) {
          internalReject(promise, wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(promise, state, false);
    }
  } catch (error) {
    internalReject(promise, { done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction(executor);
    Internal.call(this);
    var state = getInternalState(this);
    try {
      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
    } catch (error) {
      internalReject(this, state, error);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = require('../internals/redefine-all')(PromiseConstructor.prototype, {
    // `Promise.prototype.then` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = IS_NODE ? process.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify(this, state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, promise, state);
    this.reject = bind(internalReject, promise, state);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  // wrap fetch result
  if (!IS_PURE && typeof $fetch == 'function') $export({ global: true, enumerable: true, forced: true }, {
    // eslint-disable-next-line no-unused-vars
    fetch: function fetch(input) {
      return promiseResolve(PromiseConstructor, $fetch.apply(global, arguments));
    }
  });
}

$export({ global: true, wrap: true, forced: FORCED }, { Promise: PromiseConstructor });

require('../internals/set-to-string-tag')(PromiseConstructor, PROMISE, false, true);
require('../internals/set-species')(PROMISE);

PromiseWrapper = require('../internals/path')[PROMISE];

// statics
$export({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.github.io/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

$export({ target: PROMISE, stat: true, forced: IS_PURE || FORCED }, {
  // `Promise.resolve` method
  // https://tc39.github.io/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve(IS_PURE && this === PromiseWrapper ? PromiseConstructor : this, x);
  }
});

$export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.github.io/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.github.io/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      iterate(iterable, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

},{"../internals/a-function":18,"../internals/an-instance":21,"../internals/check-correctness-of-iteration":31,"../internals/classof-raw":32,"../internals/export":46,"../internals/global":53,"../internals/host-report-errors":57,"../internals/internal-state":62,"../internals/is-forced":65,"../internals/is-object":66,"../internals/is-pure":67,"../internals/iterate":69,"../internals/microtask":72,"../internals/new-promise-capability":75,"../internals/path":93,"../internals/perform":94,"../internals/promise-resolve":95,"../internals/redefine-all":96,"../internals/set-species":103,"../internals/set-to-string-tag":104,"../internals/species-constructor":108,"../internals/task":111,"../internals/user-agent":119,"../internals/well-known-symbol":121}],138:[function(require,module,exports){
'use strict';
var anObject = require('../internals/an-object');
var fails = require('../internals/fails');
var flags = require('../internals/regexp-flags');
var DESCRIPTORS = require('../internals/descriptors');
var TO_STRING = 'toString';
var nativeToString = /./[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  require('../internals/redefine')(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? flags.call(R) : undefined);
  }, { unsafe: true });
}

},{"../internals/an-object":22,"../internals/descriptors":41,"../internals/fails":47,"../internals/redefine":97,"../internals/regexp-flags":100}],139:[function(require,module,exports){
'use strict';
var codePointAt = require('../internals/string-at');
var InternalStateModule = require('../internals/internal-state');
var defineIterator = require('../internals/define-iterator');
var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = codePointAt(string, index, true);
  state.index += point.length;
  return { value: point, done: false };
});

},{"../internals/define-iterator":39,"../internals/internal-state":62,"../internals/string-at":109}],140:[function(require,module,exports){
'use strict';

var anObject = require('../internals/an-object');
var toLength = require('../internals/to-length');
var requireObjectCoercible = require('../internals/require-object-coercible');
var advanceStringIndex = require('../internals/advance-string-index');
var regExpExec = require('../internals/regexp-exec-abstract');

// @@match logic
require('../internals/fix-regexp-well-known-symbol-logic')(
  'match',
  1,
  function (MATCH, nativeMatch, maybeCallNative) {
    return [
      // `String.prototype.match` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.match
      function match(regexp) {
        var O = requireObjectCoercible(this);
        var matcher = regexp == undefined ? undefined : regexp[MATCH];
        return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
      },
      // `RegExp.prototype[@@match]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
      function (regexp) {
        var res = maybeCallNative(nativeMatch, regexp, this);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);

        if (!rx.global) return regExpExec(rx, S);

        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
        var A = [];
        var n = 0;
        var result;
        while ((result = regExpExec(rx, S)) !== null) {
          var matchStr = String(result[0]);
          A[n] = matchStr;
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
          n++;
        }
        return n === 0 ? null : A;
      }
    ];
  }
);

},{"../internals/advance-string-index":20,"../internals/an-object":22,"../internals/fix-regexp-well-known-symbol-logic":48,"../internals/regexp-exec-abstract":98,"../internals/require-object-coercible":101,"../internals/to-length":115}],141:[function(require,module,exports){
'use strict';

var anObject = require('../internals/an-object');
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var toInteger = require('../internals/to-integer');
var requireObjectCoercible = require('../internals/require-object-coercible');
var advanceStringIndex = require('../internals/advance-string-index');
var regExpExec = require('../internals/regexp-exec-abstract');
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
require('../internals/fix-regexp-well-known-symbol-logic')(
  'replace',
  2,
  function (REPLACE, nativeReplace, maybeCallNative) {
    return [
      // `String.prototype.replace` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.replace
      function replace(searchValue, replaceValue) {
        var O = requireObjectCoercible(this);
        var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
        return replacer !== undefined
          ? replacer.call(searchValue, O, replaceValue)
          : nativeReplace.call(String(O), searchValue, replaceValue);
      },
      // `RegExp.prototype[@@replace]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
      function (regexp, replaceValue) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);

        var functionalReplace = typeof replaceValue === 'function';
        if (!functionalReplace) replaceValue = String(replaceValue);

        var global = rx.global;
        if (global) {
          var fullUnicode = rx.unicode;
          rx.lastIndex = 0;
        }
        var results = [];
        while (true) {
          var result = regExpExec(rx, S);
          if (result === null) break;

          results.push(result);
          if (!global) break;

          var matchStr = String(result[0]);
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        }

        var accumulatedResult = '';
        var nextSourcePosition = 0;
        for (var i = 0; i < results.length; i++) {
          result = results[i];

          var matched = String(result[0]);
          var position = max(min(toInteger(result.index), S.length), 0);
          var captures = [];
          // NOTE: This is equivalent to
          //   captures = result.slice(1).map(maybeToString)
          // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
          // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
          // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
          for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
          var namedCaptures = result.groups;
          if (functionalReplace) {
            var replacerArgs = [matched].concat(captures, position, S);
            if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
            var replacement = String(replaceValue.apply(undefined, replacerArgs));
          } else {
            replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
          }
          if (position >= nextSourcePosition) {
            accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
            nextSourcePosition = position + matched.length;
          }
        }
        return accumulatedResult + S.slice(nextSourcePosition);
      }
    ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
    function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
      var tailPos = position + matched.length;
      var m = captures.length;
      var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
      if (namedCaptures !== undefined) {
        namedCaptures = toObject(namedCaptures);
        symbols = SUBSTITUTION_SYMBOLS;
      }
      return nativeReplace.call(replacement, symbols, function (match, ch) {
        var capture;
        switch (ch.charAt(0)) {
          case '$': return '$';
          case '&': return matched;
          case '`': return str.slice(0, position);
          case "'": return str.slice(tailPos);
          case '<':
            capture = namedCaptures[ch.slice(1, -1)];
            break;
          default: // \d\d?
            var n = +ch;
            if (n === 0) return match;
            if (n > m) {
              var f = floor(n / 10);
              if (f === 0) return match;
              if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
              return match;
            }
            capture = captures[n - 1];
        }
        return capture === undefined ? '' : capture;
      });
    }
  }
);

},{"../internals/advance-string-index":20,"../internals/an-object":22,"../internals/fix-regexp-well-known-symbol-logic":48,"../internals/regexp-exec-abstract":98,"../internals/require-object-coercible":101,"../internals/to-integer":114,"../internals/to-length":115,"../internals/to-object":116}],142:[function(require,module,exports){
'use strict';

var isRegExp = require('../internals/is-regexp');
var anObject = require('../internals/an-object');
var requireObjectCoercible = require('../internals/require-object-coercible');
var speciesConstructor = require('../internals/species-constructor');
var advanceStringIndex = require('../internals/advance-string-index');
var toLength = require('../internals/to-length');
var callRegExpExec = require('../internals/regexp-exec-abstract');
var regexpExec = require('../internals/regexp-exec');
var fails = require('../internals/fails');
var arrayPush = [].push;
var min = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

// @@split logic
require('../internals/fix-regexp-well-known-symbol-logic')(
  'split',
  2,
  function (SPLIT, nativeSplit, maybeCallNative) {
    var internalSplit;
    if (
      'abbc'.split(/(b)*/)[1] == 'c' ||
      'test'.split(/(?:)/, -1).length != 4 ||
      'ab'.split(/(?:ab)*/).length != 2 ||
      '.'.split(/(.?)(.?)/).length != 4 ||
      '.'.split(/()()/).length > 1 ||
      ''.split(/.?/).length
    ) {
      // based on es5-shim implementation, need to rework it
      internalSplit = function (separator, limit) {
        var string = String(requireObjectCoercible(this));
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (separator === undefined) return [string];
        // If `separator` is not a regex, use native split
        if (!isRegExp(separator)) {
          return nativeSplit.call(string, separator, lim);
        }
        var output = [];
        var flags = (separator.ignoreCase ? 'i' : '') +
                    (separator.multiline ? 'm' : '') +
                    (separator.unicode ? 'u' : '') +
                    (separator.sticky ? 'y' : '');
        var lastLastIndex = 0;
        // Make `global` and avoid `lastIndex` issues by working with a copy
        var separatorCopy = new RegExp(separator.source, flags + 'g');
        var match, lastIndex, lastLength;
        while (match = regexpExec.call(separatorCopy, string)) {
          lastIndex = separatorCopy.lastIndex;
          if (lastIndex > lastLastIndex) {
            output.push(string.slice(lastLastIndex, match.index));
            if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
            lastLength = match[0].length;
            lastLastIndex = lastIndex;
            if (output.length >= lim) break;
          }
          if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
        }
        if (lastLastIndex === string.length) {
          if (lastLength || !separatorCopy.test('')) output.push('');
        } else output.push(string.slice(lastLastIndex));
        return output.length > lim ? output.slice(0, lim) : output;
      };
    // Chakra, V8
    } else if ('0'.split(undefined, 0).length) {
      internalSplit = function (separator, limit) {
        return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
      };
    } else internalSplit = nativeSplit;

    return [
      // `String.prototype.split` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.split
      function split(separator, limit) {
        var O = requireObjectCoercible(this);
        var splitter = separator == undefined ? undefined : separator[SPLIT];
        return splitter !== undefined
          ? splitter.call(separator, O, limit)
          : internalSplit.call(String(O), separator, limit);
      },
      // `RegExp.prototype[@@split]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
      //
      // NOTE: This cannot be properly polyfilled in engines that don't support
      // the 'y' flag.
      function (regexp, limit) {
        var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);
        var C = speciesConstructor(rx, RegExp);

        var unicodeMatching = rx.unicode;
        var flags = (rx.ignoreCase ? 'i' : '') +
                    (rx.multiline ? 'm' : '') +
                    (rx.unicode ? 'u' : '') +
                    (SUPPORTS_Y ? 'y' : 'g');

        // ^(? + rx + ) is needed, in combination with some S slicing, to
        // simulate the 'y' flag.
        var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
        var p = 0;
        var q = 0;
        var A = [];
        while (q < S.length) {
          splitter.lastIndex = SUPPORTS_Y ? q : 0;
          var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
          var e;
          if (
            z === null ||
            (e = min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
          ) {
            q = advanceStringIndex(S, q, unicodeMatching);
          } else {
            A.push(S.slice(p, q));
            if (A.length === lim) return A;
            for (var i = 1; i <= z.length - 1; i++) {
              A.push(z[i]);
              if (A.length === lim) return A;
            }
            q = p = e;
          }
        }
        A.push(S.slice(p));
        return A;
      }
    ];
  },
  !SUPPORTS_Y
);

},{"../internals/advance-string-index":20,"../internals/an-object":22,"../internals/fails":47,"../internals/fix-regexp-well-known-symbol-logic":48,"../internals/is-regexp":68,"../internals/regexp-exec":99,"../internals/regexp-exec-abstract":98,"../internals/require-object-coercible":101,"../internals/species-constructor":108,"../internals/to-length":115}],143:[function(require,module,exports){
'use strict';
var internalStringTrim = require('../internals/string-trim');
var FORCED = require('../internals/forced-string-trim-method')('trim');

// `String.prototype.trim` method
// https://tc39.github.io/ecma262/#sec-string.prototype.trim
require('../internals/export')({ target: 'String', proto: true, forced: FORCED }, {
  trim: function trim() {
    return internalStringTrim(this, 3);
  }
});

},{"../internals/export":46,"../internals/forced-string-trim-method":49,"../internals/string-trim":110}],144:[function(require,module,exports){
// `Symbol.prototype.description` getter
// https://tc39.github.io/ecma262/#sec-symbol.prototype.description
'use strict';
var DESCRIPTORS = require('../internals/descriptors');
var has = require('../internals/has');
var isObject = require('../internals/is-object');
var defineProperty = require('../internals/object-define-property').f;
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var NativeSymbol = require('../internals/global').Symbol;

if (DESCRIPTORS && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  require('../internals/export')({ global: true, forced: true }, { Symbol: SymbolWrapper });
}

},{"../internals/copy-constructor-properties":34,"../internals/descriptors":41,"../internals/export":46,"../internals/global":53,"../internals/has":54,"../internals/is-object":66,"../internals/object-define-property":79}],145:[function(require,module,exports){
// `Symbol.iterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.iterator
require('../internals/define-well-known-symbol')('iterator');

},{"../internals/define-well-known-symbol":40}],146:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('../internals/global');
var has = require('../internals/has');
var DESCRIPTORS = require('../internals/descriptors');
var IS_PURE = require('../internals/is-pure');
var $export = require('../internals/export');
var redefine = require('../internals/redefine');
var hiddenKeys = require('../internals/hidden-keys');
var fails = require('../internals/fails');
var shared = require('../internals/shared');
var setToStringTag = require('../internals/set-to-string-tag');
var uid = require('../internals/uid');
var wellKnownSymbol = require('../internals/well-known-symbol');
var wrappedWellKnownSymbolModule = require('../internals/wrapped-well-known-symbol');
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');
var enumKeys = require('../internals/enum-keys');
var isArray = require('../internals/is-array');
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var toIndexedObject = require('../internals/to-indexed-object');
var toPrimitive = require('../internals/to-primitive');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var nativeObjectCreate = require('../internals/object-create');
var getOwnPropertyNamesExternal = require('../internals/object-get-own-property-names-external');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var hide = require('../internals/hide');
var objectKeys = require('../internals/object-keys');
var HIDDEN = require('../internals/shared-key')('hidden');
var InternalStateModule = require('../internals/internal-state');
var SYMBOL = 'Symbol';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var $Symbol = global.Symbol;
var JSON = global.JSON;
var nativeJSONStringify = JSON && JSON.stringify;
var PROTOTYPE = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var WellKnownSymbolsStore = shared('wks');
var ObjectPrototype = Object[PROTOTYPE];
var QObject = global.QObject;
var NATIVE_SYMBOL = require('../internals/native-symbol');
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, key);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[key];
  nativeDefineProperty(it, key, D);
  if (ObjectPrototypeDescriptor && it !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, key, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var isSymbol = NATIVE_SYMBOL && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) nativeDefineProperty(it, HIDDEN, createPropertyDescriptor(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = nativeObjectCreate(D, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(it, key, D);
  } return nativeDefineProperty(it, key, D);
};

var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIndexedObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};

var $create = function create(it, P) {
  return P === undefined ? nativeObjectCreate(it) : $defineProperties(nativeObjectCreate(it), P);
};

var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = nativePropertyIsEnumerable.call(this, key = toPrimitive(key, true));
  if (this === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIndexedObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var D = nativeGetOwnPropertyDescriptor(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};

var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && !has(hiddenKeys, key)) result.push(key);
  } return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OP ? ObjectPrototypeSymbols : toIndexedObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectPrototype, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// `Symbol` constructor
// https://tc39.github.io/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  require('../internals/object-get-own-property-names').f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  require('../internals/object-get-own-property-symbols').f = $getOwnPropertySymbols;

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };
}

$export({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, { Symbol: $Symbol });

for (var wellKnownSymbols = objectKeys(WellKnownSymbolsStore), k = 0; wellKnownSymbols.length > k;) {
  defineWellKnownSymbol(wellKnownSymbols[k++]);
}

$export({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  // `Symbol.for` method
  // https://tc39.github.io/ecma262/#sec-symbol.for
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // `Symbol.keyFor` method
  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$export({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$export({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// `JSON.stringify` method behavior with symbols
// https://tc39.github.io/ecma262/#sec-json.stringify
JSON && $export({ target: 'JSON', stat: true, forced: !NATIVE_SYMBOL || fails(function () {
  var symbol = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  return nativeJSONStringify([symbol]) != '[null]'
    // WebKit converts symbol values to JSON as null
    || nativeJSONStringify({ a: symbol }) != '{}'
    // V8 throws on boxed symbols
    || nativeJSONStringify(Object(symbol)) != '{}';
}) }, {
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
    return nativeJSONStringify.apply(JSON, args);
  }
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) hide($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

},{"../internals/an-object":22,"../internals/create-property-descriptor":37,"../internals/define-well-known-symbol":40,"../internals/descriptors":41,"../internals/enum-keys":45,"../internals/export":46,"../internals/fails":47,"../internals/global":53,"../internals/has":54,"../internals/hidden-keys":55,"../internals/hide":56,"../internals/internal-state":62,"../internals/is-array":64,"../internals/is-object":66,"../internals/is-pure":67,"../internals/native-symbol":73,"../internals/object-create":77,"../internals/object-define-property":79,"../internals/object-get-own-property-descriptor":80,"../internals/object-get-own-property-names":82,"../internals/object-get-own-property-names-external":81,"../internals/object-get-own-property-symbols":83,"../internals/object-keys":86,"../internals/object-property-is-enumerable":87,"../internals/redefine":97,"../internals/set-to-string-tag":104,"../internals/shared":106,"../internals/shared-key":105,"../internals/to-indexed-object":113,"../internals/to-primitive":117,"../internals/uid":118,"../internals/well-known-symbol":121,"../internals/wrapped-well-known-symbol":123}],147:[function(require,module,exports){
var DOMIterables = require('../internals/dom-iterables');
var forEach = require('../internals/array-for-each');
var hide = require('../internals/hide');
var global = require('../internals/global');

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    hide(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
}

},{"../internals/array-for-each":23,"../internals/dom-iterables":43,"../internals/global":53,"../internals/hide":56}],148:[function(require,module,exports){
var DOMIterables = require('../internals/dom-iterables');
var ArrayIteratorMethods = require('../modules/es.array.iterator');
var global = require('../internals/global');
var hide = require('../internals/hide');
var wellKnownSymbol = require('../internals/well-known-symbol');
var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      hide(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) hide(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        hide(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
}

},{"../internals/dom-iterables":43,"../internals/global":53,"../internals/hide":56,"../internals/well-known-symbol":121,"../modules/es.array.iterator":128}]},{},[9]);
