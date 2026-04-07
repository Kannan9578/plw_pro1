import { FullConfig } from "@playwright/test";
import dotenv from "dotenv";

export default async function globalSetup(config: FullConfig) {
  const envName = process.env.TEST_ENV ?? 'qa';
  dotenv.config({ path: `.env.${envName}`, override: true });
  console.log(`Loaded environment: ${envName}`);
  console.log(`Base URL: ${process.env.BASE_URL}`);
}