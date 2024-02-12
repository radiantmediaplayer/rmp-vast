goog.module('omid.sessionClient.AdSession');

const Communication = goog.require('omid.common.Communication');
const Context = goog.require('omid.sessionClient.Context');
const InternalMessage = goog.require('omid.common.InternalMessage');
const OmidJsSessionInterface = goog.require('omid.sessionClient.OmidJsSessionInterface');
const Rectangle = goog.require('omid.common.Rectangle');
const VerificationScriptResource = goog.require('omid.sessionClient.VerificationScriptResource');
const argsChecker = goog.require('omid.common.argsChecker');
const guidUtils = goog.require('omid.common.guid');
const logger = goog.require('omid.common.logger');
const {AdEventType, CreativeType, ErrorType, ImpressionType} = goog.require('omid.common.constants');
const {Event} = goog.require('omid.common.eventTypedefs');
const {Version} = goog.require('omid.common.version');
const {deserializeMessageArgs, serializeMessageArgs} = goog.require('omid.common.ArgsSerDe');
const {getPrefixedSessionServiceMethod} = goog.require('omid.common.serviceMethodUtils');
const {packageExport} = goog.require('omid.common.exporter');
const {resolveGlobalContext} = goog.require('omid.common.windowUtils');
const {startSessionServiceCommunication} = goog.require('omid.common.serviceCommunication');

/**
 * @const {string}
 * @ignore
 */
const SESSION_CLIENT_VERSION = Version;

/**
 * The JS ad session API enabling the integration partner to contribute to an
 * existing native ad session. This is also responsible for communicating to
 * the OM SDK JS service and will also handle scenarios with limited access
 * to the OM SDK JS service - i.e. cross-domain iFrames.
 * This API is commonly used in the following scenarios;
 *  - video ad session relying on the HTML5 video player for injecting
 *    verification script resources and/or publishing OMID video events.
 *  - display ad session relying on a separate JS component to handle the
 *    impression event.
 * @public
 */
class AdSession {
  /**
   * @param {!Context} context that provides the required information for
   *   initialising the JS ad session.
   * @param {?Communication<?>=} communication This parameter is for OM SDK
   *    internal use only and should be omitted.
   * @param {?OmidJsSessionInterface=} sessionInterface This parameter is for
   *    OM SDK internal use only and should be omitted.
   * @throws error if the supplied context is undefined or null.
   */
  constructor(
      context, communication = undefined, sessionInterface = undefined) {
    argsChecker.assertNotNullObject('AdSession.context', context);

    /** @private @const {string} */
    this.adSessionId_ = guidUtils.generateGuid();

    /** @private @const {!Context} */
    this.context_ = context;

    /** @private {boolean} */
    this.impressionOccurred_ = false;

    const serviceWindow = this.context_.serviceWindow || undefined;

    /**
     * Communication object that the VerificationClient will use to talk to the
     * VerificationService. This parameter is used for testing.  If left
     * unspecified, the correct Communication will be constructed and used.
     * @const {?Communication}
     * @private
     */
    this.communication_ = communication ||
        startSessionServiceCommunication(resolveGlobalContext(), serviceWindow);

    /**
     * Communicates with the OMID JS Session Interface. Used for testing, and
     * defaults to a newly constructed value.
     * @const {!OmidJsSessionInterface}
     * @private
     */
    this.sessionInterface_ = sessionInterface || new OmidJsSessionInterface();

    /** @private {boolean} */
    this.hasAdEvents_ = false;

    /** @private {boolean} */
    this.hasMediaEvents_ = false;

    /** @private {boolean} */
    this.isSessionRunning_ = false;

    /** @private {?CreativeType} */
    this.creativeType_ = null;

    /** @private {?ImpressionType} */
    this.impressionType_ = null;

    /** @private */
    this.creativeLoaded_ = false;

    /**
     * Map of callback guids to callbacks.
     * @type {!Object<string, function(?)>}
     * @private
     */
    this.callbackMap_ = {};

    // Listen to messages sent by the OMID SessionService communication.
    if (this.communication_) {
      this.communication_.onMessage = this.handleInternalMessage_.bind(this);
    }
    // NOTE: The service assumes that 'setClientInfo' is the first message it
    // will receive for each session, so do not change the order without first
    // updating the service.
    this.setClientInfo_();
    this.injectVerificationScripts_(context.verificationScriptResources);
    this.sendSlotElement_(context.slotElement);
    this.sendVideoElement_(context.videoElement);
    this.sendContentUrl_(context.contentUrl);

    // Start watching session events so we know when the session is running.
    this.watchSessionEvents_();
  }

