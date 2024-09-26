import { Router } from "express";
import { createSupervisors, deleteSupervisor, editInfoSupervisor, viewSupervisor } from "../controllers/supervisorsController.js";
import verifyToken from "../middleware/verifyJwt.js";
const supervisorsRoutes = Router()

supervisorsRoutes.post('/create/supervisor',verifyToken,createSupervisors)
supervisorsRoutes.get('/view/supervisors', verifyToken,viewSupervisor)
supervisorsRoutes.post('/update/supervisor', verifyToken,editInfoSupervisor)
supervisorsRoutes.delete('/delete/supervisor',verifyToken,deleteSupervisor)
export default supervisorsRoutes; 