const bd = require("./../utils/bd");
const T = require("./../utils/schemas");
const { imgFile } = require("./../utils/fileHandler");
const { upload } = require("./../utils/s3");

const getAll = () =>
  bd(`${T.FESTIVALES} as f`)
    .where({ "f.habilitado": true })
    .select(
      "f.nombre",
      "f.año",
      "f.edicion",
      "f.organizadores",
      "f.descripcion",
      "f.programacion"
    );

const getFestivalesPoints = async (provincia) => {
  try {
    if (provincia) {
      const [idProv] = await bd(`${T.PROVINCIAS}`)
        .where({ nombre: provincia })
        .select("id");
      const festivales = await bd(`${T.FESTIVALES} as f`)
        .join(`${T.LUGARES} as l`, "l.id", "f.lugarId")
        .join(`${T.CIUDADES} as c`, "c.id", "l.ciudadId")
        .where({
          "c.provinciaId": idProv.id,
        })
        .select("f.id", "f.nombre", "c.lat", "c.lon as lng");
      return festivales;
    } else {
      const festivales = await bd(`${T.FESTIVALES} as f`)
        .where({ "f.habilitado": true })
        .join(`${T.LUGARES} as l`, "l.id", "f.lugarId")
        .join(`${T.CIUDADES} as c`, "c.id", "l.ciudadId")
        .select("f.id", "f.nombre", "c.lat", "c.lon as lng");
      return festivales;
    }
  } catch (e) {
    throw e;
  }
};

const createImages = async (obj, uid, mimetype) => {
  try {
    await bd(`${T.IMAGENES_FESTIVALES}`).insert(obj);
    await upload(uid, mimetype);
  } catch (e) {
    throw e;
  }
};

const create = async (objFestival, files) => {
  try {
    const [festivalId] = await bd(`${T.FESTIVALES}`).insert(objFestival);

    if (files) {
      const results = files.map((file) => {
        const uid = imgFile(file);
        const obj = {
          festivalId,
          uid,
        };
        const mimetype = file.mimetype;
        createImages(obj, uid, mimetype);
      });
      await Promise.all(results);
    }
    return festivalId;
  } catch (e) {
    throw e;
  }
};

const modify = (id, obj) => bd(`${T.FESTIVALES}`).where({ id }).update(obj);

module.exports = {
  getAll,
  create,
  modify,
  getFestivalesPoints,
};
