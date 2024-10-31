import Joi from 'joi';

export const participantsSchema = Joi.object({
    name: Joi.string().required(),
})