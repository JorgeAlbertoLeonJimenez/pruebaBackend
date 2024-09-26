import db from "../settings/db.js";
import bcrypt from "bcrypt";

// Añadir un nuevo contratista
export const addContractor = async (req, res) => {
  const { name, password } = req.body;
  const role = "contractor";

  // Validación de entrada
  if (!name || !password) {
    return res.status(400).json({ message: "Nombre y contraseña son requeridos." });
  }

  try {
    // Verificar si el contratista ya existe
    const [verifyCompany] = await db.query(
      "SELECT name FROM users WHERE name = ? AND role = ?",
      [name, role]
    );

    if (verifyCompany.length > 0) {
      return res
        .status(400)
        .json({ message: "El contratista ya se encuentra registrado." });
    }

    // Hashear la contraseña
    const hashPassword = await bcrypt.hash(password, 10);

    // Insertar el contratista
    const [result] = await db.query(
      "INSERT INTO users (name, password, role) VALUES (?, ?, ?)",
      [name, hashPassword, role]
    );

    if (result.affectedRows > 0) {
      return res.status(201).json({
        message: "Contratista creado correctamente.",
        user: { name },
      });
    }

    return res.status(500).json({ message: "Error al crear el contratista." });
  } catch (error) {
    console.error("Error al añadir contratista:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Ver todos los contratistas
export const viewContractors = async (req, res) => {
  try {
    const [contractors] = await db.query(
      "SELECT * FROM users WHERE role = 'contractor' ORDER BY user_id DESC"
    );

    if (contractors.length === 0) {
      return res.status(404).json({ message: "No se encontraron contratistas." });
    }

    return res.status(200).json(contractors);
  } catch (error) {
    console.error("Error al obtener contratistas:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
