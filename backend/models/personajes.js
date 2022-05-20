const bd = require("./../utils/bd");
const T = require("./../utils/schemas");
const { checkCiudad, createCiudad } = require("./ciudades");

const getAll = async ({ limit, offset }) => {
  try {
    const [cantidad] = await bd(`${T.PERSONAJES} as p`)
      .where({ "p.habilitado": true })
      .count("p.habilitado as habilitados");

    const data = await bd({
      p: bd(`${T.PERSONAJES} as p`)
        .where({ "p.habilitado": true })
        .join(`${T.CIUDADES} as c`, "p.ciudadId", "c.id")
        .select(
          "p.id",
          "p.nombre",
          "p.rol",
          "p.descripcion",
          "p.bio",
          "c.nombre as ciudad",
          "c.provinciaId"
        )
        .join(`${T.PROVINCIAS} as prov`, `c.provinciaId`, "prov.id")
        .select("prov.nombre as provincia")
        .orderBy("p.nombre")
        .limit(limit)
        .offset(offset),
    })
      .select(
        "p.id",
        "p.nombre",
        "p.rol",
        "p.descripcion",
        "p.bio",
        "p.ciudad",
        "p.provincia"
      )
      .leftJoin(`${T.MENSAJES_PERSONAJES} as m_p`, "m_p.personajeId", "p.id")
      .select(
        "m_p.id as mp_id",
        "m_p.habilitado as mp_habilitado",
        "m_p.nombre as mp_nombre",
        "m_p.mail as mp_mail",
        "m_p.mensaje as mp_mensaje",
        "m_p.ts_create as mp_date"
      );

    const personajes = [];

    await data.forEach((personaje) => {
      const personajeIndex = personajes.findIndex(
        (el) => el.id === personaje.id
      );

      if (personajeIndex !== -1) {
        const resultPersonaje = personajes[personajeIndex];
        const {
          mp_id,
          mp_habilitado,
          mp_nombre,
          mp_mensaje,
          mp_mail,
          mp_date,
        } = personaje;
        const date = new Date(mp_date);
        const dateString = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        resultPersonaje.mensajes.push({
          mp_id,
          mp_habilitado,
          mp_nombre,
          mp_mensaje,
          mp_mail,
          dateString,
        });
        personajes[personajeIndex] = resultPersonaje;
      } else {
        const {
          id,
          nombre,
          rol,
          descripcion,
          bio,
          ciudad,
          provincia,
          mp_id,
          mp_habilitado,
          mp_nombre,
          mp_mensaje,
          mp_mail,
          mp_date,
        } = personaje;
        const date = new Date(mp_date);
        const dateString = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        personajes.push({
          id,
          nombre,
          rol,
          descripcion,
          bio,
          ciudad,
          provincia,
          mensajes: {
            id: personaje.mp_id,
            habilitado: personaje.ml_habilitado,
            nombre: personaje.mp_nombre,
            mensaje: personaje.mp_mensaje,
            mail: personaje.mp_mail,
            date: personaje.ml_date,
          }
            ? [
                {
                  mp_id,
                  mp_habilitado,
                  mp_nombre,
                  mp_mensaje,
                  mp_mail,
                  dateString,
                },
              ]
            : null,
        });
      }
    });

    personajes.forEach((f) => {
      hash = {};
      const unicos = f.mensajes.filter((o) =>
        hash[o.mp_id] || o.mp_habilitado === 0 ? false : (hash[o.mp_id] = true)
      );
      !unicos[0] || unicos[0].mp_id === null
        ? (f.mensajes = [])
        : (f.mensajes = unicos);
    });

    return { personajes, cantidad };
  } catch (e) {
    throw e;
  }
};

