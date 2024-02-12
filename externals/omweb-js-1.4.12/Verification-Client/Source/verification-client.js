goog.module('omid.verificationClient.VerificationClient');

const Communication = goog.require('omid.common.Communication');
const InternalMessage = goog.require('omid.common.InternalMessage');
const logger = goog.require('omid.common.logger');
const {AdEventType, Environment} = goog.require('omid.common.constants');
const {GeometryChangeCallback, ImpressionCallback, SessionObserverCallback, VideoCallback} = goog.require('omid.common.eventTypedefs');
const {Version} = goog.require('omid.common.version');
const {assertFunction, assertPositiveNumber, assertTruthyString} = goog.require('omid.common.argsChecker');
const {deserializeMessageArgs, serializeMessageArgs} = goog.require('omid.common.ArgsSerDe');
const {generateGuid} = goog.require('omid.common.guid');
const {getOmidEnvironment} = goog.require('omid.common.DetectOmid');
const {getPrefixedVerificationServiceMethod} = goog.require('omid.common.serviceMethodUtils');
const {omidGlobal} = goog.require('omid.common.OmidGlobalProvider');
const {packageExport} = goog.require('omid.common.exporter');
const {resolveGlobalContext, resolveTopWindowContext} = goog.require('omid.common.windowUtils');
const {startVerificationServiceCommunication} = goog.require('omid.common.serviceCommunication');

/**
 * @const {string}
 * @ignore
 */
const VERIFICATION_CLIENT_VERSION = Version;

/**
 * @typedef {!ImpressionCallback|
 *           !GeometryChangeCallback|
 *           !VideoCallback}
 * @ignore
 */
let EventCallback;

/**
 * Checks for and returns the window.omid3p object, if it exists.
 * @return {?{registerSessionObserver: !Function,
 *           addEventListener: !Function}} The omid3p object.
 * @ignore
 */
function getThirdPartyOmid() {
  const omid3p = omidGlobal['omid3p'];
  if (omid3p &&
      typeof omid3p['registerSessionObserver'] === 'function' &&
      typeof omid3p['addEventListener'] === 'function') {
    return omid3p;
  }
  return null;
}

/**
 * Allows verification scripts to interact with the OM SDK Service.
 * @public
 */
class VerificationClient {
  /**
   * @param {?Communication<?>=} communication This parameter is for OM SDK
   *    internal use only and should be omitted.
   */
  constructor(communication = undefined) {
    /**
     * Communication object that the VerificationClient will use to talk to the
     * VerificationService. This parameter is useful for testing. If left
     * unspecified, the correct Communication will be constructed and used.
     */
    this.communication = communication ||
        startVerificationServiceCommunication(resolveGlobalContext());
    if (this.communication) {
      this.communication.onMessage = this.handleMessage_.bind(this);
    } else {
      const omid3p = getThirdPartyOmid();
      if (omid3p) {
        this.omid3p = omid3p;
      }
    }

    // Create counters so that we can assign local IDs to timeouts and
    // intervals.
    /** @private */
    this.remoteTimeouts_ = 0;
    /** @private */
    this.remoteIntervals_ = 0;

    /**
     * Map of callback guids to callbacks.
     * @type {!Object<string, function(?)>}
     * @private
     */
    this.callbackMap_ = {};

    /**
     * List to hold <img> elements for pinging URLs, to prevent garbage
     * collection while the request is in flight.
     * @type {!Array<!HTMLImageElement>}
     * @private
     */
    this.imgCache_ = [];

    const verificationProperties = omidGlobal['omidVerificationProperties'];

    /**
     * An ID injected by the OM SDK to uniquely identify this script.
     * @private @const {string|undefined}
     */
    this.injectionId_ = verificationProperties ?
        verificationProperties['injectionId'] :
        undefined;
  }

  /**
   * Checks if OMID is available.
   * @return {boolean}
   * @public
   */
  isSupported() {
    if (this.getEnvironment() === Environment.WEB && !this.injectionId_) {
      return false;
    }
    return Boolean(this.communication || this.omid3p);
  }

  /**
   * Gets the environment type of the OM Service that either injected the
   * verification resource or is present in the global context (e.g. window).
   * Note that this check is based on which service binary is used: omsdk-v1.js
   * (App) or omweb-v1.js (Web). The binary typically corresponds to the actual
   * environment in which the OM SDK is run, but there may be counterexamples
   * such as the Web service binary running in a webview inside a mobile app.
   * @return {Environment|null} The service's environment type; null if either
   * (1) the service is a 3rd party custom service or (2) this verification
   * client is inlined (not injected) and the service is version 1.4.7 or below.
   * @public
   */
  getEnvironment() {
    const globalContext = resolveGlobalContext();
    return this.injectionSource() || getOmidEnvironment(globalContext) ||
        getOmidEnvironment(resolveTopWindowContext(globalContext));
  }

