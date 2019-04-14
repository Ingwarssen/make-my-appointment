const _ = require('lodash')
const mongoose = require('mongoose')
const {USER_STATUS, DEFAULT_AVATAR_URL} = require('../../constants')
const ROLES = require('../../constants/acl/role')
const Schema = require('./mongoose.schema')
const aggregationHelper = require('../../utils/aggregationHelper')

const Model = mongoose.model('User', Schema)

function getFilterQuery (filter) {
  const matchObj = {
    $and: []
  }

  for (const filterItemName in filter) {
    if (Object.prototype.hasOwnProperty.call(filter, filterItemName)) {
      const filterItemValue = filter[filterItemName]

      switch (filterItemName) {
        case 'accessRole':
          matchObj.$and.push({
            accessRole: {$in: filterItemValue}
          })
          break

        case 'nationality':
          matchObj.$and.push({
            nationality: {$in: filterItemValue}
          })
          break

        case 'status':
          matchObj.$and.push({
            status: {$in: filterItemValue}
          })
          break

        case 'startDate':
          matchObj.$and.push({
            dateOfJoining: {$ne: null, $gte: filterItemValue}
          })
          break

        case 'endDate':
          matchObj.$and.push({
            dateOfJoining: {$ne: null, $lte: filterItemValue}
          })
          break
        default:
          break
      }
    }
  }

  return matchObj
}

const defProjection = {
  _id          : 1,
  name         : 1,
  email        : 1,
  status       : 1,
  position     : 1,
  avatar       : 1,
  avatarContent: 1,
  accessRole   : 1,
  location     : 1
}

const mainPartPipeLine = [{
  $lookup: {
    from        : 'content',
    foreignField: '_id',
    localField  : 'avatar',
    as          : 'avatar'
  }
}, {
  $unwind: {
    path                      : '$avatar',
    preserveNullAndEmptyArrays: true
  }
}, {
  $addFields: {
    avatarContent: {
      $let: {
        vars: {
          isExistAvatar: {$gt: ['$avatar._id', '']}
        },

        in: {
          _id: {
            $cond: {
              if  : '$$isExistAvatar',
              then: {$ifNull: ['$avatar._id', null]},
              else: null
            }
          },

          originalUrl: {
            $cond: {
              if  : '$$isExistAvatar',
              then: {$ifNull: ['$avatar.url', null]},
              else: DEFAULT_AVATAR_URL
            }
          },

          originalName: {
            $cond: {
              if  : '$$isExistAvatar',
              then: {$ifNull: ['$avatar.originalName', null]},
              else: 'Avatar.png'
            }
          },

          type: {
            $cond: {
              if  : '$$isExistAvatar',
              then: {$ifNull: ['$avatar.type', null]},
              else: 'image/png'
            }
          },

          status: {
            $cond: {
              if  : '$$isExistAvatar',
              then: {$ifNull: ['$avatar.status', 'error']},
              else: 'done'
            }
          },

          thumbnailUrl: {
            $cond: {
              if  : '$$isExistAvatar',
              then: {
                $let: {
                  vars: {
                    thumb: {
                      $arrayElemAt: [{
                        $ifNull: [{
                          $filter: {
                            input: '$avatar.resizes',
                            as   : 'item',
                            cond : {$eq: ['$$item.resizeType', 'thumb']}
                          }
                        }, []]
                      }, 0]
                    }
                  },

                  in: {$ifNull: ['$$thumb.url', null]}
                }
              },
              else: DEFAULT_AVATAR_URL
            }
          }
        }
      }

    }
  }
}, {
  $addFields: {
    avatar: {
      $let: {
        vars: {item: '$avatar'},
        in  : {
          $let: {
            vars: {
              thumb: {
                $arrayElemAt: [{
                  $ifNull: [{
                    $filter: {
                      input: '$$item.resizes',
                      as   : 'elem',
                      cond : {$eq: ['$$elem.resizeType', 'thumb']}
                    }
                  }, []]
                }, 0]
              }
            },

            in: {$ifNull: ['$$thumb.url', DEFAULT_AVATAR_URL]}
          }
        }
      }

    }
  }
}, {
  $lookup: {
    from        : 'access_roles',
    foreignField: '_id',
    localField  : 'accessRole',
    as          : 'accessRole'
  }
}, {
  $unwind: {
    path                      : '$accessRole',
    preserveNullAndEmptyArrays: true
  }
}, {
  $project: {
    total        : 1,
    _id          : 1,
    name         : 1,
    avatarContent: 1,
    avatar       : 1,
    status       : 1,
    createdUtc   : 1,
    editedUtc    : 1,

    accessRole: {
      _id  : 1,
      name : 1,
      level: 1
    }

  }
}]

