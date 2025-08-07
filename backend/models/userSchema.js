import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import e from "express";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "first name must contain at least 3 characters"]
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "last name must contain at least 3 characters"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate : [validator.isEmail,"please provide a valid email"]
        
    },
    phone: {
        type: String,
        required: true,
        minLength: [11, "phone number must contain exact 11 digits"],
        maxLength: [11, "phone number must contain exact 11 digits"],
    },
    nic: {
        type: String,
        required: true,
        minLength: [13, "NIC number must contain atleast 13 characters"],
        maxLength: [13, "NIC number must contain exact 13 characters"],
    },
    dob: {
        type: Date,
        required: [true, "DOB is required"],
    },
    gender:{
        type: String,
        required: true,
        enum: ["male", "female", "other"],
    },
    password:{
        type : String,
        minLength: [8, "password must contain at least 8 characters"],
        required: true,
        select: false 
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin", "Doctor", "Patient"],
      
    },
    doctorDepartment:{
        type: String,
    },
    doctorAvatar:{
        public_id : String,
        url : String,
    }

});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};  

 userSchema.methods.generateJsonWebToken = function() {
    return jwt.sign({id : this._id},process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES,
    });
 };


export const User = mongoose.model("User",userSchema) 