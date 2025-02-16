import {axiosService} from "./axios-service";

import {urls} from "../configs";

const _accessTokenKey = 'access';
const _refreshTokenKey = 'refresh';
const _user = 'user';

const authService = {
    register: (user) =>{
        return axiosService.post(urls.auth.register, user, {
            headers: {'Content-type': 'multipart/form-data'}
        })
    }
    ,
    login: (credentials) =>
        axiosService.post(urls.auth.login, credentials, {
            headers: {'Content-type': 'application/json'}
        }),
    loginGoogle: (credentials) =>
        axiosService.post(urls.auth.loginGoogle, credentials, {
            headers: {'Content-type': 'application/json'},
            crossDomain: true
        }),
    refresh: (refresh) => axiosService.post(urls.auth.refresh, null, {
        headers: {
            Authorization: refresh
        }
    }),
    userLogout: (userId) => axiosService.post(`${urls.auth.logout}/${userId}`),

    setTokens: ({accessToken, refreshToken, user}) => {
        localStorage.setItem(_accessTokenKey, accessToken);
        localStorage.setItem(_refreshTokenKey, refreshToken);
    },
    deleteToken: () => {
        localStorage.removeItem(_accessTokenKey);
        localStorage.removeItem(_refreshTokenKey);
        localStorage.removeItem(_user);
    },
    getAccessToken: () => localStorage.getItem(_accessTokenKey),
    getRefreshToken: () => localStorage.getItem(_refreshTokenKey),
}

export {
    authService
}