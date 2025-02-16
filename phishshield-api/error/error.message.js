module.exports = {
  NOT_VALID_DATA: {
    message: 'Data doesnt valid',
    code: 4220
  },
  USER_IS_REGISTER: {
    message: 'You are registered',
    code: 4001
  },
  USER_ID_NOT_VALID: {
    code: 4002
  },
  USER_NOT_EXISTS: {
    message: 'User does not exists',
    code: 4003
  },
  WRONG_EMAIL_OR_PASS: {
    message: 'Wrong email or password',
    code: 4004
  },
  USER_MUST_BE_ADMIN: {
    message: 'User must be admin',
    code: 4005
  },
  UNKNOWN_ERROR: {
    message: 'Unknown error',
    code: 0
  },
  ROUT_NOT_FOUND: {
    message: 'Rout not found',
    code: 4040
  },
  UNAUTHORIZED: {
    message: 'Unauthorized',
    code: 4010
  },
  NO_TOKEN: {
    message: 'No token',
    code: 4011
  },
  WRONG_TOKEN: {
    message: 'Wrong token',
    code: 4012
  },
  WRONG_TEMPLATE: {
    message: 'Wrong template',
    code: 4041
  },
  INVALID_FORMAT: {
    message: 'Invalid format',
    code: 4150
  },
  FILE_SIZE_IS_TOO_LARGE: {
    message: (file) => `File ${file} is too big`,
    code: 4130
  },
  JUST_ONE_PHOTO: {
    message: 'Just one avatar for user',
    code: 4044
  },
  WRONG_FILE_LOAD: {
    code: 4045
  },
  WRONG_FILE_LOAD_PATH: {
    message: 'Wrong file load path',
    code: 4046
  },
  USER_NOT_ACTIVATED: {
    message: 'You are not activate your account',
    code: 4012
  },
  CANT_UPDATE_PASSWORD: {
    message: 'Cant update password,you can update on other link',
    code: 4047
  },
  MAX_FILE_COUNT: {
    message: 'You can load only 2 files',
    code: 4048
  },
  USER_NOT_HAVE_COMMENT: {
    message: 'User doesnt have this comment',
    code:4049
  },
  COMMENT_NOT_EXISTS: {
    message: 'Comment doesnt exists',
    code: 40410
  },
  TYPE_NOT_VALID: {
    message: 'Type doesnt exists',
    code: 40411
  },
  JUST_ONE_DOCUMENT: {
    message: 'Just one document for prediction',
    code: 40412
  },
};
