// both req and res have the methods of middleware
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("401, unathorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const findUser = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!findUser) {
      throw new Error("401, Invalid access token");
    }

    //since it is a middleware
    //we can add findUser to the req
    // similar to req.body

    req.findUser = findUser;
    next();
  } catch (error) {
    throw new Error(error);
  }
});

export { verifyJWT };
