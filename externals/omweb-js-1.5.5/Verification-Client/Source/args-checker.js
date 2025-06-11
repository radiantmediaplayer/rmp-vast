goog.module('omid.common.argsChecker');

/**
 * Checks that string value is not undefined, null, blank or empty.
 * @param {string} fieldName
 * @param {*} value
 * @throws error if value is undefined, null or blank.
 * @throws error if value is not a string,
 */
function assertTruthyString(fieldName, value) {
  if (!value) {
    throw new Error(`Value for ${fieldName} is undefined, null or blank.`);
  }
  if (typeof value !== 'string' && !(value instanceof String)) {
    throw new Error(`Value for ${fieldName} is not a string.`);
  }
  if (value.trim() === '') {
    throw new Error(`Value for ${fieldName} is empty string.`);
  }
}

/**
 * Checks that object value is not null or undefined.
 * @param {string} fieldName
 * @param {*} value
 * @throws error if the value is null or undefined.
 */
function assertNotNullObject(fieldName, value) {
  if (value == null) {
    throw new Error(`Value for ${fieldName} is undefined or null`);
  }
}

/** Checks that value is a valid number.
 * @param {string} fieldName
 * @param {*} value
 * @throws error if the value is not of type number
 */
function assertNumber(fieldName, value) {
  if (value == null) {
    throw new Error(`${fieldName} must not be null or undefined.`);
  }
  if (typeof(value) !== 'number' || isNaN(value)) {
    throw new Error(`Value for ${fieldName} is not a number`);
  }
}

/**
 * Checks whether value is a valid number between low and high.
 * @param {string} fieldName
 * @param {*} value
 * @param {number} low
 * @param {number} high
 * @throws error if the value is not a number or if it is outside of the
 *   [low, high] range
 */
function assertNumberBetween(fieldName, value, low, high) {
  assertNumber(fieldName, value);

  const numberValue = /** @type {number} */ (value);
  if (numberValue < low || numberValue > high) {
    throw new Error(
        `Value for ${fieldName} is outside the range [${low},${high}]`);
  }
}

/**
 * Validates that a callback is truthy.
 * @param {string} fieldName
 * @param {*} functionToExecute
 * @throws error if functionToExecute is not truthy
 */
function assertFunction(fieldName, functionToExecute) {
  if (!functionToExecute) {
    throw new Error(`${fieldName} must not be truthy.`);
  }
}

/**
 * Checks that a type is a positive number.
 * @param {string} fieldName
 * @param {*} value
 * @throws error if the value is not of type number
 */
function assertPositiveNumber(fieldName, value) {
  assertNumber(fieldName, value);
  if (/** @type {number} */ (value) < 0) {
    throw new Error(`${fieldName} must be a positive number.`);
  }
}

exports = {
  assertTruthyString,
  assertNotNullObject,
  assertNumber,
  assertNumberBetween,
  assertFunction,
  assertPositiveNumber,
};
