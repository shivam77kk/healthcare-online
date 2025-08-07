import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js"; 

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_data,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address,
    } = req.body;

    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !appointment_data ||
        !department ||
        !doctor_firstName ||
        !doctor_lastName ||
        !hasVisited ||
        !address
    ) {
        return next(new ErrorHandler("Please fill all form", 400));
    }
    const isconflict = await Appointment.findOne({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "doctor",
        doctorDepartment: department,

    })
    if (isconflict.length === 0) {
        return next(new ErrorHandler("Doctor not found", 404));
    }
    if (isconflict.length > 1) {
        return next(new ErrorHandler("Doctor conflict please contact through email or phone",
            404)
        );
    }
   const doctorId = isconflict[0]._id;
   const patientId = req.user._id;
  const appointment = await Appointment.create({
    firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_data,
        department,
        doctor:{
            firstName: doctor_firstName,
            lastName: doctor_lastName,
        },
        hasVisited,
        address,
        doctorId,
        patientId
  });

   res.status(200).json({
       success: true,
       message: "Appointment sent successfully",
   });
});
