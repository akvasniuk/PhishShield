import {axiosService} from "./axios-service";

import {urls} from "../configs";

const userService = {
    updateUser: (userId, updatedUser) => axiosService.patch(`${urls.user.userURL}${userId}`, updatedUser),
    updateUserByAdmin: (userId, updatedUser) => axiosService.patch(`${urls.user.modifyUserByAdmin}/${userId}`, updatedUser),
    updateUserAvatar: (userId, avatar) => axiosService.patch(`${urls.user.userURL}${userId}/avatar/update`, avatar, {
        headers: {'Content-type': 'multipart/form-data'}
    }),
    deleteUser: (userId) => axiosService.delete(`${urls.user.userURL}${userId}`),
    deleteUserByAdmin: (userId) => axiosService.delete(`${urls.user.userURL}/${userId}`),
    getAdmins: (userId, admin) => axiosService.get(`${urls.user.userURL}chat/${userId}`, {params: {admin}}),
    getUsers: (page = 1, perPage = 5, search) => axiosService.get(urls.user.userURL, {params: {page, perPage, search}})
}

export {
    userService
}