  /**
   * Get the ID of this ad session.
   * @return {string}
   */
  getAdSessionId() {
    return this.adSessionId_;
  }

  /**
   * Specifies the type of creative to be rendered in this session.
   * Requires that the native layer set the creative type to
   * DEFINED_BY_JAVASCRIPT.
   * @param {!CreativeType} creativeType The type of creative.
   * @throws error if arg type is DEFINED_BY_JAVASCRIPT.
   * @throws error if impression has already occured.
   * @throws error if creative has already loaded.
   * @throws error if creativeType was already defined to something
   * other than DEFINED_BY_JAVASCRIPT.
   * @throws error if native integration has started and
   * is using OMID 1.2 or earlier.
   * @public
   */
  setCreativeType(creativeType) {
    if (creativeType === CreativeType.DEFINED_BY_JAVASCRIPT) {
      throw new Error('Creative type cannot be redefined with value ' +
        CreativeType.DEFINED_BY_JAVASCRIPT);
    }
    if (this.impressionOccurred_) {
      throw new Error('Impression has already occurred');
    }
    if (this.creativeLoaded_) {
      throw new Error('Creative has already loaded');
    }
    if (this.creativeType_ &&
      this.creativeType_ !== CreativeType.DEFINED_BY_JAVASCRIPT) {
      throw new Error('Creative type cannot be redefined');
    }
    if (this.creativeType_ === undefined) {
      throw new Error('Native integration is using OMID 1.2 or earlier');
    }
    this.sendOneWayMessage('setCreativeType', creativeType, this.adSessionId_);
    this.creativeType_ = creativeType;
  }

  /**
   * Specifies the type of impression to be triggered in this session.
   * Requires that the native layer set the impression type to
   * DEFINED_BY_JAVASCRIPT.
   * @param {!ImpressionType} impressionType The type of impression.
   * @throws error if arg type is DEFINED_BY_JAVASCRIPT
   * @throws error if impression has already occurred
   * @throws error if impressionType was already defined to something
   * other than DEFINED_BY_JAVASCRIPT.
   * @throws error if native integration has started and is
   * using OMID 1.2 or earlier.
   * @public
   */
  setImpressionType(impressionType) {
    if (impressionType === ImpressionType.DEFINED_BY_JAVASCRIPT) {
      throw new Error('Impression type cannot be redefined with value ' +
        ImpressionType.DEFINED_BY_JAVASCRIPT);
    }
    if (this.impressionOccurred_) {
      throw new Error('Impression has already occurred');
    }
    if (this.creativeLoaded_) {
      throw new Error('Creative has already loaded');
    }
    if (this.impressionType_ &&
      this.impressionType_ !== ImpressionType.DEFINED_BY_JAVASCRIPT) {
      throw new Error('Impression type cannot be redefined');
    }
    if (this.impressionType_ === undefined) {
      throw new Error('Native integration is using OMID 1.2 or earlier');
    }
    this.sendOneWayMessage(
        'setImpressionType', impressionType, this.adSessionId_);
    this.impressionType_ = impressionType;
  }

  /**
   * Returns true if OMID is available, false otherwise.
   * @return {boolean}
   * @public
   */
  isSupported() {
    return Boolean(this.communication_) || this.sessionInterface_.isSupported();
  }

