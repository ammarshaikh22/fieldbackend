import { Router } from "express";
import { login, logout, signup, verifyEmail } from "../controllers/auth.js";

const Authrouter = Router();

Authrouter.post('/signup', signup)
Authrouter.post('/login', login)
Authrouter.post('/verifyemail', verifyEmail)
Authrouter.post('/logout', logout)



export default Authrouter;