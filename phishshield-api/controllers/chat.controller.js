const {chatService } = require("../services");
const {statusCode} = require("../constants");

module.exports = {
    addMessage: async (req, res, next) => {
        try {
            const {from, to, message} = req.body;
            const data = await chatService.createMessage(from, to, message);
            res.status(statusCode.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    },

    getMessages: async (req, res, next) => {
        try {
            const {from, to} = req.body;
            const messages = await chatService.getMessages(from, to);
            res.status(statusCode.CREATED).json(messages);
        } catch (e) {
            next(e);
        }
    },
};