goog.module('omid.common.logger');

/**
 * Logs an error to the console.
 * @param {...*} args Content to log to the error log.
 */
function error(...args) {
  executeLog(
      () => {
        // If this is a Jasmine run, throw loudly. Causing the tests to barf.
        throw new Error('Could not complete the test successfully - ', ...args);
      },
      () => console.error(...args),
  );
}

/**
 * Logs an error to the console. Does not throw loudly during tests.
 * @param {...*} args Content to log to the error log.
 */
function debug(...args) {
  executeLog(
      // ignore on test runs, it just produces noise.
      () => {},
      () => console.error(...args),
  );
}

/**
 * Executes the logging action to the console.
 * @param {function()} jasmineFunction The function to call during jasmine test
 *     run.
 * @param {function()} consoleFunction The function to call when running in prod.
 */
function executeLog(jasmineFunction, consoleFunction) {
  if (typeof jasmine !== 'undefined' && jasmine) {
    jasmineFunction();
  } else if (typeof console !== 'undefined' && console && console.error) {
    consoleFunction();
  }
}

exports = {error, debug};
