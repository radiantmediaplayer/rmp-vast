import FW from '../fw/fw';
import CONTENTPLAYER from '../players/content-player';

const PING = {};

PING.events = [
  'impression',
  'creativeView',
  'start',
  'firstQuartile',
  'midpoint',
  'thirdQuartile',
  'complete',
  'mute',
  'unmute',
  'pause',
  'resume',
  'fullscreen',
  'exitFullscreen',
  'skip',
  'progress',
  'clickthrough',
  'close',
  'collapse',
  'acceptInvitation'
];

const _replaceMacros = function (url, errorCode, assetUri) {
  const pattern1 = /\[CACHEBUSTING\]/gi;
  let finalString = url;
  if (pattern1.test(finalString)) {
    finalString = finalString.replace(pattern1, FW.generateCacheBusting());
  }
  const pattern2 = /\[ERRORCODE\]/gi;
  if (pattern2.test(finalString) && FW.isNumber(errorCode) && errorCode > 0 && errorCode < 1000) {
    finalString = finalString.replace(pattern2, errorCode);
  }
  const pattern3 = /\[CONTENTPLAYHEAD\]/gi;
  let currentTime = CONTENTPLAYER.getCurrentTime.call(this);
  if (pattern3.test(finalString) && currentTime > -1) {
    currentTime = FW.vastReadableTime(currentTime);
    finalString = finalString.replace(pattern3, FW.RFC3986EncodeURIComponent(currentTime));
  }
  const pattern4 = /\[ASSETURI\]/gi;
  if (pattern4.test(finalString) && typeof assetUri === 'string' && assetUri !== '') {
    finalString = finalString.replace(pattern4, FW.RFC3986EncodeURIComponent(assetUri));
  }
  return finalString;
};

const _ping = function (url) {
  // we expect an image format for the tracker (generally a 1px GIF/PNG/JPG) as 
  // this is the most common format in the industry 
  // other format may produce errors and the related tracker may not be requested properly
  let img = new Image();
  img.addEventListener('load', () => {
    if (DEBUG) {
      FW.log('VAST tracker successfully loaded ' + url);
    }
    img = null;
  });
  img.addEventListener('error', () => {
    if (DEBUG) {
      FW.log('VAST tracker failed loading ' + url);
    }
    img = null;
  });
  img.src = url;
};

PING.tracking = function (url, assetUri) {
  const trackingUrl = _replaceMacros.call(this, url, null, assetUri);
  _ping(trackingUrl);
  if (DEBUG) {
    FW.log('VAST tracking requesting ping at URL ' + trackingUrl);
  }
};

PING.error = function (errorCode) {
  // for each Error tag within an InLine or chain of Wrapper ping error URL
  let errorTags = this.inlineOrWrapperErrorTags;
  if (errorCode === 303 && this.vastErrorTags.length > 0) {
    // here we ping vastErrorTags with error code 303 according to spec
    // concat array thus
    errorTags = [...errorTags, ...this.vastErrorTags];
  }
  if (errorTags.length > 0) {
    for (let i = 0, len = errorTags.length; i < len; i++) {
      let errorUrl = _replaceMacros.call(this, errorTags[i].url, errorCode, null);
      _ping(errorUrl);
      if (DEBUG) {
        FW.log('VAST tracking requesting error at URL ' + errorUrl);
      }
    }
  }
};

export default PING;
