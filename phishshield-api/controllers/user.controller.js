const {
  statusCode,
  successfulMessage,
  constants: { AUTHORIZATION },
} = require('../constants');
const { userService } = require('../services');

module.exports = {
  allUser: async (req, res, next) => {
    try {
      const { page = 1, perPage = 5 } = req.query;
      const userData = await userService.getAllUsersWithPagination(+page, +perPage);
      res.status(statusCode.UPDATED).json(userData);
    } catch (e) {
      next(e);
    }
  },

  getUsersToChat: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { admin } = req.query;
      const users = await userService.getChatUsers(userId, admin === 'true');
      return res.json(users);
    } catch (e) {
      next(e);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const { user } = req;
      const token = req.get(AUTHORIZATION);
      await userService.softDeleteUser(user, token);
      res.status(statusCode.DELETED).json(successfulMessage.DELETED_MESSAGE);
    } catch (e) {
      next(e);
    }
  },

  deleteUserByAdmin: async (req, res, next) => {
    try {
      const { params: { userId } } = req;
      await userService.softDeleteUserByAdmin(userId);
      res.status(statusCode.DELETED).json(successfulMessage.DELETED_MESSAGE);
    } catch (e) {
      next(e);
    }
  },

  getUser: (req, res, next) => {
    try {
      const { user } = req;
      res.json(user);
    } catch (e) {
      next(e);
    }
  },

  createUser: async (req, res, next) => {
    try {
      await userService.createNewUser(req.body, req?.avatar);
      res.status(statusCode.CREATED).json(successfulMessage.REGISTER_MESSAGE);
    } catch (e) {
      console.log(e);
      next(e);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      await userService.updateUserDetails(req.user, req.body);
      res.status(statusCode.UPDATED).json(successfulMessage.UPDATED_MESSAGE);
    } catch (e) {
      next(e);
    }
  },

  updateUserByAdmin: async (req, res, next) => {
    try {
      const { params: { userId } } = req;
      await userService.updateUserDetailsByAdmin(userId, req.body);
      res.status(statusCode.UPDATED).json(successfulMessage.UPDATED_MESSAGE);
    } catch (e) {
      next(e);
    }
  },

  updateOrDeleteAvatar: async (req, res, next) => {
    try {
      const result = await userService
        .updateOrDeleteUserAvatar(req.user, req.avatar, req.url);

      if(result === "DELETED"){
          return res.status(statusCode.DELETED).json(successfulMessage.DELETED_MESSAGE);
      }

      res.status(statusCode.UPDATED).json(successfulMessage.UPDATED_MESSAGE);
    } catch (e) {
      next(e);
    }
  },

  verifyUserToChangePassword: async (req, res, next) => {
    try {
      await userService.verifyToChangePassword(req.user);
      res.status(statusCode.UPDATED).json(successfulMessage.CHECK_YOUR_EMAIL);
    } catch (e) {
      next(e);
    }
  },

  changeUserPassword: async (req, res, next) => {
    try {
      const passwordToken = req.get(AUTHORIZATION);
      await userService.changePassword(req.user, req.body.password, passwordToken);
      res.status(statusCode.UPDATED).json(successfulMessage.PASSWORD_SUCCESSFUL_CHANGED);
    } catch (e) {
      next(e);
    }
  },

  addFilesOrRemove: async (req, res, next) => {
    try {
      const result = await userService.addFilesOrRemove(req.user, req.url, req.params);

      if(result === "DELETED"){
          return res.status(statusCode.DELETED).json(successfulMessage.DELETED_MESSAGE);
      }

      res.status(statusCode.UPDATED).json(successfulMessage.UPDATED_MESSAGE);
    } catch (e) {
      next(e);
    }
  },
};
