const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

/**
 * Searches for any particular word from searchValue sentence. Words should be separated by space.
 * Looks up to field from fieldsArray argument.
 *
 * @function
 * @param {string[]} fieldsArray - The array of strings
 * - database fields where search should be performed.
 * @param {string} searchValue - One or more words to look for.
 *
 * @return {object} The MongoDB aggregate pipeline part that matches coincidences.
 *
 */
const getSearchMatch = (fieldsArray, searchValue) => {
  const regExps = searchValue.split(' ')
  const resultArray = []

  fieldsArray.forEach(field => {
    regExps.forEach(regExp => {
      resultArray.push({
        [field]: {
          $regex: regExp,
          $options: 'i',
        },
      })
    })
  })

  return {
    $match: { $or: resultArray },
  }
}

/**
 * Converts input argument to ObjectId (mongo). If ObjectId was passed instead - returns it.
 *
 * @function
 * @param {objectId[]|string[]|objectId|string} options - The input string or ObjectId.
 *
 * @returns {objectId|objectId[]} The converted hexadecimal ObjectId.
 *
 */

const toObjectId = options => {
  if (Array.isArray(options)) {
    return options.map(option => {
      return typeof option === 'string' ? ObjectId(option) : option
    })
  }

  return typeof options === 'string' ? ObjectId(options) : options
}

/**
 * Converts input argument into array. If array was passed instead - returns it.
 *
 * @function
 * @param {any} options - The any type input.
 *
 * @returns {*|*[]} The converted array.
 *
 */

const toArray = options => {
  if (Array.isArray(options)) {
    return options
  }

  return [options]
}

module.exports = {
  getSearchMatch,
  toObjectId,
  toArray,
}
