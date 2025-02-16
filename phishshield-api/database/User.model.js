const {Schema, model} = require('mongoose');

const {dataBaseTablesEnum} = require('../constants/index');

const userSchema = new Schema({
    avatar: {
        type: String
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false,
        select: false
    },
    role: {
        type: String,
        default: 'USER'
    },
    isUserActivated: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    isGoogleAuth: {
        type: Boolean,
        default: false
    },

}, {timestamps: true});

module.exports = model(dataBaseTablesEnum.USER, userSchema);
