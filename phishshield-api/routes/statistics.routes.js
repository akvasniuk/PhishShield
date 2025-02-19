const router = require('express').Router();

const {statisticsController} = require("../controllers");

router.get('/totalUserStatistics', statisticsController.getNumberOfUsers);
router.get("/totalUsersStatisticsByMonth", statisticsController.getNumberOfUsersByMonth);
router.get("/totalUsersStatisticsByAuth", statisticsController.getNumberOfUsersByAuth);
router.get("/totalUsersStatisticsByWeek", statisticsController.getNumberOfUsersByWeek);
router.get("/totalPredictionStatisticsByWeek", statisticsController.getNumberOfPredictionsByWeek());
router.get("/totalPredictionPositiveStatisticsByWeek", statisticsController.getNumberOfPredictionsByWeek([1]));
router.get("/totalPredictionNegativeStatisticsByWeek", statisticsController.getNumberOfPredictionsByWeek([0]));
router.get("/totalPredictionStatisticsByType", statisticsController.getNumberOfPredictionByType);
router.get("/totalPredictionByMonth", statisticsController.getNumberOfPredictionByMonth);

module.exports = router;