  /**
   * Returns true if sending elements to the service is supported, which is the
   * case when communication is between same-origin contexts.
   * @return {boolean}
   * @private
   */
  isSendingElementsSupported_() {
    return this.communication_ ? this.communication_.isDirectCommunication() :
                                 this.sessionInterface_.isSupported();
  }

  // TODO(OMSDK-718): Make the declarations in event-typedef.js compatible with
  // JSDoc, and remove the event handler field descriptions below.

  /**
   * Subscribes to all session events ('sessionStart', 'sessionError', and
   * 'sessionFinish').
   * The event handler will be called with a single argument that has the
   * following fields:
   *   'adSessionId': string,
   *   'timestamp': number,
   *   'type': string,
   *   'data': object
   * @param {function(!Event)} functionToExecute An event handler which will be
   *     invoked on session events.
   * @public
   */
  registerSessionObserver(functionToExecute) {
    this.sendMessage(
        'registerSessionObserver', functionToExecute, this.adSessionId_);
  }

  /**
   * If there is no currently active ad session, this notifies all session
   * observers that an ad session has started with a SESSION_START event.
   * This starts ad view tracking and makes video and ad events available to
   * send to verification scripts injected for this ad session. This method
   * has no effect if called after the ad session has already started or in a
   * mobile app environment.
   */
  start() {
    const sessionStartContext = {
      'customReferenceData': this.context_.customReferenceData,
      'underEvaluation': this.context_.underEvaluation,
    };
    this.sendOneWayMessage(
        'startSession', sessionStartContext, this.adSessionId_);
  }

  /**
   * If there is a currently active ad session, this notifies all session
   * observers that the ad session has finished with a SESSION_FINISH event.
   * This ceases ad view tracking and message sending to verification scripts
   * injected for the ad session. This method has no effect if called if there
   * is no active ad session or in a mobile app environment.
   */
  finish() {
    this.sendOneWayMessage('finishSession', this.adSessionId_);
  }

  /**
   * Notifies that an error has occurred on the ad session.
   * All verification clients will be notified via the 'sessionError' session
   * observer event.
   * @param {!ErrorType} errorType High level error type.
   * @param {string} message Description of the session error.
   * @public
   */
  error(errorType, message) {
    this.sendOneWayMessage(
        'sessionError', errorType, message, this.adSessionId_);
  }

  /**
   * Registers the existence of an AdEvent instance.
   */
  registerAdEvents() {
    if (this.hasAdEvents_) {
      throw new Error('AdEvents already registered.');
    }
    this.hasAdEvents_ = true;
    this.sendOneWayMessage('registerAdEvents', this.adSessionId_);
  }

  /**
   * Registers the existence of an MediaEvents instance.
   */
  registerMediaEvents() {
    if (this.hasMediaEvents_) {
      throw new Error('MediaEvents already registered.');
    }
    this.hasMediaEvents_ = true;
    this.sendOneWayMessage('registerMediaEvents', this.adSessionId_);
  }

  /**
   * Sends a message to the OMID VerificationService and ignores responses.
   * NOTE: This method is friend scoped. Therefore it should not be exported
   * beyond obfuscation.
   * @param {string} method Name of the remote method to invoke.
   * @param {...?} args Arguments to use when invoking the remote
   *     function.
   */
  sendOneWayMessage(method, ...args) {
    // TODO(OMSDK-930): Consolidate logic for ordering of message arguments.
    this.sendMessage(method, null, ...args);
  }

  /**
   * Sends a message to the OMID SessionService.
   * NOTE: This method is friend scoped. Therefore it should not be exported
   * beyond obfuscation.
   * @param {string} method Name of the remote method to invoke.
   * @param {?function(...?)} responseCallback Callback to be called when a
   *     response is received.
   * @param {...?} args Arguments to use when invoking the remote function.
   */
  sendMessage(method, responseCallback, ...args) {
    if (this.communication_) {
      this.sendInternalMessage_(method, responseCallback, args);
    } else if (this.sessionInterface_.isSupported()) {
      this.sendInterfaceMessage_(method, responseCallback, args);
    }
  }

