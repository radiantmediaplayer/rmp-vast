/**
 * @license Copyright (c) 2015-2021 Radiant Media Player | https://www.radiantmediaplayer.com
 * rmp-connection 1.0.0 | https://github.com/radiantmediaplayer/rmp-connection
 * rmp-connection is released under MIT | https://github.com/radiantmediaplayer/rmp-connection/blob/master/LICENSE
 */

/**
 * The class to instantiate RmpConnection
 * @export
 * @class RmpConnection
*/
export default class RmpConnection {

  /**
    * @constructor
    */
  constructor() {
    this.connectionType = '';
  }

  /** 
    * @private
    */
  _getConnectionType() {
    if (typeof navigator.connection.type === 'string' && navigator.connection.type !== '') {
      return navigator.connection.type;
    }
    return '';
  }

  /** 
   * @return {number}
   */
  getBandwidthEstimate() {
    // we are not in a supported environment - exit
    if (typeof window === 'undefined') {
      return -1;
    }
    // we are offline - exit
    if (typeof navigator.onLine !== 'undefined' && !navigator.onLine) {
      return -1;
    }
    // we do not have navigator.connection - exit
    // for support see https://caniuse.com/#feat=netinfo
    if (typeof navigator.connection === 'undefined') {
      return -1;
    }
    this.connectionType = this._getConnectionType();
    // we do have navigator.connection.type but it reports no connection - exit
    if (this.connectionType && this.connectionType === 'none') {
      return -1;
    }
    // we have navigator.connection.downlink - this is our best estimate
    // Returns the effective bandwidth estimate in megabits per second, rounded to the nearest multiple of 25 kilobits per seconds.
    if (typeof navigator.connection.downlink === 'number' && navigator.connection.downlink > 0) {
      return navigator.connection.downlink;
    }
    // we have navigator.connection.effectiveType - this is our second best estimate
    // we actually have indication here: http://wicg.github.io/netinfo/#effective-connection-types
    if (typeof navigator.connection.effectiveType === 'string' && navigator.connection.effectiveType !== '') {
      switch (navigator.connection.effectiveType) {
        case 'slow-2g':
          return 0.025;
        case '2g':
          return 0.035;
        case '3g':
          return 0.35;
        case '4g':
          return 0.7;
        case '5g':
          return 1.05;
        default:
          break;
      }
    }
    // finally we have navigator.connection.type - this won't help much 
    if (this.connectionType) {
      switch (this.connectionType) {
        case 'ethernet':
          return 1.05;
        case 'wifi':
        case 'wimax':
          return 0.7;
        case 'bluetooth':
          return 0.35;
        default:
          break;
      }
      // there is no point in guessing bandwidth when navigator.connection.type is cellular this can vary from 0 to 100 Mbps 
      // better to admit we do not know and find another way to detect bandwidth, this could include:
      // - context guess: user-agent detection (mobile vs desktop), device width or pixel ratio 
      // - AJAX/Fetch timing: this is outside rmp-connection scope
    }
    // nothing worked - exit
    return -1;
  }
}
