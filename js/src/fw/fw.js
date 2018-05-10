const FW = {};

import { API } from '../api/api';
import { VASTERRORS } from '../utils/vast-errors';
import { PING } from '../tracking/ping';

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
      element.className = (element.className.replace(className, '')).replace(/\s\s+/g, ' ');
    }
  }
};

FW.createStdEvent = function (eventName, element) {
  let event;
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

var _getComputedStyle = function (element, style) {
  let propertyValue = '';
  if (element && typeof window.getComputedStyle === 'function') {
    let cs = window.getComputedStyle(element, null);
    if (cs) {
      propertyValue = cs.getPropertyValue(style);
      propertyValue = propertyValue.toString().toLowerCase();
    }
  }
  return propertyValue;
};

var _getStyleAttributeData = function (element, style) {
  let styleAttributeData = _getComputedStyle(element, style) || 0;
  styleAttributeData = styleAttributeData.toString();
  if (styleAttributeData.indexOf('px') > -1) {
    styleAttributeData = styleAttributeData.replace('px', '');
  }
  return parseFloat(styleAttributeData);
};

FW.getWidth = function (element) {
  if (element) {
    if (typeof element.offsetWidth === 'number' && element.offsetWidth !== 0) {
      return element.offsetWidth;
    } else {
      return _getStyleAttributeData(element, 'width');
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

FW.isEmptyObject = function (obj) {
  if (Object.keys(obj).length === 0 && obj.constructor === Object) {
    return true;
  }
  return false;
};

FW.ajax = function (url, timeout, returnData, withCredentials) {
  return new Promise((resolve, reject) => {
    if (window.XMLHttpRequest) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.timeout = timeout;
      if (withCredentials) {
        xhr.withCredentials = true;
      }
      xhr.onloadend = function () {
        if (typeof xhr.status === 'number' && xhr.status >= 200 && xhr.status < 300) {
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
        FW.log('RMP: XMLHttpRequest timeout');
        reject();
      };
      xhr.send(null);
    } else {
      reject();
    }
  });
};

FW.log = function (data) {
  if (data && window.console && typeof window.console.log === 'function') {
    window.console.log(data);
  }
};

FW.trace = function (data) {
  if (data && window.console && typeof window.console.trace === 'function') {
    window.console.trace(data);
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

FW.generateCacheBusting = function () {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

FW.getNodeValue = function (element, http) {
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

FW.RFC3986EncodeURIComponent = function (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
    return '%' + c.charCodeAt(0).toString(16);
  });
};

FW.isValidDuration = function (duration) {
  // HH:MM:SS or HH:MM:SS.mmm
  let skipPattern = /^\d+:\d+:\d+(\.\d+)?$/i;
  if (skipPattern.test(duration)) {
    return true;
  }
  return false;
};

FW.convertDurationToSeconds = function (duration) {
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


FW.isValidOffset = function (offset) {
  // HH:MM:SS or HH:MM:SS.mmm
  let skipPattern1 = /^\d+:\d+:\d+(\.\d+)?$/i;
  // n%
  let skipPattern2 = /^\d+%$/i;
  if (skipPattern1.test(offset) || skipPattern2.test(offset)) {
    return true;
  }
  return false;
};

FW.convertOffsetToSeconds = function (offset, duration) {
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

FW.dispatchPingEvent = function (event) {
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

FW.logPerformance = function (data) {
  if (window.performance && typeof window.performance.now === 'function') {
    let output = '';
    if (data) {
      output += data;
    }
    FW.log(output + ' - ' + Math.round(window.performance.now()) + ' ms');
  }
};

FW.logVideoEvents = function (video) {
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

FW.filterParams = function (params) {
  let defaultParams = {
    ajaxTimeout: 8000,
    creativeLoadTimeout: 10000,
    ajaxWithCredentials: false,
    maxNumRedirects: 4,
    pauseOnClick: true,
    skipMessage: 'Skip ad',
    skipWaitingMessage: 'Skip ad in',
    textForClickUIOnMobile: 'Learn more',
    enableVpaid: true,
    vpaidSettings: {
      width: 640,
      height: 360,
      viewMode: 'normal',
      desiredBitrate: 500
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
    }
  }
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

FW.playPromise = function (whichPlayer, firstPlayerPlayRequest) {
  let targetPlayer;
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
    let playPromise = targetPlayer.play();
    // most modern browsers support play as a Promise
    // this lets us handle autoplay rejection 
    // https://developers.google.com/web/updates/2016/03/play-returns-promise
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (firstPlayerPlayRequest) {
          if (DEBUG) {
            FW.log('RMP-VAST: initial play promise on ' + whichPlayer + ' player has succeeded');
          }
          API.createEvent.call(this, 'adinitialplayrequestsucceeded');
        }
      }).catch((e) => {
        if (firstPlayerPlayRequest && whichPlayer === 'vast' && this.adIsLinear) {
          if (DEBUG) {
            FW.log(e);
            FW.log('RMP-VAST: initial play promise on VAST player has been rejected for linear asset - likely autoplay is being blocked');
          }
          PING.error.call(this, 400, this.inlineOrWrapperErrorTags);
          VASTERRORS.process.call(this, 400);
          API.createEvent.call(this, 'adinitialplayrequestfailed');
        } else if (firstPlayerPlayRequest && whichPlayer === 'content' && !this.adIsLinear) {
          if (DEBUG) {
            FW.log(e);
            FW.log('RMP-VAST: initial play promise on content player has been rejected for non-linear asset - likely autoplay is being blocked');
          }
          API.createEvent.call(this, 'adinitialplayrequestfailed');
        } else {
          if (DEBUG) {
            FW.log(e);
            FW.log('RMP-VAST: playPromise on ' + whichPlayer + ' player has been rejected');
          }
        }
      });
    }
  }
};


export { FW };