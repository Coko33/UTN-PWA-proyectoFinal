const Joi = require("@hapi/joi");

const schemas = {
  create: Joi.object().keys({
    nombre: Joi.string().min(2).max(45).required(),
    instrumento: Joi.string().min(2).max(45).required(),
    bio: Joi.string().min(2).max(255).required(),
    ciudad: Joi.string().min(2).max(45).required(),
    provincia: Joi.string().min(2).max(45).required(),
  }),
  modify: Joi.object().keys({
    id: Joi.number().integer().positive().required(),
    nombre: Joi.string().min(2).max(45).optional(),
    instrumento: Joi.string().min(2).max(45).optional(),
    bio: Joi.string().min(2).max(255).optional(),
    ciudad: Joi.string().min(2).max(45).optional(),
    provincia: Joi.string().min(2).max(45).optional(),
  }),
};

module.exports = { schemas };
