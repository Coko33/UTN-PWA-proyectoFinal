const bd = require("../utils/bd");
const T = require("../utils/schemas");

const create = async (bandaId, video) => {
  try {
    const videoId = await bd(`${T.VIDEOS}`).insert({ ...video, bandaId });
    return videoId;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  create,
};
