const bd = require("./../utils/bd");
const T = require("./../utils/schemas");

const create = async (bandaId, disco) => {
  try {
    const discoId = await bd(`${T.DISCOS}`).insert({ ...disco, bandaId });
    return discoId;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  create,
};
