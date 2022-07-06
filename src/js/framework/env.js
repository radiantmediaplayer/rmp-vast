import FW from './fw';

const TEST_VIDEO = document.createElement('video');

const IOS_PATTERN = /(ipad|iphone|ipod)/i;
const IOS_VERSION_PATTERN = /os\s+(\d+)_/i;

const MACOS_PATTERN = /(macintosh|mac\s+os)/i;
const MACOS_VERSION_PATTERN = /mac\s+os\s+x\s+(\d+)_(\d+)/i;

const SAFARI_PATTERN = /safari\/[.0-9]*/i;
const SAFARI_VERSION_PATTERN = /version\/(\d+)\./i;
const NO_SAFARI_PATTERN = /(chrome|chromium|android|crios|fxios)/i;

const MAC_PLATFORM_PATTERN = /macintel/i;

const ANDROID_PATTERN = /android/i;
const ANDROID_VERSION_PATTERN = /android\s*(\d+)\./i;

/*const FIREFOX_PATTERN = /firefox\//i;
const SEAMONKEY_PATTERN = /seamonkey\//i;*/

export default class ENV {

  static _filterVersion(pattern) {
    if (navigator.userAgent) {
      const versionArray = navigator.userAgent.match(pattern);
      if (Array.isArray(versionArray) && typeof versionArray[1] !== 'undefined') {
        return parseInt(versionArray[1], 10);
      }
    }
    return -1;
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
    let support = [false, -1];
    if (IOS_PATTERN.test(ENV.userAgent) && ENV.hasTouchEvents) {
      support = [true, ENV._filterVersion(IOS_VERSION_PATTERN)];
    }
    return support;
  }

  static get isIpadOS() {
    if (!ENV.isIos[0] && ENV.hasTouchEvents && MAC_PLATFORM_PATTERN.test(navigator.platform) && ENV.devicePixelRatio > 1 &&
      ENV.maxTouchPoints > 1) {
      return true;
    }
    return false;
  }

  static get isMacOS() {
    let isMacOS = false;
    let macOSXMinorVersion = -1;
    if (!ENV.isIos[0] && !ENV.isIpadOS && MACOS_PATTERN.test(ENV.userAgent)) {
      isMacOS = true;
      macOSXMinorVersion = ENV._filterVersion(MACOS_VERSION_PATTERN, true);
    }
    return [isMacOS, macOSXMinorVersion];
  }

  static get isSafari() {
    let isSafari = false;
    let safariVersion = -1;
    if (SAFARI_PATTERN.test(ENV.userAgent) && !NO_SAFARI_PATTERN.test(ENV.userAgent)) {
      isSafari = true;
      safariVersion = ENV._filterVersion(SAFARI_VERSION_PATTERN);
    }
    return [isSafari, safariVersion];
  }

  static get isMacOSSafari() {
    return ENV.isMacOS[0] && ENV.isSafari[0];
  }

  static get isAndroid() {
    let support = [false, -1];
    if (!ENV.isIos[0] && ENV.hasTouchEvents && ANDROID_PATTERN.test(ENV.userAgent)) {
      support = [true, ENV._filterVersion(ANDROID_VERSION_PATTERN)];
    }
    return support;
  }

  /*// from https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
  static get isFirefox() {
    if (FIREFOX_PATTERN.test(ENV.userAgent) && !SEAMONKEY_PATTERN.test(ENV.userAgent)) {
      return true;
    }
    return false;
  }*/

  static get isMobile() {
    if (ENV.isIos[0] || ENV.isAndroid[0] || ENV.isIpadOS) {
      return true;
    }
    return false;
  }

  static get hasNativeFullscreenSupport() {
    const doc = document.documentElement;
    if (doc) {
      if (typeof doc.requestFullscreen !== 'undefined' ||
        typeof doc.webkitRequestFullscreen !== 'undefined' ||
        typeof doc.mozRequestFullScreen !== 'undefined' ||
        typeof doc.msRequestFullscreen !== 'undefined' ||
        typeof TEST_VIDEO.webkitEnterFullscreen !== 'undefined') {
        return true;
      }
    }
    return false;
  }

  static checkCanPlayType(type, codec) {
    if (TEST_VIDEO.canPlayType !== 'undefined') {
      if (type && codec) {
        const canPlayType = TEST_VIDEO.canPlayType(type + '; codecs="' + codec + '"');
        if (canPlayType !== '') {
          return true;
        }
      } else if (type && !codec) {
        const canPlayType = TEST_VIDEO.canPlayType(type);
        if (canPlayType !== '') {
          return true;
        }
      }
    }
    return false;
  }

}
