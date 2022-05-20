const bd = require("./../utils/bd");
const T = require("./../utils/schemas");
const { upload } = require("./../utils/s3");
const { checkCiudad, createCiudad } = require("./../models/ciudades");

const getAll = async ({ limit, offset }) => {
  try {
    const [cantidad] = await bd(`${T.BANDAS} as b`)
      .where({ "b.habilitado": true })
      .count("b.habilitado as habilitados");

    const data = await bd({
      b: bd(`${T.BANDAS} as b`)
        .where({ "b.habilitado": true })
        .join(`${T.CIUDADES} as c`, "b.ciudadId", "c.id")
        .select(
          "b.id",
          "b.nombre",
          "b.descripcion",
          "b.año_inicio",
          "b.año_fin",
          "b.genero",
          "c.nombre as ciudad",
          "c.provinciaId"
        )
        .join(`${T.PROVINCIAS} as p`, "c.provinciaId", "p.id")
        .select("p.nombre as provincia")
        .orderBy("b.nombre")
        .limit(limit)
        .offset(offset),
    })
      .select(
        "b.id",
        "b.nombre",
        "b.descripcion",
        "b.año_inicio",
        "b.año_fin",
        "b.genero",
        "b.ciudad",
        "b.provincia"
      )
      .leftJoin(`${T.IMAGENES_BANDAS} as i_b`, "i_b.bandaId", "b.id")
      .select(
        "i_b.uid",
        "i_b.titulo as titulo_foto",
        "i_b.descripcion as descripcion_foto",
        "i_b.habilitado as ib_habilitado"
      )
      .leftJoin(`${T.FESTIVALES_BANDAS} as f_b`, "f_b.bandaId", "b.id")
      .leftJoin(`${T.FESTIVALES} as f`, "f.id", "f_b.festivalId")
      .select("f.nombre as festival")
      .leftJoin(`${T.LUGARES_BANDAS} as l_b`, "l_b.bandaId", "b.id")
      .leftJoin(`${T.LUGARES} as l`, "l.id", "l_b.lugarId")
      .select("l.nombre as lugar")
      .leftJoin(`${T.BANDAS_MUSICOS} as b_m`, "b_m.bandaId", "b.id")
      .leftJoin(`${T.MUSICOS} as m`, "m.id", "b_m.musicoId")
      .select("m.nombre as nombre_musico", "m.instrumento")
      .leftJoin(`${T.DISCOS} as d`, "b.id", "d.bandaId")
      .select("d.nombre as nombre_disco", "d.año as año_disco")
      .leftJoin(`${T.AUDIOS} as au`, "b.id", "au.bandaId")
      .select(
        "au.link as au_link",
        "au.titulo as au_titulo",
        "au.descripcion as au_descripcion"
      )
      .leftJoin(`${T.VIDEOS} as vi`, "b.id", "vi.bandaId")
      .select(
        "vi.link as vi_link",
        "vi.titulo as vi_titulo",
        "vi.descripcion as vi_descripcion"
      )
      .leftJoin(`${T.CANCIONES} as can`, "b.id", "can.bandaId")
      .select("can.canciones as canciones")
      .leftJoin(`${T.MENSAJES} as m_b`, "m_b.bandaId", "b.id")
      .select(
        "m_b.id as mb_id",
        "m_b.habilitado as mb_habilitado",
        "m_b.nombre as mb_nombre",
        "m_b.mail as mb_mail",
        "m_b.mensaje as mb_mensaje",
        "m_b.ts_create as mb_date"
      )
      .where({ "m.habilitado": true });

    const bandas = [];

    await data.forEach((banda) => {
      const bandaIndex = bandas.findIndex((el) => el.id === banda.id);
      if (bandaIndex !== -1) {
        const resultBanda = bandas[bandaIndex];
        const {
          uid,
          titulo_foto,
          descripcion_foto,
          ib_habilitado,
          festival,
          lugar,
          nombre_musico,
          instrumento,
          nombre_disco,
          año_disco,
          au_link,
          au_titulo,
          au_descripcion,
          vi_link,
          vi_titulo,
          vi_descripcion,
          mb_id,
          mb_habilitado,
          mb_nombre,
          mb_mensaje,
          mb_mail,
          mb_date,
        } = banda;
        const date = new Date(mb_date);
        const dateString = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        resultBanda.fotos.push({
          uid,
          titulo_foto,
          descripcion_foto,
          ib_habilitado,
        });
        resultBanda.festivales.push(festival);
        resultBanda.lugares.push(lugar);
        resultBanda.musicos.push({ nombre_musico, instrumento });
        resultBanda.discos.push({ nombre_disco, año_disco });
        resultBanda.audios.push({ au_link, au_titulo, au_descripcion });
        resultBanda.videos.push({ vi_link, vi_titulo, vi_descripcion });
        resultBanda.mensajes.push({
          mb_id,
          mb_habilitado,
          mb_nombre,
          mb_mensaje,
          mb_mail,
          dateString,
        });
        bandas[bandaIndex] = resultBanda;
      } else {
        const {
          id,
          nombre,
          descripcion,
          año_inicio,
          año_fin,
          genero,
          ciudad,
          provincia,
          uid,
          titulo_foto,
          descripcion_foto,
          ib_habilitado,
          festival,
          lugar,
          nombre_musico,
          instrumento,
          nombre_disco,
          año_disco,
          au_id,
          au_link,
          au_titulo,
          au_descripcion,
          vi_link,
          vi_titulo,
          vi_descripcion,
          canciones,
          mb_id,
          mb_habilitado,
          mb_nombre,
          mb_mensaje,
          mb_mail,
          mb_date,
        } = banda;
        const date = new Date(mb_date);
        const dateString = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        bandas.push({
          id,
          nombre,
          descripcion,
          año_inicio,
          año_fin,
          genero,
          ciudad,
          provincia,
          fotos: {
            uid: banda.uid,
            titulo_foto: banda.titulo_foto,
            descripcion_foto: banda.descripcion_foto,
            habilitado: banda.ib_habilitado,
          }
            ? [{ uid, titulo_foto, descripcion_foto, ib_habilitado }]
            : null,

          festivales: { festival } ? [festival] : null,
          lugares: { lugar } ? [lugar] : null,
          musicos: {
            nombre: banda.nombre_musico,
            instrumento: banda.instrumento,
          }
            ? [{ nombre_musico, instrumento }]
            : null,
          discos: {
            nombre: banda.nombre_disco,
            año: banda.año_disco,
          }
            ? [{ nombre_disco, año_disco }]
            : null,
          audios: {
            link: banda.au_link,
            titulo: banda.au_titulo,
            descripcion: banda.au_descripcion,
          }
            ? [{ au_id, au_link, au_titulo, au_descripcion }]
            : null,
          videos: {
            link: banda.vi_link,
            titulo: banda.vi_titulo,
            descripcion: banda.vi_descripcion,
          }
            ? [{ vi_link, vi_titulo, vi_descripcion }]
            : null,
          canciones,
          mensajes: {
            id: banda.mb_id,
            habilitado: banda.mb_habilitado,
            nombre: banda.mb_nombre,
            mensaje: banda.mb_mensaje,
            mail: banda.mb_mail,
            date: banda.mb_date,
          }
            ? [
                {
                  mb_id,
                  mb_habilitado,
                  mb_nombre,
                  mb_mensaje,
                  mb_mail,
                  dateString,
                },
              ]
            : null,
        });
      }
    });

    bandas.forEach((f) => {
      let hash = {};
      const unicos = f.fotos.filter((o) =>
        hash[o.uid] ? false : (hash[o.uid] = true)
      );
      const habilitados = unicos.filter((hab) => hab.ib_habilitado === 1);
      !habilitados[0] || habilitados[0].uid === null
        ? (f.fotos = [])
        : (f.fotos = habilitados);
    });

    bandas.forEach((f) => {
      const unicos = f.festivales.filter((festival, i) => {
        return f.festivales.indexOf(festival) === i;
      });
      unicos[0] === null ? (f.festivales = []) : (f.festivales = unicos);
    });

    bandas.forEach((f) => {
      const unicos = f.lugares.filter((lugar, i) => {
        return f.lugares.indexOf(lugar) === i;
      });
      unicos[0] === null ? (f.lugares = []) : (f.lugares = unicos);
    });

    bandas.forEach((f) => {
      let hash = {};
      const unicos = f.musicos.filter((o) =>
        hash[o.nombre_musico] ? false : (hash[o.nombre_musico] = true)
      );
      unicos[0].nombre_musico === null
        ? (f.musicos = [])
        : (f.musicos = unicos);
    });

    bandas.forEach((f) => {
      let hash = {};
      const unicos = f.discos.filter((o) =>
        hash[o.nombre_disco] ? false : (hash[o.nombre_disco] = true)
      );
      unicos[0].nombre_disco === null ? (f.discos = []) : (f.discos = unicos);
    });

    bandas.forEach((f) => {
      let hash = {};
      const unicos = f.audios.filter((o) =>
        hash[o.au_link] ? false : (hash[o.au_link] = true)
      );
      unicos[0].au_link === null ? (f.audios = []) : (f.audios = unicos);
    });

    bandas.forEach((f) => {
      let hash = {};
      const unicos = f.videos.filter((o) =>
        hash[o.vi_link] ? false : (hash[o.vi_link] = true)
      );
      unicos[0].vi_link === null ? (f.videos = []) : (f.videos = unicos);
    });

    bandas.forEach((f) => {
      hash = {};
      const unicos = f.mensajes.filter((o) =>
        hash[o.mb_id] ? false : (hash[o.mb_id] = true)
      );
      const habilitados = unicos.filter((hab) => hab.mb_habilitado === 1);
      !habilitados[0] || habilitados[0].mb_id === null
        ? (f.mensajes = [])
        : (f.mensajes = habilitados);
    });

    return { bandas, cantidad };
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
      .join(`${T.BANDAS} as b`, "c.id", "b.ciudadId")
      .where({ "b.habilitado": true })
      .count("b.habilitado as habilitados");

    const data = await bd({
      b: bd(`${T.CIUDADES} as c`)
        .where({
          "c.provinciaId": idProv.id,
        })
        .join(`${T.BANDAS} as b`, "c.id", "b.ciudadId")
        .where({ "b.habilitado": true })
        .select(
          "b.id",
          "b.nombre",
          "b.descripcion",
          "b.año_inicio",
          "b.año_fin",
          "b.genero",
          "c.nombre as ciudad",
          "c.provinciaId"
        )
        .join(`${T.PROVINCIAS} as p`, "c.provinciaId", "p.id")
        .select("p.nombre as provincia")
        .orderByRaw("b.nombre")
        .limit(limit)
        .offset(offset),
    })
      .select(
        "b.id",
        "b.nombre",
        "b.descripcion",
        "b.año_inicio",
        "b.año_fin",
        "b.genero",
        "b.ciudad",
        "b.provincia"
      )
      .leftJoin(`${T.IMAGENES_BANDAS} as i_b`, "i_b.bandaId", "b.id")
      .select(
        "i_b.uid",
        "i_b.titulo as titulo_foto",
        "i_b.descripcion as descripcion_foto",
        "i_b.habilitado as ib_habilitado"
      )
      .leftJoin(`${T.FESTIVALES_BANDAS} as f_b`, "f_b.bandaId", "b.id")
      .leftJoin(`${T.FESTIVALES} as f`, "f.id", "f_b.festivalId")
      .select("f.nombre as festival")
      .leftJoin(`${T.LUGARES_BANDAS} as l_b`, "l_b.bandaId", "b.id")
      .leftJoin(`${T.LUGARES} as l`, "l.id", "l_b.lugarId")
      .select("l.nombre as lugar")
      .leftJoin(`${T.BANDAS_MUSICOS} as b_m`, "b_m.bandaId", "b.id")
      .leftJoin(`${T.MUSICOS} as m`, "m.id", "b_m.musicoId")
      .select("m.nombre as nombre_musico", "m.instrumento")
      .leftJoin(`${T.DISCOS} as d`, "b.id", "d.bandaId")
      .select("d.nombre as nombre_disco", "d.año as año_disco")
      .leftJoin(`${T.AUDIOS} as au`, "b.id", "au.bandaId")
      .select(
        "au.link as au_link",
        "au.titulo as au_titulo",
        "au.descripcion as au_descripcion"
      )
      .leftJoin(`${T.VIDEOS} as vi`, "b.id", "vi.bandaId")
      .select(
        "vi.link as vi_link",
        "vi.titulo as vi_titulo",
        "vi.descripcion as vi_descripcion"
      )
      .leftJoin(`${T.CANCIONES} as can`, "b.id", "can.bandaId")
      .select("can.canciones as canciones")
      .leftJoin(`${T.MENSAJES} as m_b`, "m_b.bandaId", "b.id")
      .select(
        "m_b.id as mb_id",
        "m_b.habilitado as mb_habilitado",
        "m_b.nombre as mb_nombre",
        "m_b.mail as mb_mail",
        "m_b.mensaje as mb_mensaje",
        "m_b.ts_create as mb_date"
      );
    const bandas = [];
    await data.forEach((banda) => {
      const bandaIndex = bandas.findIndex((el) => el.id === banda.id);
      if (bandaIndex !== -1) {
        const resultBanda = bandas[bandaIndex];
        const {
          uid,
          titulo_foto,
          descripcion_foto,
          ib_habilitado,
          festival,
          lugar,
          nombre_musico,
          instrumento,
          nombre_disco,
          año_disco,
          au_link,
          au_titulo,
          au_descripcion,
          vi_link,
          vi_titulo,
          vi_descripcion,
          mb_id,
          mb_habilitado,
          mb_nombre,
          mb_mensaje,
          mb_mail,
          mb_date,
        } = banda;
        var date = new Date(mb_date);
        const dateString = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        resultBanda.fotos.push({
          uid,
          titulo_foto,
          descripcion_foto,
          ib_habilitado,
        });
        resultBanda.festivales.push(festival);
        resultBanda.lugares.push(lugar);
        resultBanda.musicos.push({ nombre_musico, instrumento });
        resultBanda.discos.push({ nombre_disco, año_disco });
        resultBanda.audios.push({ au_link, au_titulo, au_descripcion });
        resultBanda.videos.push({ vi_link, vi_titulo, vi_descripcion });
        resultBanda.mensajes.push({
          mb_id,
          mb_habilitado,
          mb_nombre,
          mb_mensaje,
          mb_mail,
          dateString,
        });
        bandas[bandaIndex] = resultBanda;
      } else {
        const {
          id,
          nombre,
          descripcion,
          año_inicio,
          año_fin,
          genero,
          ciudad,
          provincia,
          uid,
          titulo_foto,
          descripcion_foto,
          ib_habilitado,
          festival,
          lugar,
          nombre_musico,
          instrumento,
          nombre_disco,
          año_disco,
          au_link,
          au_titulo,
          au_descripcion,
          vi_link,
          vi_titulo,
          vi_descripcion,
          canciones,
          mb_id,
          mb_habilitado,
          mb_nombre,
          mb_mensaje,
          mb_mail,
          mb_date,
        } = banda;
        var date = new Date(mb_date);
        const dateString = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        bandas.push({
          id,
          nombre,
          descripcion,
          año_inicio,
          año_fin,
          genero,
          ciudad,
          provincia,
          fotos: {
            uid: banda.uid,
            titulo_foto: banda.titulo_foto,
            descripcion_foto: banda.descripcion_foto,
            habilitado: banda.ib_habilitado,
          }
            ? [{ uid, titulo_foto, descripcion_foto, ib_habilitado }]
            : null,
          festivales: { festival } ? [festival] : null,
          lugares: { lugar } ? [lugar] : null,
          musicos: {
            nombre: banda.nombre_musico,
            instrumento: banda.instrumento,
          }
            ? [{ nombre_musico, instrumento }]
            : null,
          discos: {
            nombre: banda.nombre_disco,
            año: banda.año_disco,
          }
            ? [{ nombre_disco, año_disco }]
            : null,
          audios: {
            link: banda.au_link,
            titulo: banda.au_titulo,
            descripcion: banda.au_descripcion,
          }
            ? [{ au_link, au_titulo, au_descripcion }]
            : null,
          videos: {
            link: banda.vi_link,
            titulo: banda.vi_titulo,
            descripcion: banda.vi_descripcion,
          }
            ? [{ vi_link, vi_titulo, vi_descripcion }]
            : null,
          canciones,
          mensajes: {
            id: banda.mb_id,
            habilitado: banda.mb_habilitado,
            nombre: banda.mb_nombre,
            mensaje: banda.mb_mensaje,
            mail: banda.mb_mail,
            date: banda.mb_date,
          }
            ? [
                {
                  mb_id,
                  mb_habilitado,
                  mb_nombre,
                  mb_mensaje,
                  mb_mail,
                  dateString,
                },
              ]
            : null,
        });
      }
    });

    bandas.forEach((f) => {
      let hash = {};
      const unicos = f.fotos.filter((o) =>
        hash[o.uid] ? false : (hash[o.uid] = true)
      );
      const habilitados = unicos.filter((hab) => hab.ib_habilitado === 1);
      !habilitados[0] || habilitados[0].uid === null
        ? (f.fotos = [])
        : (f.fotos = habilitados);
    });

    bandas.forEach((f) => {
      const unicos = f.festivales.filter((festival, i) => {
        return f.festivales.indexOf(festival) === i;
      });
      unicos[0] === null ? (f.festivales = []) : (f.festivales = unicos);
    });

    bandas.forEach((f) => {
      const unicos = f.lugares.filter((lugar, i) => {
        return f.lugares.indexOf(lugar) === i;
      });
      unicos[0] === null ? (f.lugares = []) : (f.lugares = unicos);
    });

    bandas.forEach((f) => {
      let hash = {};
      const unicos = f.musicos.filter((o) =>
        hash[o.nombre_musico] ? false : (hash[o.nombre_musico] = true)
      );
      unicos[0].nombre_musico === null
        ? (f.musicos = [])
        : (f.musicos = unicos);
    });

    bandas.forEach((f) => {
      let hash = {};
      const unicos = f.discos.filter((o) =>
        hash[o.nombre_disco] ? false : (hash[o.nombre_disco] = true)
      );
      unicos[0].nombre_disco === null ? (f.discos = []) : (f.discos = unicos);
    });

    bandas.forEach((f) => {
      let hash = {};
      const unicos = f.audios.filter((o) =>
        hash[o.au_link] ? false : (hash[o.au_link] = true)
      );
      unicos[0].au_link === null ? (f.audios = []) : (f.audios = unicos);
    });

    bandas.forEach((f) => {
      let hash = {};
      const unicos = f.videos.filter((o) =>
        hash[o.vi_link] ? false : (hash[o.vi_link] = true)
      );
      unicos[0].vi_link === null ? (f.videos = []) : (f.videos = unicos);
    });

    bandas.forEach((f) => {
      hash = {};
      const unicos = f.mensajes.filter((o) =>
        hash[o.mb_id] ? false : (hash[o.mb_id] = true)
      );
      const habilitados = unicos.filter((hab) => hab.mb_habilitado === 1);
      !habilitados[0] || habilitados[0].mb_id === null
        ? (f.mensajes = [])
        : (f.mensajes = habilitados);
    });

    return { bandas, cantidad };
  } catch (e) {
    throw e;
  }
};

