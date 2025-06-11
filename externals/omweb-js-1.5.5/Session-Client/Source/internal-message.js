goog.module('omid.common.InternalMessage');

/**
 * message[GUID_KEY] is an id to identify a particular two-way communication
 * between a client and the service. It is used by the service to identify the
 * callback to invoke and reply back for a message that the client expects a
 * response for.
 * @type {string}
 */
const GUID_KEY = 'omid_message_guid';

/**
 * message[METHOD_KEY] is the identifier for the method to be invoked on the
 * service, as a result of this message.
 * @type {string}
 */
const METHOD_KEY = 'omid_message_method';

/**
 * message[VERSION_KEY] is the version string of the OMID code that sends the
 * message.
 * @type {string}
 */
const VERSION_KEY = 'omid_message_version';

/**
 * message[ARGS_KEY] is the arguments to be passed on to method
 * message[METHOD_KEY] of the service.
 * @type {string}
 */
const ARGS_KEY = 'omid_message_args';

/**
 * Class representing a message exchanged by clients (session or verification)
 * and the JS service.
 */
class InternalMessage {
  /**
   * Checks that an object is a valid OMID JS internal message.
   * @param {!Object} object
   * @return {boolean} is valid OMID JS internal message.
   */
  static isValidSerializedMessage(object) {
    return Boolean(object) &&
        object[GUID_KEY] !== undefined &&
        object[METHOD_KEY] !== undefined &&
        object[VERSION_KEY] !== undefined &&
        typeof object[GUID_KEY] === 'string' &&
        typeof object[METHOD_KEY] === 'string' &&
        typeof object[VERSION_KEY] === 'string' &&
        // The args keys is optional, so undefined is valid.
        (object[ARGS_KEY] === undefined ||
         object[ARGS_KEY] !== undefined);
  }

  /**
   * Deserializes a serialized message.
   * @param {!Object} message
   * @return {!InternalMessage}
   */
  static deserialize(message) {
    return new InternalMessage(
        message[GUID_KEY],
        message[METHOD_KEY],
        message[VERSION_KEY],
        message[ARGS_KEY]);
  }

  /**
   * @param {string} guid
   * @param {string} method
   * @param {string} version
   * @param {(string|!Array<?>)=} args
   */
  constructor(guid, method, version, args = undefined) {
    this.guid = guid;
    this.method = method;
    this.version = version;
    this.args = args;
  }

  /**
   * Serializes to a message object which can cross compiled binaries.
   * @return {!Object}
   */
  serialize() {
    const exported = {
      [GUID_KEY]: this.guid,
      [METHOD_KEY]: this.method,
      [VERSION_KEY]: this.version,
    };
    if (this.args !== undefined) {
      exported[ARGS_KEY] = this.args;
    }
    return exported;
  }
}

exports = InternalMessage;
