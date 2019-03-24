const mongoose = require('mongoose');
const Schema = require('./mongoose.schema');
const aggregationHelper = require('../../utils/aggregationHelper');

const Model = mongoose.model('Activity', Schema);

module.exports = {

  Origin: Model,

  create(payload) {
    return Model.create(payload);
  },

  getAll(options) {
    const pipeLine = [];
    const {
      sortBy,
      sortOrder,
      page,
      count,
      search
    } = options;
    const skip = (page - 1) * count;

    pipeLine.push({
      $lookup: {
        from        : 'users',
        foreignField: '_id',
        localField  : 'originator',
        as          : 'originator'
      }
    }, {
      $unwind: {
        path                      : '$originator',
        preserveNullAndEmptyArrays: true
      }
    });

    if (search) {
      const searchFields = ['originator.name', 'originator.position', 'type', 'description'];
      const searchObj = aggregationHelper.getSearchMatch(searchFields, search);

      pipeLine.push(searchObj);
    }

    pipeLine.push({
      $group: {
        _id  : null,
        total: { $sum: 1 },
        root : { $push: '$$ROOT' }
      }
    }, {
      $unwind: '$root'
    }, {
      $project: {
        total      : 1,
        _id        : '$root._id',
        type       : '$root.type',
        originator : '$root.originator',
        description: '$root.description',
        createdAt  : '$root.createdAt'
      }
    }, {
      $lookup: {
        from        : 'access_roles',
        foreignField: '_id',
        localField  : 'originator.accessRole',
        as          : 'originator.accessRole'
      }
    }, {
      $unwind: {
        path                      : '$originator.accessRole',
        preserveNullAndEmptyArrays: true
      }
    }, {
      $project: {
        total      : 1,
        _id        : 1,
        type       : 1,
        description: 1,
        createdAt  : 1,

        originator: {
          _id       : { $ifNull: ['$originator._id', null] },
          name      : { $ifNull: ['$originator.name', null] },
          position  : { $ifNull: ['$originator.position', null] },
          accessRole: {
            _id : 1,
            name: 1
          }
        }
      }
    }, {
      $addFields: {
        originator: {
          accessRole: { $ifNull: ['$originator.accessRole', null] }
        }
      }
    }, {
      $sort: {
        [sortBy]: sortOrder
      }
    }, {
      $skip: skip
    }, {
      $limit: count
    }, {
      $group: {
        _id  : '$total',
        items: {
          $push: {
            _id        : '$_id',
            type       : '$type',
            description: '$description',
            originator : '$originator',
            createdAt  : '$createdAt'
          }
        }
      }
    }, {
      $project: {
        _id  : 0,
        items: 1,
        total: '$_id'
      }
    });

    return Model.aggregate(pipeLine).exec().then((data) => {
      const defResult = { total: 0, items: [] };
      const dbResult = data && data.length && data[0];
      const result = Object.assign({}, defResult, dbResult);

      return result;
    });
  }
};

const indexes = [
  Model.collection.createIndex({ createdAt: 1 }, { background: true })
];

Promise.all(indexes);
