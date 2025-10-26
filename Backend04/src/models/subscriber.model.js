import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{  //One who subscribing Channel
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{   //one who get subscribed.
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})
export const Subscriber = mongoose.model("Subscriber",subscriptionSchema)