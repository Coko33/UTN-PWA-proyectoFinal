const bd = require("./../utils/bd");
const T = require("./../utils/schemas");
const { imgFile } = require("./../utils/fileHandler");
const { upload } = require("./../utils/s3");
const { checkCiudad, createCiudad } = require("./ciudades");

const getAll = async ({ limit, offset }) => {
  try {
    const [cantidad] = await bd(`${T.LUGARES} as l`)
      .where({ "l.habilitado": true })
      .count("l.habilitado as habilitados");

    const data = await bd({
      l: bd(`${T.LUGARES} as l`)
        .where({ "l.habilitado": true })
        .join(`${T.CIUDADES} as c`, "l.ciudadId", "c.id")
        .select(
          "l.id",
          "l.nombre",
          "l.descripcion",
          "c.nombre as ciudad",
          "c.provinciaId"
        )
        .join(`${T.PROVINCIAS} as p`, "c.provinciaId", "p.id")
        .select("p.nombre as provincia")
        .orderBy("l.nombre")
        .limit(limit)
        .offset(offset),
    })
      .select(
        "l.id as id",
        "l.nombre as nombre",
        "l.descripcion",
        "l.ciudad",
        "l.provincia"
      )
      .leftJoin(`${T.IMAGENES_LUGARES} as i_l`, "i_l.lugarId", "l.id")
      .select(
        "i_l.uid",
        "i_l.titulo as titulo_foto",
        "i_l.descripcion as descripcion_foto",
        "i_l.habilitado as il_habilitado"
      )
      .leftJoin(`${T.FESTIVALES} as f`, "f.lugarId", "l.id")
      .select("f.id as f_id", "f.nombre as f_nombre")
      .leftJoin(`${T.MENSAJES_LUGARES} as m_l`, "m_l.lugarId", "l.id")
      .select(
        "m_l.id as ml_id",
        "m_l.habilitado as ml_habilitado",
        "m_l.nombre as ml_nombre",
        "m_l.mail as ml_mail",
        "m_l.mensaje as ml_mensaje",
        "m_l.ts_create as ml_date"
      );

    const lugares = [];

    await data.forEach((lugar) => {
      const lugarIndex = lugares.findIndex((el) => el.id === lugar.id);

      if (lugarIndex !== -1) {
        const resultLugar = lugares[lugarIndex];
        const {
          uid,
          titulo_foto,
          descripcion_foto,
          il_habilitado,
          ml_id,
          ml_habilitado,
          ml_nombre,
          ml_mensaje,
          ml_mail,
          ml_date,
          f_id,
          f_nombre,
        } = lugar;
        const date = new Date(ml_date);
        const dateString = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        resultLugar.fotos.push({
          uid,
          titulo_foto,
          descripcion_foto,
          il_habilitado,
        });
        resultLugar.mensajes.push({
          ml_id,
          ml_habilitado,
          ml_nombre,
          ml_mensaje,
          ml_mail,
          dateString,
        });
        resultLugar.festivales.push({
          f_id,
          f_nombre,
        });
        lugares[lugarIndex] = resultLugar;
      } else {
        const {
          id,
          nombre,
          descripcion,
          ciudad,
          provincia,
          uid,
          titulo_foto,
          descripcion_foto,
          il_habilitado,
          ml_id,
          ml_habilitado,
          ml_nombre,
          ml_mensaje,
          ml_mail,
          ml_date,
          f_id,
          f_nombre,
        } = lugar;
        const date = new Date(ml_date);
        const dateString = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        lugares.push({
          id,
          nombre,
          descripcion,
          ciudad,
          provincia,
          fotos: {
            uid: lugar.uid,
            titulo_foto: lugar.titulo_foto,
            descripcion_foto: lugar.descripcion_foto,
            habilitado: lugar.il_habilitado,
          }
            ? [{ uid, titulo_foto, descripcion_foto, il_habilitado }]
            : null,
          festivales: {
            id: lugar.f_id,
            nombre: lugar.f_nombre,
          }
            ? [{ f_id, f_nombre }]
            : null,
          mensajes: {
            id: lugar.ml_id,
            habilitado: lugar.ml_habilitado,
            nombre: lugar.ml_nombre,
            mensaje: lugar.ml_mensaje,
            mail: lugar.ml_mail,
            date: lugar.ml_date,
          }
            ? [
                {
                  ml_id,
                  ml_habilitado,
                  ml_nombre,
                  ml_mensaje,
                  ml_mail,
                  dateString,
                },
              ]
            : null,
        });
      }
    });

    lugares.forEach((f) => {
      let hash = {};
      const unicos = f.fotos.filter((o) =>
        hash[o.uid] || o.il_habilitado === 0 ? false : (hash[o.uid] = true)
      );
      unicos[0].uid === null ? (f.fotos = []) : (f.fotos = unicos);
    });

    lugares.forEach((f) => {
      let hash = {};
      const unicos = f.festivales.filter((o) =>
        hash[o.f_id] ? false : (hash[o.f_id] = true)
      );
      unicos[0].f_id === null ? (f.festivales = []) : (f.festivales = unicos);
    });

    lugares.forEach((f) => {
      let hash = {};
      const unicos = f.mensajes.filter((o) =>
        hash[o.ml_id] || o.ml_habilitado === 0 ? false : (hash[o.ml_id] = true)
      );
      !unicos[0] || unicos[0].ml_id === null
        ? (f.mensajes = [])
        : (f.mensajes = unicos);
    });

    return { lugares, cantidad };
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
      .join(`${T.LUGARES} as l`, "c.id", "l.ciudadId")
      .where({ "l.habilitado": true })
      .count("l.habilitado as habilitados");

    const data = await bd({
      l: bd(`${T.CIUDADES} as c`)
        .where({
          "c.provinciaId": idProv.id,
        })
        .join(`${T.LUGARES} as l`, "c.id", "l.ciudadId")
        .where({ "l.habilitado": true })
        .select(
          "l.id",
          "l.nombre",
          "l.descripcion",
          "c.nombre as ciudad",
          "c.provinciaId"
        )
        .join(`${T.PROVINCIAS} as p`, "c.provinciaId", "p.id")
        .select("p.nombre as provincia")
        .orderByRaw("l.nombre")
        .limit(limit)
        .offset(offset),
    })
      .select("l.id", "l.nombre", "l.descripcion", "l.ciudad", "l.provincia")
      .leftJoin(`${T.IMAGENES_LUGARES} as i_l`, "i_l.lugarId", "l.id")
      .select(
        "i_l.uid",
        "i_l.titulo as titulo_foto",
        "i_l.descripcion as descripcion_foto",
        "i_l.habilitado as il_habilitado"
      )
      .leftJoin(`${T.MENSAJES_LUGARES} as m_l`, "m_l.lugarId", "l.id")
      .select(
        "m_l.id as ml_id",
        "m_l.habilitado as ml_habilitado",
        "m_l.nombre as ml_nombre",
        "m_l.mail as ml_mail",
        "m_l.mensaje as ml_mensaje",
        "m_l.ts_create as ml_date"
      )
      .leftJoin(`${T.FESTIVALES} as f`, "f.lugarId", "l.id")
      .select("f.id as f_id", "f.nombre as f_nombre");

    const lugares = [];

    await data.forEach((lugar) => {
      const lugarIndex = lugares.findIndex((el) => el.id === lugar.id);

      if (lugarIndex !== -1) {
        const resultLugar = lugares[lugarIndex];
        const {
          uid,
          titulo_foto,
          descripcion_foto,
          il_habilitado,
          ml_id,
          ml_habilitado,
          ml_nombre,
          ml_mensaje,
          ml_mail,
          ml_date,
          f_id,
          f_nombre,
        } = lugar;
        const date = new Date(ml_date);
        const dateString = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        resultLugar.fotos.push({
          uid,
          titulo_foto,
          descripcion_foto,
          il_habilitado,
        });
        resultLugar.mensajes.push({
          ml_id,
          ml_habilitado,
          ml_nombre,
          ml_mensaje,
          ml_mail,
          dateString,
        });
        resultLugar.festivales.push({
          f_id,
          f_nombre,
        });
        lugares[lugarIndex] = resultLugar;
      } else {
        const {
          id,
          nombre,
          descripcion,
          ciudad,
          provincia,
          uid,
          titulo_foto,
          descripcion_foto,
          il_habilitado,
          ml_id,
          ml_habilitado,
          ml_nombre,
          ml_mensaje,
          ml_mail,
          ml_date,
          f_id,
          f_nombre,
        } = lugar;
        const date = new Date(ml_date);
        const dateString = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        lugares.push({
          id,
          nombre,
          descripcion,
          ciudad,
          provincia,
          fotos: {
            uid: lugar.uid,
            titulo_foto: lugar.titulo_foto,
            descripcion_foto: lugar.descripcion_foto,
            habilitado: lugar.il_habilitado,
          }
            ? [{ uid, titulo_foto, descripcion_foto, il_habilitado }]
            : null,
          festivales: {
            id: lugar.f_id,
            nombre: lugar.f_nombre,
          }
            ? [{ f_id, f_nombre }]
            : null,
          mensajes: {
            id: lugar.ml_id,
            habilitado: lugar.ml_habilitado,
            nombre: lugar.ml_nombre,
            mensaje: lugar.ml_mensaje,
            mail: lugar.ml_mail,
            date: lugar.ml_date,
          }
            ? [
                {
                  ml_id,
                  ml_habilitado,
                  ml_nombre,
                  ml_mensaje,
                  ml_mail,
                  dateString,
                },
              ]
            : null,
        });
      }
    });

    lugares.forEach((f) => {
      let hash = {};
      const unicos = f.fotos.filter((o) =>
        hash[o.uid] || o.il_habilitado === 0 ? false : (hash[o.uid] = true)
      );
      unicos[0].uid === null ? (f.fotos = []) : (f.fotos = unicos);
    });

    lugares.forEach((f) => {
      let hash = {};
      const unicos = f.festivales.filter((o) =>
        hash[o.f_id] ? false : (hash[o.f_id] = true)
      );
      unicos[0].f_id === null ? (f.festivales = []) : (f.festivales = unicos);
    });

    lugares.forEach((f) => {
      let hash = {};
      const unicos = f.mensajes.filter((o) =>
        hash[o.ml_id] || o.ml_habilitado === 0 ? false : (hash[o.ml_id] = true)
      );
      !unicos[0] || unicos[0].ml_id === null
        ? (f.mensajes = [])
        : (f.mensajes = unicos);
    });

    return { lugares, cantidad };
  } catch (e) {
    throw e;
  }
};

