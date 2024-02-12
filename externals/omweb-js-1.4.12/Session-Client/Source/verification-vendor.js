goog.module('omid.sessionClient.VerificationVendor');

const {packageExport} = goog.require('omid.common.exporter');


/**
 * Common verification vendor IDs.
 * @enum {number}
 */
const VerificationVendorId = {
  OTHER: 1,
  MOAT: 2,
  DOUBLEVERIFY: 3,
  INTEGRAL_AD_SCIENCE: 4,
  PIXELATE: 5,
  NIELSEN: 6,
  COMSCORE: 7,
  MEETRICS: 8,
  GOOGLE: 9,
};

/**
 * Gets the verification vendor ID of the given script URL.
 * @param {string} scriptUrl The script URL to look up
 * @return {VerificationVendorId} The verification vendor this URL corresponds
 *     to.
 */
function verificationVendorIdForScriptUrl(scriptUrl) {
  for (const vendorId of VERIFICATION_VENDORS.keys()) {
    for (const scriptUrlRegex of VERIFICATION_VENDORS.get(vendorId)) {
      if (scriptUrlRegex.test(scriptUrl)) {
        return vendorId;
      }
    }
  }
  return VerificationVendorId.OTHER;
}

/**
 * A map of verification vendor IDs to regexes that match their script URLs.
 * Note: only use RegEx literals since it avoids runtime regex compilation.
 * @private @const {!Map<!VerificationVendorId, !Array<!RegExp>>}
 */
const VERIFICATION_VENDORS = new Map([
  [
    VerificationVendorId.MOAT,
    [
      /^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.moatads\.com\/.*$/,
    ],
  ],
  [
    VerificationVendorId.DOUBLEVERIFY,
    [
      /^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.doubleverify\.com\/.*$/,
      /^(https?:\/\/|\/\/)?c\.[\w\-]+\.com\/vfw\/dv\/.*$/,
      /^(https?:\/\/|\/\/)?(www\.)?[\w]+\.tv\/r\/s\/d\/.*$/,
      /^(https?:\/\/|\/\/)?(\w\.?)+\.dv\.tech\/.*$/,
    ],
  ],
  [
    VerificationVendorId.INTEGRAL_AD_SCIENCE,
    [
      /^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.adsafeprotected\.com\/.*$/,
    ],
  ],
  [
    VerificationVendorId.PIXELATE,
    [
      /^https?:\/\/(q|cdn)\.adrta\.com\/s\/.*\/(aa|aanf)\.js.*$/,
      /^https:\/\/cdn\.rta247\.com\/s\/.*\/(aa|aanf)\.js.*$/,
    ],
  ],
  [
    VerificationVendorId.NIELSEN,
    [],
  ],
  [
    VerificationVendorId.COMSCORE,
    [
      /^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.voicefive\.com\/.*$/,
      /^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.measuread\.com\/.*$/,
      /^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.scorecardresearch\.com\/.*$/,
    ],
  ],
  [
    VerificationVendorId.MEETRICS,
    [
      /^(https?:\/\/|\/\/)?s418\.mxcdn\.net\/bb-serve\/omid-meetrics.*\.js$/,
    ],
  ],
  [
    VerificationVendorId.GOOGLE,
    [
      /^(https?:\/\/|\/\/)?pagead2\.googlesyndication\.com\/.*$/,
      /^(https?:\/\/|\/\/)?www\.googletagservices\.com\/.*$/,
    ],
  ],
]);

packageExport(
    'OmidSessionClient.verificationVendorIdForScriptUrl',
    verificationVendorIdForScriptUrl);
packageExport('OmidSessionClient.VerificationVendorId', VerificationVendorId);
exports = {
  verificationVendorIdForScriptUrl,
  VerificationVendorId,
};
