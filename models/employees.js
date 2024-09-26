import db from "../settings/db.js";

export async function employeesModel() {
  const query = `CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    emergency_phone VARCHAR(20),
    insurance_type VARCHAR(100),
    insurance_number VARCHAR(50),
    status ENUM('active', 'inactive', 'required', 'accident', 'low', 'vetoed') NOT NULL DEFAULT 'active',
    photo BOOLEAN DEFAULT 0, -- 1 if photo exists, 0 if not
    contract BOOLEAN DEFAULT 0, -- 1 if contract exists, 0 if not
    imss BOOLEAN DEFAULT 0, -- 1 if registered with IMSS, 0 if not
    ine BOOLEAN DEFAULT 0, -- 1 if has INE, 0 if not
    see BOOLEAN DEFAULT 1, 
    user_id INT, -- Foreign key should reference another table
    hire_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);`;

  try {
    await db.query(query);
    console.log("table employees ✅ ");
  } catch (error) {
    console.log("error employees ❗ ", error);
  }
}
 