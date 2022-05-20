const model = require("./../models/bandas");
const { imgFile } = require("./../utils/fileHandler");

const createBanda = async (ciudadNorm, objBanda, refImagenes, files) => {
  try {
    const [bandaId] = await model.createBanda(ciudadNorm, objBanda);
    if (files) {
      const results = files.map((file, i) => {
        const uid = imgFile(file);
        const obj = {
          bandaId,
          uid,
          titulo: refImagenes[i].titulo,
          descripcion: refImagenes[i].descripcion,
        };
        const mimetype = file.mimetype;
        model.createImages(obj, uid, mimetype);
      });
      await Promise.all(results);
    }
    return bandaId;
  } catch (e) {
    throw e;
  }
};

const add = async (bandaId, files, titulos, descripciones) => {
  try {
    const results = files.map((file, i) => {
      const uid = imgFile(file);
      const obj = {
        bandaId,
        uid,
        titulo: titulos[i],
        descripcion: descripciones[i],
      };
      const mimetype = file.mimetype;
      model.createImages(obj, uid, mimetype);
    });
    await Promise.all(results);

    return bandaId;
  } catch (e) {
    throw e;
  }
};

module.exports = { createBanda, add };
