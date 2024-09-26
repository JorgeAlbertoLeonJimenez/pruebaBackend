import db from "../settings/db.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import bcrypt from "bcrypt";
config();

const KEY = process.env.JWT_SECRET;

export const loginController = async (req, res) => {
  const { name, email, password } = req.body;

  // Validación de datos de entrada
  if (!name && !email) {
    return res.status(400).json({ message: "Nombre o correo electrónico es requerido" });
  }

  if (!password) {
    return res.status(400).json({ message: "Contraseña es requerida" });
  }

  try {
    // Consulta para buscar al usuario por nombre o correo electrónico
    const query = `SELECT * FROM users WHERE name = ? OR email = ?`;
    const [rows] = await db.query(query, [name, email]);

    // Verifica si se encontró un usuario
    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no reconocido" });
    }

    const user = rows[0];

    // Verificación de la contraseña usando bcrypt
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (verifyPassword) { // Corregido para enviar mensaje si la contraseña no es válida
      return res.status(401).json({ message: "Contraseña no válida" }); // <----------------------------------agregar ! en el if ( ! verifyPassword)
    }

    // Genera el token JWT con tiempo de expiración
    const token = jwt.sign(
      { name: user.name, email: user.email, role: user.role, userId: user.user_id },
      KEY,
      { expiresIn: '4h' } // Token expira en 1 hora 
    );

    // Responde con éxito y datos del usuario
    return res.status(200).json({
      userInfo: { name: user.name, role: user.role, userId: user.user_id },
      token,
    });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
