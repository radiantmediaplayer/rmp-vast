goog.module('omid.sessionClient.AdEvents');

const AdSession = goog.require('omid.sessionClient.AdSession');
const VastProperties = goog.require('omid.common.VastProperties');
const argsChecker = goog.require('omid.common.argsChecker');
const {packageExport} = goog.require('omid.common.exporter');

/**
 * Ad event API enabling the JS component to signal to all verification
 * providers when key events have occurred. The OM SDK JS service will allow
 * only one ad events instance to be associated with the ad session and any
 * attempt to create multiple instances will result in an error.
 * @public
 */
class AdEvents {
  /**
   * @param {!AdSession} adSession The ad session instance for sending events.
   * @throws error if the supplied ad session is null.
   * @throws error if an ad events instance has already been registered with
   *   the ad session.
   */
  constructor(adSession) {
    argsChecker.assertNotNullObject('AdEvents.adSession', adSession);

    /** @private @const {string} */
    this.adSessionId_ = adSession.getAdSessionId();

    try {
      adSession.registerAdEvents();
      this.adSession = adSession;
    } catch (error) {
      throw new Error('AdSession already has an ad events instance registered');
    }
  }

  /**
   * Notifies all verification providers that an impression event should be
   * recorded.
   * @throws error if the native ad session has not been started.
   * @public
   */
  impressionOccurred() {
    this.adSession.assertSessionRunning();
    this.adSession.impressionOccurred();
    this.adSession.sendOneWayMessage('impressionOccurred', this.adSessionId_);
  }

  /**
   * Notifies all verification providers that a loaded event should be
   * recorded. Video/audio creatives should supply non-null vastProperties.
   * Display creatives should supply a null argument.
   *
   * @param {?VastProperties=} vastProperties containing static information
   * about the video placement. This is non-null for video/audio creatives and null
   * for display creatives.
   * @public
   */
  loaded(vastProperties = null) {
    this.adSession.creativeLoaded();
    const vastPropertiesJson = vastProperties ? vastProperties.toJSON() : null;
    this.adSession.sendOneWayMessage(
        'loaded', vastPropertiesJson, this.adSessionId_);
  }
}

packageExport('OmidSessionClient.AdEvents', AdEvents);
exports = AdEvents;
