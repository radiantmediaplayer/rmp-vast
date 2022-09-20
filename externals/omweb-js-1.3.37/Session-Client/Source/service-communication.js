/**
 * @fileoverview A set of functions for setting up communication with the OM SDK
 * service script from either the session client or the verification client.
 */
goog.module('omid.common.serviceCommunication');

const Communication = goog.require('omid.common.Communication');
const DirectCommunication = goog.require('omid.common.DirectCommunication');
const PostMessageCommunication = goog.require('omid.common.PostMessageCommunication');
const {isOmidPresent} = goog.require('omid.common.DetectOmid');
const {isCrossOrigin, resolveTopWindowContext} = goog.require('omid.common.windowUtils');

/**
 * The keypath of the communication exported by the OMID SessionService.
 * @const {!Array<string>}
 */
const EXPORTED_SESSION_COMMUNICATION_NAME =
    ['omid', 'v1_SessionServiceCommunication'];

/**
 * The keypath of the communication exported by the OMID VerificationService.
 * @const {!Array<string>}
 */
const EXPORTED_VERIFICATION_COMMUNICATION_NAME =
    ['omid', 'v1_VerificationServiceCommunication'];

/**
 * The keypath of a reference to the service window exported by the OMID
 * VerificationService in omid.service.VerificationInjector.
 * @const {!Array<string>}
 */
const EXPORTED_SERVICE_WINDOW_NAME =
    ['omidVerificationProperties', 'serviceWindow'];

/**
 * Gets the value for an unobfuscated keypath of an object. The key may be
 * arbitrarily deep in the object.
 * @param {!Object} object The object to query.
 * @param {!Array<string>} unobfuscatedKeypath The keypath of the property.
 * @return {!Object|undefined} The value at the keypath, or undefined if not
 *     found.
 */
function getValueForKeypath(object, unobfuscatedKeypath) {
  return unobfuscatedKeypath.reduce(
      (subObject, key) => subObject && subObject[key], object);
}

/**
 * Starts communication with the OM SDK Service.
 * @param {!Window} clientGlobal The client's window or global object.
 * @param {!Window} serviceGlobal The service's window or global object.
 * @param {!Array<string>} exportedCommunicationName The unobfuscated name of
 *     the DirectCommunication as exported in the serviceGlobal.
 * @param {function(!Window): boolean} omidPresenceCallback Callback used to
 *     check if the OM SDK Service is present in a cross-origin iframe.
 * @return {?Communication<?>} A communication object connected to the service,
 *     or null if unavailable.
 */
function startServiceCommunication(
    clientGlobal, serviceGlobal, exportedCommunicationName,
    omidPresenceCallback) {
  // Prefer direct communication first.
  if (!isCrossOrigin(serviceGlobal)) {
    // As a paranoid safeguard, wrap direct access in a try catch.
    try {
      const directCommunication = getValueForKeypath(
          serviceGlobal, exportedCommunicationName);
      if (directCommunication) {
        return new DirectCommunication(
            /** @type {!DirectCommunication} */ (directCommunication));
      }
      // Do nothing, fall back to post message communication.
    } catch (e) {
    }
  }
  if (omidPresenceCallback(serviceGlobal)) {
    return new PostMessageCommunication(clientGlobal, serviceGlobal);
  }
  return null;
}

/**
 * Runs through the serviceGlobalCandidates in order and tries starting a
 * service communication with each, returning the first valid one started.
 * @param {!Window} clientGlobal The client's window or global object.
 * @param {!Array<!Window>} serviceGlobalCandidates A list of serviceGlobals
 *     with which to try starting a service communication.
 * @param {!Array<string>} exportedCommunicationName The unobfuscated name of
 *     the DirectCommunication as exported in the serviceGlobal candidates.
 * @param {function(!Window): boolean} omidPresenceCallback Callback used to
 *     check if the OM SDK Service is present in a cross-origin iframe.
 * @return {?Communication<?>} A communication object connected to the service,
 *     or null if unavailable.
 */
function startServiceCommunicationFromCandidates(
    clientGlobal, serviceGlobalCandidates, exportedCommunicationName,
    omidPresenceCallback) {
  // Try starting communication with each candidate, using first valid one.
  for (const serviceGlobal of serviceGlobalCandidates) {
    const communication = startServiceCommunication(
        clientGlobal, serviceGlobal, exportedCommunicationName,
        omidPresenceCallback);
    if (communication) {
      return communication;
    }
  }
  return null;
}

/**
 * Starts communication with the OMID SessionService.
 * @param {!Window} clientGlobal The session client's window or global object.
 * @param {!Window=} serviceGlobal A global with which to attempt service
 *     communication first, overriding the default search algorithm.
 * @param {function(!Window): boolean=} omidPresenceCallback Callback used to
 *     check if the OM SDK Service is present in a cross-origin iframe.
 * @return {?Communication<?>} A communication object connected to the service,
 *     or null if unavailable.
 */
function startSessionServiceCommunication(
    clientGlobal, serviceGlobal = undefined,
    omidPresenceCallback = isOmidPresent) {
  // Try a direct communication on the current global (DOM-less environments),
  // or try direct on top, or finally, post on top.
  const serviceGlobalCandidates =
      [clientGlobal, resolveTopWindowContext(clientGlobal)];
  if (serviceGlobal) {
    serviceGlobalCandidates.unshift(serviceGlobal);
  }
  return startServiceCommunicationFromCandidates(
      clientGlobal, serviceGlobalCandidates,
      EXPORTED_SESSION_COMMUNICATION_NAME, omidPresenceCallback);
}

/**
 * Starts communication with the OMID VerificationService.
 * @param {!Window} clientGlobal The verification client's window or global
 *     object.
 * @param {function(!Window): boolean=} omidPresenceCallback Callback used to
 *     check if the OM SDK Service is present in a cross-origin iframe.
 * @return {?Communication<?>} A communication object connected to the service,
 *     or null if unavailable.
 */
function startVerificationServiceCommunication(
    clientGlobal, omidPresenceCallback = isOmidPresent) {
  const serviceGlobalCandidates = [];
  // If the service script has told us which window to use, use that one.
  const providedServiceWindow = getValueForKeypath(
      clientGlobal, EXPORTED_SERVICE_WINDOW_NAME);
  if (providedServiceWindow) {
    serviceGlobalCandidates.push(providedServiceWindow);
  }
  // Otherwise, fall back to the old strategy of always using top.
  serviceGlobalCandidates.push(resolveTopWindowContext(clientGlobal));

  return startServiceCommunicationFromCandidates(
      clientGlobal, serviceGlobalCandidates,
      EXPORTED_VERIFICATION_COMMUNICATION_NAME, omidPresenceCallback);
}

exports = {
  startSessionServiceCommunication,
  startVerificationServiceCommunication,
};
