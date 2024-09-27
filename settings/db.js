import { config } from "dotenv";
import { createPool } from "mysql2/promise";
config()
const db = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});
try {
  console.log("se esta usando la bd ✅ ");
} catch (error) {
  console.log("error en la coneccion ❗"  , error);
}
export default db;
   