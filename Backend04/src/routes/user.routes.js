//app.js file se yaha aaye ho ab yaha par apne hisab se multiple rought bana 
//sakte ho jaise /regitser /login /signup /admin like reactRouter in React
import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewere.js";

const router =  Router()


//without file handling errror
// router.route("/register").post(registerUser)

//with file handling errror
// router.route("/register").post(upload.fields(
//     [
//         {
//             name:"avatar",
//             maxCount:1
//         },
//         {
//             name:"coverImage",
//             maxCount:1
//         }
//     ]
// ),registerUser);
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
);


export default router;

