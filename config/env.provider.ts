import dotenv from "dotenv";

dotenv.config(); // Load from .env file

// Define the config shape
interface EnvConfig {
  databaseUrl: string;
  port: number;
  jwtSecret: string;
}

// Create the config object
const envConfig: EnvConfig = {
  databaseUrl: process.env.DATABASE_URL || "",
  port: parseInt(process.env.PORT || "3000", 10),
  jwtSecret: process.env.JWT_SECRET || "default_secret", // add your own secret
};

if (!envConfig.databaseUrl) {
  throw new Error("❌ DATABASE_URL is missing in environment variables");
}

export default envConfig;
