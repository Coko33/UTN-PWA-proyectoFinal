const bd = require("./../utils/bd");
const T = require("./../utils/schemas");

const getAll = async () => {
  const bandas = await bd(`${T.BANDAS}`)
    .where({ habilitado: false })
    .andWhere({ eliminado: false })
    .select(
      "id",
      "nombre",
      "descripcion",
      "año_inicio",
      "año_fin",
      "genero",
      "ciudadId",
      "ts_create"
    );
  const fotosBandas = await bd(`${T.IMAGENES_BANDAS}`)
    .where({ habilitado: false })
    .select("id", "bandaId", "uid", "titulo", "descripcion", "ts_create");
  const mensajesBandas = await bd(`${T.MENSAJES}`)
    .where({ habilitado: false })
    .select("id", "bandaId", "nombre", "mail", "mensaje", "ts_create");
  const festivales = await bd(`${T.FESTIVALES}`)
    .where({ habilitado: false })
    .select("*");
  const lugares = await bd(`${T.LUGARES}`)
    .where({ habilitado: false })
    .select("*");
  return { bandas, fotosBandas, mensajesBandas, festivales, lugares };
};

module.exports = { getAll };
