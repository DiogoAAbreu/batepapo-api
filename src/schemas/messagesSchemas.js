import { text } from "express";
import Joi from "joi";

export const messageSchema = Joi.object({
    to: Joi.string().required(),
    text: Joi.string().required(),
    type: Joi.string().required()
})

export const putMessageSchema = Joi.object({
    from: Joi.string().required(),
    text: Joi.string().required(),
    to: Joi.string().required(),
    type: Joi.string().valid('message', 'private_message').required()
})