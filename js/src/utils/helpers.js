import FW from '../fw/fw';
import VAST_ERRORS from './vast-errors';

const HELPERS = {};

HELPERS.filterParams = function (inputParams) {
  const defaultParams = {
    ajaxTimeout: 5000,
    creativeLoadTimeout: 8000,
    ajaxWithCredentials: false,
    maxNumRedirects: 4,
    labels: {
      skipMessage: 'Skip ad',
      closeAd: 'Close ad',
      textForClickUIOnMobile: 'Learn more'
    },
    enableVpaid: true,
    outstream: false,
    showControlsForVastPlayer: true,
    vpaidSettings: {
      width: 640,
      height: 360,
      viewMode: 'normal',
      desiredBitrate: 500
    },
    // OM SDK params
    omidSupport: false,
    omidAllowedVendors: [],
    omidPathTo: '../externals/omweb-v1.js',
    autoplay: false,
    partnerName: 'Radiantmediaplayer',
    partnerVersion: '6.3.0'
  };
  this.params = defaultParams;
  if (inputParams && typeof inputParams === 'object') {
    const keys = Object.keys(inputParams);
    for (let i = 0, len = keys.length; i < len; i++) {
      const prop = keys[i];
      if (typeof inputParams[prop] === typeof this.params[prop]) {
        if ((FW.isNumber(inputParams[prop]) && inputParams[prop] > 0) || typeof inputParams[prop] !== 'number') {
          if (prop === 'vpaidSettings') {
            if (FW.isNumber(inputParams.vpaidSettings.width) && inputParams.vpaidSettings.width > 0) {
              this.params.vpaidSettings.width = inputParams.vpaidSettings.width;
            }
            if (FW.isNumber(inputParams.vpaidSettings.height) && inputParams.vpaidSettings.height > 0) {
              this.params.vpaidSettings.height = inputParams.vpaidSettings.height;
            }
            if (typeof inputParams.vpaidSettings.viewMode === 'string' && inputParams.vpaidSettings.viewMode === 'fullscreen') {
              this.params.vpaidSettings.viewMode = inputParams.vpaidSettings.viewMode;
            }
            if (FW.isNumber(inputParams.vpaidSettings.desiredBitrate) && inputParams.vpaidSettings.desiredBitrate > 0) {
              this.params.vpaidSettings.desiredBitrate = inputParams.vpaidSettings.desiredBitrate;
            }
          } else {
            this.params[prop] = inputParams[prop];
          }
        }
      }
    }
  }
};

const _createEvent = function (event) {
  if (typeof event === 'string' && event !== '') {
    if (this.debug) {
      FW.log(event);
    }
    FW.createStdEvent(event, this.container);
  }
};

HELPERS.createApiEvent = function (event) {
  // adloaded, addurationchange, adclick, adimpression, adstarted, 
  // adtagloaded, adtagstartloading, adpaused, adresumed 
  // advolumemuted, advolumechanged, adcomplete, adskipped, 
  // adskippablestatechanged, adclosed
  // adfirstquartile, admidpoint, adthirdquartile, aderror, 
  // addestroyed
  // adlinearchange, adexpandedchange, adremainingtimechange 
  // adinteraction, adsizechange
  if (Array.isArray(event)) {
    event.forEach(currentEvent => {
      _createEvent.call(this, currentEvent);
    });
  } else {
    _createEvent.call(this, event);
  }
};

HELPERS.playPromise = function (whichPlayer, firstPlayerPlayRequest) {
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
    const playPromise = targetPlayer.play();
    // most modern browsers support play as a Promise
    // this lets us handle autoplay rejection 
    // https://developers.google.com/web/updates/2016/03/play-returns-promise
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (firstPlayerPlayRequest) {
          if (this.debug) {
            FW.log('initial play promise on ' + whichPlayer + ' player has succeeded');
          }
          HELPERS.createApiEvent.call(this, 'adinitialplayrequestsucceeded');
        }
      }).catch((e) => {
        if (firstPlayerPlayRequest && whichPlayer === 'vast' && this.creative.isLinear) {
          if (this.debug) {
            FW.log('initial play promise on VAST player has been rejected for linear asset - likely autoplay is being blocked', e);
          }
          VAST_ERRORS.process.call(this, 400, true);
          HELPERS.createApiEvent.call(this, 'adinitialplayrequestfailed');
        } else if (firstPlayerPlayRequest && whichPlayer === 'content' && !this.creative.isLinear) {
          if (this.debug) {
            FW.log('initial play promise on content player has been rejected for non-linear asset - likely autoplay is being blocked', e);
          }
          HELPERS.createApiEvent.call(this, 'adinitialplayrequestfailed');
        } else {
          if (this.debug) {
            FW.log('playPromise on ' + whichPlayer + ' player has been rejected', e);
          }
        }
      });
    }
  }
};

HELPERS.accessibleButton = function (element, ariaLabel) {
  // make skip button accessible
  element.tabIndex = 0;
  element.setAttribute('role', 'button');
  element.addEventListener('keyup', (event) => {
    const code = event.which;
    // 13 = Return, 32 = Space
    if ((code === 13) || (code === 32)) {
      event.stopPropagation();
      event.preventDefault();
      FW.createStdEvent('click', element);
    }
  });
  if (ariaLabel) {
    element.setAttribute('aria-label', ariaLabel);
  }
};

export default HELPERS;
