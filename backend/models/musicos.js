const bd = require("./../utils/bd");
const T = require("./../utils/schemas");
const { checkCiudad, createCiudad } = require("./../models/ciudades");

const getAll = () =>
  bd(`${T.MUSICOS} as m`)
    .where({ "m.habilitado": true })
    .join(`${T.CIUDADES} as c`, "c.id", "ciudadId")
    .select(
      "m.id as id",
      "m.nombre as nombre",
      "bio",
      "instrumento",
      "c.nombre as ciudad"
    );

const getSingle = (id) =>
  bd(`${T.MUSICOS}`)
    .where({ id, habilitado: true })
    .select("id", "nombre", "bio", "instrumento");

const create = async (ciudadNorm, objMusico) => {
  try {
    const [idCiudad] = await checkCiudad(ciudadNorm.nombre);
    let [musicoId] = await bd(`${T.MUSICOS} as m`)
      .where({ nombre: objMusico.nombre })
      .andWhere({ ciudadId: idCiudad.id })
      .select("id");
    if (!musicoId) {
      if (!idCiudad) {
        const [ciudadId] = await createCiudad(ciudadNorm);
        musicoId = await bd(`${T.MUSICOS}`).insert({
          ...objMusico,
          ciudadId,
        });
        return musicoId;
      } else {
        musicoId = await bd(`${T.MUSICOS}`).insert({
          ...objMusico,
          ciudadId: idCiudad.id,
        });
        return musicoId;
      }
    } else {
      return [musicoId.id];
    }
  } catch (e) {
    throw e;
  }
};

const modify = async (id, ciudadNorm, objMusico) => {
  try {
    if (!ciudadNorm) {
      await bd(`${T.MUSICOS}`).where({ id }).update(objMusico);
    } else {
      const [idCiudad] = await checkCiudad(ciudadNorm.nombre);
      if (!idCiudad) {
        const [ciudadId] = await createCiudad(ciudadNorm);
        await bd(`${T.MUSICOS}`)
          .where({ id })
          .update({ ...objMusico, ciudadId });
      } else {
        await bd(`${T.MUSICOS}`)
          .where({ id })
          .update({ ...objMusico, ciudadId: idCiudad.id });
      }
    }
  } catch (e) {
    throw e;
  }
};

const createBandasMusicos = (obj) => bd(`${T.BANDAS_MUSICOS}`).insert(obj);

module.exports = {
  getAll,
  getSingle,
  create,
  modify,
  createBandasMusicos,
};
