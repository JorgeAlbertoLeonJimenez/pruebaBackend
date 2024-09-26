import { Router } from "express";
import { loginController } from "../controllers/loginController.js";

const loginRoutes = Router()


loginRoutes.post('/login',loginController)


export default loginRoutes