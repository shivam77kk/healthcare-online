import { User } from "../models/userSchema.js";

export const generateToken = (user, message, statusCode, res) => {

  console.log("user instanceof User:", user instanceof User);
  console.log("user.generateJsonWebToken:", user.generateJsonWebToken);

  const token = user.generateJsonWebToken(); 
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
