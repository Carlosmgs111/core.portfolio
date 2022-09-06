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

export const updateUserSchema = Joi.object({
  email:email.required(),
  privilege,
  password: password.required()
});

export const getUserSchema = Joi.object({
  email: email.required(),
  username,
  password: password.required(),
});
