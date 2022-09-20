goog.module('omid.sessionClient.OmidJsSessionInterface');

const {MediaEventType} = goog.require('omid.common.constants');
const {omidGlobal} = goog.require('omid.common.OmidGlobalProvider');

/**
 * Keys for accessing the OMID JS Session Interface namespace nodes.
 * @enum {string}
 */
const ExportedNodeKeys = {
  ROOT: 'omidSessionInterface',
  AD_EVENTS: 'adEvents',
  MEDIA_EVENTS: 'mediaEvents',
};

/**
 * A map of internal method names to OMID JS Session Interface method names.
 * @const {!Object<string, string>}
 */
const MethodNameMap = {
  'sessionError': 'reportError',
};

/**
 * A list of method names that fall under the MediaEvents key.
 * @const {!Array<string>}
 */
const MediaEventMethodNames =
    Object.keys(MediaEventType).map((key) => MediaEventType[key]);

/**
 * A list of method names that fall under the AdEvents key.
 * @const {!Array<string>}
 */
const AdEventMethodNames = [
  'impressionOccurred',
];

/**
 * Communicates with the OMID JS Session Interface, searching for the exported
 * object and marshalling messages.
 */
class OmidJsSessionInterface {
  /**
   * @param {!Window} globalScope The scope in which to search for the OMID JS
   *     Session Interface.
   */
  constructor(globalScope = omidGlobal) {
    /** @private @const {?Object} */
    this.interfaceRoot_ = globalScope[ExportedNodeKeys.ROOT];
  }

  /**
   * True if the OMID JS Session Interface is available.
   * @return {boolean}
   */
  isSupported() {
    return this.interfaceRoot_ != null;
  }

  /**
   * Sends a message to the OMID JS Session Interface.
   * @param {string} method The name of the method to call.
   * @param {?function(...?)} responseCallback A callback invoked on certain
   *     messages that send responses back.
   * @param {!Array<?>} args The arguments of the method.
   * @throws {!Error} when the method name is invalid or unsupported.
   */
  sendMessage(method, responseCallback, args) {
    if (method == 'registerSessionObserver') {
      // registerSessionObserver is a special case where responseCallback is not
      // null and needs to be transformed into an argument.
      args = [responseCallback];
    }
    // Map internal names to interface names where they differ.
    if (MethodNameMap[method]) {
      method = MethodNameMap[method];
    }
    // Find the appropriate node on the interface on which to call the method.
    let interfaceNode = this.interfaceRoot_;
    if (AdEventMethodNames.indexOf(method) >= 0) {
      interfaceNode = interfaceNode[ExportedNodeKeys.AD_EVENTS];
    }
    if (MediaEventMethodNames.indexOf(method) >= 0) {
      interfaceNode = interfaceNode[ExportedNodeKeys.MEDIA_EVENTS];
    }
    const interfaceMethod = interfaceNode[method];
    if (!interfaceMethod) {
      throw new Error(`Unrecognized method name: ${method}.`);
    }
    interfaceMethod(...args);
  }
}

exports = OmidJsSessionInterface;
