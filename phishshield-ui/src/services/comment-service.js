import {axiosService} from "./axios-service";

import {urls} from "../configs";

const commentService = {
    getComments: (page = 1) => axiosService.get(urls.comment.commentURL, {params: {page}}),
    createComment: (userId, data) => axiosService.post(`${urls.comment.commentURL}/${userId}`, data),
    deleteComment: (userId, commentId) => axiosService.delete(`${urls.comment.commentURL}/${userId}/${commentId}`),
    editComment: (userId, commentId, data) => axiosService.put(`${urls.comment.commentURL}/${userId}/${commentId}`, data),
    createReplyComment: (userId, commentId, data) => axiosService.post(`${urls.comment.commentURL}/${userId}/${commentId}/reply`, data),
    editReplyComment: (userId, commentId, replyId, data) => axiosService.put(`${urls.comment.commentURL}/${userId}/${commentId}/reply/${replyId}`, data),
    deleteReplyComment: (userId, commentId, replyId) => axiosService.delete(`${urls.comment.commentURL}/${userId}/${commentId}/reply/${replyId}`),
}

export {
    commentService
}