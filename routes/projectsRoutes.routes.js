import { Router } from "express";
import {
  createProject,
  deleteProject,
  editProject,
  viewProjects,
} from "../controllers/projectsController.js";
import verifyToken from "../middleware/verifyJwt.js";

const projectsRoutes = Router();

projectsRoutes.post("/create/project", verifyToken, createProject);
projectsRoutes.get("/view/projects", verifyToken, viewProjects);
projectsRoutes.post("/update/project", verifyToken, editProject);
projectsRoutes.delete("/delete/project", verifyToken, deleteProject);

export default projectsRoutes;
