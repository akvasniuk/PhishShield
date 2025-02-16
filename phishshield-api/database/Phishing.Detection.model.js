const {Schema, model} = require('mongoose');

const {dataBaseTablesEnum} = require('../constants/index');

const phishingDetectionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: dataBaseTablesEnum.USER,
        required: true,
    },
    predictions: [{
        model: {
          type: String,
          required: true,
        },
        prediction: {
            type: Number,
            required: true
        },
        probability: {
            type: Number,
            required: true
        }
    }],
    data: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    file: {
        type: String
    }
}, {timestamps: true});

phishingDetectionSchema.pre('find', function () {
    this.populate('userId');
});

module.exports = model(dataBaseTablesEnum.PHISHING_DETECTION, phishingDetectionSchema);