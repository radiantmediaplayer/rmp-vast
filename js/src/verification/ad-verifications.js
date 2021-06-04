import FW from '../fw/fw';
import TRACKING_EVENTS from '../tracking/tracking-events';

const AD_VERIFICATIONS = {};

const _pingVerificationNotExecuted = function (verification, reasonCode, debug) {
  if (typeof verification.trackingEvents !== 'undefined' &&
    Array.isArray(verification.trackingEvents.verificationNotExecuted) &&
    verification.trackingEvents.verificationNotExecuted.length > 0) {
    verification.trackingEvents.verificationNotExecuted.forEach((verificationNotExecutedURI) => {
      let validatedURI = verificationNotExecutedURI;
      const reasonPattern = /\[REASON\]/gi;
      if (reasonPattern.test(validatedURI)) {
        validatedURI = validatedURI.replace(reasonPattern, reasonCode);
      }
      if (debug) {
        FW.log('AD_VERIFICATIONS: ping VerificationNotExecuted at URI ' + validatedURI);
      }
      TRACKING_EVENTS.pingURI(validatedURI);
    });
  }
};

AD_VERIFICATIONS.init = function (adVerifications, debug) {
  if (debug) {
    FW.log('AD_VERIFICATIONS: init');
  }
  // remove executable to only have JavaScriptResource
  const validatedVerificationArray = [];
  // we only execute browserOptional="false" unless there are none 
  // in which case we will look for browserOptional="true"
  let browserOptional = [];
  for (let i = 0, len = adVerifications.length; i < len; i++) {
    const verification = adVerifications[i];
    if (typeof verification.resource !== 'string' || verification.resource === '') {
      continue;
    }
    // Ping rejection code 2
    // Verification not supported. The API framework or language type of
    // verification resources provided are not implemented or supported by
    // the player/SDK
    if (typeof verification.type !== 'undefined' && verification.type === 'executable') {
      _pingVerificationNotExecuted(verification, '2', debug);
      continue;
    }
    if (typeof verification.browserOptional !== 'undefined' && verification.browserOptional === true) {
      browserOptional.push(i);
      continue;
    }
    validatedVerificationArray.push(verification);
  }
  if (validatedVerificationArray.length === 0 && browserOptional.length > 0) {
    for (let j = 0, lenj = browserOptional.length; j < lenj; j++) {
      validatedVerificationArray.push(adVerifications[browserOptional[j]]);
    }
  }
  // start loading adVerifications now as 
  // player should execute them BEFORE creative playback begins
  for (let i = 0, len = validatedVerificationArray.length; i < len; i++) {
    const verification = validatedVerificationArray[i];
    const script = document.createElement('script');
    script.src = verification.resource;
    if (debug) {
      FW.log('AD_VERIFICATIONS: load verification resource at URI ' + verification.resource);
    }
    // Ping rejection code 3
    // Error during resource load. The player/SDK was not able to fetch the
    // verification resource, or some error occurred that the player/SDK was
    // able to detect
    script.onerror = _pingVerificationNotExecuted.bind(null, verification, '3', debug);
    FW.appendToHead(script);
  }
};

export default AD_VERIFICATIONS;
