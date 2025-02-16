const {commentService, messageService} = require("../services");
const {statusCode, successfulMessage} = require("../constants");
const {errorMessage, ErrorHandler} = require("../error");

module.exports = {
    addMessage: async (req, res, next) => {
        try {
            const {from, to, message} = req.body;
            const data = await messageService.createMessage(from, to, message);

            res.status(statusCode.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    },

    getMessages: async (req, res, next) => {
        try {
            const {from, to} = req.body;
            const messages = await messageService.getMessages(from, to);
            const projectMessages = messages.map((msg) => ({
                fromSelf: msg.sender.equals(from),
                message: msg.message.text
            }))

            res.status(statusCode.CREATED).json(projectMessages);
        } catch (e) {
            next(e);
        }
    },
};