const fs = require('fs');
const {promisify} = require('util');
const path = require('path');
const axios = require("axios");

const {
    statusCode,
    successfulMessage,
    directoryName: {
        USERS,
        AVATAR,
        AVATAR_PHOTOS
    },
    constants: {AUTHORIZATION},
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
const {userService, mailService, phishingDetectionService} = require('../services');
const {passwordHelper, userHelper, authHelper} = require('../helpers');
const {OAuth} = require('../database');
const {fileHelper} = require('../helpers');
const {ErrorHandler, errorMessage} = require('../error');

const rmdirPromisify = promisify(fs.rmdir);
const unlinkPromisify = promisify(fs.unlink);

module.exports = {
    allUser: async (req, res, next) => {
        try {
            const {page = 1, perPage = 5, search} = req.query;

            const usersCount = await userService.countUsers();
            const users = await userService.getUsers(+page, +perPage).lean();
            const normalizedUsers = [];

            for (const user of users) {
                const normalizedUser = userHelper.userNormalizator(user);

                normalizedUsers.push(normalizedUser);
            }


            res.status(statusCode.UPDATED).json({
                users: normalizedUsers,
                page: +page,
                pages: usersCount ? Math.ceil(usersCount / perPage) : 1,
                totalCount: usersCount
            });
        } catch (e) {
            next(e);
        }
    },

    getUsersToChat: async (req, res, next) => {
        try {
            const {userId} = req.params;
            const {admin} = req.query;
            let users;
            console.log(Boolean(admin))
                users = await userService.getAllUsersByParam(userId, admin === "true");

            console.log(req.query)

            return res.json(users);
        } catch (e) {
            next(e);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const {user, user: {_id}} = req;
            const token = req.get(AUTHORIZATION);

            const deletedUser = userService.deleteUser(user);

            await userService.updateUser({_id}, deletedUser);
            await OAuth.deleteMany({accessToken: token});
            await mailService.sendMail(user.email, DELETE_USER, {userName: user.name, img: DELETE_IMAGE});
            //await rmdirPromisify(path.join(process.cwd(), 'static', USERS, _id.toString()), {recursive: true});

            res.status(statusCode.DELETED).json(successfulMessage.DELETED_MESSAGE);
        } catch (e) {
            next(e);
        }
    },

    deleteUserByAdmin: async (req, res, next) => {
        try {
            const {params: {userId}} = req;
            const userForDelete = await userService.findUser({_id: userId});

            const deletedUser = userService.deleteUser(userForDelete);

            await userService.updateUser({userId}, deletedUser);
            await OAuth.deleteMany({userId});
            await mailService.sendMail(deletedUser.email, DELETE_USER, {userName: deletedUser.name, img: DELETE_IMAGE});
            //await rmdirPromisify(path.join(process.cwd(), 'static', USERS, _id.toString()), {recursive: true});

            res.status(statusCode.DELETED).json(successfulMessage.DELETED_MESSAGE);
        } catch (e) {
            next(e);
        }
    },

    getUser: (req, res, next) => {
        try {
            const {user} = req;

            res.json(user);
        } catch (e) {
            next(e);
        }
    },

    createUser: async (req, res, next) => {
        try {
            const {
                avatar,
                body: {email, name, password}
            } = req;

            const hashedPassword = await passwordHelper.hash(password);

            const {emailToken} = authHelper.generateEmailToken();
            console.log(req.body, avatar)

            const createdUser = await userService.insertUser({...req.body, password: hashedPassword});

            const {_id} = createdUser;

            await OAuth.create({emailToken, user: _id});
            await mailService.sendMail(email, VERIFY_ACCOUNT, {userName: name, emailToken, port: constants.PORT});

            const userId = createdUser._id.toString();

            if (avatar) {
                console.log(avatar);
                const {finalPath, pathForDB} = await fileHelper._filesDirBuilder(avatar.name, userId, AVATAR, USERS);

                const photosOfAvatar = await fileHelper._filesDirBuilder(avatar.name, userId, AVATAR_PHOTOS, USERS);

                await avatar.mv(finalPath);
                await avatar.mv(photosOfAvatar.finalPath);
                await userService.updateUser({_id}, {
                    avatar: finalPath
                });
            }

            res.status(statusCode.CREATED).json(successfulMessage.REGISTER_MESSAGE);
        } catch (e) {
            console.log(e)
            next(e);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const {user} = req;
            const hashedPassword = req.body.password ? await passwordHelper.hash(req.body.password) : null;

            await userService.updateUser(user, {
                ...req.body,
                ...(hashedPassword && {password: hashedPassword})
            });

            await mailService.sendMail(user.email, UPDATE_USER, {userName: user.name, img: UPDATE_IMAGE});

            res.status(statusCode.UPDATED).json(successfulMessage.UPDATED_MESSAGE);
        } catch (e) {
            next(e);
        }
    },

    updateUserByAdmin: async (req, res, next) => {
        try {
            const {params: {userId}} = req;
            const userForUpdate = await userService.findUser({_id: userId});

            const hashedPassword = req.body.password ? await passwordHelper.hash(req.body.password) : null;

            await userService.updateUser(userForUpdate, {
                ...req.body,
                ...(hashedPassword && {password: hashedPassword})
            });

            await mailService.sendMail(userForUpdate.email, UPDATE_USER, {userName: userForUpdate.firstname, img: UPDATE_IMAGE});

            res.status(statusCode.UPDATED).json(successfulMessage.UPDATED_MESSAGE);
        } catch (e) {
            next(e);
        }
    },

    updateOrDeleteAvatar: async (req, res, next) => {
        try {
            const {
                avatar,
                user: {_id, avatarPhotos},
                url
            } = req;

            const userId = _id.toString();

            const API_KEY = constants.FILE_API_KEY;
            const formData = new FormData();
            formData.append('image', avatar.data.toString('base64'));

            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log();

            if (url.includes('delete')) {
                await rmdirPromisify(path.join(process.cwd(), 'static', USERS, userId, 'avatar'), {recursive: true});

                if (avatarPhotos.length) {
                    await unlinkPromisify(path.join(process.cwd(), 'static', avatarPhotos[avatarPhotos.length - 1]));

                    avatarPhotos.splice(-1, 1);

                    await userService.updateUser({_id}, {avatar: avatarPhotos[avatarPhotos.length - 1], avatarPhotos});
                }

                return res.status(statusCode.DELETED).json(successfulMessage.DELETED_MESSAGE);
            }

            const {finalPath, pathForDB} = await fileHelper._filesDirBuilder(avatar.name, userId, AVATAR, USERS);

            const photosOfAvatar = await fileHelper._filesDirBuilder(avatar.name, userId, AVATAR_PHOTOS, USERS);

            await avatar.mv(finalPath);
            await avatar.mv(photosOfAvatar.finalPath);
            
            await userService.updateUser({_id}, {avatar: response.data.data.image.url, $push: {avatarPhotos: photosOfAvatar.pathForDB}});

            res.status(statusCode.UPDATED).json(successfulMessage.UPDATED_MESSAGE);
        } catch (e) {
            next(e);
        }
    },

    verifyUserToChangePassword: async (req, res, next) => {
        try {
            const {user: {_id, name, email}} = req;

            const {passwordToken} = await authHelper.generatePasswordToken();

            await OAuth.updateOne({user: _id}, {passwordToken});
            await mailService.sendMail(email, CHANGE_PASSWORD, {userName: name, passwordToken});

            res.status(statusCode.UPDATED).json(successfulMessage.CHECK_YOUR_EMAIL);
        } catch (e) {
            next(e);
        }
    },

    changeUserPassword: async (req, res, next) => {
        try {
            const {body: {password}, user: {_id}} = req;

            const passwordToken = req.get(AUTHORIZATION);

            await authHelper.verifyPasswordToken(passwordToken);

            const hashedPassword = await passwordHelper.hash(password);

            await userService.updateUser({_id}, {password: hashedPassword});

            res.status(statusCode.UPDATED).json(successfulMessage.PASSWORD_SUCCESSFUL_CHANGED);
        } catch (e) {
            next(e);
        }
    },

    addFilesOrRemove: async (req, res, next) => {
        try {
            const {
                user: {_id},
                params: {files},
                url,
                user
            } = req;

            if (url.includes('delete')) {
                await rmdirPromisify(path.join(process.cwd(), 'static', USERS, _id.toString(), files), {recursive: true});

                await userService.updateUser({_id}, {[files]: []});

                res.status(statusCode.DELETED).json(successfulMessage.DELETED_MESSAGE);

                return;
            }

            const chosenFiles = req[files];

            if (!chosenFiles.length) {
                throw new ErrorHandler(
                    statusCode.BAD_REQUEST,
                    errorMessage.WRONG_FILE_LOAD_PATH.message,
                    errorMessage.WRONG_FILE_LOAD_PATH.code
                );
            }

            const pathArray = await fileHelper._filesSaver(chosenFiles, _id.toString(), files, USERS);

            if (user[files].length) {
                const filesArray = user[files];

                filesArray.push(...pathArray);
                filesArray.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));

                Object.assign(user, {filesArray});

                await userService.updateUser({_id}, user);

                res.status(statusCode.UPDATED).json(successfulMessage.UPDATED_MESSAGE);

                return;
            }

            await userService.updateUser({_id}, {$push: {[files]: pathArray}});

            res.status(statusCode.UPDATED).json(successfulMessage.UPDATED_MESSAGE);
        } catch (e) {
            next(e);
        }
    }
};