module.exports = {

  Origin: Model,

  create (data) {
    return Model.create(data).then(user => Model.findById(user._id, defProjection).lean().exec())
  },

  update (query, modify, opt) {
    return Model.update(query, modify, opt)
  },

  updateOne (query, modify, opt = {}) {
    return Model.findOneAndUpdate(query, modify, opt).lean()
  },

  getOne (options, project_) {
    const project = Object.assign({}, defProjection, project_)

    return Model.findOne(options, project).lean()
  },

  getCurrent (id) {
    const userId = aggregationHelper.toObjectId(id)
    const extraOpt = {accessRole: {name: 1, level: 1, _id: 1}}
    const projectFields = Object.assign({}, defProjection, extraOpt)

    return Model.aggregate([{
      $match: {
        _id: userId
      }
    }, {
      $lookup: {
        from        : 'content',
        foreignField: '_id',
        localField  : 'avatar',
        as          : 'avatar'
      }
    }, {
      $unwind: {
        path                      : '$avatar',
        preserveNullAndEmptyArrays: true
      }
    }, {
      $addFields: {
        avatarContent: {
          $let: {
            vars: {
              isExistAvatar: {$gt: ['$avatar._id', '']}
            },

            in: {
              _id: {
                $cond: {
                  if  : '$$isExistAvatar',
                  then: {$ifNull: ['$avatar._id', null]},
                  else: null
                }
              },

              originalUrl: {
                $cond: {
                  if  : '$$isExistAvatar',
                  then: {$ifNull: ['$avatar.url', null]},
                  else: DEFAULT_AVATAR_URL
                }
              },

              originalName: {
                $cond: {
                  if  : '$$isExistAvatar',
                  then: {$ifNull: ['$avatar.originalName', null]},
                  else: 'Avatar.png'
                }
              },

              type: {
                $cond: {
                  if  : '$$isExistAvatar',
                  then: {$ifNull: ['$avatar.type', null]},
                  else: 'image/png'
                }
              },

              status: {
                $cond: {
                  if  : '$$isExistAvatar',
                  then: {$ifNull: ['$avatar.status', 'error']},
                  else: 'done'
                }
              },

              thumbnailUrl: {
                $cond: {
                  if  : '$$isExistAvatar',
                  then: {
                    $let: {
                      vars: {
                        thumb: {
                          $arrayElemAt: [{
                            $ifNull: [{
                              $filter: {
                                input: '$avatar.resizes',
                                as   : 'item',
                                cond : {$eq: ['$$item.resizeType', 'thumb']}
                              }
                            }, []]
                          }, 0]
                        }
                      },

                      in: {$ifNull: ['$$thumb.url', null]}
                    }
                  },
                  else: DEFAULT_AVATAR_URL
                }
              }
            }
          }

        }
      }
    }, {
      $addFields: {
        avatar: {
          $let: {
            vars: {item: '$avatar'},
            in  : {
              $let: {
                vars: {
                  thumb: {
                    $arrayElemAt: [{
                      $ifNull: [{
                        $filter: {
                          input: '$$item.resizes',
                          as   : 'elem',
                          cond : {$eq: ['$$elem.resizeType', 'thumb']}
                        }
                      }, []]
                    }, 0]
                  }
                },

                in: {$ifNull: ['$$thumb.url', DEFAULT_AVATAR_URL]}
              }
            }
          }

        }
      }
    }, {
      $lookup: {
        from        : 'access_roles',
        localField  : 'accessRole',
        foreignField: '_id',
        as          : 'accessRole'
      }
    }, {
      $unwind: {
        path                      : '$accessRole',
        preserveNullAndEmptyArrays: true
      }
    }, {
      $project: projectFields
    }]).exec().then(data => data && data.length && data[0])
  },

  getAll (options) {
    const pipeLine = []
    const {
      supervisor,
      sortBy,
      sortOrder,
      page,
      count,
      search,
      filter = {}
    } = options
    const skip = (page - 1) * count

    if (search) {
      const searchFields = ['name', 'phone', 'position']
      const searchObj = aggregationHelper.getSearchMatch(searchFields, search)

      pipeLine.push(searchObj)
    }

    if (supervisor) {
      const supervisorId = aggregationHelper.toObjectId(supervisor)
      pipeLine.push({
        $match: {
          supervisor: supervisorId
        }
      })
    }

    if (Object.keys(filter).length) {
      const filterMatch = getFilterQuery(filter)

      pipeLine.push({
        $match: filterMatch
      })
    }

    pipeLine.push({
      $group: {
        _id  : null,
        total: {$sum: 1},
        root : {$push: '$$ROOT'}
      }
    }, {
      $unwind: {
        path                      : '$root',
        preserveNullAndEmptyArrays: true
      }
    }, {
      $project: {
        total          : 1,
        _id            : '$root._id',
        name           : '$root.name',
        email          : '$root.email',
        status         : '$root.status',
        position       : '$root.position',
        supervisor     : '$root.supervisor',
        accessRole     : '$root.accessRole',
        createdBy      : '$root.createdBy',
        editedBy       : '$root.editedBy',
        dateOfPromotion: '$root.dateOfPromotion',
        dateOfJoining  : '$root.dateOfJoining',
        nationality    : '$root.nationality',
        shift          : '$root.shift',
        portfolio      : '$root.portfolio',
        location       : '$root.location'
      }
    }, {
      $sort: {
        [sortBy]: sortOrder
      }
    }, {
      $skip: skip
    }, {
      $limit: count
    }, ...mainPartPipeLine, {
      $group: {
        _id  : '$total',
        items: {
          $push: {
            _id            : '$_id',
            name           : '$name',
            email          : '$email',
            status         : '$status',
            position       : '$position',
            supervisor     : '$supervisor',
            employees      : '$employees',
            accessRole     : '$accessRole',
            createdBy      : '$createdBy',
            editedBy       : '$editedBy',
            nationality    : '$nationality',
            dateOfPromotion: '$dateOfPromotion',
            dateOfJoining  : '$dateOfJoining',
            shift          : '$shift',
            portfolio      : '$portfolio',
            location       : '$location'
          }
        }
      }
    }, {
      $project: {
        _id  : 0,
        items: 1,
        total: '$_id'
      }
    })

    return Model.aggregate(pipeLine).exec().then(data => {
      const defResult = {total: 0, items: []}
      const dbResult = data && data.length && data[0]
      const result = Object.assign({}, defResult, dbResult)

      return result
    })
  },

  getPopulatedById (id) {
    const userId = aggregationHelper.toObjectId(id)
    const pipeLine = [{
      $match: {
        _id: userId
      }
    }, ...mainPartPipeLine, {
      $project: {
        _id          : 1,
        name         : 1,
        avatar       : 1,
        avatarContent: 1,
        status       : 1,
        createdUtc   : 1,
        updatedUtc   : 1
      }
    }]

    return Model.aggregate(pipeLine).exec().then((data = []) => {
      const [result] = data
      return result
    })
  },

  getUserFilter (options) {
    const pipeLine = []

    const {
      filter = {}
    } = options

    if (Object.keys(filter).length) {
      const filterMatch = getFilterQuery(filter)

      pipeLine.push({
        $match: filterMatch
      })
    }

    pipeLine.push({
      $lookup: {
        from        : 'access_roles',
        localField  : 'accessRole',
        foreignField: '_id',
        as          : 'accessRole'
      }
    }, {
      $unwind: {
        path                      : '$accessRole',
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from        : 'users',
        localField  : 'supervisor',
        foreignField: '_id',
        as          : 'supervisor'
      }
    }, {
      $unwind: {
        path                      : '$supervisor',
        preserveNullAndEmptyArrays: true
      }
    }, {
      $group: {
        _id: null,

        supervisor: {
          $addToSet: {
            _id : '$supervisor._id',
            name: '$supervisor.name'
          }
        },

        accessRole: {
          $addToSet: {
            _id : '$accessRole._id',
            name: '$accessRole.name'
          }
        },

        nationality: {
          $addToSet: {
            _id : '$nationality',
            name: '$nationality'
          }
        },

        portfolio: {
          $addToSet: {
            _id : '$portfolio',
            name: '$portfolio'
          }
        },

        shift: {
          $addToSet: {
            _id : '$shift',
            name: '$shift'
          }
        },

        status: {
          $addToSet: {
            _id : '$status',
            name: '$status'
          }
        }
      }
    }, {
      $project: {
        _id       : 0,
        accessRole: {
          $filter: {
            input: '$accessRole',
            as   : 'item',
            cond : {
              $gt: ['$$item.name', '']
            }
          }
        },

        supervisor: {
          $filter: {
            input: '$supervisor',
            as   : 'item',
            cond : {
              $gt: ['$$item.name', '']
            }
          }
        },

        nationality: {
          $filter: {
            input: '$nationality',
            as   : 'item',
            cond : {
              $gt: ['$$item.name', '']
            }
          }
        },

        portfolio: {
          $filter: {
            input: '$portfolio',
            as   : 'item',
            cond : {
              $gt: ['$$item.name', '']
            }
          }
        },

        shift: {
          $filter: {
            input: '$shift',
            as   : 'item',
            cond : {
              $gt: ['$$item.name', '']
            }
          }
        },

        status: {
          $filter: {
            input: '$status',
            as   : 'item',
            cond : {
              $gt: ['$$item.name', '']
            }
          }
        }
      }
    })

    return Model.aggregate(pipeLine).exec().then(data => {
      const defResult = {
        accessRole : [],
        supervisor : [],
        nationality: [],
        portfolio  : [],
        shift      : [],
        status     : []
      }
      const dbResult = data && data.length && data[0]
      const result = Object.assign({}, defResult, dbResult)

      for (const key in result) {
        if ({}.hasOwnProperty.call(result, key)) {
          result[key] = _.sortBy(result[key], 'name')
        }
      }

      return result
    })
  },

  // uid => userId; mid => moduleId
  getAccess (uid, mid) {
    const userId = aggregationHelper.toObjectId(uid)

    const pipeline = [
      {
        $match: {
          _id   : userId,
          status: USER_STATUS.ACTIVE
        }
      }, {
        $lookup: {
          from        : 'access_roles',
          localField  : 'accessRole',
          foreignField: '_id',
          as          : 'accessRole'
        }
      }, {
        $unwind: {
          path                      : '$accessRole',
          preserveNullAndEmptyArrays: true
        }
      }, {
        $project: {
          access: '$accessRole.roleAccess',
          user  : {
            _id                     : '$_id',
            name                    : '$name',
            level                   : '$accessRole.level',
            lastReadNotificationDate: '$lastReadNotificationDate'
          }
        }
      }, {
        $unwind: {
          path                      : '$access',
          preserveNullAndEmptyArrays: true
        }
      }, {
        $match: {
          'access.module': mid
        }
      }
    ]

    return Model.aggregate(pipeline).exec().then(data => data && data.length && data[0])
  }
}

const indexes = [
  Model.collection.createIndex({phone: 1}, {unique: true, background: true})
]

Promise.all(indexes)
