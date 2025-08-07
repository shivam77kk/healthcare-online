import express from 'express';
import { postAppointment } from '../controller/appointmentController.js    ';
const router = express.Router();

router.post("/post", postAppointment);

export default router;