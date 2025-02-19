const {User, PhishingDetection} = require('../database');

module.exports = {
    countUsers: () => {
        return User.countDocuments({deleted: false, role: "USER"})
    },
    getUsers: (page, perPage) => {
        return User.find({deleted: false, role: "USER"})
            .limit(perPage)
            .skip(perPage * (page - 1))
            .sort({createdAt: 'desc'})
            .select({__v: 0, apiPath: 0})
    },
    getAllUsersByParam: (userId, isAdmin) => User.find({
        _id: {$ne: userId},
        role: isAdmin ? "USER" : "ADMIN",
        deleted: false
    }).select([
        "firstname",
        "lastname",
        "avatar",
        "_id"
    ]),

    insertUser: (user) => User.create(user),

    findUser: (userParam) => User.findOne({...userParam, deleted: false}),

    updateUser: (user, updatedUser) => User.updateOne(user, updatedUser),

    deleteUser: (user) => Object.assign(user, {deleted: true, deletedAt: Date.now()}),

    findUserByEmail: (email) => User.findOne({email, deleted: false}),

    getUsersFromYear: (lastYearDate) => User.aggregate([
        {
            $match: {
                createdAt: {$lte: lastYearDate},
            },
        },
        {
            $group: {
                _id: null,
                totalUsers: {$sum: 1}
            }
        }
    ]),

    getNumberOfUsers: () => User.countDocuments(),

    getMonthlyUserStatistic: (currentYear) => User.aggregate([
        {
            $match: {
                "$and": [
                    {
                        createdAt: {
                            $gte: currentYear,
                        },
                    },
                    {
                        "deleted": false
                    }
                ]
            },
        },
        {
            $group: {
                _id: {
                    month: {$month: '$createdAt'}
                },
                total: {$sum: 1},
            },
        },
        {
            $sort: {'_id.month': 1}
        },
    ]),

    getWeeklyUserStatistic: (currentWeek) => User.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(currentWeek),
                },
            },
        },
        {
            $group: {
                _id: {
                    week: {$week: '$createdAt'},
                    day: {$dayOfWeek: '$createdAt'}
                },
                count: {$sum: 1},
            },
        },
        {
            $sort: {'_id': 1}
        },
    ]),

    getUsersByAuth: () => User.aggregate([
        {
            $match: {
                "deleted": false,
            },
        },
        {
            $group: {
                _id: '$isGoogleAuth',
                count: {$sum: 1}
            }
        },
        {
            $project: {
                type: '$_id',
                count: 1,
                _id: 0
            }
        }
    ]),
};
