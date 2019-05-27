const FW = {};

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

const _getComputedStyle = function (element, style) {
  let propertyValue = '';
  if (element && typeof window.getComputedStyle === 'function') {
    const cs = window.getComputedStyle(element, null);
    if (cs) {
      propertyValue = cs.getPropertyValue(style);
      propertyValue = propertyValue.toString().toLowerCase();
    }
  }
  return propertyValue;
};

const _getStyleAttributeData = function (element, style) {
  let styleAttributeData = _getComputedStyle(element, style) || 0;
  styleAttributeData = styleAttributeData.toString();
  if (styleAttributeData.indexOf('px') > -1) {
    styleAttributeData = styleAttributeData.replace('px', '');
  }
  return parseFloat(styleAttributeData);
};

FW.getWidth = function (element) {
  if (element) {
    if (FW.isNumber(element.offsetWidth) && element.offsetWidth !== 0) {
      return element.offsetWidth;
    } else {
      return _getStyleAttributeData(element, 'width');
    }
  }
  return 0;
};

FW.getHeight = function (element) {
  if (element) {
    if (FW.isNumber(element.offsetHeight) && element.offsetHeight !== 0) {
      return element.offsetHeight;
    } else {
      return _getStyleAttributeData(element, 'height');
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

FW.removeElement = function (element) {
  if (element && element.parentNode) {
    try {
      element.parentNode.removeChild(element);
    } catch (e) {
      FW.trace(e);
    }
  }
};

FW.ajax = function (url, timeout, returnData, withCredentials) {
  return new Promise((resolve, reject) => {
    if (window.XMLHttpRequest) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.timeout = timeout;
      if (withCredentials) {
        xhr.withCredentials = true;
      }
      xhr.onloadend = function () {
        if (FW.isNumber(xhr.status) && xhr.status >= 200 && xhr.status < 300) {
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
        FW.log('XMLHttpRequest timeout');
        reject();
      };
      xhr.send(null);
    } else {
      reject();
    }
  });
};

const consoleStyleOne = 'color: white; background-color: #00ACC1; padding:1px 3px; border-radius: 3px; margin-right: 7px';
let hasLog = false;
let hasDir = false;
let hasTrace = false;
if (typeof window.console !== 'undefined') {
  if (typeof window.console.log === 'function') {
    hasLog = true;
  }
  if (typeof window.console.dir === 'function') {
    hasDir = true;
  }
  if (typeof window.console.trace === 'function') {
    hasTrace = true;
  }
}

FW.log = function (data) {
  if (hasLog) {
    if (typeof data === 'string') {
      window.console.log('%crmp-vast%c' + data, consoleStyleOne, '');
    } else if (hasDir && typeof data === 'object') {
      window.console.dir(data);
    } else {
      window.console.log(data);
    }
  }
};

FW.trace = function (data) {
  if (DEBUG) {
    if (hasTrace) {
      window.console.trace(data);
    } else if (hasLog) {
      FW.log(data);
    }
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
  if (FW.isNumber(time) && time >= 0) {
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
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

FW.getNodeValue = function (element, http) {
  const childNodes = element.childNodes;
  let value = '';
  // sometimes we have may several nodes - some of which may hold whitespaces
  for (let i = 0, len = childNodes.length; i < len; i++) {
    if (childNodes[i] && childNodes[i].textContent) {
      value += childNodes[i].textContent.trim();
    }
  }
  if (value) {
    // in case we have some leftovers CDATA - mainly for VPAID
    const pattern = /^<!\[CDATA\[.*\]\]>$/i;
    if (pattern.test(value)) {
      value = value.replace('<![CDATA[', '').replace(']]>', '');
    }
    if (http) {
      const httpPattern = /^(https?:)?\/\//i;
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
  const skipPattern = /^\d+:\d+:\d+(\.\d+)?$/i;
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
  const splitTime = splitNoMS.split(':');
  let seconds = 0;
  seconds = (parseInt(splitTime[0]) * 60 * 60) + (parseInt(splitTime[1]) * 60) +
    parseInt(splitTime[2]);
  return seconds;
};

// HH:MM:SS or HH:MM:SS.mmm
const skipPattern1 = /^\d+:\d+:\d+(\.\d+)?$/i;
// n%
const skipPattern2 = /^\d+%$/i;
FW.isValidOffset = function (offset) {
  if (skipPattern1.test(offset) || skipPattern2.test(offset)) {
    return true;
  }
  return false;
};

FW.convertOffsetToSeconds = function (offset, duration) {
  let seconds = 0;
  if (skipPattern1.test(offset)) {
    // remove .mmm
    let splitNoMS = offset.split('.');
    splitNoMS = splitNoMS[0];
    const splitTime = splitNoMS.split(':');
    seconds = (parseInt(splitTime[0]) * 60 * 60) + (parseInt(splitTime[1]) * 60) + parseInt(splitTime[2]);
  } else if (skipPattern2.test(offset) && duration > 0) {
    let percent = offset.split('%');
    percent = parseInt(percent[0]);
    seconds = Math.round((duration * percent) / 100);
  }
  return seconds;
};

FW.logVideoEvents = function (video, type) {
  const events = ['loadstart', 'durationchange',
    'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'];
  events.forEach((value) => {
    video.addEventListener(value, (e) => {
      if (e && e.type) {
        FW.log(type + ' player event - ' + e.type);
      }
    });
  });
};

FW.isNumber = function (n) {
  if (typeof n !== 'undefined' && typeof n === 'number' && Number.isFinite(n)) {
    return true;
  }
  return false;
};

FW.isObject = function (obj) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj === 'object') {
    return true;
  }
  return false;
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

export default FW;
