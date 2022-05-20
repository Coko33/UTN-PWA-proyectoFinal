const bd = require("./../utils/bd");
const T = require("./../utils/schemas");

const create = async (bandaId, cancion) => {
  try {
    const cancionId = await bd(`${T.CANCIONES}`).insert({
      ...cancion,
      bandaId,
    });
    return cancionId;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  create,
};
