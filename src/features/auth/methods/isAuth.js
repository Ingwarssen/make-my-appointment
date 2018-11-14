const { USER_STATUS } = require('../../../constants');
const User = require('../../user/model');

const {
  responseSender
} = require('../../../utils');

module.exports = async (req, res, next) => {
  const {
    loggedIn,
    uId: userId
  } = req.session;

  if (!loggedIn || !userId) {
    return responseSender.notAuthorized(next);
  }

  let user;
  try {
    user = await User.getCurrent(userId);
  } catch (ex) {
    return responseSender.error(next, ex, 'Database Error: User.getCurrent');
  }

  if (!user || user.status === USER_STATUS.DISABLED) {
    return responseSender.notAuthorized(next);
  }

  return responseSender.success(res, { data: user });
};
