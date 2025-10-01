import express from 'express'

const app = express()
const Port=3000
app.get('/',(req,res)=>{
    res.send("Here We Go");
})
app.listen(Port,()=>{
    console.log(`App is Litening at ${Port}`)
})