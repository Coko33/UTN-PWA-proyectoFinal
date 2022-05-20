const bd = require("./../utils/bd");
const T = require("./../utils/schemas");
const service = require("./../models/lugares");

const getLugar = async (nombre, descripcion, ciudadNorm) => {
  try {
    const id = await bd(`${T.LUGARES}`)
      .where({ habilitado: true, nombre })
      .select("id");
    if (id.length != 0) {
      return id;
    } else {
      let id = await service.create(ciudadNorm, { nombre, descripcion });
      [id] = id;
      return id;
    }
  } catch (e) {
    throw e;
  }
};

module.exports = { getLugar };
