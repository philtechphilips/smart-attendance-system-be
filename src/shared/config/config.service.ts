import * as dotenv from 'dotenv';
import * as joi from 'joi';

dotenv.config();

const schema = joi
  .object({
    PORT: joi.number().required(),
    ENVIRONMENT: joi
      .string()
      .valid('development', 'production', 'staging')
      .required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_PASSWORD: joi.optional(),
    JWT_DURATION: joi.string().required(),
    JWT_EXPIRATION: joi.string().required(),
    EMAIL_USER: joi.string().required(),
    EMAIL_PASSWORD: joi.string().required(),
    EMAIL_HOST: joi.string().required(),
    FRONTEND_URL: joi.string().required(),
  })
  .unknown()
  .required();

const { error, value: envVars } = schema.validate(process.env);
if (error) {
  throw new Error(`ENV validation error: ${error.message}`);
}

export const config = {
  PORT: {
    APP_PORT: envVars.PORT,
  },
  ENVIRONMENT: envVars.ENVIRONMENT,
  DB: {
    PORT: Number(envVars.DB_PORT),
    HOST: envVars.DB_HOST,
    USER: envVars.DB_USERNAME,
    PASSWORD: envVars.DB_PASSWORD,
    NAME: envVars.DB_NAME,
  },
  EMAIL: {
    USER: envVars.EMAIL_USER,
    PASSWORD: envVars.EMAIL_PASSWORD,
    HOST: envVars.EMAIL_HOST,
  },
  FRONTEND_URL: envVars.FRONTEND_URL,
  JWT_EXPIRES: envVars.JWT_EXPIRATION,
};
