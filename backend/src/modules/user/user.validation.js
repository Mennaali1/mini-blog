import joi from "joi";

export const signUpSchema = joi.object({
  name: joi.string().min(2).max(20).required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  rePassword: joi.ref("password"),
});
export const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});
