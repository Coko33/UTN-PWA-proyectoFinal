const bd = require("./../utils/bd");
const T = require("./../utils/schemas");

const create = async (bandaId, objAudio) => {
  try {
    const audioId = await bd(`${T.AUDIOS}`).insert({ ...objAudio, bandaId });
    return audioId;
  } catch (e) {
    throw e;
  }
};

const modify = async (id, objAudio) => {
  try {
    const audioId = await bd(`${T.AUDIOS}`).where({ id }).update(objAudio);
    return audioId;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  create,
  modify,
};
