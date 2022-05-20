const bd = require("./../utils/bd");
const T = require("./../utils/schemas");
const { upload } = require("./../utils/s3");

const getAll = async () => {
  const mensajesFotos = await bd(`${T.MENSAJES} as m`)
    .where({ "m.habilitado": true })
    .join(`${T.IMAGENES_MENSAJES} as i_m`, "i_m.mensajeId", "m.id")
    .select(
      "m.id",
      "m.nombre",
      "m.mail",
      "m.mensaje",
      "i_m.uid as fotos",
      "m.ts_create as fecha"
    );

  let entradas = [];
  mensajesFotos.map((mF) => {
    if (!entradas.hasOwnProperty(mF.id)) {
      entradas[mF.id] = {
        id: mF.id,
        nombre: mF.nombre,
        mail: mF.mail,
        mensaje: mF.mensaje,
        fecha: mF.fecha,
        fotos: [],
      };
    }
    entradas[mF.id].fotos.push(mF.fotos);
  });
  entradas = entradas.filter((el) => el);

  return entradas;
};

const create = async (obj) => {
  try {
    const mensajeId = await bd(`${T.MENSAJES}`).insert(obj);
    return mensajeId;
  } catch (e) {
    throw e;
  }
};

const createImages = async (obj, uid, mimetype) => {
  await bd(`${T.IMAGENES_BANDAS}`).insert(obj);
  await upload(uid, mimetype);
};

module.exports = { create, createImages, getAll };
