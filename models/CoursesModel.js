import mongoose from "mongoose";
const CourseScehma=new mongoose.Schema({
    tittle:{type:String,required:true},
    description:{type:String,required:true},
    resources:[
        {
            type: { type: String, enum: ["video", "pdf"], required: true },
            url: { type: String, required: true },
        },
    ],
    rating: { type: Number, default: 0 },
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" ,default:[]}],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    
})
export const Course= mongoose.model('Course',CourseScehma);