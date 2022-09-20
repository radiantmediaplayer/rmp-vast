goog.module('omid.common.VastProperties');

const {VideoPosition} = goog.require('omid.common.constants');

/**
 * Captures key VAST properties so they can be shared with all registered
 * verification providers.
 * @unrestricted
 * @public
 */
class VastProperties {
  /**
   * @param {boolean} isSkippable Whether the ad can be skipped by the user.
   * @param {number} skipOffset The number of seconds after which the player
   *     makes the UI to skip the ad available to the user. Corresponds to the
   *     'skipoffset' attribute from VAST.
   *     Required when skippable is true. Otherwise should be set to zero.
   * @param {boolean} isAutoPlay Whether the ad playback will be automatically
   *     started without input from the user.
   * @param {!VideoPosition} position Position of the ad in relation to other
   *     content.
   */
  constructor(isSkippable, skipOffset, isAutoPlay, position) {
    this.isSkippable = isSkippable;
    this.skipOffset = skipOffset;
    this.isAutoPlay = isAutoPlay;
    this.position = position;
  }

  /**
   * @override
   * @return {!Object}
   */
  toJSON() {
    return {
      'isSkippable': this.isSkippable,
      'skipOffset': this.skipOffset,
      'isAutoPlay': this.isAutoPlay,
      'position': this.position,
    };
  }
}

exports = VastProperties;