  /**
   * DEPRECATED: use getEnvironment to cover both injected and inline scripts.
   * Gets the environment type of the OM Service that injected the verification
   * resource.
   * @return {Environment|undefined} the injecting service's environment type or
   * undefined if the verification resource was side-loaded or the service is a
   * 3rd party custom service.
   * @public
   */
  injectionSource() {
    const verificationProperties = omidGlobal['omidVerificationProperties'];
    if (verificationProperties && verificationProperties['injectionSource']) {
      return verificationProperties['injectionSource'];
    }
  }

  // TODO(OMSDK-718): Make the declarations in event-typedef.js compatible with
  // JSDoc, and remove the event handler field descriptions below.

  /**
   * Subscribes to all session events ('sessionStart', 'sessionError', and
   * 'sessionFinish'). This method also signals that the verification script has
   * loaded and is ready to receive events, so it should be called upon
   * initialization.
   * The event handler will be called with a single argument that has the
   * following fields:
   *   'adSessionId': string,
   *   'timestamp': number,
   *   'type': string,
   *   'data': object
   * @param {SessionObserverCallback} functionToExecute An event handler which
   *     will be invoked on session events.
   * @param {string=} vendorKey
   * @throws error if the function to execute is undefined or null.
   * @throws error if the vendor key is undefined, null or blank.
   * @public
   */
  registerSessionObserver(functionToExecute, vendorKey = undefined) {
    assertFunction('functionToExecute', functionToExecute);
    if (this.omid3p) {
      // The `injectionId` argument may or may not be used by the omid3p
      // implementation; always pass it in case it is used.
      this.omid3p['registerSessionObserver'](
          functionToExecute, vendorKey, this.injectionId_);
      return;
    }
    this.sendMessage_(
        'addSessionListener', functionToExecute, vendorKey, this.injectionId_);
  }

  /**
   * Subscribes to ad lifecycle and metric events.
   * The event handler will be called with a single argument that has the
   * following fields:
   *   'adSessionId': string,
   *   'timestamp': number,
   *   'type': string,
   *   'data': object
   * @param {!AdEventType} eventType The event type to subscribe this listener
   *     to.
   * @param {!EventCallback} functionToExecute An event handler to be invoked
   *     when the given event type is triggered.
   * @throws error if the event type is undefined, null or blank.
   * @throws error if the function to execute is undefined or null.
   * @public
   */
  addEventListener(eventType, functionToExecute) {
    assertTruthyString('eventType', eventType);
    assertFunction('functionToExecute', functionToExecute);
    if (this.omid3p) {
      // The `injectionId` argument may or may not be used by the omid3p
      // implementation; always pass it in case it is used.
      this.omid3p['addEventListener'](
          eventType, functionToExecute, this.injectionId_);
      return;
    }
    this.sendMessage_(
        'addEventListener', functionToExecute, eventType, this.injectionId_);
  }

  /**
   * Requests the target URL.
   *
   * This can be used to transmit data to a remote server by requesting a URL
   * with the payload embeded into the URL as query arg(s).
   * @param {string} url The URL to be requested.
   * @param {function()=} successCallback Optional callback to be executed if
   *     the request was successfully received (2xx response code).
   * @param {function()=} failureCallback Optional callback to be executed if
   *     the request was not successfully received (non-success response code or
   *     other error).
   * @throws error if the url is undefined, null or blank.
   * @public
   */
  sendUrl(url, successCallback = undefined, failureCallback = undefined) {
    assertTruthyString('url', url);
    if (omidGlobal.document && omidGlobal.document.createElement) {
      this.sendUrlWithImg_(url, successCallback, failureCallback);
      return;
    }
    this.sendMessage_(
        'sendUrl', (success) => {
          if (success && successCallback) {
            successCallback();
          } else if (!success && failureCallback) {
            failureCallback();
          }
        }, url);
  }

