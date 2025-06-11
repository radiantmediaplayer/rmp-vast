goog.module('omid.sessionClient.UniversalAdId');

const argsChecker = goog.require('omid.common.argsChecker');
const {packageExport} = goog.require('omid.common.exporter');

/**
 * This class contains details passed from advertisers regarding the UniversalId tag used for creative ID validation.
 * @public
 */
class UniversalAdId {
  /**
   * Create a new UniversalAdId instance with supplied fields.
   * @param {string} value It is used to identify the unique creative identifier.
   * @param {string} idRegistry It is used to identify the URL for the registry
   * website where the unique creative ID is cataloged.
   * @throws error if any of the parameters are undefined, null or blank.
   */
  constructor(value, idRegistry) {
    argsChecker.assertTruthyString('UniversalAdId.value', value);
    argsChecker.assertTruthyString('UniversalAdId.idRegistry', idRegistry);

    this.value = value;
    this.idRegistry = idRegistry;
  }

  /**
   * @return {string}
   */
  toSerialisedValue() {
    return this.value + '; ' + this.idRegistry;
  }
}

packageExport('OmidSessionClient.UniversalAdId', UniversalAdId);
exports = UniversalAdId;
