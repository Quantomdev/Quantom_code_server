import { Course } from "../models/CoursesModel.js";
import { User } from "../models/usermodel.js";
import { ValidateResource } from "./functions.js";
import { CoursePublisher } from "../observer/publisher.js";
import { UserSubscriber } from "../observer/subscriber.js";
//hii
export const addCourse=async(req,res)=>{
    try{
        const{tittle,description,resources}=req.body;
        if(!tittle || !description || !resources){
            return res.json({message:"all fields are required"});
        }
        if(!ValidateResource(resources)){
            return res.json({message:"invalid resources"});
        }
        const isCourseExist=await Course.findOne({resources});
        if(isCourseExist){
            return res.json({message:"course already exist"});
        }
        const course=await Course.create({tittle,description,resources});
        await course.save();
        return res.json({message:"course added successfully"});
    }
    catch(error){
        console.log(error);
        return res.json({message:"server error"});
    }
};

export const updateCourse = async(req,res)=>{
    try{
        const {id} = req.params;
        const{tittle,description,resources}=req.body;
        if(!tittle || !description || !resources){
            return res.json({message:"all fields are required"});
        }
        if(!ValidateResource(resources)){
            return res.json({message:"invalid resources"});
        }
        const course=await Course.findById(id);
        console.log(course);
        if(!course){
            return res.json({message:"course not found"});
        }
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { 
                tittle, 
                description, 
                resources,
                updatedAt: Date.now() 
            },
            { new: true, runValidators: true } // Return updated doc + validate
        );
        return res.json({message:"course updated successfully"});
    }
    catch(error){
        console.log(error);
        return res.json({message:"server error"});
    }
}

export const deleteCourse = async(req,res)=>{
    try{
        const {id} = req.params;
        const course=await Course.findById(id);
        console.log(course);
        if(!course){
            return res.json({message:"course not found"});
        }
         await Course.deleteOne(course);
        return res.json({message:"course deleted successfully"});
    }
    catch(error){
        console.log(error);
        return res.json({message:"server error"});
    }
}
export const subscribe=async(req,res)=>{
    try{
        const {id}=req.params;
        const {userId}=req.body;
        if(!id || !userId){
            return res.json({message:"all fileds are required"});

        }
        const targetuser= await User.findById(userId);
        const targetcourse=await Course.findById(id);
        if(!targetuser || !targetcourse){
            return res.status(404).json({message:"user or course is not found!"});

        }
        if(!targetcourse.subscribers.includes(targetuser)){
            targetcourse.subscribers.push(targetuser);
            await targetcourse.save();
            return res.status(200).json({message:"user is succesfully subscribed to the course!"});
        }
        }
    catch(error){
        console.log(error);
        }
}
    export const addcontent=async(req,res)=>{
     try{
        const {id}=req.param;
        const {new_resources}=req.boyd;
        if(!ValidateResource(new_resources)){
            return res.json({message:"inavlid resources"});
        }   
        const targetcourse=await Course.findById(id).populate("subscribers");
        if(!targetcourse){
            return res.status(404).json({messgae:"course is not found"})
        }
        //add resources to the  course
        targetcourse.resources.push(...new_resources);
        targetcourse.updatedAt=Date.now();
        await targetcourse.save();
        const publisher =new  CoursePublisher(); 

        targetcourse.subscribers.forEach(user => {
          publisher.addSubscriber(new UserSubscriber(user));
        });
        publisher.notify(targetcourse);
        return res.status(200).json({message:"email sent"});
        

    
        



     }  
     catch(error){
        console.log(error);
        return res.json({message:"server error"});
     } 
    }