  /**
   * Requests the target URL in browser-based environments, using an <img> tag.
   *
   * @param {string} url which should be requested.
   * @param {function()=} successCallback function to be executed when the
   *     request has been successful.
   * @param {function()=} failureCallback function to be executed when the
   *     request has failed.
   * @private
   */
  sendUrlWithImg_(url, successCallback = undefined,
      failureCallback = undefined) {
    const img = /** @type {!HTMLImageElement} */
        (omidGlobal.document.createElement('img'));
    this.imgCache_.push(img);
    const removeAndCall = (callback) => {
      const i = this.imgCache_.indexOf(img);
      if (i >= 0) {
        this.imgCache_.splice(i, 1);
      }
      if (callback) {
        callback();
      }
    };
    img.addEventListener('load', removeAndCall.bind(this, successCallback));
    img.addEventListener('error', removeAndCall.bind(this, failureCallback));
    img.src = url;
  }

  /**
   * Injects the supplied JavaScript resource into the same execution
   * environment as the verification provider.
   *
   * For all DOM based environments (incl. Android native ad sessions) this will
   * append `script` elements to the DOM.
   * For native ad sessions this will delegate responsibility to the OM SDK
   * library which will be responsible for downloading and injecting the
   * JavaScript content into the execution environment.
   * @param {string} url The URL of the JavaScript resource to load into the
   *     environment.
   * @param {function()=} successCallback Optional callback to be executed if
   *     the HTTP request was successful. Does not indicate whether the script
   *     evaluation was successful.
   * @param {function()=} failureCallback Optional callback to be executed if
   *     the script failed to load.
   * @throws error if the supplied URL is undefined, null or blank.
   * @public
   */
  injectJavaScriptResource(
      url, successCallback, failureCallback) {
    assertTruthyString('url', url);
    if (omidGlobal.document) {
      this.injectJavascriptResourceUrlInDom_(
          url, successCallback, failureCallback);
    } else {
      this.sendMessage_(
          'injectJavaScriptResource', (success, contents) => {
            // Check for resource load failure.
            if (!success) {
              logger.error('Service failed to load JavaScript resource.');
              failureCallback();
              return;
            }

            this.evaluateJavaScript_(contents, url);
            successCallback();
          }, url);
    }
  }

  /**
   * Inject the supplied javascript resource in the DOM.
   * @param {string} url
   * @param {function()=} successCallback
   * @param {function()=} failureCallback
   * @private
   */
  injectJavascriptResourceUrlInDom_(url, successCallback, failureCallback) {
    const document = omidGlobal.document;
    const body = document.body;

    // Create the script tag and load the content, while listening to the onload
    // and onerror events as measures of success. Note that if the parsing of
    // the script fails, the onload event will still fire. Success only
    // indicates HTTP success.
    const scriptNode = document.createElement('script');
    // Type expected for onload/onerror callbacks is slightly different
    scriptNode.onload =
        /** @type {function ((Event|null)): ?|null} */ (successCallback);
    scriptNode.onerror =
        /** @type {function ((Event|null)): ?|null} */ (failureCallback);
    scriptNode.src = url;
    scriptNode.type = 'application/javascript';

    body.appendChild(scriptNode);
  }

  /**
   * Inject the supplied javascript resource in the DOM.
   * @param {string} javaScript
   * @param {string} url
   * @private
   */
  evaluateJavaScript_(javaScript, url) {
    try {
      eval(javaScript);
    } catch (error) {
      logger.error(`Error evaluating the JavaScript resource from "${url}".`);
    }
  }

  /**
   * Schedules a function to be called a function after the specified delay.
   * Provides behavior equivalent to the window.setTimeout web API method.
   * @param {function()} functionToExecute The callback to execute after the
   *     delay.
   * @param {number} timeInMillis The number of milliseconds to wait before
   *     invoking the callback.
   * @return {number} A unique ID which can be used with clearTimeout to cancel
   *     the function execution.
   * @throws error if the function to execute is undefined or null.
   * @throws error if the time in millis is undefined, null or a non-positive
   *     number.
   * @public
   */
  setTimeout(functionToExecute, timeInMillis) {
    assertFunction('functionToExecute', functionToExecute);
    assertPositiveNumber('timeInMillis', timeInMillis);

    if (this.hasTimeoutMethods_()) {
      return omidGlobal.setTimeout(functionToExecute, timeInMillis);
    }

    const id = this.remoteTimeouts_++;
    this.sendMessage_('setTimeout', functionToExecute, id, timeInMillis);
    return id;
  }

