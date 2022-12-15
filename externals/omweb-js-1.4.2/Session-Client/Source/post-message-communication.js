goog.module('omid.common.PostMessageCommunication');

const Communication = goog.require('omid.common.Communication');
const InternalMessage = goog.require('omid.common.InternalMessage');
const {CommunicationType} = goog.require('omid.common.constants');
const {isCrossOrigin} = goog.require('omid.common.windowUtils');
const {omidGlobal} = goog.require('omid.common.OmidGlobalProvider');

/**
 * A send and forget style communication between two Windows.
 * @extends {Communication<!Window>}
 */
class PostMessageCommunication extends Communication {
  /**
   * Checks to see if this communication can be used in the given context.
   * @param {!Window} windowContext
   * @return {boolean}
   */
  static isCompatibleContext(windowContext) {
    return Boolean(windowContext &&
        windowContext.addEventListener &&
        windowContext.postMessage);
  }

  /**
   * @param {!Window} thisWindow The Window instance that the communication
   *     should list for messages on.
   * @param {!Window} to Where to send messages to.
   */
  constructor(thisWindow, to = omidGlobal) {
    super(to);

    this.communicationType_ = CommunicationType.POST_MESSAGE;

    // Listen to incomming messages.
    thisWindow.addEventListener('message', (event) => {
      // Validate the incomming InternalMessage.
      if (typeof event.data !== 'object') return;
      const exportedMessage = /** @type {!Object} */ (event.data);
      if (!InternalMessage.isValidSerializedMessage(exportedMessage)) return;
      const message = InternalMessage.deserialize(exportedMessage);

      // Verify that the source of the message is known.
      if (!event.source) return;

      this.handleMessage(message, /** @type {!Window} */ (event.source));
    });
  }

  /**
   * Posts a message to the remote window.
   * @param {!InternalMessage} message Message to send. Must be JSONable.
   * @param {!Window=} to Where to send the message to.
   * @override
   */
  sendMessage(message, to = this.to) {
    if (!to) {
      throw new Error('Message destination must be defined at construction ' +
                      'time or when sending the message.');
    }

    to.postMessage(message.serialize(), '*');
  }

  /** @override */
  isCrossOrigin() {
    if (!this.to) {
      return true;
    }
    return isCrossOrigin(this.to);
  }
}

exports = PostMessageCommunication;
