import { config } from "dotenv";
import { isNumberString } from "../utils/typeGuards";

config();

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

const JWT_ACCESS_EXPIRES_IN = getEnv("JWT_ACCESS_EXPIRES_IN");
const JWT_REFRESH_EXPIRES_IN = getEnv("JWT_REFRESH_EXPIRES_IN");

if (!isNumberString(JWT_ACCESS_EXPIRES_IN) || !isNumberString(JWT_REFRESH_EXPIRES_IN)) {
  throw new Error("JWT expiration variables must be valid numbers");
}

export const env = {
  PORT: process.env.PORT,
  CLIENT_URL: getEnv("CLIENT_URL"),
  MONGGO_DB_ACCESS_LOGIN: getEnv("MONGGO_DB_ACCESS_LOGIN"),
  MONGGO_DB_ACCESS_PASSWORD: getEnv("MONGGO_DB_ACCESS_PASSWORD"),
  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
};
