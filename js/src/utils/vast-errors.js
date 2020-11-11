import FW from '../fw/fw';
import HELPERS from '../utils/helpers';
import TRACKING_EVENTS from '../tracking/tracking-events';
import VAST_PLAYER from '../players/vast-player';

const VAST_ERRORS = {};

// Indicates that the error was encountered when the ad was being loaded. 
// Possible causes: there was no response from the ad server, malformed ad response was returned ...
// 300, 301, 302, 303, 304 Wrapper errors are managed in ast-client-js
const loadErrorList = [
  303,
  900,
  1001
];

// Indicates that the error was encountered after the ad loaded, during ad play. 
// Possible causes: ad assets could not be loaded, etc.
const playErrorList = [
  201, 204, 205,
  400, 401, 402, 403,
  501, 502, 503,
  603,
  901,
  1002
];

const vastErrorsList = [{
  code: 201,
  description: 'Video player expecting different linearity.'
}, {
  code: 204,
  description: 'Ad category was required but not provided.'
}, {
  code: 205,
  description: 'Inline Category violates Wrapper BlockedAdCategories.'
}, {
  code: 303,
  description: 'No VAST response after one or more Wrappers.'
}, {
  code: 400,
  description: 'General Linear error. Video player is unable to display the Linear Ad.'
}, {
  code: 401,
  description: 'File not found. Unable to find Linear/MediaFile from URI.'
}, {
  code: 402,
  description: 'Timeout of MediaFile URI.'
}, {
  code: 403,
  description: 'Couldn\'t find MediaFile that is supported by this video player, based on the attributes of the MediaFile element.'
}, {
  code: 501,
  description: 'Unable to display NonLinear Ad because creative dimensions do not align with creative display area (i.e. creative dimension too large).'
}, {
  code: 502,
  description: 'Unable to fetch NonLinearAds/NonLinear resource.'
}, {
  code: 503,
  description: 'Couldn\'t find NonLinear resource with supported type.'
}, {
  code: 603,
  description: 'Unable to fetch CompanionAds/Companion resource.'
}, {
  code: 900,
  description: 'Undefined Error.'
}, {
  code: 901,
  description: 'General VPAID error.'
}, {
  code: 1001,
  description: 'Invalid input for loadAds method'
}, {
  code: 1002,
  description: 'Required DOMParser API is not available'
}];

const _updateVastError = function (errorCode) {
  const error = vastErrorsList.filter((value) => {
    return value.code === errorCode;
  });
  if (error.length > 0) {
    this.vastErrorCode = error[0].code;
    this.vastErrorMessage = error[0].description;
  } else {
    this.vastErrorCode = -1;
    this.vastErrorMessage = 'Error getting VAST error';
  }
  if (this.vastErrorCode > -1) {
    if (loadErrorList.indexOf(this.vastErrorCode) > -1) {
      this.adErrorType = 'adLoadError';
    } else if (playErrorList.indexOf(this.vastErrorCode) > -1) {
      this.adErrorType = 'adPlayError';
    }
  }
  if (this.debug) {
    FW.log('VAST error code is ' + this.vastErrorCode +
      ' - VAST error message is ' + this.vastErrorMessage +
      ' - Ad error type is ' + this.adErrorType);
  }
};

VAST_ERRORS.process = function (errorCode, ping) {
  if (ping) {
    TRACKING_EVENTS.error.call(this, errorCode);
  }
  _updateVastError.call(this, errorCode);
  HELPERS.createApiEvent.call(this, 'aderror');
  VAST_PLAYER.resumeContent.call(this);
};

export default VAST_ERRORS;
