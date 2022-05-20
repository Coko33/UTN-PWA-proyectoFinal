const Joi = require("@hapi/joi");

const schemas = {
  create: Joi.object().keys({
    nombre: Joi.string().min(2).max(45).required(),
    edicion: Joi.string().min(2).max(45).optional(),
    año: Joi.number().integer().positive().min(1970).max(2000).optional(),
    descripcion: Joi.string().min(2).max(255).optional(),
    nombre_lugar: Joi.string().min(2).max(45).optional(),
    descripcion_lugar: Joi.string().min(2).max(45).optional(),
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
    edicion: Joi.string().min(2).max(45).optional(),
    año: Joi.number().integer().positive().min(1970).max(2000).optional(),
    descripcion: Joi.string().min(2).max(255).optional(),
    nombre_lugar: Joi.string().min(2).max(45).optional(),
    descripcion_lugar: Joi.string().min(2).max(45).optional(),
    ciudad: Joi.string().min(2).max(45).optional(),
    provincia: Joi.string().min(2).max(45).optional(),
  }),
};

module.exports = { schemas };
