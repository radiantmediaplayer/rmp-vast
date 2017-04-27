const ENV = {};

ENV.testVideo = document.createElement('video');

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

var _isWindowsPhone = function (ua, hasTouchEvents) {
  let isWP = false;
  let wpVersion = -1;
  let support = [isWP, wpVersion];
  if (!hasTouchEvents) {
    return support;
  }
  let pattern = /windows\s+phone/i;
  if (pattern.test(ua)) {
    isWP = true;
    let pattern2 = /windows\s+phone\s+(\d+)\./i;
    support = [isWP, _filterVersion(pattern2, ua)];
  }
  return support;
};

var _isIos = function (ua, isWindowsPhone, hasTouchEvents) {
  let isIOS = false;
  let iOSVersion = -1;
  let support = [isIOS, iOSVersion];
  if (isWindowsPhone[0] || !hasTouchEvents) {
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

var _isAndroid = function (ua, isWindowsPhone, isIos, hasTouchEvents) {
  let isAndroid = false;
  let androidVersion = -1;
  let support = [isAndroid, androidVersion];
  if (isWindowsPhone[0] || isIos[0] || !hasTouchEvents) {
    return support;
  }
  let pattern = /android/i;
  if (pattern.test(ua)) {
    isAndroid = true;
    let pattern2 = /android\s+(\d+)\./i;
    androidVersion = _filterVersion(pattern2, ua);
    support = [isAndroid, androidVersion];
  }
  return support;
};

var _video5 = function () {
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

var _okMp4 = function (video5) {
  if (video5) {
    let canPlayType = ENV.testVideo.canPlayType('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
    if (canPlayType !== '') {
      return true;
    }
  }
  return false;
};
ENV.okMp4 = _okMp4(ENV.video5);

var _okWebM = function (video5) {
  if (video5) {
    let canPlayType = ENV.testVideo.canPlayType('video/webm; codecs="vp8,vorbis"');
    if (canPlayType !== '') {
      return true;
    }
  }
  return false;
};
ENV.okWebM = _okWebM(ENV.video5);

var _okHls = function (video5, okMp4) {
  if (video5 && okMp4) {
    let isSupp1 = ENV.testVideo.canPlayType('application/vnd.apple.mpegurl');
    let isSupp2 = ENV.testVideo.canPlayType('application/x-mpegurl');
    if (isSupp1 !== '' || isSupp2 !== '') {
      return true;
    }
  }
  return false;
};
ENV.okHls = _okHls(ENV.video5, ENV.okMp4);

var _hasNativeFullscreenSupport = function () {
  let doc = document.documentElement;
  if (doc) {
    if (typeof doc.requestFullscreen !== 'undefined' ||
      typeof doc.webkitRequestFullscreen !== 'undefined' ||
      typeof doc.mozRequestFullScreen !== 'undefined' ||
      typeof doc.msRequestFullscreen !== 'undefined' ||
      typeof ENV.testVideo.webkitEnterFullscreen !== 'undefined') {
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

export { ENV };
