goog.module('omid.common.guid');

/**
 * Generates an RFC4122 complaint GUID which can be used to uniquely identify
 * messages.
 * @return {string} Unique RFC4122 GUID string.
 */
function generateGuid() {
  const digit = (containsClockSeqHiAndReserved) => {
    let randomNumber = Math.random() * 16 | 0;
    // This digit contains the clock sequence high and reserved bits, so we
    // must set them in the return value.
    if (containsClockSeqHiAndReserved) {
      return (randomNumber & 0x3 | 0x8).toString(16);
    }
    return randomNumber.toString(16);
  };

  // Mark the digit that contains the clock sequence high and reserved bits
  // so that the algorithm sets them appropriately. Also set version 4 in the
  // string directly.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g, (character) => digit(character === 'y'));
}

exports = {
  generateGuid,
};
