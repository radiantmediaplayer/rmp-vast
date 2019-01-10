/**
 * @license Copyright (c) 2015-2019 Radiant Media Player 
 * rmp-connection 0.2.0 | https://github.com/radiantmediaplayer/rmp-connection
 */

const RMPCONNECTION = {};

let connectionType = null;

const _getConnectionType = function () {
  if (typeof navigator.connection.type === 'string' && navigator.connection.type !== '') {
    return navigator.connection.type;
  }
  return null;
};

const _getArbitraryBitrateData = function () {
  // we actually have indication here: http://wicg.github.io/netinfo/#effective-connection-types
  const equivalentMbpsArray = [
    0.025,
    0.035,
    0.35,
    1.4
  ];
  // if we are in a bluetooth/cellular connection.type with 4g assuming 1.4 Mbps is a bit high so we settle for 0.7 Mbps
  // for ethernet/wifi/wimax where available bandwidth is likely higher we settle for 2.1 Mbps
  if (connectionType) {
    switch (connectionType) {
      case 'bluetooth':
      case 'cellular':
        equivalentMbpsArray[3] = 0.7;
        break;
      case 'ethernet':
      case 'wifi':
      case 'wimax':
        equivalentMbpsArray[3] = 2.1;
        break;
      default:
        break;
    }
  }
  return equivalentMbpsArray;
};

RMPCONNECTION.getBandwidthEstimate = function () {
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
  connectionType = _getConnectionType();
  // we do have navigator.connection.type but it reports no connection - exit
  if (connectionType && connectionType === 'none') {
    return -1;
  }
  // we have navigator.connection.downlink - this is our best estimate
  // Returns the effective bandwidth estimate in megabits per second, rounded to the nearest multiple of 25 kilobits per seconds.
  if (typeof navigator.connection.downlink === 'number' && navigator.connection.downlink > 0) {
    return navigator.connection.downlink;
  }
  // we have navigator.connection.effectiveType - this is our second best estimate
  // Returns the effective type of the connection meaning one of 'slow-2g', '2g', '3g', or '4g'. This value is determined using a combination of recently observed, round-trip time and downlink values.
  const arbitraryBitrateData = _getArbitraryBitrateData();
  if (typeof navigator.connection.effectiveType === 'string' && navigator.connection.effectiveType !== '') {
    switch (navigator.connection.effectiveType) {
      case 'slow-2g':
        return arbitraryBitrateData[0];
      case '2g':
        return arbitraryBitrateData[1];
      case '3g':
        return arbitraryBitrateData[2];
      case '4g':
        return arbitraryBitrateData[3];
      default:
        break;
    }
  }
  // finally we have navigator.connection.type - this won't help much 
  if (connectionType) {
    switch (connectionType) {
      case 'ethernet':
      case 'wifi':
      case 'wimax':
        return 1.4;
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
};

export default RMPCONNECTION;
