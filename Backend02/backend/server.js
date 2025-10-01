import express from 'express'

const app = express();

const PORT = 3000

const jokes = [
  {
    id: 1,
    title: "Why don't skeletons fight each other?",
    content: "Because they don’t have the guts."
  },
  {
    id: 2,
    title: "Why did the math book look sad?",
    content: "Because it had too many problems."
  },
  {
    id: 3,
    title: "Why can't your nose be 12 inches long?",
    content: "Because then it would be a foot."
  },
  {
    id: 4,
    title: "Why did the computer go to therapy?",
    content: "It had too many bytes of emotional baggage."
  },
  {
    id: 5,
    title: "Why don’t eggs tell jokes?",
    content: "Because they’d crack each other up."
  }
];


app.get('/api/jokes',(req,res)=>{
    res.send(jokes)
})
app.get('/',(req,res)=>{
    res.send("Here is your Joke")
})
app.listen(PORT,(req,res)=>{
    console.log(`App is Listening at PORT ${PORT}`)
})