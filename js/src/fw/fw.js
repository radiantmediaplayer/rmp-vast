const FW = {};

FW.isNumber = function (n) {
  if (typeof n === 'number' && isFinite(n)) {
    return true;
  }
  return false;
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

FW.hasClass = function (element, className) {
  if (element &&
    typeof element.className === 'string' && typeof className === 'string') {
    if (element.className.indexOf(className) > -1) {
      return true;
    }
    return false;
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

FW.getStyleAttributeData = function (element, style) {
  let styleAttributeData = FW.getComputedStyle(element, style) || 0;
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
      return FW.getStyleAttributeData(element, 'width');
    }
  }
  return 0;
};

FW.getHeight = function (element) {
  if (element) {
    if (typeof element.offsetHeight === 'number' && element.offsetHeight !== 0) {
      return element.offsetHeight;
    } else {
      return FW.getStyleAttributeData(element, 'height');
    }
  }
  return 0;
};

FW.getComputedStyle = function (element, style) {
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

FW.playPromise = function (video) {
  if (video) {
    let playPromise = video.play();
    // on Chrome 50+ play() returns a promise
    // https://developers.google.com/web/updates/2016/03/play-returns-promise
    // but not all browsers support this - so we just catch the potential Chrome error that 
    // may result if pause() is called in between - pause should overwrite play 
    // and in this case causes a promise rejection
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (DEBUG) {
          FW.log('RMP: playPromise on content has resolved');
        }
      }).catch((e) => {
        if (DEBUG) {
          FW.log(e);
          FW.log('RMP: playPromise on content has been rejected');
        }
      });
    }
  }
};

export { FW };