  /**
   * Sends a message to the OMID SessionService via internal OM SDK
   * communication.
   * @param {string} method The name of the method to call.
   * @param {?function(...?)} responseCallback A callback invoked on certain
   *     messages that send responses back.
   * @param {!Array<?>} args The arguments of the method.
   * @private
   */
  sendInternalMessage_(method, responseCallback, args) {
    const guid = guidUtils.generateGuid();
    if (responseCallback) {
      this.callbackMap_[guid] = responseCallback;
    }
    const message = new InternalMessage(
        guid, getPrefixedSessionServiceMethod(method), SESSION_CLIENT_VERSION,
        serializeMessageArgs(SESSION_CLIENT_VERSION, args));
    this.communication_.sendMessage(message);
  }

  /**
   * Handles an incoming internal OM SDK message from the OMID SessionService.
   * @param {!InternalMessage} message The incoming message.
   * @param {?} from The sender of the message.
   * @private
   */
  handleInternalMessage_(message, from) {
    const {method, guid, args} = message;
    if (method === 'response' && this.callbackMap_[guid]) {
      // Clients deserialize messages based on their own version, which is this
      // SESSION_CLIENT_VERSION in this case.
      // The service will serde the message based on the clients' initiated
      // message version
      const parsedArgs = deserializeMessageArgs(SESSION_CLIENT_VERSION, args);
      this.callbackMap_[guid].apply(this, parsedArgs);
    }
    if (method === 'error') {
      if (window.console) logger.error(args);
    }
  }

  /**
   * Sends a message to the OMID SessionService via the JS Session Interface.
   * @param {string} method The name of the method to call.
   * @param {?function(...?)} responseCallback A callback invoked on certain
   *     messages that send responses back.
   * @param {!Array<?>} args The arguments of the method.
   * @private
   */
  sendInterfaceMessage_(method, responseCallback, args) {
    try {
      this.sessionInterface_.sendMessage(method, responseCallback, args);
    } catch (error) {
      logger.error('Failed to communicate with SessionInterface with error:');
      logger.error(error);
    }
  }

  /**
   * Throws an error if the session is not running.
   * NOTE: This method is friend scoped. Therefore it should not be exported
   * beyond obfuscation.
   */
  assertSessionRunning() {
    if (!this.isSessionRunning_) {
      throw new Error('Session not started.');
    }
  }

  /**
   * Handles when an impression has occurred.
   * Sets a flag of this class so that it can remember that an impression has
   * occured.
   * NOTE: This method is friend scoped. Therefore it should not be exported
   * beyond obfuscation.
   * @throws error if creativeType or impressionType has not be redefined
   * from the JS layer. Both the creative and impression types must be redefined
   * by the JS layer before the impression event can be sent from the JS layer.
   */
  impressionOccurred() {
    if (this.creativeType_ === CreativeType.DEFINED_BY_JAVASCRIPT) {
      throw new Error('Creative type has not been redefined');
    }
    if (this.impressionType_ === ImpressionType.DEFINED_BY_JAVASCRIPT) {
      throw new Error('Impression type has not been redefined');
    }
    this.impressionOccurred_ = true;
  }

  /**
   * Handles when a load event has occurred.
   * Sets a flag of this class so that it can remember that a loaded event
   * has occured.
   * NOTE: This method is friend scoped. Therefore it should not be exported
   * beyond obfuscation.
   * @throws error if creativeType or impressionType has not be redefined
   * from the JS layer. Both the creative and impression types must be redefined
   * by the JS layer before the loaded event can be sent from the JS layer.
   */
   creativeLoaded() {
    if (this.creativeType_ === CreativeType.DEFINED_BY_JAVASCRIPT) {
      throw new Error('Creative type has not been redefined');
    }
    if (this.impressionType_ === ImpressionType.DEFINED_BY_JAVASCRIPT) {
      throw new Error('Impression type has not been redefined');
    }
    this.creativeLoaded_ = true;
   }

