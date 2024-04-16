import Logger from './logger';


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
        Logger.print('warning', error);
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
        Logger.print('warning', error);
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
      Logger.print('warning', error);
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

}
