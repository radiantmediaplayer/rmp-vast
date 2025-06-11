goog.module('omid.common.FloatComparer');

/** @type {number} the tolerance to still be considered roughly equal when comparing floats
 * This number was chosen to be small enough so that on almost any device a difference less
 * this number in pixels would not be visible to a user and large enough to account for
 * non-real differences that arise due to float arithmetic issues.
 */
const FLOAT_ROUGH_DIFF_TOLERANCE = 0.01;

/**
 * Compares if two numbers roughly equal (within a margin of 0.01)
 * @param {number} x - the first number
 * @param {number} y - the second number
 * @return {boolean} true if roughly equal, false if not
 */
function roughlyEqual(x, y) {
    return Math.abs(x - y) < FLOAT_ROUGH_DIFF_TOLERANCE;
}

/**
 * Compares if one number is less than a second number by a margin large enough to account for
 * float arithmetic (within a margin of 0.01)
 * @param {number} x - the number to check if it's less than another number
 * @param {number} y - the other number
 * @return {boolean} true if x less than y, false if not
 */
function roughlyLessThan(x, y) {
    return (y - x) > FLOAT_ROUGH_DIFF_TOLERANCE;
}

/**
 * Compares if one number is less than a second number or if they are roughly
 * equal (within a margin of 0.01)
 * @param {number} x - the number to check if it's less than another number
 * @param {number} y - the other number
 * @return {boolean} true if x less than y or if x roughly equals y, false if not
 */
function lessThanOrRoughlyEqual(x, y) {
    return x < y || roughlyEqual(x, y);
}

/**
 * Compares if one number is greater than a second number or if they are roughly
 * equal (within a margin of 0.01)
 * @param {number} x - the number to check if it's greater than another number
 * @param {number} y - the other number
 * @return {boolean} true if x greater than y or if x roughly equals y, false if not
 */
function greaterThanOrRoughlyEqual(x, y) {
    return x > y || roughlyEqual(x, y);
}

exports = {
    roughlyEqual,
    roughlyLessThan,
    lessThanOrRoughlyEqual,
    greaterThanOrRoughlyEqual,
};
