const router = require('express').Router();

const {phishingDetectionController} = require('../controllers');
const {authMiddleware, fileMiddleware, phishingDetectionMiddleware} = require("../middleware");

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