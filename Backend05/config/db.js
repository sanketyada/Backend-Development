const mongoose = require("mongoose")

const connection=mongoose.connect("mongodb://localhost:27017/MENstack")
.then((data)=>{
    console.log("Database Connected")
})

module.exports = connection;