import express from "express"

const app = express();

const PORT = process.env.PORT ||3000;

app.get("/",(req,res)=>{
    res.send("Litening")
})
app.listen(PORT,()=>{
    console.log(`App is Listenig at ${PORT}`)
})