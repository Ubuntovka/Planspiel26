import path from "path";
import dotenv from "dotenv";

// Load environment variables from the backend/.env file by default
const envPath = process.env.ENV_PATH || path.resolve(__dirname, "..", ".env");
dotenv.config({ path: envPath });

export interface AppConfig {
  nodeEnv: string;
  port: number;
  mongoUri: string;
  jwtSecret: string;
}

function requireVar(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config: AppConfig = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  mongoUri: requireVar("MONGODB_URI", process.env.MONGODB_URI),
  jwtSecret: requireVar("JWT_KEY", process.env.JWT_KEY),
};

export default config;
