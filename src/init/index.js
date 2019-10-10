const addAccessRoles = require('./addAccessRoles')
const addDefaultUser = require('./addDefaultUser')
const { logger } = require('../utils')

module.exports = async function init() {
  logger.info('>Init scrip initiated utils')

  try {
    await addAccessRoles()
  } catch (ex) {
    logger.error(`Adding acl modules error: ${ex}`)
    throw ex
  }

  logger.info('>AccessRoles updated without error')

  try {
    await addDefaultUser()
  } catch (ex) {
    logger.error(`Adding default user error: ${ex}`)
    throw ex
  }

  logger.info('>Default user updated without error')
}
