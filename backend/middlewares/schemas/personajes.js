const Joi = require("@hapi/joi");

const schemas = {
  create: Joi.object().keys({
    nombre: Joi.string().min(2).max(45).required(),
    descripcion: Joi.string().min(2).max(45).required(),
    bio: Joi.string().min(2).max(255).optional(),
    rol: Joi.string().min(2).max(45).optional(),
    estrellas: Joi.number().integer().positive().min(0).max(5),
    ciudad: Joi.string().min(2).max(45).required(),
    provincia: Joi.string().min(2).max(45).required(),
  }),
  modify: Joi.object().keys({
    id: Joi.number().integer().positive().required(),
    nombre: Joi.string().min(2).max(45).optional(),
    descripcion: Joi.string().min(2).max(45).optional(),
    bio: Joi.string().min(2).max(255).optional(),
    rol: Joi.string().min(2).max(45).optional(),
    estrellas: Joi.number().integer().positive().min(0).max(5),
    ciudad: Joi.string().min(2).max(45).optional(),
    provincia: Joi.string().min(2).max(45).optional(),
  }),
};

module.exports = { schemas };
