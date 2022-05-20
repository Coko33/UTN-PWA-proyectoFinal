const model = require("./../models/mensajes");
const { imgFile } = require("./../utils/fileHandler");

const create = async (objMsj, files) => {
  try {
    if (!files) {
      const [mensajeId] = await model.create(objMsj);
      return mensajeId;
    }
    if (files) {
      const results = await Promise.all(
        files.map(async (file, i) => {
          const uid = imgFile(file);
          const obj = {
            bandaId: objMsj[i].bandaId,
            titulo: objMsj[i].titulo,
            descripcion: objMsj[i].descripcion,
            uid,
          };
          const mimetype = file.mimetype;
          await model.createImages(obj, uid, mimetype);
        })
      );
      return objMsj[0].bandaId;
    }
  } catch (e) {
    throw e;
  }
};

module.exports = { create };
