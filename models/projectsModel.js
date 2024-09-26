import db from "../settings/db.js";

export async function projectModel() {
  const query = `CREATE TABLE IF NOT EXISTS projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
`;

  try {
    await db.query(query);
    console.log("projects ✅ ");
  } catch (error) {
    console.log("projects ❗  ");
  }
}
