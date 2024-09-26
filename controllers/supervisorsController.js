import db from "../settings/db.js";
import bcrypt from "bcrypt";

// Crea un nuevo supervisor
export const createSupervisors = async (req, res) => {
  const { name, email, password, project_id, phone_number } = req.body;
  const role = "supervisor";
  const status = "active";
  const user = { name, email, password, project_id, phone_number };
  console.log(user);

  // Validación básica
  if (!name || !email || !password || !project_id) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  try {
    // Verifica si el supervisor ya existe
    const [verifySupervisor] = await db.query(
      "SELECT * FROM users WHERE name = ? OR email = ?",
      [name, email]
    );

    if (verifySupervisor.length > 0) {
      return res
        .status(400)
        .json({ message: "El usuario o correo ya está registrado" });
    }

    // Hasheado de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserción del nuevo supervisor
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role, project_id, phone_number, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role, project_id, phone_number, status]
    );

    if (result.affectedRows > 0) {
      return res.status(201).json({
        message: "Supervisor creado correctamente",
        newUser: { name, email, role, project_id },
      });
    } else {
      return res.status(500).json({ message: "Error al crear el supervisor" });
    }
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// Ver todos los supervisores
export const viewSupervisor = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página actual
  const limit = parseInt(req.query.limit) || 8; // Número de registros por página
  const offset = (page - 1) * limit; // Calcular desde dónde empezar

  try {
      const [supervisors] = await db.query(
        `SELECT
          u.user_id,
          u.name AS supervisor_name,
          u.email,
          u.phone_number,
          u.status,               -- Agregado status del supervisor
          p.name AS project_name  -- Solo el nombre del proyecto
        FROM
          users u
        JOIN
          projects p
        ON
          u.project_id = p.project_id
        WHERE
          u.role = 'supervisor'
        ORDER BY
          u.user_id  -- Cambiar si se desea otro orden
        LIMIT ?
        OFFSET ?`,
        [limit, offset] // Pasar los valores como parámetros de consulta
      );
    if (supervisors.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron supervisores" });
    }

    res.status(200).json(supervisors);
  } catch (error) {
    console.error("Error al obtener supervisores:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


// Editar información del supervisor
export const editInfoSupervisor = async (req, res) => {
  const { user_id, newPhoneNumber, newEmail } = req.body;
  const user ={ user_id, newPhoneNumber, newEmail }
console.log(user);

  // Validación de entrada
  if (!user_id) {
    return res.status(400).json({ message: "ID de usuario es requerido" });
  }

  try {
    const [result] = await db.query(
      `UPDATE users
SET email = ?,
    phone_number = ?
WHERE user_id = ?;`,
      [newPhoneNumber, newEmail, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Supervisor no encontrado" });
    }

    res.status(200).json({ message: "Información actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar el supervisor:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Eliminar un supervisor
export const deleteSupervisor = async (req, res) => {
  const { user_id } = req.body;


  if (!user_id) {
    return res.status(400).json({ message: "ID de usuario es requerido" });
  }

  try {
    const [result] = await db.query("DELETE FROM users WHERE user_id = ?", [
      user_id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Supervisor no encontrado" });
    }

    res.status(200).json({ message: "Supervisor eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el supervisor:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
