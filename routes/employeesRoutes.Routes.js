import { Router } from "express";
import {
  countEmployees,
  createEmployees,
  deleteEmployee,
  uploadImageUserRoute,
  viewEmployeesAdmin,
  viewEmployess,
} from "../controllers/employeesController.js";
import verifyToken from "../middleware/verifyJwt.js";
const employessRoutes = Router();
employessRoutes.get("/view/employees/admin", verifyToken,viewEmployeesAdmin);
employessRoutes.post("/create/employees", verifyToken,createEmployees);
employessRoutes.get("/view/employees/:userId",verifyToken ,viewEmployess);
employessRoutes.post("/upload/employees", verifyToken,uploadImageUserRoute);
employessRoutes.delete("/delete/employee", verifyToken,deleteEmployee);
employessRoutes.get("/count/employees/:userId", verifyToken,countEmployees);


export default employessRoutes;
  