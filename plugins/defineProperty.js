/* eslint-disable no-extend-native */

/**
 * Array.remove
 * @param {Object} item - 要移除的对象
 */
Object.defineProperty(Array.prototype, 'remove', {
  value(item) {
    const index = this.indexOf(item);
    if (index >= 0) {
      return this.splice(index, 1);
    }
    return null;
  },
});

/* eslint-disable no-extend-native */

/**
 * Math.floorTo 無條件捨去到第n位
 */
Math.floorTo = (number, digit) => Math.floor(number * 10 ** digit) / 10 ** digit;
