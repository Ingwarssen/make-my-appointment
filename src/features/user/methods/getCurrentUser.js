const UserModel = require('../model')
const { responseSender } = require('../../../utils')

module.exports = async (req, res, next) => {
  const userId = req.auth.id

  let data
  try {
    data = await UserModel.getPopulatedById(userId)
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: UserModel.getPopulatedById')
  }

  responseSender.success(res, { data })
}
