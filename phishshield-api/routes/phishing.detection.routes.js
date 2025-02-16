const router = require('express').Router();

const {commentController, diseaseController, phishingDetectionController} = require('../controllers');
const {userMiddleware, authMiddleware, commentMiddleware, fileMiddleware, phishingDetectionMiddleware} = require("../middlewars");

router.post("",
    authMiddleware.checkAccessToken,
    fileMiddleware.checkFiles,
    fileMiddleware.checkDocumentForPrediction,
    phishingDetectionMiddleware.isTypeExists,
    phishingDetectionMiddleware.isPhishingDataValid,
    phishingDetectionController.predictPhishing);

router.get("/history",
    authMiddleware.checkAccessToken,
    phishingDetectionController.getPhishingHistory);

module.exports = router;