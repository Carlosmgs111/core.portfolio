import Joi from "joi";

const username  = Joi.string()
const email = Joi.string().email()
const password =  Joi.string()
const privilege = Joi.string()

export const createUserSchema = Joi.object({
  email:email.required(),
  username:username.required(),
  password: password.required(),
  privilege,
})