const getById = async (id) => {
  const [banda] = await bd(`${T.BANDAS} as b`)
    .where({ "b.habilitado": true })
    .andWhere({ "b.id": id })
    .join(`${T.CIUDADES} as c`, "b.ciudadId", "c.id")
    .join(`${T.PROVINCIAS} as p`, "c.provinciaId", "p.id")
    .select(
      "b.id",
      "b.nombre",
      "c.nombre as ciudad",
      "p.nombre as provincia",
      "b.descripcion",
      "b.año_inicio",
      "b.año_fin",
      "b.genero"
    );

  if (banda) {
    musicos = await bd(`${T.MUSICOS} as m`)
      .join(`${T.BANDAS_MUSICOS} as b_m`, "m.id", "b_m.musicoId")
      .where({ bandaId: banda.id })
      .select("m.nombre", "m.instrumento");

    fotos = await bd(`${T.IMAGENES_BANDAS} as i_b`)
      .where({ bandaId: banda.id })
      .select("i_b.uid", "i_b.titulo", "i_b.descripcion");

    festivales = await bd(`${T.FESTIVALES_BANDAS} as f_b`)
      .join(`${T.FESTIVALES} as f`, "f.id", "festivalId")
      .where({ bandaId: banda.id })
      .select("f.nombre");

    lugares = await bd(`${T.LUGARES_BANDAS} as l_b`)
      .join(`${T.LUGARES} as l`, "l.id", "lugarId")
      .where({ bandaId: banda.id })
      .select("l.nombre");

    audios = await bd(`${T.AUDIOS} as au`)
      .where({ bandaId: banda.id })
      .select("au.link", "au.titulo", "au.descripcion");

    videos = await bd(`${T.VIDEOS} as vi`)
      .where({ bandaId: banda.id })
      .select("vi.link", "vi.titulo", "vi.descripcion");

    canciones = await bd(`${T.CANCIONES} as can`)
      .where({ bandaId: banda.id })
      .select("can.canciones as canciones");

    return {
      banda,
      musicos,
      fotos,
      festivales,
      lugares,
      audios,
      videos,
      canciones,
    };
  } else {
    return { mensaje: `no existe la banda con el id ${id}` };
  }
};

