goog.module('omid.common.DetectOmid');

/**
 * The name of the iframe that lets other iframes detect that OMID can be used.
 * @const {string}
 */
exports.OMID_PRESENT_FRAME_NAME = 'omid_v1_present';

/**
 * Determine if the OMID JS Service is available even if not in the same iframe
 * as the verification providers' code.
 * @param {!Window} globalObject the Window or other global object where the
 *     client is running
 * @return {boolean} true if OMID is present, false if OMID is not present
 */
exports.isOmidPresent = function(globalObject) {
  try {
    // We cannot access OMID through postMessage in DOM-less JSContext
    if (!globalObject.frames) {
      return false;
    }

    // Can we access OMID in another frame?
    return !!globalObject.frames[exports.OMID_PRESENT_FRAME_NAME];
  } catch (error) {
    // No other options for accessing OMID.
    return false;
  }
};

/**
 * Set up the iframe that declares the presence of the OM SDK JS service to
 * clients in other frames.
 * @param {!Window} globalObject the Window or other global object where the
 *     service is running
 */
exports.declareOmidPresence = function(globalObject) {
  // We only need to declare presence in a webview, not a DOM-less context.
  if (!globalObject.frames || !globalObject.document) {
    return;
  }
  if (exports.OMID_PRESENT_FRAME_NAME in globalObject.frames) {
    return;
  }
  if (globalObject.document.body == null &&
      exports.isMutationObserverAvailable_(globalObject)) {
    exports.registerMutationObserver_(globalObject);
  } else if (globalObject.document.body) {
    exports.appendPresenceIframe_(globalObject);
  } else {
    const frameTag = '<iframe style="display:none" ' +
        `id="${exports.OMID_PRESENT_FRAME_NAME}"` +
        ` name="${exports.OMID_PRESENT_FRAME_NAME}">` + '</iframe>';
    globalObject.document.write(frameTag);
  }
};

/**
 * Appends the presence iframe in the body of a window document.
 * @param {!Window} globalObject the Window or other global object where the
 *     client is running
 * @private
 */
exports.appendPresenceIframe_ = function(globalObject) {
  const iframe = globalObject.document.createElement('iframe');
  iframe.id = exports.OMID_PRESENT_FRAME_NAME;
  iframe.name = exports.OMID_PRESENT_FRAME_NAME;
  iframe.style.display = 'none';
  globalObject.document.body.appendChild(iframe);
};

/**
 * Tests if Mutation Observer API exists.
 * @param {!Window} globalObject the Window or other global object where the
 *     client is running
 * @return {boolean} true if MO API is there, false otherwise.
 * @private
 */
exports.isMutationObserverAvailable_ = function(globalObject) {
  return 'MutationObserver' in globalObject;
};

exports.registerMutationObserver_ = function(globalObject) {
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes[0].nodeName === 'BODY') {
        exports.appendPresenceIframe_(globalObject);
        mutationObserver.disconnect();
      }
    });
  });
  mutationObserver.observe(
      globalObject.document.documentElement, {childList: true});
};
