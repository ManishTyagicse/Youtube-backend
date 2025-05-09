import { Router } from "express";
import { logoutUser, registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// now since we want to do file handling when userregisters on our site, we will use multer middleware which will get active when ever we have any image, video, files in our request.

// so new user will upload avatar and coverImage

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
userRouter.route("/login").post(loginUser);

//secured route
userRouter.route("/logout").post(verifyJWT, logoutUser);

export default userRouter;
