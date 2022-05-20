const Joi = require("@hapi/joi");

const schemas = {
  logIn: Joi.object().keys({
    usuario: Joi.string().min(5).max(20).required(),
    password: Joi.string().min(8).max(20).required(),
  }),
};

module.exports = { schemas };