  /**
   * Sends initial information about the session client to the JS service.
   * @private
   */
  setClientInfo_() {
    this.sendOneWayMessage(
        'setClientInfo', SESSION_CLIENT_VERSION, this.context_.partner.name,
        this.context_.partner.version, this.adSessionId_);
  }

  /**
   * Requests the JS service to inject the verification script resources. This
   * happens either by the service appending <script> tags if a window is
   * available, or by invoking the native layer.
   * @param {?Array<!VerificationScriptResource>} verificationScriptResources
   * @throws error if the verificationScriptResources array is undefined, null
   *     or empty
   * @private
   */
  injectVerificationScripts_(verificationScriptResources) {
    if (!verificationScriptResources) return;
    const resources = verificationScriptResources.map((r) => r.toJSON());
    this.sendOneWayMessage(
        'injectVerificationScriptResources', resources, this.adSessionId_);
  }

  /**
   * Sends the ad creative DOM element to the service, if sending elements is
   * supported.
   * @param {?HTMLElement} element The ad creative DOM element
   * @private
   */
  sendSlotElement_(element) {
    this.sendElement_(element, 'setSlotElement');
  }

  /**
   * Sends the video DOM element to the service, if sending elements is
   * supported.
   * @param {?HTMLVideoElement} element The video DOM element
   * @private
   */
  sendVideoElement_(element) {
    this.sendElement_(element, 'setVideoElement');
  }

  /**
   * Sends the given DOM element to the service with the given method, if
   * sending elements is supported.
   * @param {?HTMLElement} element The DOM element to send.
   * @param {string} method The method with which to send the element.
   * @private
   */
  sendElement_(element, method) {
    if (!element) {
      return;
    }
    if (!this.isSendingElementsSupported_()) {
      this.error(ErrorType.GENERIC,
          `Session Client ${method} called when communication is cross-origin`);
      return;
    }
    this.sendOneWayMessage(method, element, this.adSessionId_);
  }

  /**
   * Sends the provided contentUrl to the service.
   * @param {?string} contentUrl
   * @private
   */
  sendContentUrl_(contentUrl) {
    if (!contentUrl) {
      return;
    }
    this.sendOneWayMessage('setContentUrl', contentUrl, this.adSessionId_);
  }

  /**
   * Set the DOM element's geometry relative to the geometry of either the
   * slotElement or the cross domain iframe the creative's DOM element is in.
   * @param {?Rectangle} elementBounds
   * @throws Error if the elementBounds parameter is null or undefined.
   * @public
   */
  setElementBounds(elementBounds) {
    argsChecker.assertNotNullObject('AdSession.elementBounds', elementBounds);
    this.sendOneWayMessage(
        'setElementBounds', elementBounds, this.adSessionId_);
  }

  /**
   * Watches the session start and stop events so that the class can know
   * whether the session is running or not.
   * @private
   */
  watchSessionEvents_() {
    // Watch for session events.
    this.registerSessionObserver((event) => {
      if (event['type'] === AdEventType.SESSION_START) {
        this.isSessionRunning_ = true;
        // OMID 1.2 integrations and earlier will not include this data.
        // In this case, both creativeType/impressionType will be undefined.
        this.creativeType_ = event['data']['creativeType'];
        this.impressionType_ = event['data']['impressionType'];
      }
      if (event['type'] === AdEventType.SESSION_FINISH) {
        this.isSessionRunning_ = false;
      }
    });
  }
}

packageExport('OmidSessionClient.AdSession', AdSession);
exports = AdSession;
