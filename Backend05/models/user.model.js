const mongoose = require("mongoose")

 const userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    age:Number,
    gender:{
        type:String,
        enum:['Male','Female']
    }
 })

 const userModel = mongoose.model("User",userSchema)
 module.exports = userModel