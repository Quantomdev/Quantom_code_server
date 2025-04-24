import {chatWithAI,Debug} from "../controlers/chatbotControler.js";
import { verfytoken } from "../middlware/cookiesfunction.js";

import express from "express";
const router=express.Router();
router.post("/chat",verfytoken,chatWithAI);
router.post("/debug",verfytoken,Debug);
export default router;