const getByProvincia = async ({ limit, offset, provincia }) => {
  try {
    const [idProv] = await bd(`${T.PROVINCIAS}`)
      .where({ nombre: provincia })
      .select("id");

    const [cantidad] = await bd(`${T.CIUDADES} as c`)
      .where({
        "c.provinciaId": idProv.id,
      })
      .join(`${T.PERSONAJES} as p`, "c.id", "p.ciudadId")
      .where({ "p.habilitado": true })
      .count("p.habilitado as habilitados");

    const data = await bd({
      p: bd(`${T.CIUDADES} as c`)
        .where({
          "c.provinciaId": idProv.id,
        })
        .join(`${T.PERSONAJES} as p`, "c.id", "p.ciudadId")
        .where({ "p.habilitado": true })
        .select(
          "p.id",
          "p.nombre",
          "p.rol",
          "p.descripcion",
          "p.bio",
          "c.nombre as ciudad",
          "c.provinciaId"
        )
        .join(`${T.PROVINCIAS} as prov`, `c.provinciaId`, "prov.id")
        .select("prov.nombre as provincia")
        .orderBy("p.nombre")
        .limit(limit)
        .offset(offset),
    })
      .select(
        "p.id",
        "p.nombre",
        "p.rol",
        "p.descripcion",
        "p.bio",
        "p.ciudad",
        "p.provincia"
      )
      .leftJoin(`${T.MENSAJES_PERSONAJES} as m_p`, "m_p.personajeId", "p.id")
      .select(
        "m_p.id as mp_id",
        "m_p.habilitado as mp_habilitado",
        "m_p.nombre as mp_nombre",
        "m_p.mail as mp_mail",
        "m_p.mensaje as mp_mensaje",
        "m_p.ts_create as mp_date"
      );

    const personajes = [];

    await data.forEach((personaje) => {
      const personajeIndex = personajes.findIndex(
        (el) => el.id === personaje.id
      );

      if (personajeIndex !== -1) {
        const resultPersonaje = personajes[personajeIndex];
        const {
          mp_id,
          mp_habilitado,
          mp_nombre,
          mp_mensaje,
          mp_mail,
          mp_date,
        } = personaje;
        const date = new Date(mp_date);
        const dateString = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        resultPersonaje.mensajes.push({
          mp_id,
          mp_habilitado,
          mp_nombre,
          mp_mensaje,
          mp_mail,
          dateString,
        });
        personajes[personajeIndex] = resultPersonaje;
      } else {
        const {
          id,
          nombre,
          rol,
          descripcion,
          bio,
          ciudad,
          provincia,
          mp_id,
          mp_habilitado,
          mp_nombre,
          mp_mensaje,
          mp_mail,
          mp_date,
        } = personaje;
        const date = new Date(mp_date);
        const dateString = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        personajes.push({
          id,
          nombre,
          rol,
          descripcion,
          bio,
          ciudad,
          provincia,
          mensajes: {
            id: personaje.mp_id,
            habilitado: personaje.ml_habilitado,
            nombre: personaje.mp_nombre,
            mensaje: personaje.mp_mensaje,
            mail: personaje.mp_mail,
            date: personaje.ml_date,
          }
            ? [
                {
                  mp_id,
                  mp_habilitado,
                  mp_nombre,
                  mp_mensaje,
                  mp_mail,
                  dateString,
                },
              ]
            : null,
        });
      }
    });

    personajes.forEach((f) => {
      hash = {};
      const unicos = f.mensajes.filter((o) =>
        hash[o.mp_id] || o.mp_habilitado === 0 ? false : (hash[o.mp_id] = true)
      );
      !unicos[0] || unicos[0].mp_id === null
        ? (f.mensajes = [])
        : (f.mensajes = unicos);
    });

    return { personajes, cantidad };
  } catch (e) {
    throw e;
  }
};

const getPersonajesPoints = async (provincia) => {
  try {
    if (provincia) {
      const [idProv] = await bd(`${T.PROVINCIAS}`)
        .where({ nombre: provincia })
        .select("id");
      const personajes = await bd(`${T.CIUDADES} as c`)
        .where({
          "c.provinciaId": idProv.id,
        })
        .join(`${T.PERSONAJES} as p`, "p.ciudadId", "c.id")
        .select("p.id", "p.nombre", "c.lat", "c.lon as lng");
      return personajes;
    } else {
      const personajes = await bd(`${T.PERSONAJES} as p`)
        .where({ "p.habilitado": true })
        .join(`${T.CIUDADES} as c`, "c.id", "p.ciudadId")
        .select("p.id", "p.nombre", "c.lat", "c.lon as lng");
      return personajes;
    }
  } catch (e) {
    throw e;
  }
};

const create = async (ciudadNorm, objPersonaje) => {
  try {
    const [idCiudad] = await checkCiudad(ciudadNorm.nombre);
    if (!idCiudad) {
      const [ciudadId] = await createCiudad(ciudadNorm);
      const personajeId = await bd(`${T.PERSONAJES}`).insert({
        ...objPersonaje,
        ciudadId,
      });
      return personajeId;
    } else {
      const [personajeId] = await bd(`${T.PERSONAJES}`).insert({
        ...objPersonaje,
        ciudadId: idCiudad.id,
      });
      return personajeId;
    }
  } catch (e) {
    throw e;
  }
};

const modify = async (id, ciudadNorm, objPersonaje) => {
  try {
    if (!ciudadNorm) {
      await bd(`${T.PERSONAJES}`).where({ id }).update(objPersonaje);
    } else {
      const [idCiudad] = await checkCiudad(ciudadNorm.nombre);
      if (!idCiudad) {
        const [ciudadId] = await createCiudad(ciudadNorm);
        await bd(`${T.PERSONAJES}`)
          .where({ id })
          .update({ ...objPersonaje, ciudadId });
      } else {
        await bd(`${T.PERSONAJES}`)
          .where({ id })
          .update({ ...objPersonaje, ciudadId: idCiudad.id });
      }
    }
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getAll,
  getByProvincia,
  getPersonajesPoints,
  create,
  modify,
};
