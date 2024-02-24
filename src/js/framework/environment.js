import FW from './fw';


export default class Environment {

  static _filterVersion(pattern) {
    if (navigator.userAgent) {
      const versionArray = navigator.userAgent.match(pattern);
      if (Array.isArray(versionArray) && typeof versionArray[1] !== 'undefined') {
        return parseInt(versionArray[1], 10);
      }
    }
    return -1;
  }

  static get _testVideo() {
    return document.createElement('video');
  }

  static get hasTouchEvents() {
    if (typeof window.ontouchstart !== 'undefined' ||
      (window.DocumentTouch && document instanceof window.DocumentTouch)) {
      return true;
    }
    return false;
  }

  static get userAgent() {
    if (navigator.userAgent) {
      return navigator.userAgent;
    }
    return null;
  }

  static get devicePixelRatio() {
    let pixelRatio = 1;
    if (FW.isNumber(window.devicePixelRatio) && window.devicePixelRatio > 1) {
      pixelRatio = window.devicePixelRatio;
    }
    return pixelRatio;
  }

  static get maxTouchPoints() {
    if (typeof navigator.maxTouchPoints === 'number') {
      return navigator.maxTouchPoints;
    }
    return -1;
  }

  static get isIos() {
    const IOS_PATTERN = /(ipad|iphone|ipod)/i;
    const IOS_VERSION_PATTERN = /os\s+(\d+)_/i;
    let support = [false, -1];
    if (IOS_PATTERN.test(Environment.userAgent) && Environment.hasTouchEvents) {
      support = [true, Environment._filterVersion(IOS_VERSION_PATTERN)];
    }
    return support;
  }

  static get isIpadOS() {
    const MAC_PLATFORM_PATTERN = /macintel/i;
    if (!Environment.isIos[0] && Environment.hasTouchEvents && MAC_PLATFORM_PATTERN.test(navigator.platform) &&
      Environment.devicePixelRatio > 1 && Environment.maxTouchPoints > 1) {
      return true;
    }
    return false;
  }

  static get isMacOS() {
    const MACOS_PATTERN = /(macintosh|mac\s+os)/i;
    const MACOS_VERSION_PATTERN = /mac\s+os\s+x\s+(\d+)_(\d+)/i;
    let isMacOS = false;
    let macOSXMinorVersion = -1;
    if (!Environment.isIos[0] && !Environment.isIpadOS && MACOS_PATTERN.test(Environment.userAgent)) {
      isMacOS = true;
      macOSXMinorVersion = Environment._filterVersion(MACOS_VERSION_PATTERN, true);
    }
    return [isMacOS, macOSXMinorVersion];
  }

  static get isSafari() {
    const SAFARI_PATTERN = /safari\/[.0-9]*/i;
    const SAFARI_VERSION_PATTERN = /version\/(\d+)\./i;
    const NO_SAFARI_PATTERN = /(chrome|chromium|android|crios|fxios)/i;
    let isSafari = false;
    let safariVersion = -1;
    if (SAFARI_PATTERN.test(Environment.userAgent) && !NO_SAFARI_PATTERN.test(Environment.userAgent)) {
      isSafari = true;
      safariVersion = Environment._filterVersion(SAFARI_VERSION_PATTERN);
    }
    return [isSafari, safariVersion];
  }

  static get isMacOSSafari() {
    return Environment.isMacOS[0] && Environment.isSafari[0];
  }

  static get isAndroid() {
    const ANDROID_PATTERN = /android/i;
    const ANDROID_VERSION_PATTERN = /android\s*(\d+)\./i;
    let support = [false, -1];
    if (!Environment.isIos[0] && Environment.hasTouchEvents && ANDROID_PATTERN.test(Environment.userAgent)) {
      support = [true, Environment._filterVersion(ANDROID_VERSION_PATTERN)];
    }
    return support;
  }

  static get isMobile() {
    if (Environment.isIos[0] || Environment.isAndroid[0] || Environment.isIpadOS) {
      return true;
    }
    return false;
  }

  static get hasNativeFullscreenSupport() {
    const doc = document.documentElement;
    const testVideo = Environment._testVideo;
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
  }

  static checkCanPlayType(type, codec) {
    const testVideo = Environment._testVideo;
    if (testVideo.canPlayType !== 'undefined') {
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
  }

}
