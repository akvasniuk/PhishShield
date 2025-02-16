const {Schema, model} = require('mongoose');

const {dataBaseTablesEnum} = require('../constants/index');

const viewSchema = new Schema({
   numberOfView: {
       type: Number,
       default: 1
   }
}, {timestamps: true});

module.exports = model(dataBaseTablesEnum.VIEW, viewSchema);