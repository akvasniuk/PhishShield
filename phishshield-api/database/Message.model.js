const {Schema, model} = require('mongoose');

const {dataBaseTablesEnum} = require('../constants/index');

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: dataBaseTablesEnum.USER,
        required: true,
    },
    message: {
        text: {
            type: String,
            required: true
        }
    },
    users: Array
}, {timestamps: true});

messageSchema.pre('find', function () {
    this.populate('sender');
});

module.exports = model(dataBaseTablesEnum.MESSAGE, messageSchema);
