const {PhishingDetection} = require('../database');

module.exports = {
    findPhishingItems: (phishingParam, selected = {}) =>
        PhishingDetection.find(phishingParam)
            .select(selected),
    countPhishing: (userId, searchType) => {
        const searchCondition = searchType ?
            {
                "$and": [
                    {
                        userId,
                    },
                    {
                        type: {$regex: new RegExp(searchType, 'i')}
                    }
                ]
            }
            : {userId};
        return PhishingDetection.countDocuments(searchCondition);
    },
    getPhishingItems: (userId, page, perPage, searchType) => {
        const searchCondition = searchType
            ?
            {
                "$and": [
                    {
                        userId,
                    },
                    {
                        type: {$regex: new RegExp(searchType, 'i')}
                    }
                ]
            }
            : {userId};

        return PhishingDetection.find(searchCondition)
            .limit(perPage)
            .skip(perPage * (page - 1))
            .sort({createdAt: 'desc'})
            .select({__v: 0, apiPath: 0})
    },
    createPhishingRecord: (phishingItem) => PhishingDetection.create(phishingItem),
    getWeeklyDetectionStatistic: (startOfWeek, endOfWeek, prediction = [0, 1]) => PhishingDetection.aggregate([
        {
            $match: {
                "$and": [
                    {
                        createdAt: {$gte: startOfWeek, $lte: endOfWeek},
                    },
                    {
                        "predictions.prediction": {$in: prediction}
                    }
                ]
            },
        },
        {
            $group: {
                _id: {day: {$dayOfWeek: "$createdAt"}},
                total: {$sum: 1},
            },
        },
        {$sort: {"_id.day": 1}},
    ]),
    getPhishingByType: () => PhishingDetection.aggregate([
        {
            $group: {
                _id: '$type',
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

    getMonthlyPredictionStatistic: (currentYear) => PhishingDetection.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: currentYear,
                },
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

};
