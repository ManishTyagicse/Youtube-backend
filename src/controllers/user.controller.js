import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloundinary } from "../utils/cloudinary.service.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details
  //validation -not empty
  // check if user already exists: username, emial
  // check for images, check for avatar
  // upload to cloudinary
  // create user object
  //remove password from refresh token field from response
  //check for user creation
  //return res
  const { email, username, fullname, password } = req.body;
  console.log("email", email);

  // now we will do data validation

  /*  if (!username) {
    throw new Error("400,Username is required");
  } */

  // OR advance method

  if ([fullname, email, username, password].some((it) => it?.trim() === " ")) {
    throw new Error("400, all fields are necessary");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new Error("409, User with email or username already exists");
  }

  console.log(req.files);

  // the way express provides us req.body
  // multer gives us req.files option to get files in the request

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new Error("400, Avatar is required but not coverimage");
  }

  const avatar = await uploadOnCloundinary(avatarLocalPath);
  const coverImage = await uploadOnCloundinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // now in mongodb all the fields of user will be by default selected
  // to unselect them, we write this syntax
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new Error("500, Something went wrong while registering the user");
  }

  return res.status(201).json({
    apiResponse: 200,
    msg: "User registered Successfully",
    createdUser,
  });
});

export { registerUser };
