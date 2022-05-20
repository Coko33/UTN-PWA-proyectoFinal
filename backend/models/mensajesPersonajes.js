const bd = require("../utils/bd");
const T = require("../utils/schemas");

const create = async (obj) => {
  try {
    const mensajeId = await bd(`${T.MENSAJES_PERSONAJES}`).insert(obj);
    return mensajeId;
  } catch (e) {
    throw e;
  }
};

module.exports = { create };
