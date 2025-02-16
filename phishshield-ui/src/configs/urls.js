const baseURL = import.meta.env.VITE_API_URL

const urls = {
    auth: {
        login: "/auth/login",
        register: "/users",
        loginGoogle: "/auth/loginGoogle",
        refresh: "/auth/refresh",
        logout: "/auth/logout"
    },
    statistics: {
        getNumberOfUsers: "/statistics/totalUserStatistics",
        getNumberOfViews: "/statistics/totalViewStatistics",
        getNumberOfUsersByMonth: "/statistics/totalUsersStatisticsByMonth",
        getNumberOfViewsByMonth: "/statistics/totalViewStatisticsByMonth",
        getNumberOfUsersByWeek: "/statistics/totalUsersStatisticsByWeek",
        getNumberOfViewsByWeek: "/statistics/totalViewStatisticsByWeek",
        getNumberOfPredictionsByWeek: "/statistics/totalPredictionStatisticsByWeek",
        getNumberOfPositivePredictionsByWeek: "/statistics/totalPredictionPositiveStatisticsByWeek",
        getNumberOfNegativePredictionsByWeek: "/statistics/totalPredictionNegativeStatisticsByWeek",
        getNumberOfPredictionByType: "/statistics/totalPredictionStatisticsByType",
        getNumberOfPredictionByMonth: "/statistics/totalPredictionByMonth",
        getNumberOfUsersByAuth: "/statistics/totalUsersStatisticsByAuth",
    },
    user: {
        userURL: "/users/",
        modifyUserByAdmin: '/users/admin',
    },
    comment: {
        commentURL: "/comments"
    },
    chat: {
        addMessage: '/chat/postMessage',
        getMessages: '/chat/getMessages'
    },
    phishingDetection: {
        phishingDetectionURL: "/predict-phishing",
        phishingHistoryURL: "/predict-phishing/history",
    }
}

export {
    baseURL,
    urls,
}