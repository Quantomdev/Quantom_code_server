import { addCourse, deleteCourse, updateCourse } from "../controlers/CourseControler.js";
import express from "express";
const router=express.Router();
router.post("/addcourse",addCourse);
router.put('/updatecourse/:id',updateCourse);
router.delete('/deletecourse/:id',deleteCourse);

export default router;