const getForEdit = async (id) => {
  const [banda] = await bd(`${T.BANDAS} as b`)
    .where({ "b.id": id })
    .select(
      "b.id",
      "b.nombre",
      "b.descripcion",
      "b.año_inicio",
      "b.año_fin",
      "b.genero"
    );

  if (banda) {
    musicos = await bd(`${T.MUSICOS} as m`)
      .join(`${T.BANDAS_MUSICOS} as b_m`, "m.id", "b_m.musicoId")
      .where({ bandaId: banda.id })
      .select("m.id", "m.nombre", "m.instrumento");

    fotos = await bd(`${T.IMAGENES_BANDAS} as i_b`)
      .where({ bandaId: banda.id })
      .select("i_b.uid", "i_b.titulo", "i_b.descripcion");

    festivales = await bd(`${T.FESTIVALES_BANDAS} as f_b`)
      .join(`${T.FESTIVALES} as f`, "f.id", "festivalId")
      .where({ bandaId: banda.id })
      .select("f.id", "f.nombre");

    lugares = await bd(`${T.LUGARES_BANDAS} as l_b`)
      .join(`${T.LUGARES} as l`, "l.id", "lugarId")
      .where({ bandaId: banda.id })
      .select("l.id", "l.nombre");

    audios = await bd(`${T.AUDIOS} as au`)
      .where({ bandaId: banda.id })
      .select("au.id", "au.link", "au.titulo", "au.descripcion");

    videos = await bd(`${T.VIDEOS} as vi`)
      .where({ bandaId: banda.id })
      .select("vi.link", "vi.link", "vi.titulo", "vi.descripcion");

    canciones = await bd(`${T.CANCIONES} as can`)
      .where({ bandaId: banda.id })
      .select("can.id", "can.canciones as canciones");

    return {
      banda,
      musicos,
      fotos,
      festivales,
      lugares,
      audios,
      videos,
      canciones,
    };
  } else {
    return { mensaje: `no existe la banda con el id ${id}` };
  }
};

