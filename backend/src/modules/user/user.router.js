import express from "express";
import { signin, signup } from "./user.controller.js";
import { signInSchema, signUpSchema } from "./user.validation.js";
import { validation } from "../../middleware/validation.js";

const userRoter = express.Router();

userRoter.post("/signup", validation(signUpSchema), signup);
userRoter.post("/signin", validation(signInSchema), signin);

export default userRoter;