const getLugaresPoints = async (provincia) => {
  try {
    if (provincia) {
      const [idProv] = await bd(`${T.PROVINCIAS}`)
        .where({ nombre: provincia })
        .select("id");
      const lugares = await bd(`${T.CIUDADES} as c`)
        .where({
          "c.provinciaId": idProv.id,
        })
        .join(`${T.LUGARES} as l`, "l.ciudadId", "c.id")
        .select("l.id", "l.nombre", "c.lat", "c.lon as lng");
      return lugares;
    } else {
      const lugares = await bd(`${T.LUGARES} as l`)
        .where({ "l.habilitado": true })
        .join(`${T.CIUDADES} as c`, "c.id", "l.ciudadId")
        .select("l.id", "l.nombre", "c.lat", "c.lon as lng");
      return lugares;
    }
  } catch (e) {
    throw e;
  }
};

const createImages = async (obj, uid, mimetype) => {
  try {
    await bd(`${T.IMAGENES_LUGARES}`).insert(obj);
    await upload(uid, mimetype);
  } catch (e) {
    throw e;
  }
};

const create = async (ciudadNorm, objLugar, refImagenes, files) => {
  try {
    const [idCiudad] = await checkCiudad(ciudadNorm.nombre);
    let lugarId;
    if (!idCiudad) {
      const [ciudadId] = await createCiudad(ciudadNorm);
      [lugarId] = await bd(`${T.LUGARES}`).insert({
        ...objLugar,
        ciudadId,
      });
    } else {
      [lugarId] = await bd(`${T.LUGARES}`).insert({
        ...objLugar,
        ciudadId: idCiudad.id,
      });
    }

    if (files) {
      const results = files.map((file, i) => {
        const uid = imgFile(file);
        const obj = {
          lugarId,
          uid,
          titulo: refImagenes[i].titulo,
          descripcion: refImagenes[i].descripcion,
        };
        const mimetype = file.mimetype;
        createImages(obj, uid, mimetype);
      });
      await Promise.all(results);
    }
    return lugarId;
  } catch (e) {
    throw e;
  }
};

const modify = async (id, ciudadNorm, objLugar) => {
  try {
    if (!ciudadNorm) {
      await bd(`${T.LUGARES}`).where({ id }).update(objLugar);
    } else {
      const [idCiudad] = await checkCiudad(ciudadNorm.nombre);
      if (!idCiudad) {
        const [ciudadId] = await createCiudad(ciudadNorm);
        await bd(`${T.LUGARES}`)
          .where({ id })
          .update({ ...objLugar, ciudadId });
      } else {
        await bd(`${T.LUGARES}`)
          .where({ id })
          .update({ ...objLugar, ciudadId: idCiudad.id });
      }
    }
  } catch (e) {
    throw e;
  }
};

const lugaresBandas = (obj) => bd(`${T.LUGARES_BANDAS}`).insert(obj);

module.exports = {
  getAll,
  getByProvincia,
  create,
  modify,
  lugaresBandas,
  getLugaresPoints,
};