const getByName = async (nombre) => {
  const [banda] = await bd(`${T.BANDAS} as b`)
    .where({ habilitado: true })
    .andWhere({ nombre: nombre })
    .select(
      "b.id",
      "b.nombre",
      "b.descripcion",
      "b.año_inicio",
      "b.año_fin",
      "b.genero"
    );
  if (banda) {
    fotos = await bd(`${T.IMAGENES_BANDAS}`)
      .where({ bandaId: banda.id })
      .select("uid");

    festivales = await bd(`${T.FESTIVALES_BANDAS} as f_b`)
      .join(`${T.FESTIVALES} as f`, "f.id", "festivalId")
      .where({ bandaId: banda.id })
      .select("f.nombre");

    lugares = await bd(`${T.LUGARES_BANDAS} as l_b`)
      .join(`${T.LUGARES} as l`, "l.id", "lugarId")
      .where({ bandaId: banda.id })
      .select("l.nombre");

    audios = await bd(`${T.AUDIOS} as au`)
      .where({ bandaId: banda.id })
      .select("au.link", "au.titulo", "au.descripcion");

    videos = await bd(`${T.VIDEOS} as vi`)
      .where({ bandaId: banda.id })
      .select("vi.link", "vi.titulo", "vi.descripcion");

    canciones = await bd(`${T.CANCIONES} as can`)
      .where({ bandaId: banda.id })
      .select("can.canciones as canciones");

    return { banda, fotos, festivales, lugares, audios, videos, canciones };
  } else {
    return { mensaje: `no existe la banda con el nombre ${nombre}` };
  }
};

