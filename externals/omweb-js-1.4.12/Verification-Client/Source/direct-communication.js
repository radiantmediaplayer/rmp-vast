goog.module('omid.common.DirectCommunication');

const Communication = goog.require('omid.common.Communication');
const {CommunicationType} = goog.require('omid.common.constants');
const InternalMessage = goog.require('omid.common.InternalMessage');

/**
 * A send and forget style communication between two DirectCommunication
 * instances.
 * @extends {Communication<!DirectCommunication>}
 * @unrestricted
 */
class DirectCommunication extends Communication {
  /**
   * @param {!DirectCommunication} to Where to send messages to.
   */
  constructor(to = undefined) {
    super(to);
    this.communicationType_ = CommunicationType.DIRECT;
    this['handleExportedMessage'] =
        DirectCommunication.prototype.handleExportedMessage.bind(this);
  }

  /**
   * @override
   */
  sendMessage(message, to = this.to) {
    if (!to) {
      throw new Error('Message destination must be defined at construction ' +
                      'time or when sending the message.');
    }

    // Since this call may be cross binary, we need to call to the unobfuscated
    // function name.
    to['handleExportedMessage'](message.serialize(), this);
  }

  /**
   * Handles an exported message which may be from another binary.
   * @param {!Object} exportedMessage
   * @param {!DirectCommunication} from
   */
  handleExportedMessage(exportedMessage, from) {
    if (!InternalMessage.isValidSerializedMessage(exportedMessage)) return;
    this.handleMessage(InternalMessage.deserialize(exportedMessage), from);
  }

  /** @override */
  isCrossOrigin() {
    return false;
  }
}

exports = DirectCommunication;
