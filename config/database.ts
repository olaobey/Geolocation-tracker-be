import { cleanEnv, str } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

const DB_CONFIG = cleanEnv(process.env, {
  DB_URI: str({
    desc: 'Database URI to connect the application and save the data to',
  }),
});

export default DB_CONFIG;