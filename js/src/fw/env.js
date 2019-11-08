import FW from './fw';

const ENV = {};

const testVideo = document.createElement('video');

const _hasTouchEvents = function () {
  if (typeof window.ontouchstart !== 'undefined' ||
    (window.DocumentTouch && document instanceof window.DocumentTouch)) {
    return true;
  }
  return false;
};
const hasTouchEvents = _hasTouchEvents();

const _getUserAgent = function () {
  if (window.navigator && window.navigator.userAgent) {
    return window.navigator.userAgent;
  }
  return null;
};
const userAgent = _getUserAgent();

const _filterVersion = function (pattern) {
  if (userAgent !== null) {
    const versionArray = userAgent.match(pattern);
    if (Array.isArray(versionArray) && typeof versionArray[1] !== 'undefined') {
      return parseInt(versionArray[1], 10);
    }
  }
  return -1;
};

const _getDevicePixelRatio = function () {
  let pixelRatio = 1;
  if (FW.isNumber(window.devicePixelRatio) && window.devicePixelRatio > 1) {
    pixelRatio = window.devicePixelRatio;
  }
  return pixelRatio;
};
ENV.devicePixelRatio = _getDevicePixelRatio();

const IOS_PATTERN = /(ipad|iphone|ipod)/i;
const IOS_VERSION_PATTERN = /os\s+(\d+)_/i;
const _isIos = function () {
  let support = [false, -1];
  if (!hasTouchEvents) {
    return support;
  }
  if (IOS_PATTERN.test(userAgent)) {
    support = [true, _filterVersion(IOS_VERSION_PATTERN)];
  }
  return support;
};
const isIos = _isIos();

const MACOS_PATTERN = /(macintosh|mac\s+os)/i;
const MACOS_VERSION_PATTERN = /mac\s+os\s+x\s+(\d+)_(\d+)/i;
const _isMacOS = function () {
  let isMacOS = false;
  let macOSXMinorVersion = -1;
  if (!isIos[0] && MACOS_PATTERN.test(userAgent)) {
    isMacOS = true;
    macOSXMinorVersion = _filterVersion(MACOS_VERSION_PATTERN, true);
  }
  return [isMacOS, macOSXMinorVersion];
};
const isMacOS = _isMacOS();

const SAFARI_PATTERN = /safari\/[.0-9]*/i;
const SAFARI_VERSION_PATTERN = /version\/(\d+)\./i;
const NO_SAFARI_PATTERN = /(chrome|chromium|android|crios|fxios)/i;
const _isSafari = function () {
  let isSafari = false;
  let safariVersion = -1;
  if (SAFARI_PATTERN.test(userAgent) && !NO_SAFARI_PATTERN.test(userAgent)) {
    isSafari = true;
    safariVersion = _filterVersion(SAFARI_VERSION_PATTERN);
  }
  return [isSafari, safariVersion];
};
const isSafari = _isSafari();

const _isIpadOS = function() {
  if (!isIos[0] && isSafari[0] && isSafari[1] > 12 && isMacOS[0] && isMacOS[1] > 14 && ENV.devicePixelRatio > 1) {
    return true;
  }
  return false;
};
ENV.isIpadOS = _isIpadOS();

const ANDROID_PATTERN = /android/i;
const ANDROID_VERSION_PATTERN = /android\s*(\d+)\./i;
const _isAndroid = function () {
  let support = [false, -1];
  if (isIos[0] || !hasTouchEvents) {
    return support;
  }
  if (ANDROID_PATTERN.test(userAgent)) {
    support = [true, _filterVersion(ANDROID_VERSION_PATTERN)];
  }
  return support;
};

// from https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
const FIREFOX_PATTERN = /firefox\//i;
const SEAMONKEY_PATTERN = /seamonkey\//i;
const _isFirefox = function () {
  if (FIREFOX_PATTERN.test(userAgent) && !SEAMONKEY_PATTERN.test(userAgent)) {
    return true;
  }
  return false;
};

const _video5 = function () {
  return typeof testVideo.canPlayType !== 'undefined';
};
const html5VideoSupport = _video5();

const MP4_H264_AAC_BASELINE_MIME_PATTERN = 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"';
const _okMp4 = function () {
  if (html5VideoSupport) {
    const canPlayType = testVideo.canPlayType(MP4_H264_AAC_BASELINE_MIME_PATTERN);
    if (canPlayType !== '') {
      return true;
    }
  }
  return false;
};
const okMp4 = _okMp4();

const _okHls = function () {
  if (html5VideoSupport && okMp4) {
    const isSupp1 = testVideo.canPlayType('application/vnd.apple.mpegurl');
    const isSupp2 = testVideo.canPlayType('application/x-mpegurl');
    if (isSupp1 !== '' || isSupp2 !== '') {
      return true;
    }
  }
  return false;
};

const _okDash = function () {
  if (html5VideoSupport) {
    const dashSupport = testVideo.canPlayType('application/dash+xml');
    if (dashSupport !== '') {
      return true;
    }
  }
  return false;
};

const _hasNativeFullscreenSupport = function () {
  const doc = document.documentElement;
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

ENV.isSafari = isSafari;
ENV.isIos = isIos;
ENV.isAndroid = _isAndroid();
ENV.isMacOS = _isMacOS();
ENV.isFirefox = _isFirefox();
ENV.isMobile = false;
if (ENV.isIos[0] || ENV.isAndroid[0] || ENV.isIpadOS) {
  ENV.isMobile = true;
}

ENV.okMp4 = okMp4;
ENV.okHls = _okHls();
ENV.okDash = _okDash();
ENV.canPlayType = function (type, codec) {
  if (html5VideoSupport) {
    if (type && codec) {
      const canPlayType = testVideo.canPlayType(type + '; codecs="' + codec + '"');
      if (canPlayType !== '') {
        return true;
      }
    } else if (type && !codec) {
      const canPlayType = testVideo.canPlayType(type);
      if (canPlayType !== '') {
        return true;
      }
    }
  }
  return false;
};

ENV.hasNativeFullscreenSupport = _hasNativeFullscreenSupport();

export default ENV;
