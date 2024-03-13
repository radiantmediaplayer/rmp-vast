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
      * @private
      */
    private _getConnectionType;
    /**
      * @private
      */
    private _getBandwidthEstimate;
    /**
     * @typedef {object} BandwidthData
     * @property {number} estimate
     * @property {string} connectionType
     * @return {BandwidthData}
     */
    get bandwidthData(): {
        estimate: number;
        connectionType: string;
    };
}
//# sourceMappingURL=rmp-connection.d.ts.map