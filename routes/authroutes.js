
import { register,login,logout,verfyEmail,verifyopt,is_authenticated,ResetOtp,ResetPass, ResetPassword } from "../controlers/authControler.js";
import { verfytoken } from "../middlware/cookiesfunction.js";
import express from "express";
const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);
router.post("/verifyopt",verfytoken,verifyopt);
router.post("/verifyemail",verfytoken,verfyEmail);
router.post("/isauthenticated",verfytoken,is_authenticated);
router.post("/sendresetemail",ResetOtp);
router.post("/resetpass",ResetPass);
router.post("/pass-reset",verfytoken,ResetPassword);
export default router;
