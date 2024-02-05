/** // ? Simulate a delayed task
 * @param {number} delay - time in milliseconds to be delayed by default 5000
 * @returns {Promise}
 */
export const asyncDelay = (delay = 5000) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};
