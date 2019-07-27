const config = require('../../../config')

const {
  responseSender
} = require('../../../utils')

module.exports = async (req, res) => {
  const {
    appId,
    appName,
    apiVersion
  } = config.facebook

  responseSender.success(res, {
    facebook: {
      appId,
      appName,
      apiVersion
    }
  })
}
