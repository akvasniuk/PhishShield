const router = require('express').Router();

const {authController} = require('../controllers');
const {authMiddleware, userMiddleware} = require('../middlewars');
const {userService} = require("../services");

router.post('/login',
    authMiddleware.checkIsUserDataValid,
    authMiddleware.checkIsUserExist,
    authMiddleware.checkIsPasswordValid,
    authMiddleware.checkIsUserActivated,
    authController.login);

router.post("/loginGoogle",
    authMiddleware.checkIsTokenDataValid,
    authMiddleware.checkIsEmailExist,
    authController.loginGoogle
);

router.post('/logout/:userId',
    userMiddleware.isUserExists,
    authMiddleware.checkAccessToken,
    authController.logout);

router.post('/refresh', authMiddleware.checkRefreshToken, authController.refresh);

router.get('/activate/mail/:emailToken', authMiddleware.checkMailToken, authController.activate);

router.get('/activate/password/:passwordToken', authMiddleware.checkPasswordToken(), authController.changePassword);

module.exports = router;
