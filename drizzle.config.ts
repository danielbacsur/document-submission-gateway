import { defineConfig } from "drizzle-kit";

const config = defineConfig({
  dialect: "postgresql",
  schema: "./schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});

export default config;