const getBandasPoints = async (provincia) => {
  try {
    if (provincia) {
      const [idProv] = await bd(`${T.PROVINCIAS}`)
        .where({ nombre: provincia })
        .select("id");
      const bandas = await bd(`${T.CIUDADES} as c`)
        .where({
          "c.provinciaId": idProv.id,
        })
        .join(`${T.BANDAS} as b`, "b.ciudadId", "c.id")
        .select("b.id", "b.nombre", "c.lat", "c.lon as lng");
      return bandas;
    } else {
      const bandas = await bd(`${T.BANDAS} as b`)
        .where({ "b.habilitado": true })
        .join(`${T.CIUDADES} as c`, "c.id", "b.ciudadId")
        .select("b.id", "b.nombre", "c.lat", "c.lon as lng");
      return bandas;
    }
  } catch (e) {
    throw e;
  }
};

const createBanda = async (ciudadNorm, objBanda) => {
  try {
    const [idCiudad] = await checkCiudad(ciudadNorm.nombre);
    if (!idCiudad) {
      const [ciudadId] = await createCiudad(ciudadNorm);
      const bandaId = await bd(`${T.BANDAS}`).insert({ ...objBanda, ciudadId });
      return bandaId;
    } else {
      const bandaId = await bd(`${T.BANDAS}`).insert({
        ...objBanda,
        ciudadId: idCiudad.id,
      });
      return bandaId;
    }
  } catch (e) {
    throw e;
  }
};

