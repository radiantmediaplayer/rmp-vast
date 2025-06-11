goog.module('omid.common.ArgsSerDe');

const {isValidVersion, versionGreaterOrEqual} = goog.require('omid.common.VersionUtils');

/**
 * Represents the semver portion of the version where OMSDK JS service and
 * clients stopped serializing the args of InternalMessage objects to strings
 * before using them in direct or post message communication.
 * @type {string}
 */
const ARGS_NOT_SERIALIZED_VERSION = '1.0.3';

/**
 * Serializes the args based on the version. OM SDK JS before version
 * ARGS_NOT_SERIALIZED_VERSION was serializing them as a string, using
 * JSON.stringify. Starting with version ARGS_NOT_SERIALIZED_VERSION this does
 * not happen.
 * @param {string} version Version of the clients or service that sends message.
 * @param {?} args Arguments to serialize
 * @return {?|string} the serialized form of the args
 */
function serializeMessageArgs(version, args) {
  if (isValidVersion(version) &&
      versionGreaterOrEqual(version, ARGS_NOT_SERIALIZED_VERSION)) {
    return args;
  } else {
    return JSON.stringify(args);
  }
}

/**
 * Deserializes the args based on the version. OM SDK JS before version
 * ARGS_NOT_SERIALIZED_VERSION was serializing them as a string, so JSON.parse
 * needs to be used. Starting with version ARGS_NOT_SERIALIZED_VERSION the args
 * are arrays containing objects so no deserialization is required.
 * @param {string} version Version of the clients or service that sends message.
 * @param {(string|!Array<?>)=} args Arguments to deserialize
 * @return {!Array<?>} the deserialized form of the args
 */
function deserializeMessageArgs(version, args) {
  if (isValidVersion(version) &&
      versionGreaterOrEqual(version, ARGS_NOT_SERIALIZED_VERSION)) {
    return args ? /** @type {!Array<?>} */ (args) : [];
  } else {
    return args && typeof args === 'string' ?
        /** @type {!Array<?>} */ (JSON.parse(/** @type {string} */ (args))) :
        [];
  }
}

exports = {serializeMessageArgs, deserializeMessageArgs};
