const PASSWORD_SALT = process.env.PASSWORD_SALT || 10;
const PORT = process.env.PORT || 8000;
const ENV = process.env.ENV || 'development';

export { PORT, PASSWORD_SALT, ENV };
