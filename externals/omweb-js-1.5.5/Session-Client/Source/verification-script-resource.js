goog.module('omid.sessionClient.VerificationScriptResource');

const argsChecker = goog.require('omid.common.argsChecker');
const {AccessMode} = goog.require('omid.common.constants');
const {packageExport} = goog.require('omid.common.exporter');

/**
 * Represents a verification script resource that comes in a VAST extension for
 * VAST versions <= 3 or a verification node for VAST versions >= 4
 * @public
 */
class VerificationScriptResource {
  /**
   * Creates new verification script resource instance which requires vendor
   * specific verification parameters.
   * @param {string} resourceUrl
   * @param {string=} vendorKey
   * @param {string=} verificationParameters
   * @param {AccessMode=} accessMode The level of access this verification
   *     script will have when executed.
   * @throws error if either the vendorKey or resourceUrl is undefined, null or
   *   blank.
   */
  constructor(resourceUrl, vendorKey = undefined,
      verificationParameters = undefined, accessMode = AccessMode.FULL) {
    argsChecker.assertTruthyString('VerificationScriptResource.resourceUrl',
        resourceUrl);

    /** @type {string} */
    this.resourceUrl = resourceUrl;

    /** @type {(string|undefined)} */
    this.vendorKey = vendorKey;

    /** @type {(string|undefined)} */
    this.verificationParameters = verificationParameters;

    /** @type {!AccessMode} */
    this.accessMode = accessMode;
  }

  /**
   * @override
   * @return {!Object}
   */
  toJSON() {
    return {
      'accessMode': this.accessMode,
      'resourceUrl': this.resourceUrl,
      'vendorKey': this.vendorKey,
      'verificationParameters': this.verificationParameters,
    };
  }
}

packageExport('OmidSessionClient.VerificationScriptResource',
       VerificationScriptResource);
exports = VerificationScriptResource;