const modifyBanda = async (id, ciudadNorm, objBanda) => {
  try {
    if (!ciudadNorm) {
      await bd(`${T.BANDAS}`).where({ id }).update(objBanda);
    } else {
      const [idCiudad] = await checkCiudad(ciudadNorm.nombre);
      if (!idCiudad) {
        const [ciudadId] = await createCiudad(ciudadNorm);
        await bd(`${T.BANDAS}`)
          .where({ id })
          .update({ ...objBanda, ciudadId });
      } else {
        await bd(`${T.BANDAS}`)
          .where({ id })
          .update({ ...objBanda, ciudadId: idCiudad.id });
      }
    }
  } catch (e) {
    throw e;
  }
};

const modifyImagenBanda = async (id, objImagenBanda) => {
  try {
    await bd(`${T.IMAGENES_BANDAS}`).where({ id }).update(objImagenBanda);
  } catch (e) {
    throw e;
  }
};
const modifyMensajeBanda = async (id, objMensajeBanda) => {
  try {
    await bd(`${T.MENSAJES}`).where({ id }).update(objMensajeBanda);
  } catch (e) {
    throw e;
  }
};

const createImages = async (obj, uid, mimetype) => {
  await bd(`${T.IMAGENES_BANDAS}`).insert(obj);
  await upload(uid, mimetype);
};

const createF_Banda = (obj) => bd(`${T.FESTIVALES_BANDAS}`).insert(obj);
const createL_Banda = (obj) => bd(`${T.LUGARES_BANDAS}`).insert(obj);

module.exports = {
  getAll,
  getById,
  getForEdit,
  getByName,
  getByProvincia,
  getBandasPoints,
  createBanda,
  modifyBanda,
  modifyImagenBanda,
  modifyMensajeBanda,
  createImages,
  createF_Banda,
  createL_Banda,
};
