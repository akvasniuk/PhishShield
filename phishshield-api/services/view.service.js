const {View} = require('../database');

module.exports = {
    insertView: () => View.create({numberOfView: 1}),
    totalViews: () => View.countDocuments(),
    getViewsFromYear: (lastYearDate) => View.aggregate([
        {
            $match: {
                createdAt: {$lte: lastYearDate},
            },
        },
        {
            $group: {
                _id: null,
                totalViews: {$sum: 1}
            }
        }
    ]),
    getMonthlyViewStatist: (currentYear) => View.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(currentYear),
                },
            },
        },
        {
            $group: {
                _id: {
                    year: {$year: '$createdAt'},
                    month: {$month: '$createdAt'}
                },
                count: {$sum: 1},
            },
        },
        {
            $sort: {'_id': 1}
        },
    ]),
    getWeekViewStatist: (currentWeek) => View.aggregate([
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
                    week: { $week: '$createdAt' },
                    day: { $dayOfWeek : '$createdAt' }
                },
                count: {$sum: 1},
            },
        },
        {
            $sort: {'_id': 1}
        },
    ]),
}