import express from "express";
import { config } from "dotenv";
import { usersModel } from "./models/usersModel.js";
import { projectModel } from "./models/projectsModel.js";
import { insertAdmin } from "./inserts/insertAdmin.js";
import loginRoutes from "./routes/loginRoutes.routes.js";
import cors from "cors";
import { insertSupervisor } from "./inserts/insertSupervisor.js";
import supervisorsRoutes from './routes/supervisorsRoutes.routes.js';
import projectsRoutes from "./routes/projectsRoutes.routes.js";
import contractorRoutes from "./routes/contractorRoutes.routes.js";
import { employeesModel } from "./models/employees.js";
import employessRoutes from "./routes/employeesRoutes.Routes.js";
import { Resend } from "resend";

const app = express();
app.use(express.json()); 
app.use(cors());
config();

const createTablesAndInsertData = async () => {
  try {
    // Crear las tablas en el orden correcto 
    await projectModel();
    console.log("Tabla 'projects' creada o ya existe.");

    await usersModel();
    console.log("Tabla 'users' creada o ya existe.");

    await employeesModel();
    console.log("Tabla 'employees' creada o ya existe.");

    // Insertar los datos después de crear las tablas
    await insertSupervisor();
    console.log("Datos de supervisores insertados.");

    await insertAdmin();
    console.log("Datos de administradores insertados.");
  } catch (error) {
    console.error("Error al crear tablas o insertar datos:", error);
    process.exit(1); // Termina el proceso en caso de error crítico
  }
};

// Llamada a la función de configuración
createTablesAndInsertData();

// Rutas
app.use("/api", loginRoutes);
app.use("/api", projectsRoutes);
app.use("/api", supervisorsRoutes);
app.use("/api", contractorRoutes);
app.use('/api', employessRoutes);




const key = "re_Hjk8hz6w_CNyUeGJqVYdfxy23uWE4bcD5"
const resend = new Resend(key);
app.get("/api/email", async (req, res) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["jorgealbertolejim@gmail.com"],
    subject: "hello world",
    html: "<strong>it works!</strong> <h1>Welcome to application of the grup ADCO</h1>",
  });

  if (error) {
    return res.status(400).json({ error });
  }

  res.status(200).json({ data });
});
app.use('/api/uploads', express.static('public/uploads'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