  /**
   * Cancels a timeout before its callback has been executed.
   * Provides behavior equivalent to the window.clearTimeout web API method.
   * @param {number} timeoutId The ID returned from setTimeout of the callback
   *     to cancel.
   * @throws error if the timeout ID is undefined, null or a non-positive
   *     number.
   * @public
   */
  clearTimeout(timeoutId) {
    assertPositiveNumber('timeoutId', timeoutId);

    if (this.hasTimeoutMethods_()) {
      omidGlobal.clearTimeout(timeoutId);
      return;
    }

    this.sendOneWayMessage_('clearTimeout', timeoutId);
  }

  /**
   * Schedules a function to be called repeatedly at a specified interval.
   * Provides behavior equivalent to the window.setInterval web API method.
   * @param {function()} functionToExecute The callback to execute repeatedly.
   * @param {number} timeInMillis The number of milliseconds to wait between
   *     callback invocations.
   * @return {number} A unique ID which can be used with clearInterval to cancel
   *     the function execution.
   * @throws error if the function to execute is undefined or null.
   * @throws error if the time in millis is undefined, null or a non-positive
   *     number.
   * @public
   */
  setInterval(functionToExecute, timeInMillis) {
    assertFunction('functionToExecute', functionToExecute);
    assertPositiveNumber('timeInMillis', timeInMillis);

    if (this.hasIntervalMethods_()) {
      return omidGlobal.setInterval(functionToExecute, timeInMillis);
    }

    const id = this.remoteIntervals_++;
    this.sendMessage_('setInterval', functionToExecute, id, timeInMillis);
    return id;
  }

  /**
   * Cancels further execution of a repeated callback.
   * @param {number} intervalId The ID returned from setInterval of the callback
   *     to cancel.
   * @throws error if the interval ID is undefined, null or a non-positive
   *     number.
   * @public
   */
  clearInterval(intervalId) {
    assertPositiveNumber('intervalId', intervalId);

    if (this.hasIntervalMethods_()) {
      omidGlobal.clearInterval(intervalId);
      return;
    }

    this.sendOneWayMessage_('clearInterval', intervalId);
  }

  /**
   * Checks to see if intrinsic timeout methods are defined in the local
   * execution context.
   * @return {boolean} Whether setTimeout and clearTimeout are defined.
   * @protected
   */
  hasTimeoutMethods_() {
    return typeof omidGlobal.setTimeout === 'function' &&
        typeof omidGlobal.clearTimeout === 'function';
  }

  /**
   * Checks to see if intrinsic interval methods are defined in the local
   * execution context.
   * @return {boolean} Whether setInterval and clearInterval are defined.
   * @protected
   */
  hasIntervalMethods_() {
    return typeof omidGlobal.setInterval === 'function' &&
        typeof omidGlobal.clearInterval === 'function';
  }

  /**
   * Handles an incomming post message.
   * @param {!InternalMessage} message
   * @param {?} from Who sent the message.
   * @private
   */
  handleMessage_(message, from) {
    const {method, guid, args} = message;
    if (method === 'response' && this.callbackMap_[guid]) {
      // Clients deserialize messages based on their own version, which is this
      // VERIFICATION_CLIENT_VERSION in this case.
      // The service will serde the message based on the clients' initiated
      // message version
      const deserializedArgs = deserializeMessageArgs(
          VERIFICATION_CLIENT_VERSION, args);
      this.callbackMap_[guid].apply(this, deserializedArgs);
    }
    if (method === 'error') {
      if (window.console) logger.error(args);
    }
  }

  /**
   * Sends a message to the OMID VerificationService and ignores responses.
   * @param {string} method Name of the remote method to invoke.
   * @param {...?} args Arguments to use when invoking the remote
   *     function.
   * @private
   */
  sendOneWayMessage_(method, ...args) {
    this.sendMessage_(method, null, ...args);
  }

  /**
   * Sends a message to the OMID VerificationService.
   * @param {string} method Name of the remote method to invoke.
   * @param {?function(...?)} responseCallback Callback to be called when
   *     a response is received.
   * @param {...?} args Arguments to use when invoking the remote function.
   * @private
   */
  sendMessage_(method, responseCallback, ...args) {
    if (!this.communication) return;

    const guid = generateGuid();
    if (responseCallback) {
      this.callbackMap_[guid] = responseCallback;
    }

    const message = new InternalMessage(
        guid,
        getPrefixedVerificationServiceMethod(method),
        VERIFICATION_CLIENT_VERSION,
        serializeMessageArgs(VERIFICATION_CLIENT_VERSION, args));
    this.communication.sendMessage(message);
  }
}

packageExport('OmidVerificationClient', VerificationClient);
exports = VerificationClient;
