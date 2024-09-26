import db from "../settings/db.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

// Configuración de multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // Ruta donde se guardarán los archivos subidos
    const dirPath = path.join(
      `./foldersEmployees/${req.body.firstName}${req.body.lastName}`
    );

    try {
      // Verifica si la carpeta existe
      await fs.access(dirPath);
      // Si la carpeta existe, usa la carpeta existente
      cb(null, dirPath);
    } catch (error) {
      // Si la carpeta no existe, crea la carpeta
      await fs.mkdir(dirPath, { recursive: true });
      cb(null, dirPath);
    }
  },
  filename: (req, file, cb) => {
    // Nombre del archivo subido
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Aquí puedes filtrar archivos si es necesario
    cb(null, true);
  },
});

// Controlador para crear empleados
export const createEmployees = [
  upload.fields([
    { name: "contract", maxCount: 1 },
    { name: "nss", maxCount: 1 },
    { name: "ine", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        emergencyPhone,
        insuranceType,
        insuranceNumber,
        status,
        userId,
        hireDate,
      } = req.body;

      // Se determina si los archivos están presentes y obtiene sus nombres
      const contract = req.files["contract"] ? true : false;
      const imss = req.files["nss"] ? true : false;
      const ine = req.files["ine"] ? true : false;

      const employee = {
        firstName,
        lastName,
        emergencyPhone,
        insuranceType,
        insuranceNumber,
        status,
        photo: null, // Aquí no estás manejando un campo de "photo"
        contract,
        imss,
        ine,
        userId,
        hireDate,
      };

      console.log(employee);

      // Verificar si el empleado ya está registrado
      const [verifyEmployees] = await db.query(
        `SELECT * FROM employees WHERE first_name = ? AND last_name = ?`,
        [firstName, lastName]
      );

      if (verifyEmployees.length > 0) {
        return res
          .status(400)
          .json({ message: "El empleado ya está registrado" });
      }

      // Insertar el nuevo empleado
      const [insertEmployees] = await db.query(
        `INSERT INTO employees (
          first_name, last_name, emergency_phone, insurance_type,
          insurance_number, status, photo, contract, imss, ine,
          user_id, hire_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          firstName,
          lastName,
          emergencyPhone,
          insuranceType,
          insuranceNumber,
          status,
          null, // Aquí no estás manejando un campo de "photo"
          contract,
          imss,
          ine,
          userId,
          hireDate,
        ]
      );

      if (insertEmployees.affectedRows > 0) {
        res.status(201).json({ message: "Empleado agregado correctamente" });
      } else {
        res.status(500).json({ message: "Error al agregar el empleado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  },
];

export const viewEmployess = async (req, res) => {
  const { userId } = req.params;
  try {
    const [viewEmployees] = await db.query(
      "SELECT * FROM employees WHERE user_id =? AND see = 1",
      [userId]
    );
    res.status(200).json(viewEmployees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
const storageImageUser = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dirPath = path.join("public/uploads");

    try {
      await fs.access(dirPath);
      cb(null, dirPath);
    } catch (error) {
      await fs.mkdir(dirPath, { recursive: true });
      cb(null, dirPath);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    req.fileFilename = filename; // Guardar el nombre del archivo en req para usarlo más tarde
    cb(null, filename);
  },
});

const uploadImageUser = multer({
  storage: storageImageUser,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

export const uploadImageUserRoute = [
  uploadImageUser.single("imageUser"),
  async (req, res) => {
    const { firstName, lastName } = req.body;
    const filename = req.fileFilename; // Obtener el nombre del archivo guardado en req

    try {
      if (!req.file) {
        return res.status(400).send("No se ha subido ningún archivo.");
      }

      // Insertar el nombre del archivo en la base de datos

      await db.query(
        ` UPDATE employees
        SET image = ?
        WHERE first_name = ? AND last_name = ?`,
        [filename, firstName, lastName]
      );

      res.status(200).json({
        message: "Imagen subida exitosamente",
        file: req.file,
      });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      res.status(500).send("Error al subir la imagen");
    }
  },
];

export const deleteEmployee = async (req, res) => {
  const { userId } = req.body;
  console.log(userId);
  try {
    const [verifyEmployee] = await db.query(
      "SELECT * FROM employees WHERE id = ? ",
      [userId]
    );
    if (verifyEmployee.length === 0) {
      return res
        .status(404)
        .json({ message: "el empleado no esta registrado" });
    }

    await db.query("UPDATE employees SET see = 0  WHERE id = ? ", [userId]);
    res.status(200).json({ message: "el empleado a sido borrado" });
  } catch (error) {
    console.log(error);
  }
};

export const countEmployees = async (req, res) => {
  const { userId } = req.params;
  const [countContractor] = await db.query(
    `SELECT COUNT(*) AS employee_count
     FROM employees
    WHERE user_id = ?`,
    userId
  );
  res.status(200).json(countContractor);
};

export const viewEmployeesAdmin = async (req, res) => {
  try {
    const [employees] = await db.query(`SELECT e.*, 
       u.name AS contractor_name
FROM employees e
LEFT JOIN users u ON e.user_id = u.user_id
`);

    res.status(200).json(employees);
  } catch (error) {
    console.log(error);
  }
};
