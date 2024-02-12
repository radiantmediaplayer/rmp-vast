goog.module('omid.complianceVerificationScript.ComplianceVerificationClient');
const {packageExport} = goog.require('omid.common.exporter');
const {AdEventType} = goog.require('omid.common.constants');
const VerificationClient = goog.require('omid.verificationClient.VerificationClient');
const {Version} = goog.require('omid.common.version');
const {isTopWindowAccessible, removeDomElements, resolveGlobalContext} = goog.require('omid.common.windowUtils');

/**
 * @const {string} the default URL to send messages to another server.
 */
const DefaultLogServer = 'https://complianceomsdk.iabtechlab.org/omsdk/sendmessage?';

/**
 * @const {string}
 * @ignore
 */
const COMPLIANCE_VERIFICATION_CLIENT_VERSION = Version;

/**
 * A const array that holds the interesting AdEventTypes.  It is used in registering for AdEventType events.
 */
const AdEventTypeArray = [
            AdEventType.IMPRESSION,
            AdEventType.GEOMETRY_CHANGE,
            AdEventType.LOADED,
            AdEventType.START,
            AdEventType.FIRST_QUARTILE,
            AdEventType.MIDPOINT,
            AdEventType.THIRD_QUARTILE,
            AdEventType.COMPLETE,
            AdEventType.PAUSE,
            AdEventType.RESUME,
            AdEventType.PLAYER_STATE_CHANGE,
            AdEventType.VOLUME_CHANGE,
            AdEventType.SKIPPED,
            AdEventType.AD_USER_INTERACTION,
            AdEventType.BUFFER_START,
            AdEventType.BUFFER_FINISH,
        ];

/**
 * OMID ComplianceVerificationClient.
 * Script to be used to see if an integration is compliant with IAB standards.
 * The script creates a ComplianceVerificationClient instance to register the appropriate add event listeners
 * for specific events like impression, quartile, geometry changes, etc.
 * The script fires a message to a URL for every event that is received by the OMID.
 */
class ComplianceVerificationClient {
    /**
     * Simple ComplianceVerificationClient
     *  - log if support is true
     *  - register to sessionObserver
     *  - register a callback to all AdEventType, except additional registration to media events
     * @param {VerificationClient} verificationClient instance for communication with OMID server
     * @param {string} vendorKey - should be the same when calling sessionStart in order to get verificationParameters
     */
    constructor(verificationClient, vendorKey) {
        this.verificationClient_ = verificationClient;

        this.fireURL_(DefaultLogServer + 'version=' + COMPLIANCE_VERIFICATION_CLIENT_VERSION);

        let supportedStr = this.verificationClient_.isSupported() ? 'yes' : 'no';
        this.fireURL_(DefaultLogServer + 'supported=' + supportedStr);

        this.verificationClient_.registerSessionObserver((event) => {
            this.fireEvent_(event);
        }, vendorKey);

        for (let i = 0; i < AdEventTypeArray.length; i++ ) {
            this.verificationClient_.addEventListener(AdEventTypeArray[i], (event) => {
                this.fireEvent_(event);
            });
        }
    }

    /**
     * Helper function used to serialize the event data into key=value pairs.
     * @param {Object} obj which is the data to be serialized
     * @param {string|undefined} prefix text
     * @return {string} the new pair for the URL
     */
    serialize_(obj, prefix) {
        let str = [];
        let p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                let k = prefix ? prefix + '[' + p + ']' : p;
                let v = obj[p];

                /* Special check for an empty array to ensure that it is printed instead of being skipped. */
                if (Array.isArray(v) && v.length == 0) {
                    str.push(encodeURIComponent(k) + '=' + encodeURIComponent('[]'));
                } else {
                    str.push((v !== null && typeof v === 'object') ?
                        this.serialize_(v, k) :
                        encodeURIComponent(k) + '=' + encodeURIComponent(v));
                }
            }
        }
        return str.join('&');
    }

    /**
     * Calls the verificationClient sendUrl method to send a message to a server over the network.
     * @param {string} url - The fully formed URL message to send to the server.
     */
    fireURL_(url) {
       this.verificationClient_.sendUrl(url);
    }

    /**
     * Simple helper function which requests the data to be serialized before appending to the predefined URL.
     * Then it requests the data to be sent over the network.
     * @param {Object} event data
     */
    fireEvent_(event) {
        event = removeDomElements(event);
        /* Add new param friendlyToTop, true if top window is available, false otherwise. */
        if (event.hasOwnProperty('type')) {
            if (event['type'] === 'sessionStart') {
                event.data.context['friendlyToTop'] = JSON.stringify(isTopWindowAccessible(resolveGlobalContext()));
            }
        }
        let params = this.serialize_(event, undefined);
        params += '&rawJSON=' + encodeURIComponent(JSON.stringify(event));
        let url = DefaultLogServer + params;
        this.fireURL_(url);
    }
}
exports = ComplianceVerificationClient;
