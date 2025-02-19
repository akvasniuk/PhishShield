const { userRepository } = require('../repositories');
const { passwordHelper, userHelper, authHelper, fileHelper } = require('../helpers');
const {
  statusCode,
  directoryName: {
    USERS,
    AVATAR,
    AVATAR_PHOTOS
  },
  emailActionsEnum: {
    UPDATE_USER,
    DELETE_USER,
    VERIFY_ACCOUNT,
    CHANGE_PASSWORD
  },
  emailActionImage: {
    UPDATE_IMAGE,
    DELETE_IMAGE
  }, constants
} = require('../constants');
const { OAuth } = require('../database');
const axios = require('axios');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');
const { ErrorHandler, errorMessage } = require('../error');
const { mailService } = require('./mail.service');

const rmdirPromisify = promisify(fs.rmdir);
const unlinkPromisify = promisify(fs.unlink);

module.exports = {
  getAllUsersWithPagination: async (page, perPage) => {
    const usersCount = await userRepository.countUsers();
    const users = await userRepository.getUsers(page, perPage).lean();
    const normalizedUsers = [];

    for (const user of users) {
      const normalizedUser = userHelper.userNormalizator(user);

      normalizedUsers.push(normalizedUser);
    }

    return {
      users: normalizedUsers,
      page,
      pages: usersCount ? Math.ceil(usersCount / perPage) : 1,
      totalCount: usersCount,
    };
  },

  getChatUsers: (userId, isAdmin) => userRepository.getAllUsersByParam(userId, isAdmin),

  softDeleteUser: async (user, token) => {
    const deletedUser = await userRepository.deleteUser(user);
    await userRepository.updateUser(user._id, deletedUser);

    await OAuth.deleteMany({ accessToken: token });
    await mailService.sendMail(user.email, DELETE_USER, { userName: user.name, img: DELETE_IMAGE });
    //await rmdirPromisify(path.join(process.cwd(), 'static', USERS, user._id.toString()), {recursive: true});
  },

  softDeleteUserByAdmin: async (userId) => {
    const userForDelete = await userRepository.findUser({ _id: userId });
    const deletedUser = userRepository.deleteUser(userForDelete);

    await userRepository.updateUser({ userId }, deletedUser);
    await OAuth.deleteMany({ userId });
    await mailService.sendMail(deletedUser.email, DELETE_USER, { userName: deletedUser.name, img: DELETE_IMAGE });
    //await rmdirPromisify(path.join(process.cwd(), 'static', USERS, _id.toString()), {recursive: true});
  },

  createNewUser: async (userData, avatar) => {
    userData.password = await passwordHelper.hash(userData.password);
    const { emailToken } = authHelper.generateEmailToken();

    const createdUser = await userRepository.insertUser(userData);
    const { _id } = createdUser;

    await OAuth.create({ emailToken, user: _id });
    await mailService.sendMail(userData.email, VERIFY_ACCOUNT,
      { userName: userData.name, emailToken, port: constants.PORT });

    const userId = createdUser._id.toString();

    if (avatar) {
      const { finalPath, pathForDB } = await fileHelper._filesDirBuilder(avatar.name, userId, AVATAR, USERS);

      const photosOfAvatar = await fileHelper._filesDirBuilder(avatar.name, userId, AVATAR_PHOTOS, USERS);

      await avatar.mv(finalPath);
      await avatar.mv(photosOfAvatar.finalPath);

      const API_KEY = constants.FILE_API_KEY;
      const formData = new FormData();
      formData.append('image', avatar.data.toString('base64'));

      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await userRepository.updateUser({ _id }, {
        avatar: response.data.data.image.url,
      });
    }

    return createdUser;
  },

  updateUserDetails: async (user, updateData) => {
    if (updateData.password) {
      updateData.password = await passwordHelper.hash(updateData.password);
    }

    await userRepository.updateUser(user, updateData);
    await mailService.sendMail(user.email, UPDATE_USER, { userName: user.name, img: UPDATE_IMAGE });
  },

  updateUserDetailsByAdmin: async (userId, updateData) => {
    if (updateData.password) {
      updateData.password = await passwordHelper.hash(updateData.password);
    }

    const userForUpdate = await userRepository.findUser({ _id: userId });
    await userRepository.updateUser(userForUpdate, updateData);
    await mailService.sendMail(userForUpdate.email, UPDATE_USER, {
      userName: userForUpdate.firstname,
      img: UPDATE_IMAGE,
    });
  },

  updateOrDeleteUserAvatar: async ({ avatarPhotos, _id }, avatar, url) => {
    const userId = _id.toString();

    const API_KEY = constants.FILE_API_KEY;
    const formData = new FormData();
    formData.append('image', avatar.data.toString('base64'));

    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (url.includes('delete')) {
      await rmdirPromisify(path.join(process.cwd(), 'static', USERS, userId, 'avatar'), { recursive: true });

      if (avatarPhotos.length) {
        await unlinkPromisify(path.join(process.cwd(), 'static', avatarPhotos[avatarPhotos.length - 1]));
        avatarPhotos.splice(-1, 1);
        await userRepository.updateUser({ _id }, { avatar: avatarPhotos[avatarPhotos.length - 1], avatarPhotos });
      }

      return 'DELETED';
    }

    const { finalPath, pathForDB } = await fileHelper._filesDirBuilder(avatar.name, userId, AVATAR, USERS);

    const photosOfAvatar = await fileHelper._filesDirBuilder(avatar.name, userId, AVATAR_PHOTOS, USERS);

    await avatar.mv(finalPath);
    await avatar.mv(photosOfAvatar.finalPath);

    await userRepository.updateUser({ _id }, {
      avatar: response.data.data.image.url,
      $push: { avatarPhotos: photosOfAvatar.pathForDB },
    });
    return 'UPDATED';
  },

  verifyToChangePassword: async (user) => {
    const { _id, name, email } = user;
    await userRepository.verifyToChangePassword(user);

    const { passwordToken } = await authHelper.generatePasswordToken();

    await OAuth.updateOne({ user: _id }, { passwordToken });
    await mailService.sendMail(email, CHANGE_PASSWORD, { userName: name, passwordToken });
  },

  changePassword: async (user, password, passwordToken) => {
    const { _id } = user;
    await authHelper.verifyPasswordToken(passwordToken);

    const hashedPassword = await passwordHelper.hash(password);
    await userRepository.updateUser({ _id }, { password: hashedPassword });
  },

  addFilesOrRemove: async (user, url, { files }, _id = user._id) => {
    if (url.includes('delete')) {
      await rmdirPromisify(path.join(process.cwd(), 'static', USERS, _id.toString(), files), { recursive: true });
      await userRepository.updateUser({ _id }, { [files]: [] });

      return "DELETED";
    }

    const chosenFiles = req[files];

    if (!chosenFiles.length) {
      throw new ErrorHandler(
        statusCode.BAD_REQUEST,
        errorMessage.WRONG_FILE_LOAD_PATH.message,
        errorMessage.WRONG_FILE_LOAD_PATH.code,
      );
    }

    const pathArray = await fileHelper._filesSaver(chosenFiles, _id.toString(), files, USERS);

    if (user[files].length) {
      const filesArray = user[files];

      filesArray.push(...pathArray);
      filesArray.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));

      Object.assign(user, { filesArray });

      await userRepository.updateUser({ _id }, user);

      return "UPDATED";
    }

    await userRepository.updateUser({ _id }, { $push: { [files]: pathArray } });
  },
};
