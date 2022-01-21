
const CONSOLE_STYLE = 'color: white; background-color: #00ACC1; padding:1px 3px; border-radius: 3px; margin-right: 7px';

export default class FW {

  _getComputedStyle(element, style) {
    let propertyValue = '';
    if (element && typeof window.getComputedStyle === 'function') {
      const cs = window.getComputedStyle(element, null);
      if (cs) {
        propertyValue = cs.getPropertyValue(style);
        propertyValue = propertyValue.toString().toLowerCase();
      }
    }
    return propertyValue;
  }

  _getStyleAttributeData(element, style) {
    let styleAttributeData = FW._getComputedStyle(element, style) || 0;
    styleAttributeData = styleAttributeData.toString();
    if (styleAttributeData.indexOf('px') > -1) {
      styleAttributeData = styleAttributeData.replace('px', '');
    }
    return parseFloat(styleAttributeData);
  }

  static nullFn() {
    return null;
  }

  static createStdEvent(eventName, element) {
    let event;
    if (element) {
      try {
        event = new Event(eventName);
        element.dispatchEvent(event);
      } catch (e) {
        console.trace(e);
      }
    }
  }

  static setStyle(element, styleObject) {
    if (element && typeof styleObject === 'object') {
      const keys = Object.keys(styleObject);
      for (let i = 0, len = keys.length; i < len; i++) {
        const currentKey = keys[i];
        element.style[currentKey] = styleObject[currentKey];
      }
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
      } catch (e) {
        console.trace(e);
      }
    }
  }

  static isEmptyObject(obj) {
    if (obj && typeof obj === 'object' && Object.keys(obj).length === 0) {
      return true;
    }
    return false;
  }

  static log(text, data) {
    if (typeof text === 'string') {
      console.log('%crmp-vast%c' + text, CONSOLE_STYLE, '');
    }
    if (typeof data === 'object') {
      console.dir(data);
    }
  }

  static logVideoEvents(video, type) {
    const events = [
      'loadstart',
      'durationchange',
      'playing',
      'waiting',
      'loadedmetadata',
      'loadeddata',
      'canplay',
      'canplaythrough'
    ];
    events.forEach((value) => {
      video.addEventListener(value, (e) => {
        if (e && e.type) {
          FW.log(type + ' player event - ' + e.type);
        }
      });
    });
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
    } catch (e) {
      console.trace(e);
    }
  }

}
