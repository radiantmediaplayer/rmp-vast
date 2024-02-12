goog.module('omid.common.DetectOmid');

const {Environment} = goog.require('omid.common.constants');

/**
 * The name of the iframe that lets other iframes detect that OMID can be used.
 * @const {string}
 */
exports.OMID_PRESENT_FRAME_NAME = 'omid_v1_present';

/**
 * The name of the iframe that lets other iframes detect that we're using
 * OMID on web environment
 * @const {string}
 */
exports.OMID_PRESENT_FRAME_NAME_WEB = 'omid_v1_present_web';

/**
 * The name of the iframe that lets other iframes detect that we're using
 * OMID on app environment
 * @const {string}
 */
exports.OMID_PRESENT_FRAME_NAME_APP = 'omid_v1_present_app';

/**
 * Returns name of presence iframe based on service environment
 * @param {!Environment} env The environment of the service
 * @return {!string}
 */
exports.getEnvironmentIframeName = function(env) {
  const environmentsIframeNames = {
    [Environment.APP]: exports.OMID_PRESENT_FRAME_NAME_APP,
    [Environment.WEB]: exports.OMID_PRESENT_FRAME_NAME_WEB,
  };

  return environmentsIframeNames[env];
};

/**
 * Determines if an iframe with the given name is present in the global object.
 * @param {!Window} globalObject the Window or other global object where the
 *     client is running.
 * @param {string} iframeName the `name` property of the iframe.
 * @return {boolean} Whether the iframe with the given name is present.
 */
function isIframePresent(globalObject, iframeName) {
  try {
    return globalObject.frames && !!globalObject.frames[iframeName];
  } catch (error) {
    return false;
  }
}

/**
 * Determine if the OMID JS Service is available even if not in the same iframe
 * as the verification providers' code.
 * @param {!Window} globalObject the Window or other global object where the
 *     client is running
 * @return {boolean} true if OMID is present, false if OMID is not present
 */
exports.isOmidPresent = function(globalObject) {
  const allOmidPresentIframeNames = [
      exports.OMID_PRESENT_FRAME_NAME,
      exports.OMID_PRESENT_FRAME_NAME_WEB,
      exports.OMID_PRESENT_FRAME_NAME_APP,
  ];

  return allOmidPresentIframeNames.some((iframeName) =>
      isIframePresent(globalObject, iframeName));
};

/**
 * Determines the environment in which the OM SDK is running.
 * If not detectable (such as for older service versions), returns null.
 * @param {!Window} globalObject the Window or other global object where the
 *     client is running.
 * @return {?Environment}
 */
exports.getOmidEnvironment = function(globalObject) {
  for (const env of Object.values(Environment)) {
    const iframeName = exports.getEnvironmentIframeName(env);
    if (isIframePresent(globalObject, iframeName)) {
      return env;
    }
  }

  return null;
};

/**
 * Write using document.write an iframe with a given iframe ID
 * @param {!Window} globalObject
 * @param {!string} iframeId
 * @private
 */
function writePresenceIframe_(globalObject, iframeId) {
  const frameTag = '<iframe style="display:none" ' +
      `id="${iframeId}" name="${iframeId}" sandbox></iframe>`;
  globalObject.document.write(frameTag);
}

/**
 * Set up the iframe that declares the presence of the OM SDK JS service to
 * clients in other frames.
 * @param {!Window} globalObject the Window or other global object where the
 *     service is running
 * @param {!Environment} env The environment of the service
 */
exports.declareOmidPresence = function(globalObject, env) {
  // We only need to declare presence in a webview, not a DOM-less context.
  if (!globalObject.frames || !globalObject.document) {
    return;
  }

  const allOmidPresentIframeNames = [
    exports.OMID_PRESENT_FRAME_NAME,
    exports.OMID_PRESENT_FRAME_NAME_WEB,
    exports.OMID_PRESENT_FRAME_NAME_APP,
  ];

  if (allOmidPresentIframeNames.some(
      (iframeName) => !!globalObject.frames[iframeName])) {
    return;
  }

  if (globalObject.document.body == null &&
      exports.isMutationObserverAvailable_(globalObject)) {
    exports.registerMutationObserver_(globalObject, env);
  } else {
    const envIframeName = exports.getEnvironmentIframeName(env);

    if (globalObject.document.body) {
      exports.appendPresenceIframe_(
          globalObject, exports.OMID_PRESENT_FRAME_NAME);
      exports.appendPresenceIframe_(globalObject, envIframeName);
    } else {
      writePresenceIframe_(globalObject, exports.OMID_PRESENT_FRAME_NAME);
      writePresenceIframe_(globalObject, envIframeName);
    }
  }
};

/**
 * Appends the presence iframe in the body of a window document.
 * @param {!Window} globalObject the Window or other global object where the
 *     client is running
 * @param {!string} frameId
 * @private
 */
exports.appendPresenceIframe_ = function(globalObject, frameId) {
  const iframe =
    /** @type {HTMLIFrameElement} */ (
        globalObject.document.createElement('iframe'));
  iframe.id = frameId;
  iframe.name = frameId;
  iframe.style.display = 'none';
  // Set empty sandbox attribute (all restrictions applied) as best practice.
  // This appears in the element's HTML as "sandbox" (not "sandbox=something").
  iframe.sandbox = /** @type {!DOMTokenList} */ (/** @type {*} */ (''));
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

/**
 * Registering to the MutationObserver and add presence iframes
 * @param {!Window} globalObject The Window or other global object where the
 *     client is running
 * @param {!Environment} env The environment of the service
 * @private
 */
exports.registerMutationObserver_ = function(globalObject, env) {
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes[0].nodeName === 'BODY') {
        const envIframeName = exports.getEnvironmentIframeName(env);

        exports.appendPresenceIframe_(
            globalObject, exports.OMID_PRESENT_FRAME_NAME);
        exports.appendPresenceIframe_(globalObject, envIframeName);
        mutationObserver.disconnect();
      }
    });
  });
  mutationObserver.observe(
      globalObject.document.documentElement, {childList: true});
};
