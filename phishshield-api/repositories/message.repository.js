const {Message} = require('../database');

module.exports = {
   getMessages: (from, to) => Message.find({
       users: {
           $all: [from, to],
       },
   }).sort({updatedAt: 1}),
    createMessage: (from, to, message) => Message.create({
        message: {text: message},
        users: [from, to],
        sender: from
    })
}