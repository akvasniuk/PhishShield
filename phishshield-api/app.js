const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');
const http = require('http');
const socket = require('socket.io');
require('dotenv').config();

const { constants } = require('./constants');
const { userRouter, authRouter, statisticsRouter, commentRouter,
    chatRouter, phishingDetectionRouter
} = require('./routes');
const { errorHandlerHelper: { _handleErrors, _notFoundHandler }, connectToDB: { _mongooseConnector } } = require('./helpers');
const {socketService} = require("./socket");

const app = express();

_mongooseConnector();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())

app.use(express.static(path.join(__dirname, 'static')));

app.use(fileUpload({}));
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/statistics', statisticsRouter);
app.use('/comments', commentRouter);
app.use('/chat', chatRouter);
app.use('/predict-phishing', phishingDetectionRouter);

app.use(_handleErrors);
app.use('*', _notFoundHandler);

const server = http.createServer(app);
server.listen(constants.PORT, () => {
    console.log(`App listen ${constants.PORT}`);
});

const io = socket(server, {
    cors: {
        origin: constants.FRONT_CONNECTION_URL,
        credentials: true,
    },
});

socketService.createSocketService(io);