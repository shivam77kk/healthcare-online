import express from "express";
import {addNewDoctor, logoutPatient, logoutAdmin, getAllDoctors, addNewAdmin, login, patientRegister, getUserDetails } from "../controller/userController.js";
import {isAdminAuthenticated, isPatientAuthenticated} from "../middlewares/auth.js";
import { get } from "mongoose";
const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew", isAdminAuthenticated,addNewAdmin);
router.get("/doctors", getAllDoctors);
router.get("/admin/me", isAdminAuthenticated , getUserDetails );
router.get("/patient/me", isPatientAuthenticated , getUserDetails );
router.get("/admin/logout", isAdminAuthenticated , logoutAdmin );
router.get("/patient/logout", isPatientAuthenticated , logoutPatient );
router.post("/doctor/addnew", isAdminAuthenticated , addNewDoctor );

export default router;