import { FW } from './fw';

const FWVAST = {};

FWVAST.hasDOMParser = function () {
  if (typeof window.DOMParser !== 'undefined') {
    return true;
  }
  return false;
};

FWVAST.vastReadableTime = function (time) {
  if (typeof time === 'number' && time >= 0) {
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let ms = Math.floor(time % 1000);
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
      seconds = seconds - (minutes * 60);
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
      minutes = minutes - (hours * 60);
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

FWVAST.generateCacheBusting = function () {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

FWVAST.getNodeValue = function (element, http) {
  let childNodes = element.childNodes;
  let value = '';
  // sometimes we have may several nodes - some of which may hold whitespaces
  for (let i = 0, len = childNodes.length; i < len; i++) {
    if (childNodes[i] && childNodes[i].textContent) {
      value += childNodes[i].textContent.trim();
    }
  }
  if (value) {
    // in case we have some leftovers CDATA - mainly for VPAID
    let pattern = /^<!\[CDATA\[.*\]\]>$/i;
    if (pattern.test(value)) {
      value = value.replace('<![CDATA[', '').replace(']]>', '');
    }
    if (http) {
      let httpPattern = /^(https?:)?\/\//i;
      if (httpPattern.test(value)) {
        return value;
      }
    } else {
      return value;
    }
  }
  return null;
};

FWVAST.RFC3986EncodeURIComponent = function (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
    return '%' + c.charCodeAt(0).toString(16);
  });
};

FWVAST.isValidDuration = function (duration) {
  // HH:MM:SS or HH:MM:SS.mmm
  let skipPattern = /^\d+:\d+:\d+(\.\d+)?$/i;
  if (skipPattern.test(duration)) {
    return true;
  }
  return false;
};

FWVAST.convertDurationToSeconds = function (duration) {
  // duration is HH:MM:SS or HH:MM:SS.mmm
  // remove .mmm
  let splitNoMS = duration.split('.');
  splitNoMS = splitNoMS[0];
  let splitTime = splitNoMS.split(':');
  let seconds = 0;
  seconds = (parseInt(splitTime[0]) * 60 * 60) + (parseInt(splitTime[1]) * 60) +
    parseInt(splitTime[2]);
  return seconds;
};


FWVAST.isValidOffset = function (offset) {
  // HH:MM:SS or HH:MM:SS.mmm
  let skipPattern1 = /^\d+:\d+:\d+(\.\d+)?$/i;
  // n%
  let skipPattern2 = /^\d+%$/i;
  if (skipPattern1.test(offset) || skipPattern2.test(offset)) {
    return true;
  }
  return false;
};

FWVAST.convertOffsetToSeconds = function (offset, duration) {
  // HH:MM:SS or HH:MM:SS.mmm
  let skipPattern1 = /^\d+:\d+:\d+(\.\d+)?$/i;
  // n%
  let skipPattern2 = /^\d+%$/i;
  let seconds = 0;
  if (skipPattern1.test(offset)) {
    // remove .mmm
    let splitNoMS = offset.split('.');
    splitNoMS = splitNoMS[0];
    let splitTime = splitNoMS.split(':');
    seconds = (parseInt(splitTime[0]) * 60 * 60) + (parseInt(splitTime[1]) * 60) + parseInt(splitTime[2]);
  } else if (skipPattern2.test(offset) && duration > 0) {
    let percent = offset.split('%');
    percent = parseInt(percent[0]);
    seconds = Math.round((duration * percent) / 100);
  }
  return seconds;
};

FWVAST.dispatchPingEvent = function (event) {
  if (event) {
    let element;
    if (this.adIsLinear && this.vastPlayer) {
      element = this.vastPlayer;
    } else if (!this.adIsLinear && this.nonLinearContainer) {
      element = this.nonLinearContainer;
    }
    if (element) {
      if (Array.isArray(event)) {
        event.forEach((currentEvent) => {
          FW.createStdEvent(currentEvent, element);
        });
      } else {
        FW.createStdEvent(event, element);
      }
    }
  }
};

FWVAST.logPerformance = function (data) {
  if (window.performance && typeof window.performance.now === 'function') {
    let output = '';
    if (data) {
      output += data;
    }
    FW.log(output + ' - ' + Math.round(window.performance.now()) + ' ms');
  }
};

FWVAST.logVideoEvents = function (video) {
  let events = ['loadstart', 'durationchange', 
  'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'];
  events.forEach((value) => {
    video.addEventListener(value, (e) => {
      if (e && e.type) {
        FW.log('RMP-VAST: content player event - ' + e.type);
      }
    });
  });
};

FWVAST.filterParams = function (params) {
  let defaultParams = {
    ajaxTimeout: 8000,
    creativeLoadTimeout: 10000,
    ajaxWithCredentials: false,
    maxNumRedirects: 4,
    pauseOnClick: true,
    skipMessage: 'Skip ad',
    skipWaitingMessage: 'Skip ad in',
    textForClickUIOnMobile: 'Learn more',
    enableVpaid: false,
    vpaidSettings: {
      width: 640,
      height: 360,
      viewMode: 'normal',
      desiredBitrate: 500,
      vpaidTimeout: 8000
    }
  };
  this.params = defaultParams;
  if (params && !FW.isEmptyObject(params)) {
    if (typeof params.ajaxTimeout === 'number' && params.ajaxTimeout > 0) {
      this.params.ajaxTimeout = params.ajaxTimeout;
    }
    if (typeof params.creativeLoadTimeout === 'number' && params.creativeLoadTimeout > 0) {
      this.params.creativeLoadTimeout = params.creativeLoadTimeout;
    }
    if (typeof params.ajaxWithCredentials === 'boolean') {
      this.params.ajaxWithCredentials = params.ajaxWithCredentials;
    }
    if (typeof params.maxNumRedirects === 'number' && params.maxNumRedirects > 0 && params.maxNumRedirects !== 4) {
      this.params.maxNumRedirects = params.maxNumRedirects;
    }
    if (typeof params.pauseOnClick === 'boolean') {
      this.params.pauseOnClick = params.pauseOnClick;
    }
    if (typeof params.skipMessage === 'string') {
      this.params.skipMessage = params.skipMessage;
    }
    if (typeof params.skipWaitingMessage === 'string') {
      this.params.skipWaitingMessage = params.skipWaitingMessage;
    }
    if (typeof params.textForClickUIOnMobile === 'string') {
      this.params.textForClickUIOnMobile = params.textForClickUIOnMobile;
    }
    if (typeof params.enableVpaid === 'boolean') {
      this.params.enableVpaid = params.enableVpaid;
    }
    if (typeof params.vpaidSettings === 'object') {
      if (typeof params.vpaidSettings.width === 'number') {
        this.params.vpaidSettings.width = params.vpaidSettings.width;
      }
      if (typeof params.vpaidSettings.height === 'number') {
        this.params.vpaidSettings.height = params.vpaidSettings.height;
      }
      if (typeof params.vpaidSettings.viewMode === 'string') {
        this.params.vpaidSettings.viewMode = params.vpaidSettings.viewMode;
      }
      if (typeof params.vpaidSettings.desiredBitrate === 'number') {
        this.params.vpaidSettings.desiredBitrate = params.vpaidSettings.desiredBitrate;
      }
      if (typeof params.vpaidSettings.vpaidTimeout === 'number') {
        this.params.vpaidSettings.vpaidTimeout = params.vpaidSettings.vpaidTimeout;
      }
    }
  }
};

export { FWVAST };
