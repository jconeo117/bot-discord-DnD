/**
 * get a random number in a range
 * @param {number} min number minimun (default = 0)
 * @param {number} max number maximun (default = 100)
 * @returns {number} return the random number in range
 */

export function getRandomNum(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}