const Joi = require("@hapi/joi");
const musico = require("./musicos");

const schemas = {
  create: Joi.object().keys({
    nombre: Joi.string().min(2).max(45).required(),
    descripcion: Joi.string().min(5).max(400).optional(),
    año_inicio: Joi.number().integer().min(1960).max(2030).optional(),
    año_fin: Joi.number().integer().min(1960).max(2000).optional(),
    genero: Joi.string().min(2).max(45).optional(),
    ciudad: Joi.string().min(2).max(45).required(),
    provincia: Joi.string().min(2).max(45).required(),
    musicosArr: Joi.array().items(musico.schemas.create).optional(),
    imagenes: Joi.array().optional(),
  }),
  modify: Joi.object().keys({
    id: Joi.number().integer().positive().required(),
    nombre: Joi.string().min(2).max(45).optional(),
    descripcion: Joi.string().max(400).optional(),
    año_inicio: Joi.number().integer().min(1960).max(2030).optional(),
    año_fin: Joi.number().integer().min(1960).max(2030).optional(),
    genero: Joi.string().min(2).max(45).optional(),
    ciudad: Joi.string().min(2).max(45).optional(),
    provincia: Joi.string().min(2).max(45).optional(),
  }),
};

//schemas.create;
module.exports = { schemas };
