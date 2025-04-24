import { User } from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail ,sendotpemail,send_reset_email} from "../config/Nodemailer.js";
import { genrateotp } from "./functions.js";

export const register=async(req,res)=>{
    //take the info from the body
    const {email,name,password}=req.body;
    //chech if they are empty
    if(!email || !name || !password){
        return res.status(409).json({error:"all fields are required"});
    }
    try{
        //chech if the user arleady ex  ists
            const finduser= await User.findOne({email});
            console.log(finduser);
            if(finduser){
                return res.status(409).json({error:"user already exists"});
            }
            //hash pass befor inserting it
            const hashed_pass=await bcrypt.hash(password,10);
                const user= await User.create({email,name,password:hashed_pass});
                await user.save();
                //generate the token when register
                const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
                res.cookie('token',token,{
                    httpOnly:true,
                    secure:process.env.NODE_ENV==="production",
                    sameSite:process.env.NODE_ENV=='production'?'none':'strict',
                    maxAge:7*24*60*60*1000




                })
                sendWelcomeEmail(user.email);

            return res.status(200).json({message:"user created successfully"});
    }
    catch(error ){
        console.log(error);
        return res.status(500).json({error:"server error"});
    }

}
//work flow//
/*
The client sends a POST request to the /register endpoint with name, email, and password in the request body.

The server validates the input and checks if the user already exists.

If the user does not exist, the password is hashed, and a new user is created in the database.

A JWT token is generated and sent to the client as an HTTP-only cookie.

The server responds with a success message or an appropriate error message.*/
/////////////////////////////////////////////////////
//login function
export const login=async(req,res)=>{
 const {name,password}=req.body;
 if(!name || !password){
    return res.status(404).json({error:"all fields are required"});
 }
 try{
    const targetuser=await User.findOne({name});
    if(!targetuser){
        return res.status(404).json({message:'user not found'});
    }
    const matchpass=await bcrypt.compare(password,targetuser.password);
    if(!matchpass){
        return res.json({message:"wrong password"});
    }
    const token=jwt.sign({id:targetuser._id},process.env.JWT_SECRET,{expiresIn:"7d"});
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:process.env.NODE_ENV=='production'?'none':'strict',
        maxAge:7*24*60*60*1000




    })
    const response = {
        message: "User logged in successfully",
        user: {
          id: targetuser._id,
          name: targetuser.name,
          email: targetuser.email,
          isVerified: targetuser.isVerified,
        },
      };
      return res.status(200).json(response);

 }
 catch(error){
    console.log(error);
    return res.status(500).json({error:"server error"});
 }
}
export const logout=async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV=='production'?'none':'strict',
            maxAge:7*24*60*60*1000
    
    
    
    
        });
        return res.status(200).json({message:"user logged out successfully"});
    }

        

    
    catch(error){
        console.log(error);
    }
}
export const verifyopt=async(req,res)=>{
    try{
        const {userId}=req.body;
        const targetuser=await User.findById(userId);
        if(!targetuser){
            console.log("user not found");
        }   
        if(targetuser.isVerfied){
            return res.json({message:'user already verfied'});
        }
        //generate the number that he will use to verify  if the user is not verfied
        const opt=genrateotp();
        targetuser.verifyoption=opt;
        targetuser.verfyexpires=Date.now()+24*60*60*1000;   
        await targetuser.save();  
        await sendotpemail(targetuser.email,opt);  
        return res.status(200).json({message:"otp sent successfully"});

    }
    catch(error){
        console.log(error);
    }
}
export const verfyEmail=async(req,res)=>{

    try{
        const {userId,otp}=req.body;
        if(!userId || !otp){
            return res.status(404).json({error:"all fields are required"});
        }
        const targetuser=await User.findById(userId);
        if(!targetuser){
            return res.status(404).json({message:'user not found'});
        }
        if(targetuser.isVerified){
            return res.json({message:'user already verfied'});
        }
        if(targetuser.verifyoption!==otp || targetuser.verifyoption==''){
            return res.json({message:"wrong otp"});
        }
        if(targetuser.verfyexpires<Date.now()){
            return res.json({message:"otp expired"});
        }
        targetuser.isVerified=true;
        targetuser.verifyoption="";
        targetuser.verfyexpires=0;
        await targetuser.save();
        return res.status(200).json({message:"user verfied successfully"});

     
    }
    catch(error){
        console.log(error);
    }
}
 /*5. Summary of the Flow
User logs in → JWT token is generated and stored in a cookie.

User requests OTP → verfytoken middleware extracts the user ID from the JWT token → verifyopt generates and sends the OTP.

User submits OTP → verfyEmail validates the OTP and marks the user as verifi*/

export const is_authenticated=async(req,res)=>{
    try{
        return res.status(200).json({message:"user is authenticated"});

    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:"server error"});
    }
}
export const ResetOtp=async(req,res)=>{
    try{
        const {email}=req.body;
        if(!email){
            return res.json({message:"email is required"});

        }
        const targetuser = await User.findOne({ email: email });
    
        if(!targetuser){
            return res.status(404).json({message:"user not found"});
        }
        const opt=genrateotp();
        targetuser. resetopt=opt;
        targetuser. resetoptexpires=Date.now()+24*60*60*1000;  
        await targetuser.save();
        await send_reset_email(targetuser.email,opt);
        return res.status(200).json({message:"Pass reset email sent successfully"});





    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:"server error"});
  
    }
}
export const ResetPass=async(req,res)=>{
    try{
        const{email,otp,newpass}=req.body;
        if(!otp || !newpass || !email){
            return res.json({message:"all fields are required"});
        }
        const targetuser=await User.findOne({email:email});
        if(!targetuser){
            return res.status(404).json({message:"user not found"});
        }
        if(targetuser.resetopt!==otp || targetuser.resetopt==''){
            return res.json({message:"wrong otp"});
        }
        if(targetuser.resetoptexpires<Date.now()){
            return res.json({message:"otp expired"});
        }
        const hashed_pass=await bcrypt.hash(newpass,10);
        targetuser.password=hashed_pass;
        targetuser.resetopt="";
        targetuser.resetoptexpires=0;
        await targetuser.save();
        const response = {
            message: "User pass reset  successfully",
            user: {
              id: targetuser._id,
              name: targetuser.name,
              email: targetuser.email,
              password: targetuser.password,
              isVerified: targetuser.isVerified,
            },
          };
          return res.status(200).json(response);


    }
    catch(error){

    }
}
//method 2
export const ResetPassword=async(req,res)=>{
    const{newPass,userId}=req.body;
    if(!newPass || !userId){
        return res.json({message:"all fields are required"});
    }
    try{
        const targetuser=await User.findById(userId);
        if(!targetuser){
            return res.status(404).json({message:"user not found"});
        }
        const hashed_pass=await bcrypt.hash(newPass,10);
        targetuser.password=hashed_pass;
        await targetuser.save();
        return res.status(200).json({message:"password reset successfully"});

    }
    catch(error){
        return res.json({message:"server error"});
    }

}