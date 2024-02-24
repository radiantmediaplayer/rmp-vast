// our elements
const id = 'rmp';
const container = document.getElementById(id);
let rmpVast;
let playerWidth = 640;
let playerHeight = 360;
// the default adTag when none is provided
let adTag = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear.xml';

const _createStdEvent = function (eventName, element) {
  let event;
  if (element) {
    try {
      event = new Event(eventName);
      element.dispatchEvent(event);
    } catch (e) {
      console.trace(e);
    }
  }
};

/*** start of fullscreen management logic ***/
/* yes HTML5 video fullscreen is probably not as easy as it sounds */
// first we need some polyfill to handle fullscreenchange event in a unified way
const _proxyFullscreenEvents = function (event) {
  if (event && event.type) {
    const newType = event.type.replace(/^(webkit|moz|MS)/, '').toLowerCase();
    _createStdEvent(newType, document);
  }
};
document.addEventListener('webkitfullscreenchange', _proxyFullscreenEvents);
document.addEventListener('webkitfullscreenerror', _proxyFullscreenEvents);
document.addEventListener('mozfullscreenchange', _proxyFullscreenEvents);
document.addEventListener('mozfullscreenerror', _proxyFullscreenEvents);
document.addEventListener('MSFullscreenChange', _proxyFullscreenEvents);
document.addEventListener('MSFullscreenError', _proxyFullscreenEvents);

let isInFullscreen = false;
const _onfullscreenchange = function () {
  if (!isInFullscreen) {
    isInFullscreen = true;
    container.classList.add('rmp-fullscreen-on');
    rmpVast.resizeAd(window.screen.width, window.screen.height, 'fullscreen');
  } else {
    isInFullscreen = false;
    container.classList.remove('rmp-fullscreen-on');
    rmpVast.resizeAd(playerWidth, playerHeight, 'normal');
  }
};
// on iOS webkitbeginfullscreen/webkitendfullscreen are used but we do not care
// because we do not need rmp-fullscreen-on on container on iOS (iOS uses its own fullscreen player)
document.addEventListener('fullscreenchange', _onfullscreenchange);

