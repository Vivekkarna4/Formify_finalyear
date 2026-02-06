import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import 'dotenv/config'

export default defineConfig({
  out: './drizzle',
  schema: './config/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://accounts:1fUYBQczhA2x@ep-delicate-moon-a5u5ks4r.us-east-2.aws.neon.tech/ai-form-generator?sslmode=require',
  },
});
