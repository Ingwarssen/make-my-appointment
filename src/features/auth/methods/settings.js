const {facebook} = require('../../../config')

const {
  responseSender
} = require('../../../utils')

module.exports = async (req, res) => {
  responseSender.success(res, {facebook})
}
