goog.module('omid.common.Rectangle');

/**
 * A class which holds rectangle data.
 * @public
 */
class Rectangle {
  /**
   * @param {number} x The x coordinate of the upper left corner.
   * @param {number} y The y coordinate of the upper left corner.
   * @param {number} width The width of the rectangle.
   * @param {number} height The height of the rectangle.
   */
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

exports = Rectangle;
