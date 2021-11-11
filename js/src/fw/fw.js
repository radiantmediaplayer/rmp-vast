const FW = {};

FW.nullFn = function () {
  return null;
};

FW.createStdEvent = function (eventName, element) {
  let event;
  if (element) {
    try {
      event = new Event(eventName);
      element.dispatchEvent(event);
    } catch (e) {
      console.trace(e);
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

FW.setStyle = function (element, styleObject) {
  if (element && typeof styleObject === 'object') {
    const keys = Object.keys(styleObject);
    for (let i = 0, len = keys.length; i < len; i++) {
      const currentKey = keys[i];
      element.style[currentKey] = styleObject[currentKey];
    }
  }
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

FW.isEmptyObject = function (obj) {
  if (obj && typeof obj === 'object' && Object.keys(obj).length === 0) {
    return true;
  }
  return false;
};

const consoleStyleOne = 'color: white; background-color: #00ACC1; padding:1px 3px; border-radius: 3px; margin-right: 7px';
let hasLog = false;
let hasDir = false;
let hasTrace = false;
if (typeof console !== 'undefined') {
  if (typeof console.log === 'function') {
    hasLog = true;
  }
  if (typeof console.dir === 'function') {
    hasDir = true;
  }
  if (typeof console.trace === 'function') {
    hasTrace = true;
  }
}

FW.log = function (text, data) {
  if (hasLog) {
    if (typeof text === 'string') {
      console.log('%crmp-vast%c' + text, consoleStyleOne, '');
    }
    if (hasDir && typeof data === 'object') {
      console.dir(data);
    }
  }
};

FW.trace = function (data) {
  if (hasTrace) {
    console.trace(data);
  } else if (hasLog) {
    FW.log(data);
  }
};

FW.logVideoEvents = function (video, type) {
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
};

FW.isNumber = function (n) {
  if (typeof n !== 'undefined' && typeof n === 'number' && Number.isFinite(n)) {
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
