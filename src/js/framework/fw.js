export default class FW {

  static _getStyleAttributeData(element, style) {
    let styleAttributeData = 0;
    if (element && typeof window.getComputedStyle === 'function') {
      const cs = window.getComputedStyle(element, null);
      if (cs) {
        styleAttributeData = cs.getPropertyValue(style);
        styleAttributeData = styleAttributeData.toString().toLowerCase();
      }
    }
    styleAttributeData = styleAttributeData.toString();
    if (styleAttributeData.indexOf('px') > -1) {
      styleAttributeData = styleAttributeData.replace('px', '');
    }
    return parseFloat(styleAttributeData);
  }

  static createSyntheticEvent(eventName, element) {
    let event;
    if (element) {
      try {
        event = new Event(eventName);
        element.dispatchEvent(event);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  static setStyle(element, styleObject) {
    if (element && typeof styleObject === 'object') {
      const keys = Object.keys(styleObject);
      keys.forEach(key => {
        element.style[key] = styleObject[key];
      });
    }
  }

  static getWidth(element) {
    if (element) {
      if (FW.isNumber(element.offsetWidth) && element.offsetWidth !== 0) {
        return element.offsetWidth;
      } else {
        return FW._getStyleAttributeData(element, 'width');
      }
    }
    return 0;
  }

  static getHeight(element) {
    if (element) {
      if (FW.isNumber(element.offsetHeight) && element.offsetHeight !== 0) {
        return element.offsetHeight;
      } else {
        return FW._getStyleAttributeData(element, 'height');
      }
    }
    return 0;
  }

  static show(element) {
    if (element) {
      element.style.display = 'block';
    }
  }

  static hide(element) {
    if (element) {
      element.style.display = 'none';
    }
  }

  static removeElement(element) {
    if (element && element.parentNode) {
      try {
        element.parentNode.removeChild(element);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  static isNumber(n) {
    if (typeof n === 'number' && Number.isFinite(n)) {
      return true;
    }
    return false;
  }

  static openWindow(link) {
    try {
      // I would like to use named window here to have better performance like 
      // window.open(link, 'rmpVastAdPageArea'); but focus is not set on updated window with such approach
      // in MS Edge and FF - so _blank it is
      window.open(link, '_blank');
    } catch (error) {
      console.warn(error);
    }
  }

  static ajax(url, timeout, withCredentials) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.timeout = timeout;
      if (withCredentials) {
        xhr.withCredentials = true;
      }
      xhr.onloadend = () => {
        if (typeof xhr.status === 'number' && xhr.status >= 200 && xhr.status < 300) {
          resolve('XMLHttpRequest request succeeded');
        } else {
          reject('XMLHttpRequest wrong status code: ' + xhr.status);
        }
      };
      xhr.ontimeout = () => {
        reject('XMLHttpRequest timeout');
      };
      xhr.send(null);
    });
  }

  static addEvents(events, domElement, callback) {
    if (events && events.length > 1 && domElement && typeof callback === 'function') {
      events.forEach(event => {
        domElement.addEventListener(event, callback);
      });
    }
  }

  static removeEvents(events, domElement, callback) {
    if (events && events.length > 1 && domElement && typeof callback === 'function') {
      events.forEach(event => {
        domElement.removeEventListener(event, callback);
      });
    }
  }

  static clearTimeout(timeoutCallback) {
    if (typeof timeoutCallback === 'number') {
      window.clearTimeout(timeoutCallback);
    }
  }

  static clearInterval(intervalCallback) {
    if (typeof intervalCallback === 'number') {
      window.clearInterval(intervalCallback);
    }
  }

  static stopPreventEvent(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  static vastReadableTime(time) {
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
  }

  static generateCacheBusting() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  static makeButtonAccessible(element, ariaLabel) {
    // make skip button accessible
    element.tabIndex = 0;
    element.setAttribute('role', 'button');
    element.addEventListener('keyup', event => {
      const code = event.which;
      // 13 = Return, 32 = Space
      if ((code === 13) || (code === 32)) {
        event.stopPropagation();
        event.preventDefault();
        FW.createSyntheticEvent('click', element);
      }
    });
    if (ariaLabel) {
      element.setAttribute('aria-label', ariaLabel);
    }
  }

}
