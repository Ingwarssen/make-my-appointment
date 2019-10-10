const crypto = require('crypto')

/**
 * Hashes input to hexadecimal code.
 * @function
 * @param {string} pass - The users password that has to be hashed
 *
 * @returns {string} The hashed string.
 *
 */

module.exports = pass => {
  const shaSum = crypto.createHash('sha256')

  shaSum.update(pass)
  return shaSum.digest('hex')
}
