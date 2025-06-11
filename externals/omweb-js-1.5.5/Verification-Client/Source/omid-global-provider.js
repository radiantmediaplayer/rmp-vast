goog.module('omid.common.OmidGlobalProvider');

/**
 * Returns the omidGlobal object. If the client is wrapped in a bootstrapper,
 * then the omidGlobal object is defined from the wrapping immediately invoked
 * function. For client integrations that use Google Closure Compiler, then it
 * resorts to the top-level this object.
 * @return {!Window}
 * @throws error when omidGlobal cannot be determined.
 */
function getOmidGlobal() {
  if (typeof omidGlobal !== 'undefined' && omidGlobal) {
    return omidGlobal;
  } else if (typeof global !== 'undefined' && global) {
    return global;
  } else if (typeof window !== 'undefined' && window) {
    return window;
  } else if (typeof globalThis !== 'undefined' && globalThis) {
    return globalThis;
  } else {
    // Using the `Function` constructor forces `this` to be evaluated in the
    // global scope, which is the only way to get the global object on some
    // platforms that do not support `globalThis`, such as JavaScriptCore in
    // some older iOS versions.
    // The `Function` constructor can be blocked by a Content Security Policy,
    // but CSPs only apply to browsers/webviews, which always define `window`.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/window#browser_compatibility
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
    const globalObject = /** @type {?Window} */ (Function('return this')());
    if (globalObject) return globalObject;
  }
  throw new Error('Could not determine global object context.');
}

/** @type {!Window} */
exports.omidGlobal = getOmidGlobal();
