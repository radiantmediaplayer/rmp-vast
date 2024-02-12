goog.module('omid.common.Communication');

const {CommunicationType} = goog.require('omid.common.constants');
const InternalMessage = goog.require('omid.common.InternalMessage');

/**
 * A send and forget style communication between two generic instances.
 * @abstract
 * @template T
 * @unrestricted
 */
class Communication {
  /**
   * @param {!T=} to Where to send messages to.
   */
  constructor(to = undefined) {
    /** @const @protected */
    this.to = to;

    /**
     * Handles when a message has been received.
     * @type {?function(!InternalMessage, !T)}
     */
    this.onMessage;

    /** @type {!CommunicationType} */
    this.communicationType_ = CommunicationType.NONE;
  }

  /**
   * Posts a message to the remote window.
   * @param {!InternalMessage} message Message to send. Must be JSONable.
   * @param {!T=} to Where to send the message to.
   * @abstract
   */
  sendMessage(message, to) {}

  /**
   * Handles an incomming JSON message.
   * @param {!InternalMessage} message
   * @param {!T} from Where the message is from.
   */
  handleMessage(message, from) {
    if (this.onMessage) this.onMessage(message, from);
  }

  /**
   * Serializes a message into a string.
   * @param {!Object} message
   * @return {string}
   */
  serialize(message) {
    return JSON.stringify(message);
  }

  /**
   * Deserializes a serialized message back into its original form.
   * @param {string} messageJson
   * @return {!Object}
   */
  deserialize(messageJson) {
    return /** @type {!Object} */ (JSON.parse(messageJson));
  }

  /**
   * Return true if the concrete instance of this object is a
   * DirectCommunication one, false otherwise.
   * @return {boolean}
   */
  isDirectCommunication() {
    return this.communicationType_ === CommunicationType.DIRECT;
  }

  /**
   * Returns true if the communication is occuring across origin boundaries.
   * @return {boolean}
   * @abstract
   */
  isCrossOrigin() { }
}

exports = Communication;
