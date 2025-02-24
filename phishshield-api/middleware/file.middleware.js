const {
  fileUploadEnum: {
    PHOTOS_MIMETYPES,
    VIDEOS_MIMETYPES,
    DOCS_MIMETYPES,
    PHOTO_MAX_SIZE,
    VIDEO_MAX_SIZE,
    DOCS_MAX_SIZE,
    AUDIO_MAX_SIZE,
    AUDIO_MIMETYPES,
  },
  statusCode,
} = require('../constants');
const { ErrorHandler, errorMessage } = require('../error');
const { fileValidator } = require('../validators');

module.exports = {
  checkFiles: (req, res, next) => {
    try {
      if (req.files) {
        const files = Object.values(req.files);

        const photos = [];
        const videos = [];
        const documents = [];
        const audios = [];

        for (const file of files) {
          const { name, size, mimetype } = file;

          if (PHOTOS_MIMETYPES.includes(mimetype)) {
            if (size > PHOTO_MAX_SIZE) {
              throw new ErrorHandler(
                statusCode.FILE_TOO_BIG,
                errorMessage.FILE_SIZE_IS_TOO_LARGE.message(name),
                errorMessage.FILE_SIZE_IS_TOO_LARGE.code,
              );
            }

            photos.push(file);
          } else if (VIDEOS_MIMETYPES.includes(mimetype)) {
            if (size > VIDEO_MAX_SIZE) {
              throw new ErrorHandler(
                statusCode.FILE_TOO_BIG,
                errorMessage.FILE_SIZE_IS_TOO_LARGE.message(name),
                errorMessage.FILE_SIZE_IS_TOO_LARGE.code,
              );
            }

            videos.push(file);
          } else if (DOCS_MIMETYPES.includes(mimetype)) {
            if (size > DOCS_MAX_SIZE) {
              throw new ErrorHandler(
                statusCode.FILE_TOO_BIG,
                errorMessage.FILE_SIZE_IS_TOO_LARGE.message(name),
                errorMessage.FILE_SIZE_IS_TOO_LARGE.code,
              );
            }

            documents.push(file);
          } else if (AUDIO_MIMETYPES.includes(mimetype)) {
            if (size > AUDIO_MAX_SIZE) {
              throw new ErrorHandler(
                statusCode.FILE_TOO_BIG,
                errorMessage.FILE_SIZE_IS_TOO_LARGE.message(name),
                errorMessage.FILE_SIZE_IS_TOO_LARGE.code,
              );
            }

            audios.push(file);
          } else {
            throw new ErrorHandler(
              statusCode.INVALID_FORMAT,
              errorMessage.INVALID_FORMAT.message,
              errorMessage.INVALID_FORMAT.code,
            );
          }
        }

        req.photos = photos;
        req.documents = documents;
        req.videos = videos;
        req.audios = audios;
      }

      next();
    } catch (e) {
      next(e);
    }
  },

  checkAvatar: (req, res, next) => {
    try {
      if (req.photos) {
        if (req.photos.length > 1) {
          throw new ErrorHandler(statusCode.BAD_REQUEST, errorMessage.JUST_ONE_PHOTO.message, errorMessage.JUST_ONE_PHOTO.code);
        }

        req.avatar = req.photos[0];
      }

      next();
    } catch (e) {
      next(e);
    }
  },

  checkImageForPrediction: (req, res, next) => {
    try {
      if (req.photos) {
        if (req.photos.length > 1) {
          throw new ErrorHandler(statusCode.BAD_REQUEST, errorMessage.JUST_ONE_PHOTO.message, errorMessage.JUST_ONE_PHOTO.code);
        }

        req.imagePrediction = req.photos[0];
      }

      next();
    } catch (e) {
      next(e);
    }
  },
  checkDocumentForPrediction: (req, res, next) => {
    try {
      if (req.documents) {
        if (req.documents.length > 1) {
          throw new ErrorHandler(statusCode.BAD_REQUEST, errorMessage.JUST_ONE_DOCUMENT.message,
            errorMessage.JUST_ONE_DOCUMENT.code);
        }

        req.documentPrediction = req.documents[0];
      }

      next();
    } catch (e) {
      next(e);
    }
  },
  checkAudioForPrediction: (req, res, next) => {
    try {
      if (req.audios) {
        if (req.audios.length > 1) {
          throw new ErrorHandler(statusCode.BAD_REQUEST, errorMessage.JUST_ONE_AUDIO.message,
            errorMessage.JUST_ONE_AUDIO.code);
        }

        req.audioPrediction = req.audios[0];
      }

      next();
    } catch (e) {
      next(e);
    }
  },

  checkFilesCount: (req, res, next) => {
    try {
      const { documents, videos } = req;

      const file = documents || videos;


      if (file.length > 2) {
        throw new ErrorHandler(statusCode.BAD_REQUEST, errorMessage.MAX_FILE_COUNT.message, errorMessage.MAX_FILE_COUNT.code);
      }

      next();
    } catch (e) {
      next(e);
    }
  },

  checkFilesPath: (req, res, next) => {
    try {
      const { files } = req.params;

      const { error } = fileValidator.fileExtensionValidator.validate(files);

      if (error) {
        throw new ErrorHandler(statusCode.BAD_REQUEST, error.details[0].message, errorMessage.WRONG_FILE_LOAD.code);
      }

      next();
    } catch (e) {
      next(e);
    }
  },
};
