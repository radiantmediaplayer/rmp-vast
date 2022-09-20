goog.module('omid.sessionClient.Partner');

const argsChecker = goog.require('omid.common.argsChecker');
const {packageExport} = goog.require('omid.common.exporter');

/**
 * Holds information about the integration partner that is using the session
 * client.
 * @public
 */
class Partner {
  /**
   * Creates a new partner instance given a name and a version.
   * @param {string} name The partner ID of the integration.
   * @param {string} version The version of the integration's session script.
   * @throws error if any of the parameters are undefined, null or blank.
   */
  constructor(name, version) {
    argsChecker.assertTruthyString('Partner.name', name);
    argsChecker.assertTruthyString('Partner.version', version);

    this.name = name;
    this.version = version;
  }
}

packageExport('OmidSessionClient.Partner', Partner);
exports = Partner;
