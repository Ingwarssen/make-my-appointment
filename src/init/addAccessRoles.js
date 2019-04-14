const Promise = require('bluebird');
const accessRoleData = require('../constants/acl/access');
const ROLES = require('../constants/acl/role');
const AccessRoleModel = require('../features/accessRole/model');

const iterator = roleName => {
  const {
    _id,
    name,
    level,
    allowedLoginFromMobile
  } = ROLES[roleName];
  const query = {
    _id
  };

  const modify = {
    $set: {
      roleAccess: accessRoleData[_id],
      allowedLoginFromMobile
    },

    $setOnInsert: {
      level,
      name
    }
  };

  const opt = {
    new                : true,
    upsert             : true,
    setDefaultsOnInsert: true
  };

  return AccessRoleModel.updateOne(query, modify, opt);
};

const addRoles = () => {
  const roleNames = Object.keys(ROLES);
  const tasks = [];

  roleNames.forEach(elem => {
    tasks.push(iterator(elem));
  });

  return Promise.all(tasks);
};

module.exports = addRoles;
