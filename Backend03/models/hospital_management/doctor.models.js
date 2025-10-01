import mongoose from "mongoose"

// const hostalVisit = mongoose.Schema({
//     hospitalname:{
//         type:String,
//         required:true
//     },
//     hours:{
//         type:Number,
//         default:2
//     }
// })

const doctorSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        salary:{
            type:String,
            required:true
        },
        qualification:{
            type:String,
            required:true
        },
        experienceInYear:{
            type:Number,
            default:0
        },
        //Here we are taking array to 
        // store many hospital where doctor work
        worksInHosptal:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Hospital"
            }
        ]     
    },
    {timestamps:true}
)

export const Doctor = mongoose.model("Doctor",doctorSchema)