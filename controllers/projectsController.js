import db from "../settings/db.js";

// Crear un nuevo proyecto
export const createProject = async (req, res) => {
  const { name } = req.body;

  // Validación básica
  if (!name) {
    return res.status(400).json({ message: "El nombre del proyecto es requerido." });
  }

  try {
    const [existingProjects] = await db.query(
      "SELECT * FROM projects WHERE name = ?",
      [name]
    );

    if (existingProjects.length > 0) {
      return res.status(400).json({ message: "El nombre del proyecto ya está en uso." });
    }

    // Inserta el nuevo proyecto
    await db.query("INSERT INTO projects (name) VALUES (?)", [name]);

    return res.status(201).json({ message: "Proyecto agregado correctamente." });
  } catch (error) {
    console.error("Error al agregar el proyecto:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Ver todos los proyectos
export const viewProjects = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página actual
  const limit = parseInt(req.query.limit) || 8; // Número de registros por página
  const offset = (page - 1) * limit; // Calcular desde dónde empezar
  
  try {
    const [projects] = await db.query(
      `SELECT
        u.user_id,
        u.name AS supervisor_name,
        u.email,
        u.status AS supervisor_status,  -- Agregado status del supervisor
        p.project_id,
        p.name AS project_name
      FROM
        projects p
      LEFT JOIN
        users u
      ON
        u.project_id = p.project_id AND u.role = 'supervisor'
      ORDER BY
        p.project_id DESC
      LIMIT ?
      OFFSET ?`,
      [limit, offset] // Pasar los valores como parámetros de consulta
    );

    if (projects.length === 0) {
      return res.status(404).json({ message: "No se encontraron proyectos." });
    }

    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error al obtener los proyectos:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Editar un proyecto existente
export const editProject = async (req, res) => {
  const { project_id, name, newName } = req.body;
console.log(project_id,name,newName);

  // Validación de entrada
  if (!project_id || !name || !newName) {
    return res.status(400).json({ message: "Datos incompletos para actualizar el proyecto." });
  }

  try {
    // Verifica si el nuevo nombre ya está en uso
    const [duplicate] = await db.query("SELECT * FROM projects WHERE name = ?", [newName]);

    if (duplicate.length > 0) {
      return res.status(400).json({ message: "Ya existe un proyecto con el mismo nombre." });
    }

    const [edit] = await db.query(
      "UPDATE projects SET name = ? WHERE project_id = ? AND name = ?",
      [newName, project_id, name]
    );

    if (edit.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró el proyecto o no se pudo actualizar." });
    }

    return res.status(200).json({ message: "Proyecto actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Eliminar un proyecto
export const deleteProject = async (req, res) => {
  const { name, project_id } = req.body;

  // Validación de entrada
  if (!project_id || !name) {
    return res.status(400).json({ message: "Datos incompletos para eliminar el proyecto." });
  }

  try {
    const [deleteProject] = await db.query(
      "DELETE FROM projects WHERE name = ? AND project_id = ?",
      [name, project_id]
    );

    if (deleteProject.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró el proyecto para eliminar." });
    }

    return res.status(200).json({ message: "Proyecto eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar el proyecto:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};