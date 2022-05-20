const bd = require("./../utils/bd");
const T = require("./../utils/schemas");

const getAll = () =>
  bd(`${T.CIUDADES} as c`)
    .where({ "c.habilitado": true })
    .join(`${T.PROVINCIAS} as p`, "p.id", "provinciaId")
    .select(
      "c.id",
      "c.nombre",
      "c.lat",
      "c.lon as lng",
      "p.nombre as provincia"
    );

const checkCiudad = (nombre) =>
  bd(`${T.CIUDADES} as c`).where({ "c.nombre": nombre }).select("id");

const getCiudadesPoints = async (provincia) => {
  try {
    if (provincia) {
      const [idProv] = await bd(`${T.PROVINCIAS} as p`)
        .where({ nombre: provincia })
        .select("p.id");
      const ciudades = await bd(`${T.CIUDADES} as c`)
        .where({
          "c.provinciaId": idProv.id,
        })
        .select("c.id", "c.nombre as ciudad", "c.lat", "c.lon as lng");
      return ciudades;
    } else {
      const ciudades = await bd(`${T.CIUDADES} as c`)
        .where({ "c.habilitado": true })
        .join(`${T.PROVINCIAS} as p`, "p.id", "provinciaId")
        .select(
          "c.id",
          "c.nombre as ciudad",
          "p.nombre as provincia",
          "c.lat",
          "c.lon as lng"
        );
      return ciudades;
    }
  } catch (e) {
    throw e;
  }
};

const createCiudad = async (ciudadNorm) => {
  try {
    const [provinciaId] = await bd(`${T.PROVINCIAS} as p`)
      .where("p.nombre", ciudadNorm.provincia)
      .select("id");
    delete ciudadNorm.provincia;
    return await bd(`${T.CIUDADES}`)
      .insert({ ...ciudadNorm, provinciaId: provinciaId.id })
      .select("id");
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getAll,
  getCiudadesPoints,
  createCiudad,
  checkCiudad,
};
