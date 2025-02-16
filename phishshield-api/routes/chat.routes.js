const {chatController} = require("../controllers");
const {authMiddleware} = require("../middlewars");
const router = require('express').Router();

router.post('/getMessages/:userId',
    authMiddleware.checkAccessToken,
    chatController.getMessages);

router.post("/postMessage/:userId",
    authMiddleware.checkAccessToken,
    chatController.addMessage);

module.exports = router;