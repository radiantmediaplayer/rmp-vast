(function () {

  'use strict';

  // our elements
  var id = 'rmpPlayer';
  var container = document.getElementById(id);
  var video = container.getElementsByClassName('rmp-video')[0];
  // the default adTag when none is provided
  var adTag = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-5.xml';
  // the following params are the default
  var params = {
    ajaxTimeout: 10000,
    ajaxWithCredentials: true,
    maxNumRedirects: 4,
    skipMessage: 'Skip ad',
    skipWaitingMessage: 'Skip ad in',
    textForClickUIOnMobile: 'Learn more'
  };
  // new RmpVast instance - we pass id (required) and params (optional) 
  var rmpVast = new RmpVast(id, params);
  // we get rmpVast framework to help us out for the app
  var fw = rmpVast.getFW();

  // first we need some polyfill to handle fullscreen changes
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

  /*** START of resizing logic ***/
  // following is just some basic resizing logic for the purpose of the 
  // demo - you probably want to upgrade it or write your own 
  // the concept is to properly size container in pixels
  // inner elements of container will follow because they are % based
  var originalContainerWidth = fw.getWidth(container);
  var originalContainerHeight = fw.getHeight(container);
  var ratio = originalContainerWidth / originalContainerHeight;

  var _getViewportWidth = function () {
    var viewportWidth = 0;
    if (document.documentElement && typeof document.documentElement.clientWidth === 'number') {
      viewportWidth = document.documentElement.clientWidth;
    } else if (typeof window.innerWidth === 'number') {
      viewportWidth = window.innerWidth;
    }
    return viewportWidth;
  };

  var _setContainerSize = function (width, height) {
    if (width && height) {
      container.style.width = width + 'px';
      container.style.height = height + 'px';
    }
  };

  var _resize = function () {
    if (rmpVast.getFullscreen()) {
      return;
    }
    var containerWidth = fw.getWidth(container);
    // the - 30 is specific the demo layout (e.g. bootstrap left/right 15px padding on col-*)
    var viewportWidth = _getViewportWidth() - 30;
    if (containerWidth > viewportWidth) {
      _setContainerSize(viewportWidth, viewportWidth / ratio);
    } else if (containerWidth <= viewportWidth) {
      if (originalContainerWidth <= viewportWidth) {
        _setContainerSize(originalContainerWidth, originalContainerWidth / ratio);
      } else {
        _setContainerSize(viewportWidth, viewportWidth / ratio);
      }
    }
  };

  window.addEventListener('orientationchange', _resize);
  window.addEventListener('resize', _resize);
  _resize();
  /*** END of resizing logic ***/


  fw.log('APP: rmpVast instance created');

  // we wire our demo app UI for user interactions and logging
  var _wireUI = function () {

    // UI buttons
    var play = document.getElementById('play');
    play.addEventListener('click', function () {
      rmpVast.play();
    });

    var pause = document.getElementById('pause');
    pause.addEventListener('click', function () {
      rmpVast.pause();
    });

    var fullscreen = document.getElementById('fullscreen');
    fullscreen.addEventListener('click', function () {
      if (rmpVast.getFullscreen()) {
        rmpVast.setFullscreen(false);
      } else {
        rmpVast.setFullscreen(true);
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
      'getFullscreen',
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
        if (window.performance && typeof window.performance.now === 'function') {
          data += ' - ' + Math.round(window.performance.now()) + ' ms';
        }
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
      if (newAdTagUrl.value) {
        if (rmpVast.getInitialized()) {
          rmpVast.loadAds(newAdTagUrl.value);
        } else {
          // if rmp-vast is not initialized then we just update adTag
          // an explicit play interaction is still required (e.g. to prevent issues on mobiles)
          adTag = newAdTagUrl.value;
        }
      }
    });

  };

  _wireUI();

  // at start up be it autoplay or through a user interaction we loadAds at play event
  var _onPlayLoadAds = function () {
    video.removeEventListener('play', _onPlayLoadAds);
    fw.log('APP: play event reached on content player - loadAds');
    rmpVast.loadAds(adTag);
  };
  video.addEventListener('play', _onPlayLoadAds);
})();