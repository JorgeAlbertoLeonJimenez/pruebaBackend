import db from "../settings/db.js";

export async function insertAdmin(params) {
  const newAdmin = {
    name: "jorge",
    email: "jorge@gmail.com",
    password: "123",
    role: "administrator",
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
      console.log("El administrador en la base de datos ✅ ");
      return; // Salir de la función si el admin ya existe
    }
     
    // Insertar nuevo administrador si no existe
    await db.query(query, [
      newAdmin.name,
      newAdmin.email,
      newAdmin.password,
      newAdmin.role,
    ]);
    console.log("Administrador creado ✅ ");
  } catch (error) {
    console.log("Administrador creado ❗ ", error);
  }
}
     