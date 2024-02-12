goog.module('omid.common.serviceMethodUtils');

/**
 * Prefix for a method identifying which service it is intended for.
 * @enum {string}
 */
const ServiceMethodPrefix = {
  SESSION_SERVICE: 'SessionService.',
  VERIFICATION_SERVICE: 'VerificationService.',
};

/**
 * Creates a prefixed session service method from an unprefixed method.
 * @param {string} unprefixedMethod
 * @return {string}
 */
function getPrefixedSessionServiceMethod(unprefixedMethod) {
  return getPrefixedMethod(
    unprefixedMethod,
    ServiceMethodPrefix.SESSION_SERVICE,
  );
}

/**
 * Extracts the unprefixed session service method from a prefixed method.
 * Returns `null` if the method is not intended for the session service.
 * @param {string} prefixedMethod
 * @return {?string}
 */
function getUnprefixedSessionServiceMethod(prefixedMethod) {
  return getUnprefixedMethod(
    prefixedMethod,
    ServiceMethodPrefix.SESSION_SERVICE,
  );
}

/**
 * Checks whether a prefixed method is intended for the session service.
 * @param {string} prefixedMethod
 * @return {boolean}
 */
function isPrefixedSessionServiceMethod(prefixedMethod) {
  return getUnprefixedSessionServiceMethod(prefixedMethod) != null;
}

/**
 * Creates a prefixed verification service method from an unprefixed method.
 * @param {string} unprefixedMethod
 * @return {string}
 */
function getPrefixedVerificationServiceMethod(unprefixedMethod) {
  return getPrefixedMethod(
    unprefixedMethod,
    ServiceMethodPrefix.VERIFICATION_SERVICE,
  );
}

/**
 * Extracts the unprefixed verification service method from a prefixed method.
 * Returns `null` if the method is not intended for the verification service.
 * @param {string} prefixedMethod
 * @return {?string}
 */
function getUnprefixedVerificationServiceMethod(prefixedMethod) {
  return getUnprefixedMethod(
    prefixedMethod,
    ServiceMethodPrefix.VERIFICATION_SERVICE,
  );
}

/**
 * Checks whether a prefixed method is intended for the verification service.
 * @param {string} prefixedMethod
 * @return {boolean}
 */
function isPrefixedVerificationServiceMethod(prefixedMethod) {
  return getUnprefixedVerificationServiceMethod(prefixedMethod) != null;
}

/**
 * Creates a prefixed method from an unprefixed method given the prefix.
 * @param {string} unprefixedMethod
 * @param {string} prefix
 * @return {string}
 * @private
 */
function getPrefixedMethod(unprefixedMethod, prefix) {
  return prefix + unprefixedMethod;
}

/**
 * Extracts the unprefixed method from a prefixed method given the prefix.
 * Returns `null` if the given prefix is not used.
 * @param {string} prefixedMethod
 * @param {string} prefix
 * @return {?string}
 * @private
 */
function getUnprefixedMethod(prefixedMethod, prefix) {
  const match = prefixedMethod.match(new RegExp(`^${prefix}(.*)`));
  return match && match[1];
}

exports = {
  getPrefixedSessionServiceMethod,
  getPrefixedVerificationServiceMethod,
  getUnprefixedSessionServiceMethod,
  getUnprefixedVerificationServiceMethod,
  isPrefixedSessionServiceMethod,
  isPrefixedVerificationServiceMethod,
};
