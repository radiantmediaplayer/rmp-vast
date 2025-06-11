/**
 * @fileoverview Logic for OM SDK for Web CTV
 */
goog.module('omid.common.webtvUtils');

// LG webOS TV Integration

/**
 * @typedef {{
 *   deviceInfo: string,
 *   identifier: string,
 * }}
 */
let WebOSSystem;
const WEBOSSYSTEM = 'webOSSystem';

/**
 * Gets webOSSystem object if it exists on the device (may not be available on
 * webOS simulator)
 * @param {!Window} windowContext The window context
 * @return {WebOSSystem|undefined} the webOSSystem object
 */
function getWebOSSystem(windowContext) {
  if (typeof windowContext === 'object' &&
    typeof windowContext[WEBOSSYSTEM] === 'object') {
    return windowContext[WEBOSSYSTEM];
  }
  return undefined;
}
exports.getWebOSSystem = getWebOSSystem;

/**
 * Gets if environment is an LG webOS device
 * @param {!Window} windowContext The window context
 * @return {boolean} whether it's an webOS device
 */
function isWebOS(windowContext) {
  return typeof getWebOSSystem(windowContext) === 'object';
}
exports.isWebOS = isWebOS;

// TIZEN integration

// Global object provides CTV API support on Samsung Tizen Smart TVs
/**
 * @typedef {{
 *   tvinputdevice: ?,
* }}
*/
let Tizen;
const TIZEN = 'tizen';

/**
 * Gets Tizen object on the device
 * @param {!Window} windowContext The window context
 * @return {Tizen|undefined} the tizen object
 */
function getTizen(windowContext) {
  if (typeof windowContext === 'object' &&
    typeof windowContext[TIZEN] === 'object') {
    return windowContext[TIZEN];
  }
  return undefined;
}
exports.getTizen = getTizen;

/**
 * Gets if environment is a Tizen
 * @param {!Window} windowContext The window context
 * @return {boolean} The web app is running on a Samsung Tizen device
 */
function isTizen(windowContext) {
  return typeof getTizen(windowContext) === 'object';
}
exports.isTizen = isTizen;
