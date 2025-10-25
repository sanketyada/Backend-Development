//app.js file se yaha aaye ho ab yaha par apne hisab se multiple rought bana 
//sakte ho jaise /regitser /login /signup /admin like reactRouter in React
import {Router} from "express"
import { loginUser, logoutUser, refreshAccessTokne, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewere.js";
import { varifyJWT } from "../middlewares/auth.middlewere.js";

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
router.route("/login").post(loginUser)

//secured Routes
router.route("/logout").post(varifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessTokne)

export default router;

