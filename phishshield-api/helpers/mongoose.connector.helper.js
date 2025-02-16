const mongoose = require('mongoose');

const { constants: { DB_URL } } = require('../constants');

module.exports = {
  _mongooseConnector: () => {
    mongoose.connect(DB_URL).then(() => {
      console.log("MONGODB CONNECTED");
    }).catch((err) => {
      console.log(err);
    });
  }
};
