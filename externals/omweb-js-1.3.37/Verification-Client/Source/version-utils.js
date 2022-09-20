goog.module('omid.common.VersionUtils');

/** @type {number} */
const SEMVER_DIGITS_NUMBER = 3;

/**
 * Returns true if this a valid version, false otherwise.
 * @param {string} version to check
 * @return {boolean}
 */
function isValidVersion(version) {
  return /\d+\.\d+\.\d+(-.*)?/.test(version);
}

/**
 * Returns true if baseVersion is greater or equal than versionToCompare, given
 * the semantic versioning rules. It ignores the build version when comparing.
 * @param {string} baseVersion
 * @param {string} versionToCompare
 * @return {boolean} true if baseVersion >= versionToCompare, false otherwise.
 */
function versionGreaterOrEqual(baseVersion, versionToCompare) {
  const baseComponents = baseVersion.split('-')[0].split('.');
  const toCompareComponents = versionToCompare.split('-')[0].split('.');

  for (let i=0; i<SEMVER_DIGITS_NUMBER; i++) {
    const baseNumber = parseInt(baseComponents[i], 10);
    const toCompareNumber = parseInt(toCompareComponents[i], 10);
    if (baseNumber > toCompareNumber) {
      return true;
    } else if (baseNumber < toCompareNumber) {
      return false;
    }
  }
  return true;
}

exports = {isValidVersion, versionGreaterOrEqual};
