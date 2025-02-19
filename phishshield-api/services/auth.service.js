const { OAuth } = require('../database');
const { authHelper, passwordHelper, userHelper } = require('../helpers');
const { userRepository } = require('../repositories');
const { mailService } = require('./index');
const {
  emailActionsEnum: {WELCOME},
  emailActionImage: {REGISTER_IMAGE}
} = require('../constants');

module.exports = {
  login: async (user) => {
    const { _id } = user;
    const tokenPair = authHelper.generateTokenPair();

    await OAuth.updateOne({ user: _id }, { ...tokenPair });

    const normalizedUser = userHelper.userNormalizator(user.toJSON());

    return { ...tokenPair, user: normalizedUser };
  },

  loginGoogle: async (userInfo) => {
    const user = {
      firstname: userInfo?.given_name,
      lastname: userInfo?.family_name,
      email: userInfo?.email,
      isUserActivated: true,
      avatar: userInfo?.picture,
      isGoogleAuth: true
    };

    const hashedPassword = await passwordHelper.hash(userInfo?.picture);
    const insertedUser = await userRepository.insertUser({ ...user, password: hashedPassword });
    await OAuth.create({ user: insertedUser._id });

    const tokenPair = authHelper.generateTokenPair();
    await OAuth.updateOne({ user: insertedUser._id }, { ...tokenPair });

    const normalizedUser = userHelper.userNormalizator(insertedUser.toJSON());

    return { ...tokenPair, user: normalizedUser };
  },

  logout: async (accessToken, userId) => {
    await OAuth.deleteOne({ accessToken });
    onlineUsers.delete(userId);
  },

  refresh: async (user, refreshToken) => {
    const tokenPair = authHelper.generateTokenPair();

    await OAuth.deleteOne({ refreshToken });
    await OAuth.create({ ...tokenPair, user: user._id });

    return { ...tokenPair, user };
  },

  activate: async (user) => {
    const { email, name, _id } = user;
    await userRepository.updateUser(_id, { isUserActivated: true });
    await mailService.sendMail(email, WELCOME, { userName: name, img: REGISTER_IMAGE });
  }
};
