(function () {

  'use strict';

  // our elements
  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var rmpVast;
  var fw;
  var playerWidth = 640;
  var playerHeight = 360;
  // the default adTag when none is provided
  var adTag = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear.xml';

  /*** start of fullscreen management logic ***/
  /* yes HTML5 video fullscreen is probably not as easy as it sounds */
  // first we need some polyfill to handle fullscreenchange event in a unified way
  var _proxyFullscreenEvents = function (event) {
    if (event && event.type) {
      let newType = event.type.replace(/^(webkit|moz|MS)/, '').toLowerCase();
      fw.createStdEvent(newType, document);
    }
  };
  document.addEventListener('webkitfullscreenchange', _proxyFullscreenEvents);
  document.addEventListener('webkitfullscreenerror', _proxyFullscreenEvents);
  document.addEventListener('mozfullscreenchange', _proxyFullscreenEvents);
  document.addEventListener('mozfullscreenerror', _proxyFullscreenEvents);
  document.addEventListener('MSFullscreenChange', _proxyFullscreenEvents);
  document.addEventListener('MSFullscreenError', _proxyFullscreenEvents);

  var isInFullscreen = false;
  var _onfullscreenchange = function () {
    if (!isInFullscreen) {
      isInFullscreen = true;
      fw.addClass(container, 'rmp-fullscreen-on');
      rmpVast.resizeAd(window.screen.width, window.screen.height, 'fullscreen');
    } else {
      isInFullscreen = false;
      fw.removeClass(container, 'rmp-fullscreen-on');
      rmpVast.resizeAd(playerWidth, playerHeight, 'normal');
    }
  };
  // on iOS webkitbeginfullscreen/webkitendfullscreen are used but we do not care
  // because we do not need rmp-fullscreen-on on container on iOS (iOS uses its own fullscreen player)
  document.addEventListener('fullscreenchange', _onfullscreenchange);

  var _requestFullscreen = function (container, video) {
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
        // we still need to tell iOS to go fullscreen
        video.webkitEnterFullscreen();
      }
    }
  };

  var _exitFullscreen = function (video) {
    if (typeof document.exitFullscreen !== 'undefined') {
      document.exitFullscreen();
    } else if (typeof document.webkitExitFullscreen !== 'undefined') {
      document.webkitExitFullscreen();
    } else if (typeof document.mozCancelFullScreen !== 'undefined') {
      document.mozCancelFullScreen();
    } else if (typeof document.msExitFullscreen !== 'undefined') {
      document.msExitFullscreen();
    } else if (video && typeof video.webkitExitFullscreen !== 'undefined') {
      // we still need to tell iOS to exit fullscreen
      video.webkitExitFullscreen();
    }
  };

  var _setFullscreen = function (fs) {
    if (typeof fs === 'boolean') {
      var contentPlayer = rmpVast.getContentPlayer();
      var vastPlayer = rmpVast.getVastPlayer();
      if (isInFullscreen && !fs) {
        if (rmpVast.getAdOnStage() && rmpVast.getAdLinear()) {
          _exitFullscreen(vastPlayer);
        } else {
          _exitFullscreen(contentPlayer);
        }
      } else if (!isInFullscreen && fs) {
        if (rmpVast.getAdOnStage() && rmpVast.getAdLinear()) {
          _requestFullscreen(container, vastPlayer);
        } else {
          _requestFullscreen(container, contentPlayer);
        }
      }
    }
  };
  /*** end of fullscreen management logic ***/

  /*** START of resizing logic ***/
  // following is just some basic resizing logic for the purpose of the 
  // demo - you probably want to upgrade it
  var _getViewportWidth = function () {
    var viewportWidth = 0;
    if (document.documentElement && typeof document.documentElement.clientWidth === 'number') {
      viewportWidth = document.documentElement.clientWidth;
    } else if (typeof window.innerWidth === 'number') {
      viewportWidth = window.innerWidth;
    }
    return viewportWidth;
  };
  var viewportWidth = _getViewportWidth();
  if (viewportWidth < 640) {
    playerWidth = 480;
    playerHeight = 270;
  }
  if (viewportWidth < 480) {
    playerWidth = 320;
    playerHeight = 180;
  }
  container.style.width = playerWidth + 'px';
  container.style.height = playerHeight + 'px';
  /*** END of resizing logic ***/

  /*** START RmpVast instantiation  ***/
  // the following params are the default
  var params = {
    ajaxTimeout: 8000,
    creativeLoadTimeout: 10000,
    ajaxWithCredentials: true,
    maxNumRedirects: 4,
    skipMessage: 'Skip ad',
    skipWaitingMessage: 'Skip ad in',
    textForClickUIOnMobile: 'Learn more',
    enableVpaid: true,
    vpaidSettings: {
      width: playerWidth,
      height: playerHeight,
      viewMode: 'normal',
      desiredBitrate: 500,
      vpaidTimeout: 8000
    }
  };
  // new RmpVast instance - we pass id (required) and params (optional) 
  rmpVast = new RmpVast(id, params);
  // we get rmpVast framework to help us out for the app
  fw = rmpVast.getFW();
  fw.log('APP: rmpVast instance created');
  /*** END RmpVast instantiation  ***/

  var nowOffset = 0;
  var _getNow = function () {
    if (window.performance && typeof window.performance.now === 'function') {
      return Math.round(window.performance.now());
    }
    return 0;
  };

  // we wire our demo app UI for user interactions and logging
  var _wireUI = function () {

    // UI buttons
    var play = document.getElementById('play');
    var firstClick = true;
    play.addEventListener('click', function () {
      if (firstClick) {
        firstClick = false;
        nowOffset = _getNow();
        rmpVast.loadAds(adTag);
      } else {
        rmpVast.play();
      }
    });

    var pause = document.getElementById('pause');
    pause.addEventListener('click', function () {
      rmpVast.pause();
    });

    var fullscreen = document.getElementById('fullscreen');
    fullscreen.addEventListener('click', function () {
      if (isInFullscreen) {
        _setFullscreen(false);
      } else {
        _setFullscreen(true);
      }
    });

    var stopAds = document.getElementById('stopAds');
    stopAds.addEventListener('click', function () {
      rmpVast.stopAds();
    });

    var mute = document.getElementById('mute');
    mute.addEventListener('click', function () {
      rmpVast.setMute(true);
    });

    var unmute = document.getElementById('unmute');
    unmute.addEventListener('click', function () {
      rmpVast.setMute(false);
    });

    var volume13 = document.getElementById('volume13');
    volume13.addEventListener('click', function () {
      rmpVast.setVolume(0.33);
    });

    var volume23 = document.getElementById('volume23');
    volume23.addEventListener('click', function () {
      rmpVast.setVolume(0.66);
    });

    var volume33 = document.getElementById('volume33');
    volume33.addEventListener('click', function () {
      rmpVast.setVolume(1);
    });

    var getters = [
      'getAdPaused',
      'getVolume',
      'getMute',
      'getAdTagUrl',
      'getAdMediaUrl',
      'getAdLinear',
      'getAdSystem',
      'getAdContentType',
      'getAdTitle',
      'getAdDescription',
      'getAdDuration',
      'getAdCurrentTime',
      'getAdOnStage',
      'getAdMediaWidth',
      'getAdMediaHeight',
      'getClickThroughUrl'
    ];
    var _bindResult = function (index) {
      if (getters[index]) {
        var result = document.getElementById(getters[index] + 'Result');
        var value = rmpVast[getters[index]]();
        if (value === null) {
          value = 'null';
        }
        result.textContent = value.toString();
      }
    };
    for (var i = 0, lenI = getters.length; i < lenI; i++) {
      var element = document.getElementById(getters[i]);
      element.addEventListener('click', _bindResult.bind(null, i));
    }

    // events logging
    var eventLogs = document.getElementById('eventLogs');
    var events = [
      'adloaded', 'addurationchange', 'adclick', 'adimpression', 'adstarted', 'adtagloaded',
      'adpaused', 'adresumed', 'adtagstartloading', 'adfollowingredirect',
      'advolumemuted', 'advolumechanged', 'adcomplete', 'adskipped', 'adskippablestatechanged',
      'adfirstquartile', 'admidpoint', 'adthirdquartile', 'aderror', 'addestroyed'
    ];
    var _logEvent = function (event) {
      if (event && event.type) {
        var data = event.type;
        data += ' - ' + (_getNow() - nowOffset) + ' ms';
        fw.log(data);
        eventLogs.insertAdjacentHTML('afterbegin', '<p>' + data + '</p>');
        if (event.type === 'aderror') {
          var errorMessage = rmpVast.getAdErrorMessage();
          var errorCode = rmpVast.getAdVastErrorCode();
          var errorLog = errorCode + ' - ' + errorMessage;
          fw.log(errorLog);
          eventLogs.insertAdjacentHTML('afterbegin', '<p>' + errorLog + '</p>');
        }
      }
    };
    for (var j = 0, lenJ = events.length; j < lenJ; j++) {
      container.addEventListener(events[j], _logEvent);
    }

    // new ad with loadAds
    var loadAds = document.getElementById('loadAds');
    var newAdTagUrl = document.getElementById('newAdTagUrl');
    loadAds.addEventListener('click', function () {
      firstClick = false;
      nowOffset = _getNow();
      if (newAdTagUrl.value) {
        adTag = newAdTagUrl.value;
      }
      rmpVast.loadAds(adTag);
    });

  };

  _wireUI();

})();