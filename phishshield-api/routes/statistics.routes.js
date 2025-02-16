const router = require('express').Router();

const {statisticsController} = require("../controllers");

router.get('/totalUserStatistics', statisticsController.getNumberOfUsers);
router.get("/totalViewStatistics", statisticsController.getNumberOfViews);
router.get("/totalPredictionStatistics", statisticsController.getNumberOfPredictions);
router.get("/totalAnalysisStatistics", statisticsController.getNumberOfAnalysis);
router.post("/view", statisticsController.createView);
router.get("/totalUsersStatisticsByMonth", statisticsController.getNumberOfUsersByMonth);
router.get("/totalUsersStatisticsByAuth", statisticsController.getNumberOfUsersByAuth);
router.get("/totalViewStatisticsByMonth", statisticsController.getNumberOfViewsByMonth);
router.get("/totalUsersStatisticsByWeek", statisticsController.getNumberOfUsersByWeek);
router.get("/totalViewStatisticsByWeek", statisticsController.getNumberOfViewsByWeek);
router.get("/totalPredictionStatisticsByWeek", statisticsController.getNumberOfPredictionsByWeek());
router.get("/totalPredictionPositiveStatisticsByWeek", statisticsController.getNumberOfPredictionsByWeek([1]));
router.get("/totalPredictionNegativeStatisticsByWeek", statisticsController.getNumberOfPredictionsByWeek([0]));
router.get("/totalPredictionStatisticsByType", statisticsController.getNumberOfPredictionByType);
router.get("/totalPredictionByMonth", statisticsController.getNumberOfPredictionByMonth);

module.exports = router;