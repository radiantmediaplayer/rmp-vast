/**
 * @license Copyright (c) 2015-2022 Radiant Media Player | https://www.radiantmediaplayer.com
 * rmp-connection 2.1.0 | https://github.com/radiantmediaplayer/rmp-connection
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
  constructor() { }

  /**
    * @private
    */
  _getConnectionType() {
    if (typeof navigator.connection.type === 'string' && navigator.connection.type !== '') {
      switch (navigator.connection.type) {
        case 'ethernet':
          return 'ethernet';
        case 'wifi':
        case 'wimax':
        case 'mixed':
        case 'other':
          return 'wifi';
        case 'bluetooth':
        case 'cellular':
          return 'cellular';
        case 'none':
          return 'none';
        default:
          break;
      }
    }
    return 'unknown';
  }

  /**
    * @private
    */
  _getBandwidthEstimate() {
    if (typeof navigator.connection.downlink === 'number' && navigator.connection.downlink > 0) {
      return navigator.connection.downlink;
    } else if (typeof navigator.connection.effectiveType === 'string' && navigator.connection.effectiveType !== '') {
      switch (navigator.connection.effectiveType) {
        case 'slow-2g':
          return 0.025;
        case '2g':
          return 0.035;
        case '3g':
          return 0.35;
        case '4g':
          return 1.4;
        case '5g':
          return 5;
        default:
          break;
      }
    } else if (typeof navigator.connection.type === 'string' && navigator.connection.type !== '') {
      switch (navigator.connection.type) {
        case 'ethernet':
        case 'wifi':
        case 'wimax':
        case 'mixed':
        case 'other':
          return 1.4;
        case 'bluetooth':
        case 'cellular':
          return 0.35;
        case 'none':
          return -1;
        default:
          break;
      }
    }
    return 0.35;
  }

  /** 
   * @typedef {object} BandwidthData
   * @property {number} estimate
   * @property {string} connectionType
   * @return {BandwidthData}
   */
  get bandwidthData() {

    // default return values
    const result = {
      estimate: -1,
      connectionType: 'none'
    };

    // we are offline - exit
    if (typeof navigator.onLine !== 'undefined' && !navigator.onLine) {
      return result;
    }

    // we do not have navigator.connection - exit
    // for support see https://caniuse.com/#feat=netinfo - works everywhere but in Safari && Firefox 
    if (typeof navigator.connection === 'undefined') {
      return {
        estimate: -1,
        connectionType: 'unknown'
      };
    }

    // we return our internal values
    return {
      estimate: this._getBandwidthEstimate(),
      connectionType: this._getConnectionType()
    };
  }
}
