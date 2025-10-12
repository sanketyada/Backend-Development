//yaha se projet start hota hai aur aar db connected ho gya to 
//browser se request lene ko taiyaar ho jata hai
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { app } from "./app.js";
const Port = process.env.PORT;
import connectDB from "./db/index.js";


connectDB()
  .then((result) => {
    const Port = process.env.PORT;
    app.listen(Port || 8000, () => {
      console.log(`Server is running at port ${Port}`);
    });
  })
  .catch((err) => {
    console.log("Mongo Db Connection Faild", err);
});

// ////DataBase Connection
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("Error", error);
//       throw error;
//     });

//     app.get("/", (req, res) => {
//       res.send("Here We Go");
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`App is Litening at ${Port}`);
//     });

//   } catch (error) {
//     console.log("Error Found", error);
//     throw error;
//   }
// })();
  