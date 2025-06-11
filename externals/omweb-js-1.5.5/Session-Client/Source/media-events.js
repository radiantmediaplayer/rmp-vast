goog.module('omid.sessionClient.MediaEvents');

const AdSession = goog.require('omid.sessionClient.AdSession');
const VastProperties = goog.require('omid.common.VastProperties');
const argsChecker = goog.require('omid.common.argsChecker');
const {InteractionType, VideoPlayerState} = goog.require('omid.common.constants');
const {packageExport} = goog.require('omid.common.exporter');

/**
 * Provides a complete list of supported JS media events. Using this event API
 * assumes the media player is fully responsible for communicating all media
 * events at the appropriate times. Only one media events implementation can be
 * associated with the ad session and any attempt to create multiple instances
 * will result in an error. The same rules apply to both multiple JS media
 * events and any attempt to register a JS media events instance when a native
 * instance has already been registered via the native bridge.
 * @public
 */
class MediaEvents {
  /**
   * @param {!AdSession} adSession The ad session instance for sending events.
   * @throws error if the supplied ad session is undefined or null.
   */
  constructor(adSession) {
    argsChecker.assertNotNullObject('MediaEvents.adSession', adSession);

    /** @private @const {string} */
    this.adSessionId_ = adSession.getAdSessionId();

    try {
      adSession.registerMediaEvents();
      this.adSession = adSession;
    } catch (error) {
      throw new Error(
          'AdSession already has a media events instance registered');
    }
  }

  /**
   * Notifies all media listeners that media content has started playing.
   * @param {number} duration Duration of the selected media media (in seconds).
   * @param {number} mediaPlayerVolume Audio volume of the media player with a
   *   range between 0 and 1.
   * @throws error if an invalid duration or mediaPlayerVolume has been
   *   supplied.
   * @public
   */
  start(duration, mediaPlayerVolume) {
    argsChecker.assertNumber('MediaEvents.start.duration', duration);
    argsChecker.assertNumberBetween('MediaEvents.start.mediaPlayerVolume',
        mediaPlayerVolume, 0, 1);
    this.adSession.sendOneWayMessage(
        'start', duration, mediaPlayerVolume, this.adSessionId_);
  }

  /**
   * Notifies all media listeners that media playback has reached the first
   * quartile.
   * @public
   */
  firstQuartile() {
    this.adSession.sendOneWayMessage('firstQuartile', this.adSessionId_);
  }

  /**
   * Notifies all media listeners that media playback has reached the midpoint.
   * @public
   */
  midpoint() {
    this.adSession.sendOneWayMessage('midpoint', this.adSessionId_);
  }

  /**
   * Notifies all media listeners that media playback has reached the third
   * quartile.
   * @public
   */
  thirdQuartile() {
    this.adSession.sendOneWayMessage('thirdQuartile', this.adSessionId_);
  }

  /**
   * Notifies all media listeners that media playback is complete.
   * @public
   */
  complete() {
    this.adSession.sendOneWayMessage('complete', this.adSessionId_);
  }

  /**
   * Notifies all media listeners that media playback has paused after a user
   * interaction.
   * @public
   */
  pause() {
    this.adSession.sendOneWayMessage('pause', this.adSessionId_);
  }

  /**
   * Notifies all media listeners that media playback has resumed (after being
   * paused) after a user interaction.
   * @public
   */
  resume() {
    this.adSession.sendOneWayMessage('resume', this.adSessionId_);
  }

  /**
   * Notifies all media listeners that media playback has stopped and started
   * buffering.
   * @public
   */
  bufferStart() {
    this.adSession.sendOneWayMessage('bufferStart', this.adSessionId_);
  }

  /**
   * Notifies all media listeners that buffering has finished and media playback
   * has resumed.
   * @public
   */
  bufferFinish() {
    this.adSession.sendOneWayMessage('bufferFinish', this.adSessionId_);
  }

  /**
   * Notifies all media listeners that media playback has stopped as a user skip
   * interaction. Once skipped media it should not be possible for the media to
   * resume playing content.
   * @public
   */
  skipped() {
    this.adSession.sendOneWayMessage('skipped', this.adSessionId_);
  }

  /**
   * Notifies all media listeners that the media player has changed the volume.
   * @param {number} mediaPlayerVolume Audio volume of the media player with a
   *   range between 0 and 1.
   * @throws error if an invalid mediaPlayerVolume has been supplied.
   * @public
   */
  volumeChange(mediaPlayerVolume) {
    argsChecker.assertNumberBetween(
        'MediaEvents.volumeChange.mediaPlayerVolume', mediaPlayerVolume, 0, 1);
    this.adSession.sendOneWayMessage(
        'volumeChange', mediaPlayerVolume, this.adSessionId_);
  }

  /**
   * Notifies all media listeners that media player state has changed.
   * @param {!VideoPlayerState} playerState The latest media player state.
   * @throws error if the supplied player state is undefined or null.
   * @see VideoPlayerState
   * @public
   */
  playerStateChange(playerState) {
    argsChecker.assertNotNullObject(
        'MediaEvents.playerStateChange.playerState', playerState);
    this.adSession.sendOneWayMessage(
        'playerStateChange', playerState, this.adSessionId_);
  }

  /**
   * Notifies all media listeners that the user has performed an ad interaction.
   * @param {!InteractionType} interactionType The latest user interaction.
   * @throws error if the supplied interaction type is undefined or null.
   * @public
   */
  adUserInteraction(interactionType) {
    argsChecker.assertNotNullObject(
        'MediaEvents.adUserInteraction.interactionType', interactionType);
    this.adSession.sendOneWayMessage(
        'adUserInteraction', interactionType, this.adSessionId_);
  }
}

packageExport('OmidSessionClient.MediaEvents', MediaEvents);
exports = MediaEvents;
