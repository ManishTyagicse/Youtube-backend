import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.service.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const findUser = await User.findById(userId);
    const accessToken = findUser.generateAccessToken();
    const refreshToken = findUser.generateRefreshToken();

    // this updates the refreshtoken field in the model
    findUser.refreshToken = refreshToken;
    await findUser.save({ validateBeforeSave: false });
    // this will save without the validation of password

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("500, error while generating the access and refresh token");
  }
};

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
  const avatar = "";
  const coverImage = "";
  // the way express provides us req.body
  // multer gives us req.files option to get files in the request

  /*  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path; */

  /*let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  console.log("Avatar path:", avatarLocalPath);

  if (!avatarLocalPath) {
    throw new Error("400, Avatar is required but not coverimage");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new Error("400, Avatar file is required");
  } */

  const user = await User.create({
    fullname,
    avatar: avatar?.url || "",
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

const loginUser = asyncHandler(async (req, res) => {
  // get user data
  //username and email
  // find the user
  // match password
  // access and refresh tokken generation
  // sending cookies

  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new Error("400, username or email is required");
  }

  const findUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!findUser) {
    throw new Error("404, User not found");
  }

  const isValidPassword = await findUser.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new Error("401, Password is wrong");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    findUser._id
  );

  const loggedInUser = await User.findOne(findUser._id).select(
    "-passwod -refreshToken"
  );

  const cookieOptions = {
    httpOnly: true, // now only server can modify cookies
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      statusCode: 200,
      user: loggedInUser,
      accessToken,
      refreshToken,
      msg: "User logged in successfully",
    });
});

const logoutUser = asyncHandler(async (req, res) => {
  // how to logout a user
  // what actually happens
  // 1. clear cookies
  // 2. reset refresh token
  //but we don't have user available in the logout process
  // therefore a middleware, that has access to user

  await User.findByIdAndUpdate(
    req.findUser._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({
      statusCode: 200,
      msg: "User logged out successfully",
    });
});

export { registerUser, loginUser, logoutUser };
