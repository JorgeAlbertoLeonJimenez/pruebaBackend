import db from "../settings/db.js";

export async function insertSupervisor(params) {
  const newAdmin = {
    name: "supervisor",
    email: "supervisor@gmail.com",
    password: "123",
    role: "supervisor",
  };
  
  const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
  const verifyAdminQuery = "SELECT * FROM users WHERE name = ? AND email = ? AND role = ?";
  
  try {
    // Verificar si el admin ya existe en la base de datos
    const [existingAdmins] = await db.query(verifyAdminQuery, [
      newAdmin.name,
      newAdmin.email,
      newAdmin.role,
    ]);
    
    if (existingAdmins.length > 0) {
      console.log("supervisor en la base de datos ✅ ");
      return; // Salir de la función si el admin ya existe
    }  
    
    // Insertar nuevo administrador si no existe
    await db.query(query, [
      newAdmin.name,
      newAdmin.email,
      newAdmin.password,
      newAdmin.role,
    ]);
    console.log("supervisor insertado en la base de datos ✅ ");
  } catch (error) {
    console.log("Error al crear el supervisor  ❗ ", error);
  }
}
     