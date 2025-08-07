import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
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
   appointment_data: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    doctor:{
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        }
    },
    hasVisited: {
        type: Boolean,
       default: false
    },
    doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    patientId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);