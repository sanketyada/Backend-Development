const express = require("express");
const morgan = require("morgan");
const app = express();
const dbConnection = require("./config/db");
const userModel = require("./models/user.model");

app.set("view engine", "ejs");

app.use((req, res, next) => {
  console.log(" Middleware Sanket");
  return next();
});
app.use(morgan("dev"));
app.use(express.json()); //for geting dat in req.body
app.use(express.urlencoded({ extended: true })); //for geting dat in req.body

app.use(express.static("public")); //for using the public folder

app.get("/", (req, res) => {
  res.send("Home");
});

app.get("/about", (req, res) => {
  //   res.send("About Page");
  res.render("index");
});

app.post("/get-form-data", (req, res) => {
  console.log(req.body);
  res.send("Data Recived");
});

app.get("/profile", (req, res) => {
  res.send("Profile Page");
});
app.get("/register", (req, res) => {
  res.render("ragisterForm");
});

app.post("/ragisterUser", async (req, res) => {
  const { username, email, password, age, gender } = req.body;
  const newUser = await userModel.create({
    username: username,
    email: email,
    password: password,
    age: age,
    gender: gender,
  });
  res.send(newUser);
});

app.get("/get-users", async (req, res) => {
  await userModel.findOne({ username: "Anu" }).then((data) => {
    res.send(data);
  });
});
app.get("/update-user", async (req, res) => {
  await userModel
    .findOneAndUpdate({ username: "Anu" }, { email: "anuRani@gmail.com" })
    .then((UpdatedData) => {
      res.send("UpdatedData");
    });
});

app.get("/delete-user",async (req,res)=>{
   await userModel.findOneAndDelete({username:"Ravi"})
   .then(()=>{
    res.send('User Deleted')
   })
})

app.listen(3000, () => {
  console.log("App is listenig at 3000");
});
