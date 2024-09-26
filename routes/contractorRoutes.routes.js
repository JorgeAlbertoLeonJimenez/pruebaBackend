
import { Router } from "express";
import { addContractor, viewContractors } from "../controllers/contractorController.js";
import verifyToken from "../middleware/verifyJwt.js";

const contractorRoutes = Router()

contractorRoutes.post('/add/contractor',verifyToken,addContractor)
contractorRoutes.get('/view/contractors',verifyToken,viewContractors)


export default contractorRoutes