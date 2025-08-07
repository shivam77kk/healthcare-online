import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import {ErrorHandler} from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
const { 
    firstName,
     lastName, 
     email, 
     phone, 
     password, 
     gender, 
     dob, 
     nic, 
     role
    } = req.body;
    if(
     !firstName ||
     !lastName || 
     !email || 
     !phone || 
     !password || 
     !gender || 
     !dob || 
     !nic || 
     !role
    ){
        return next(new ErrorHandler("Please enter all fields", 400));
    }
    let user = await User.findOne({ email });
    if(user){
        return next(new ErrorHandler("User already registered", 400));
    }
    user = await User.create({
     firstName,
     lastName, 
     email, 
     phone, 
     password, 
     gender, 
     dob, 
     nic, 
     role
    });
    generateToken(user, "User registered",200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const {email, password, confirmPassword, role} = req.body;
    if(!email || !password || !confirmPassword || !role){
        return next(new ErrorHandler("Please provide all details", 400));
    }if(password !== confirmPassword){
        return next(new ErrorHandler("Password and confirmPassword do not match", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    const ispasswordMatched = await user.comparePassword(password);
    if(!ispasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    if(role !== user.role){
        return next(new ErrorHandler("User with this role not found", 400));
    }
      generateToken(user, "User logged in successfully",200, res);
 });

 export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { 
    firstName,
    lastName, 
    email, 
    phone, 
    password, 
    gender, 
    dob, 
    nic, 
  } = req.body;

  if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  const isRegistered = await User.findOne({ email });

  if (isRegistered) {
    return next(new ErrorHandler(`${isRegistered.role} with this email already exists`, 400));
  }

  const admin = await User.create({
    firstName,
    lastName, 
    email, 
    phone, 
    password, 
    gender, 
    dob, 
    nic, 
    role: "Admin",
  });

  // ✅ Send token + response
  generateToken(admin, "New Admin created successfully", 201, res);
});
