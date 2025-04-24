import mongoose from "mongoose";
export const DbConnect=async()=>{
    try{
    const con=await mongoose.connect(process.env.MONGO_URL);
    console.log(`Database connected to ${con.connection.host}`);
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}