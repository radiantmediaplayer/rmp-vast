goog.module('omid.common.exporter');

/**
 * Gets the omidExports name if it exists, null otherwise.
 * @return {?Object<string, ?>}
 */
function getOmidExports() {
  return typeof omidExports === 'undefined' ? null : omidExports;
}

/**
 * Gets the named value of an object, or creates it if it doesn't exist.
 * In other words, this checks if the object contains the key (name) specified
 * and if it does, it returns that value. Otherwise it creates that key as an
 * empty object and returns a handle to the new empty object.
 * @param {?Object} owner
 * @param {string} name
 * @return {?Object}
 */
function getOrCreateName(owner, name) {
  return owner && (owner[name] || (owner[name] = {}));
}

/**
 * Exports a package level name for public consumption.
 * @param {string} namespace Dot notation namespace to export.
 * @param {?} objectToExport Object to be exported.
 * @param {?} exportsGlobal Global object to export to
 */
function packageExport(
    namespace, objectToExport, exportsGlobal = getOmidExports()) {
  // Only export the name if the global exports definitions exists
  if (!exportsGlobal) return;

  const names = namespace.split('.');
  const destination = names
      .slice(0, names.length - 1)
      .reduce(getOrCreateName, exportsGlobal);
  const name = names[names.length - 1];
  destination[name] = objectToExport;
}

exports = {packageExport};
