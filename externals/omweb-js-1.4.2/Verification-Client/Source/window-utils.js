/**
 * @fileoverview Utilities for retrieiving and inspecting window and global
 * objects.
 */
goog.module('omid.common.windowUtils');

const {omidGlobal} = goog.require('omid.common.OmidGlobalProvider');
const {AdEventType} = goog.require('omid.common.constants');

/**
 * Detects if the given window exists in a DOM and is not null or undefined.
 * @param {!Window=} win The window to check.
 * @return {boolean} True if the window exists in a DOM and is not null or
 *    undefined.
 */
function isValidWindow(win = undefined) {
  return win != null && typeof win.top !== 'undefined' && win.top != null;
}

/**
 * Detect if the given window is cross-origin relative to the current one.
 * @param {!Window} win The window to check.
 * @return {boolean} True if the window is cross-origin.
 */
function isCrossOrigin(win) {
  if (win === omidGlobal) {
    return false;
  }
  try {
    // This check is tricky and subtle. We want to confirm that arbitrary
    // properties on the window are safely accessible, but we don't care
    // what the value of the particular property we choose to check is.
    //  Bugs that have affected this code previously:
    //    OMSDK-467: IE<=11 will return 'undefined' for typeof
    //    window.unaccessibleProperty, instead of throwing an error. We must
    //    access and test properties directly.
    //
    //    OMSDK-469: iOS<=9 will not throw an error for accessing/reading
    //    window.unaccessibleProperty, and will simply return undefined (and log
    //    an uncatchable console error).
    //
    if (typeof win.location.hostname === 'undefined') {
      // This check catches top inaccessibility for most browsers, including old
      // Safari/iOS.
      return true;
    }
    if (isSameOriginForIE(win)) {
      return false;
    }
  } catch (e) {
    // If the above block throws an exception, then the window is cross-origin.
    return true;
  }
  // In all other cases, the window is same-origin.
  return false;
}

/**
 * This check is explicitly for IE 11 and below, which will not be properly
 * caught by techniques used for other browsers. In most browsers, this function
 * will return true for cross and same-origin windows, and true in IE 11 and
 * below for a same-origin window. It will throw for a cross-origin window in IE
 * 11 and below.
 *
 * This statement never returns false, but the check needs to be made so that
 * the compiler won't remove it because it thinks the result is not being used.
 *
 * This one-line check also needs to be in its own function since otherwise the
 * compiler will remove it because it doesn't think it can ever throw.
 *
 * @param {!Window} win The window to check.
 * @return {boolean} True if the window is same-origin.
 * @throws an error if the window is cross-origin on IE.
 */
function isSameOriginForIE(win) {
  return win['x'] === '' || win['x'] !== '';
}

/**
 * Resolves the global context for the current environment -- either the current
 * window for a DOM environment, or the omidGlobal in a DOM-less environment.
 * @param {!Window=} win The current environment's window object. If not
 *     provided, defaults to the 'window' global.
 * @return {!Window} The global context for the current environment.
 */
function resolveGlobalContext(win = undefined) {
  if (typeof win === 'undefined' && typeof window !== 'undefined' && window) {
    win = window;
  }
  if (isValidWindow(win)) {
    return /** @type {!Window} */ (win);
  }
  // Probably JSCore or some other non-DOM environment, so return omidGlobal.
  return omidGlobal;
}

/**
 * Returns the top window that is accessible from the current window context.
 * If a window does not exist at all, omidGlobal is returned.
 * @param {!Window=} win The current environment's window object.
 * @return {!Window} The top window, or the omidGlobal.
 */
function resolveTopWindowContext(win) {
  // JSCore or some other non browser environment, so return omidGlobal.
  if (!isValidWindow(win)) {
    return omidGlobal;
  }
  return win.top;
}

/**
 * Returns true if top window is available, false otherwise.
 * @param {!Window=} win The current window object.
 * @return {boolean}
 */
function isTopWindowAccessible(win) {
  try {
    return win.top.location.href ? true : false;
  } catch (c) {
    return false;
  }
}

/**
 * Simple helper function to avoid serialize error for videoElement and slotElement.
 * @param {!Object} event with DOM elements.
 * @return {!Object} event after removing DOM elements.
 */
function removeDomElements(event) {
  if (event['type'] === AdEventType.SESSION_START) {
    if (typeof event['data']['context']['videoElement'] !== 'undefined') {
      event['data']['context']['videoElement'] = 'DOM Video Element - Present but not parsed to avoid parse error';
    }
    if (typeof event['data']['context']['slotElement'] !== 'undefined') {
      event['data']['context']['slotElement'] = 'DOM Slot Element - Present but not parsed to avoid parse error';
    }
  }
  return event;
}

/**
 * Returns the URL of the top-level web page as determined by
 * the OMSDK JS service. Returns null when service is running
 * in cross-domain iframe.
 * @param {!Window} globalObject the Window or other global object
 * where OMSDK JS is running.
 * @return {?string}
 */
function evaluatePageUrl(globalObject) {
  if (!isValidWindow(globalObject)) {
    return null;
  }

  try {
    const top = globalObject.top;
    return isCrossOrigin(top) ? null : top.location.href;
  } catch (error) {
    // location access is blocked, so in cross-domain.
    return null;
  }
};

exports = {
  evaluatePageUrl,
  isCrossOrigin,
  removeDomElements,
  resolveGlobalContext,
  resolveTopWindowContext,
  isTopWindowAccessible,
};
