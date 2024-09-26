import db from "../settings/db.js";

export async function usersModel() {
  const query = `CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('administrator', 'supervisor', 'contractor') NOT NULL,
    phone_number VARCHAR(20), -- Número de teléfono del usuario
    employee_number INT,      -- Número de empleado (si es relevante)
    status ENUM('active', 'inactive') NOT NULL, -- Estado del usuario
    project_id INT,           -- ID del proyecto al que está asignado el usuario (solo aplicable para supervisores)
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
)`;
   
  try {
    await db.query(query);
    console.log("user ✅ ");
  } catch (error) {
    console.log("user ❗ ");
  }
}
      