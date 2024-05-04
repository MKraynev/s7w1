import dotenv from "dotenv";
dotenv.config();

export const PORT = +process.env.PORT_NUMBER || 80;
export const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost/nest";

export const JWT_SECRET = process.env.JWT_SECRET_TOKEN || "veryStrongSecret12311";
export const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || "5m";
export const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || "5m";

export const MAIL_LOGIN = process.env.GMAIL_LOGIN;
export const MAIL_PASSWORD = process.env.GMAIL_PASSWORD;

// export let CONFIRM_REGISTRATION_URL = process.env.REGISTRATION_CONFIRM_URL || "localhost:5001/auth/registration-confirmation"
export const REFRESH_PASSWORD_URL = process.env.REFRESH_PASSWORD_URL || "localhost:5001/auth/new-password";

export const ADMIN_LOGIN = process.env.ADMIN_LOGIN;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const POSTGRES_URL = process.env.POSTGRES_HOST || "127.0.0.1";
export const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT) || 5432;
export const POSTGRES_USERNAME = process.env.POSTGRES_USER || "user";
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || "qwerty";
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || "TestDataBase";
export const POSGRES_URL = process.env.POSTGRES_URL || "";
export const POSTGRES_SSL_STATUS = process.env.POSTGRES_SSL_STATUS || "false";

console.log(PORT);

console.log("Postgres info:", POSTGRES_URL, POSTGRES_PORT, POSTGRES_USERNAME, POSTGRES_PASSWORD, POSTGRES_DATABASE, POSGRES_URL);
