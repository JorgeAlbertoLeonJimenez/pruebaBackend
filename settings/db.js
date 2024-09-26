import { config } from "dotenv";
import { createPool } from "mysql2/promise";
config()
const db = createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
try {
  console.log("se esta usando la bd ✅ ");
} catch (error) {
  console.log("error en la coneccion ❗"  , error);
}
export default db;
   