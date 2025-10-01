const express = require('express')
const app = express()
require('dotenv').config()
const port =process.env.PORT || 3000

let githubdata ={
  "login": "sanketyada",
  "id": 160760290,
  "node_id": "U_kgDOCZUB4g",
  "avatar_url": "https://avatars.githubusercontent.com/u/160760290?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/sanketyada",
  "html_url": "https://github.com/sanketyada",
  "followers_url": "https://api.github.com/users/sanketyada/followers",
  "following_url": "https://api.github.com/users/sanketyada/following{/other_user}",
  "gists_url": "https://api.github.com/users/sanketyada/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/sanketyada/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/sanketyada/subscriptions",
  "organizations_url": "https://api.github.com/users/sanketyada/orgs",
  "repos_url": "https://api.github.com/users/sanketyada/repos",
  "events_url": "https://api.github.com/users/sanketyada/events{/privacy}",
  "received_events_url": "https://api.github.com/users/sanketyada/received_events",
  "type": "User",
  "user_view_type": "public",
  "site_admin": false,
  "name": "Sanket Yadav",
  "company": null,
  "blog": "",
  "location": "Mumbai ,Maharastra",
  "email": null,
  "hireable": null,
  "bio": "👋 Hi, I’m Sanket Yadav\r\n👀 I’m interested in Full Stack Devloper\r\n🌱 I’m currently learning MERN STACK\r\n💞️ I’m looking to collaborate on Open source.",
  "twitter_username": null,
  "public_repos": 22,
  "public_gists": 0,
  "followers": 2,
  "following": 2,
  "created_at": "2024-02-21T15:43:03Z",
  "updated_at": "2025-09-15T16:40:21Z"
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/greet',(req,res)=>{
    res.send("Congratulation Man!")
})
app.get('/github',(req,res)=>{
    res.json(githubdata)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
