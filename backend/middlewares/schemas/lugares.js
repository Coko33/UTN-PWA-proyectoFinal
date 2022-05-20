const Joi = require("@hapi/joi");

const schemas = {
  create: Joi.object().keys({
    nombre: Joi.string().min(2).max(45).required(),
    descripcion: Joi.string().min(2).max(800).required(),
    año_inicio: Joi.number().min(1800).max(2100).optional(),
    año_fin: Joi.number().min(1800).max(2100).optional(),
    ciudad: Joi.string().min(2).max(45).required(),
    provincia: Joi.string().min(2).max(45).required(),
    imagenes: Joi.array()
      .items(
        Joi.object().keys({
          imagen: Joi.any(),
          titulo: Joi.string().min(2).max(45).optional(),
          descripcion: Joi.string().min(2).max(255).optional(),
        })
      )
      .optional(),
  }),
  modify: Joi.object().keys({
    id: Joi.number().integer().positive().required(),
    nombre: Joi.string().min(2).max(45).optional(),
    descripcion: Joi.string().min(2).max(800).optional(),
    año_inicio: Joi.number().min(1800).max(2100).optional(),
    año_fin: Joi.number().min(1800).max(2100).optional(),
    ciudad: Joi.string().min(2).max(45).optional(),
    provincia: Joi.string().min(2).max(45).optional(),
  }),
};

module.exports = { schemas };
