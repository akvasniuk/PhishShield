import {axiosService} from "./axios-service";

import {urls} from "../configs";

const chatService = {
    getMessages: (userId, data) => axiosService.post(`${urls.chat.getMessages}/${userId}`, data),
    addMessage: (userId, data) => axiosService.post(`${urls.chat.addMessage}/${userId}`, data)
}

export {
    chatService
}