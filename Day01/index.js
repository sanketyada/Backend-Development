import express from "express"

const app = express()

const Port = 5000;

app.set("view engine","ejs");
app.set("views", "./views");

app.get("/",(req,res)=>{
    res.render("index",{standard:12})
})


app.listen(Port,()=>{
    console.log(`Listening at ${Port}`)
})