const _requestFullscreen = function (container, video) {
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

const _exitFullscreen = function (video) {
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

const _setFullscreen = function (fs) {
  if (typeof fs === 'boolean') {
    const contentPlayer = rmpVast.contentPlayer;
    const adPlayer = rmpVast.adPlayer;
    if (isInFullscreen && !fs) {
      if (rmpVast.adOnStage && rmpVast.adLinear) {
        _exitFullscreen(adPlayer);
      } else {
        _exitFullscreen(contentPlayer);
      }
    } else if (!isInFullscreen && fs) {
      if (rmpVast.adOnStage && rmpVast.adLinear) {
        _requestFullscreen(container, adPlayer);
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
const _getViewportWidth = function () {
  let viewportWidth = 0;
  if (document.documentElement && typeof document.documentElement.clientWidth === 'number') {
    viewportWidth = document.documentElement.clientWidth;
  } else if (typeof window.innerWidth === 'number') {
    viewportWidth = window.innerWidth;
  }
  return viewportWidth;
};
const viewportWidth = _getViewportWidth();
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
const params = {
  ajaxTimeout: 5000,
  creativeLoadTimeout: 8000,
  ajaxWithCredentials: false,
  maxNumRedirects: 4,
  labels: {
    skipMessage: 'Skip ad',
    closeAd: 'Close ad',
    textForInteractionUIOnMobile: 'Learn more'
  },
  outstream: false,
  showControlsForAdPlayer: true,
  enableSimid: true,
  enableVpaid: true,
  vpaidSettings: {
    width: 640,
    height: 360,
    viewMode: 'normal',
    desiredBitrate: 500
  },
  useHlsJS: true,
  debugHlsJS: false,
  // OM SDK params
  omidSupport: true,
  omidAllowedVendors: [],
  omidRunValidationScript: false,
  omidUnderEvaluation: true,
  omidAutoplay: false
};
// new RmpVast instance - we pass id (required) and params (optional) 
rmpVast = new RmpVast(id, params);
// we get rmpVast framework to help us out for the app
console.log('APP: rmpVast instance created');
/*** END RmpVast instantiation  ***/

let nowOffset = 0;
const _getNow = function () {
  if (window.performance && typeof window.performance.now === 'function') {
    return Math.round(window.performance.now());
  }
  return 0;
};

// we wire our demo app UI for user interactions and logging
const _wireUI = function () {

  // UI buttons
  const play = document.getElementById('play');
  let firstClick = true;
  play.addEventListener('click', function () {
    if (firstClick) {
      firstClick = false;
      nowOffset = _getNow();
      rmpVast.loadAds(adTag);
    } else {
      rmpVast.play();
    }
  });

  const pause = document.getElementById('pause');
  pause.addEventListener('click', function () {
    rmpVast.pause();
  });

  const fullscreen = document.getElementById('fullscreen');
  fullscreen.addEventListener('click', function () {
    if (isInFullscreen) {
      _setFullscreen(false);
    } else {
      _setFullscreen(true);
    }
  });

  const stopAds = document.getElementById('stopAds');
  stopAds.addEventListener('click', function () {
    rmpVast.stopAds();
  });

  const mute = document.getElementById('mute');
  mute.addEventListener('click', function () {
    rmpVast.muted = true;
  });

  const unmute = document.getElementById('unmute');
  unmute.addEventListener('click', function () {
    rmpVast.muted = false;
  });

  const volume13 = document.getElementById('volume13');
  volume13.addEventListener('click', function () {
    rmpVast.volume = 0.33;
  });

  const volume23 = document.getElementById('volume23');
  volume23.addEventListener('click', function () {
    rmpVast.volume = 0.66;
  });

  const volume33 = document.getElementById('volume33');
  volume33.addEventListener('click', function () {
    rmpVast.volume = 1;
  });

  const getters = [
    'adPaused',
    'volume',
    'muted',
    'adTagUrl',
    'adMediaUrl',
    'adLinear',
    'adSystem',
    'adUniversalAdIds',
    'adContentType',
    'adTitle',
    'adDescription',
    'adAdvertiser',
    'adPricing',
    'adSurvey',
    'adAdServingId',
    'adCategories',
    'adBlockedAdCategories',
    'adDuration',
    'adCurrentTime',
    'adRemainingTime',
    'adOnStage',
    'adMediaWidth',
    'adMediaHeight',
    'clickThroughUrl',
    'skipTimeOffset',
    'isSkippableAd',
    'adSkippableState'
  ];
  const _bindResult = function (index) {
    if (getters[index]) {
      const result = document.getElementById(getters[index] + 'Result');
      let value = rmpVast[getters[index]];
      if (value === null) {
        value = 'null';
      } else if (typeof value === 'object') {
        value = JSON.stringify(value);
      } else if (value === '') {
        value = '\'\'';
      }
      result.textContent = value.toString();
    }
  };
  for (let i = 0, lenI = getters.length; i < lenI; i++) {
    const element = document.getElementById(getters[i]);
    element.addEventListener('click', _bindResult.bind(null, i));
  }

  // events logging
  const eventLogs = document.getElementById('event-logs');
  const events = [
    'adloaded',
    'addurationchange',
    'adclick',
    'adclosed',
    'adimpression',
    'adinteraction',
    'aduseracceptinvitation',
    'adcollapse',
    'adstarted',
    'adtagloaded',
    'adprogress',
    'adviewable',
    'adviewundetermined',
    'adinitialplayrequestfailed',
    'adinitialplayrequestsucceeded',
    'adpaused',
    'adresumed',
    'adtagstartloading',
    'adsizechange',
    'adlinearchange',
    'adexpandedchange',
    'adremainingtimechange',
    'advolumemuted',
    'advolumechanged',
    'adcomplete',
    'adskipped',
    'adskippablestatechanged',
    'adfirstquartile',
    'admidpoint',
    'adthirdquartile',
    'aderror',
    'addestroyed',
    'adpodcompleted'
  ];
  const _logEvent = function (event) {
    if (event && event.type) {
      let data = event.type;
      data += ' - ' + (_getNow() - nowOffset) + ' ms';
      console.log(data);
      eventLogs.insertAdjacentHTML('afterbegin', '<p>' + data + '</p>');
      if (event.type === 'aderror') {
        const errorMessage = rmpVast.adErrorMessage;
        const errorCode = rmpVast.adVastErrorCode;
        const errorLog = errorCode + ' - ' + errorMessage;
        console.log(errorLog);
        eventLogs.insertAdjacentHTML('afterbegin', '<p>' + errorLog + '</p>');
      }
    }
  };
  for (let j = 0, lenJ = events.length; j < lenJ; j++) {
    rmpVast.on(events[j], _logEvent);
  }

  // companion ad
  rmpVast.on('adstarted', function () {
    const companionId = document.getElementById('companion-ad');
    companionId.innerHTML = '';
    const list = rmpVast.getCompanionAdsList();
    if (list) {
      const html = rmpVast.getCompanionAd(0);
      if (html) {
        // we get our companion ad image and we can append it to DOM now
        // VAST trackers will be called automatically when needed
        companionId.appendChild(html);
      }
    }
  });
  // new ad with loadAds
  const loadAds = document.getElementById('loadAds');
  const newAdTagUrl = document.getElementById('newAdTagUrl');
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
