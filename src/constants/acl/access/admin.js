module.exports = [
  {
    moduleName: 'Admins',
    module    : 1,

    cms: {
      create: false,
      read  : true,
      update: false,
      delete: false
    },

    mobile: {
      create: false,
      read  : true,
      update: false,
      delete: false
    }
  }, {
    moduleName: 'Users',
    module    : 2,

    cms: {
      create: true,
      read  : true,
      update: true,
      delete: true
    },

    mobile: {
      create: true,
      read  : true,
      update: true,
      delete: true
    }
  }, {
    moduleName: 'Training schedule',
    module    : 3,

    cms: {
      create: true,
      read  : true,
      update: true,
      delete: true
    },

    mobile: {
      create: true,
      read  : true,
      update: true,
      delete: true
    }
  }
]
