const bd = require("../utils/bd");
const T = require("../utils/schemas");
const { upload } = require("../utils/s3");

const create = async (obj) => {
  try {
    const mensajeId = await bd(`${T.MENSAJES_LUGARES}`).insert(obj);
    return mensajeId;
  } catch (e) {
    throw e;
  }
};

const createImages = async (obj, uid, mimetype) => {
  console.log(obj, uid);
  await bd(`${T.IMAGENES_LUGARES}`).insert(obj);
  await upload(uid, mimetype);
};

module.exports = { create, createImages };
