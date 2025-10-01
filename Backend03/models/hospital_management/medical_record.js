import mongoose from "mongoose";

const medicalSchema = new mongoose.Schema(
  {
    recordId: {
      type: Number,
      required: true,
    },
    patientName:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Patient"
    },
    patientID:{
        type:Number,
        required:true
    },
    visitDate:{
        type:Date,
        required:true
    },
    referedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor"
    },
    hospitalName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hospital"
    }
  },
  {timestamps:true}
);

export const Medical = mongoose.model("Medical", medicalSchema);
