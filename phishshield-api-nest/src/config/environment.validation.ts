import * as Joi from 'joi';

export default Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
    PORT: Joi.number().port().default(3005),
    DB_CONNECTION_URL: Joi.string().required(),
    ACCESS_TOKEN_SECRET: Joi.string().required(),
    REFRESH_TOKEN_SECRET: Joi.required(),
    EMAIL_TOKEN_SECRET: Joi.string().required(),
    PASSWORD_TOKEN_SECRET: Joi.string().required(),
    SYSTEM_EMAIL: Joi.string().required(),
    SYSTEM_EMAIL_PASSWORD: Joi.string().required(),
    SECRET_KEY: Joi.string().required(),
    GOOGLE_CLIENT_ID: Joi.string().required(),
    FRONT_CONNECTION_URL: Joi.string().required(),
    FASTAPI_CONNECTION_URL: Joi.string().required(),
    FILE_API_KEY: Joi.string().required(),
});