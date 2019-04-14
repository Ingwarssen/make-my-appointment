const ROLES = require('../constants/acl/role')
const {DEF_USER: defUserProfile} = require('../constants')
const AccessRoleModel = require('../features/accessRole/model')
const UserModel = require('../features/user/model')
const {defUser: defUserCred} = require('../config')
const {
  logger,
  encrypt
} = require('../utils')

module.exports = async () => {
  const {_id} = ROLES.SUPER_ADMIN
  const {email} = defUserCred

  let adminRole
  try {
    adminRole = await AccessRoleModel.getOne({_id})
  } catch (ex) {
    logger.error(`Retrieving user accessRole error: ${ex}`)
    throw ex
  }

  const accessRole = adminRole._id

  let user
  try {
    user = await UserModel.getOne({email})
  } catch (ex) {
    logger.error(`Retrieving user error: ${ex}`)
    throw ex
  }

  const options = Object.assign({}, defUserProfile, defUserCred, {accessRole})

  options.password = encrypt(options.password)

  if (!user) {
    try {
      await UserModel.create(options)
    } catch (ex) {
      logger.error(`Creating user error: ${ex}`)
      throw ex
    }
  } else {
    try {
      await UserModel.updateOne({email}, options)
    } catch (ex) {
      logger.error(`Updating user error: ${ex}`)
      throw ex
    }
  }

  // logger.info(DEF_USER);
}
