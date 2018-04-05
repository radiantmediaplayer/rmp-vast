const ENV = {};

var testVideo = document.createElement('video');

var _filterVersion = function (pattern, ua) {
  if (ua === null) {
    return -1;
  }
  let versionArray = ua.match(pattern);
  if (Array.isArray(versionArray) && typeof versionArray[1] !== 'undefined') {
    return parseInt(versionArray[1], 10);
  }
  return -1;
};

var _hasTouchEvents = function () {
  if (typeof window.ontouchstart !== 'undefined' ||
    (window.DocumentTouch && document instanceof DocumentTouch)) {
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

var _isIos = function (ua, hasTouchEvents) {
  let isIOS = false;
  let iOSVersion = -1;
  let support = [isIOS, iOSVersion];
  if (!hasTouchEvents) {
    return support;
  }
  let pattern = /(ipad|iphone|ipod)/i;
  if (pattern.test(ua)) {
    isIOS = true;
    let pattern2 = /os\s+(\d+)_/i;
    support = [isIOS, _filterVersion(pattern2, ua)];
  }
  return support;
};

var _isMacOSX = function (ua, isIos) {
  let pattern = /(macintosh|mac\s+os)/i;
  if (pattern.test(ua) && !isIos[0]) {
    return true;
  }
  return false;
};

var _isSafari = function (ua) {
  let isSafari = false;
  let safariVersion = -1;
  let pattern1 = /safari\/\d+\.\d+/i;
  let pattern2 = /chrome/i;
  let pattern3 = /chromium/i;
  let pattern4 = /android/i;
  if (pattern1.test(ua) && !pattern2.test(ua) && !pattern3.test(ua) &&
    !pattern4.test(ua)) {
    isSafari = true;
  }
  if (isSafari) {
    let versionPattern = /version\/(\d+)\./i;
    safariVersion = _filterVersion(versionPattern, ua);
  }
  return [isSafari, safariVersion];
};

var _isAndroid = function (ua, isIos, hasTouchEvents) {
  let isAndroid = false;
  let androidVersion = -1;
  let support = [isAndroid, androidVersion];
  if (isIos[0] || !hasTouchEvents) {
    return support;
  }
  let pattern = /android/i;
  if (pattern.test(ua)) {
    isAndroid = true;
    let pattern2 = /android\s*(\d+)\./i;
    androidVersion = _filterVersion(pattern2, ua);
    support = [isAndroid, androidVersion];
  }
  return support;
};

var _isFirefox = function (ua) {
  // from https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
  let firefoxPattern = /firefox\//i;
  let seamonkeyPattern = /seamonkey\//i;
  if (firefoxPattern.test(ua) && !seamonkeyPattern.test(ua)) {
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
    let canPlayType = testVideo.canPlayType('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
    if (canPlayType !== '') {
      return true;
    }
  }
  return false;
};
ENV.okMp4 = _okMp4();

var _okWebM = function () {
  if (html5VideoSupport) {
    let canPlayType = testVideo.canPlayType('video/webm; codecs="vp8,vorbis"');
    if (canPlayType !== '') {
      return true;
    }
  }
  return false;
};
ENV.okWebM = _okWebM();

var _okHls = function (okMp4) {
  if (html5VideoSupport && okMp4) {
    let isSupp1 = testVideo.canPlayType('application/vnd.apple.mpegurl');
    let isSupp2 = testVideo.canPlayType('application/x-mpegurl');
    if (isSupp1 !== '' || isSupp2 !== '') {
      return true;
    }
  }
  return false;
};
ENV.okHls = _okHls(ENV.okMp4);

var _hasNativeFullscreenSupport = function () {
  let doc = document.documentElement;
  if (doc) {
    if (typeof doc.requestFullscreen !== 'undefined' ||
      typeof doc.webkitRequestFullscreen !== 'undefined' ||
      typeof doc.mozRequestFullScreen !== 'undefined' ||
      typeof doc.msRequestFullscreen !== 'undefined' ||
      typeof testVideo.webkitEnterFullscreen !== 'undefined') {
      return true;
    }
  }
  return false;
};
ENV.hasNativeFullscreenSupport = _hasNativeFullscreenSupport();

var userAgent = _getUserAgent();
var hasTouchEvents = _hasTouchEvents();
ENV.isIos = _isIos(userAgent, hasTouchEvents);
ENV.isAndroid = _isAndroid(userAgent, ENV.isIos, hasTouchEvents);
ENV.isMacOSX = _isMacOSX(userAgent, ENV.isIos);
ENV.isSafari = _isSafari(userAgent);
ENV.isFirefox = _isFirefox(userAgent);
ENV.isMobile = false;
if (ENV.isIos[0] || ENV.isAndroid[0]) {
  ENV.isMobile = true;
}

export { ENV };
