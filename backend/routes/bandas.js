const express = require("express");
const router = express.Router();
const {
  getAll,
  getByName,
  getById,
  getForEdit,
  getByProvincia,
  modifyBanda,
  modifyImagenBanda,
  modifyMensajeBanda,
  createF_Banda,
  createL_Banda,
} = require("./../models/bandas");
const { getCiudad } = require("./../services/ciudades");
const service = require("./../services/bandas");
const serviceMusicos = require("./../models/musicos");
const serviceDiscos = require("./../models/discos");
const serviceAudios = require("./../models/audios");
const serviceVideos = require("./../models/videos");
const { validateCreate, validateModify } = require("./../middlewares/bandas");
const multer = require("multer");
const config = { dest: "./public/tmp" };
const upload = multer(config);

const all = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.size);
    const offset = page ? page * limit : 0;
    const bandas = await getAll({ limit, offset });
    const count = bandas.cantidad.habilitados;
    const totalPages = Math.ceil(count / limit);
    res.json({ ...bandas, totalPages: totalPages });
  } catch (e) {
    res.status(500).json(e);
  }
};

const single = (req, res) =>
  getById(req.params.id)
    .then((response) => res.json(response))
    .catch((e) => res.status(500).json(e));

const forEdit = (req, res) =>
  getForEdit(req.params.id)
    .then((response) => res.json(response))
    .catch((e) => res.status(500).json(e));

const name = (req, res) =>
  getByName(req.body.nombre)
    .then((response) => res.json(response))
    .catch((e) => res.status(500).json(e));

const provincia = async (req, res) => {
  try {
    const { provincia } = req.params;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.size);
    const offset = page ? page * limit : 0;
    const bandas = await getByProvincia({ limit, offset, provincia });
    const count = bandas.cantidad.habilitados;
    const totalPages = Math.ceil(count / limit);
    res.json({ ...bandas, totalPages: totalPages });
  } catch (e) {
    res.status(500).json(e);
  }
};

const create = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      año_inicio,
      año_fin,
      genero,
      ciudad,
      provincia,
    } = req.body;

    let { infoImagenes } = req.body;
    if (infoImagenes != undefined) {
      infoImagenes = JSON.parse(infoImagenes);
    }

    const objBanda = {
      nombre,
      descripcion,
      año_inicio: parseInt(año_inicio) || null,
      año_fin: parseInt(año_fin) || null,
      genero,
    };

    const objFiles = req.files;
    const ciudadNorm = await getCiudad(ciudad, provincia);
    const bandaId = await service.createBanda(
      ciudadNorm,
      objBanda,
      infoImagenes,
      objFiles
    );

    let { arrMusicos } = req.body;
    if (arrMusicos) {
      arrMusicos = JSON.parse(arrMusicos);
      await Promise.all(
        arrMusicos.map(async (musico) => {
          const [musicoId] = await serviceMusicos.create(ciudadNorm, musico);
          await serviceMusicos.createBandasMusicos({ musicoId, bandaId });
          console.log(musicoId);
          return musicoId;
        })
      );
    } else {
      const musicoId = [];
      return musicoId;
    }

    let { arrDiscos } = req.body;
    if (arrDiscos) {
      arrDiscos = JSON.parse(arrDiscos);
      await Promise.all(
        arrDiscos.map(async (disco) => {
          const [discoId] = await serviceDiscos.create(bandaId, disco);
          return discoId;
        })
      );
    } else {
      const discoId = [];
      return discoId;
    }

    let { arrAudios } = req.body;
    if (arrAudios) {
      arrAudios = JSON.parse(arrAudios);
      await Promise.all(
        arrAudios.map(async (audio) => {
          const [audioId] = await serviceAudios.create(bandaId, audio);
          return audioId;
        })
      );
    } else {
      const audioId = [];
      return audioId;
    }

    let { arrVideos } = req.body;
    if (arrVideos) {
      arrVideos = JSON.parse(arrVideos);
      await Promise.all(
        arrVideos.map(async (video) => {
          const [videoId] = await serviceVideos.create(bandaId, video);
          return videoId;
        })
      );
    } else {
      const videoId = [];
      return videoId;
    }

    const result = { banda: bandaId };
    res.json(result);
  } catch (e) {
    e.sql
      ? res.status(422).json({ code: e.code, errno: e.errno })
      : res.status(500).json(e);
  }
};

const modify = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      nombre,
      descripcion,
      ao_inicio,
      año_fin,
      genero,
      ciudad,
      provincia,
      habilitado,
      eliminado,
    } = req.body;

    const objBanda = {
      nombre,
      descripcion,
      ao_inicio,
      año_fin,
      genero,
      habilitado,
      eliminado,
    };

    if (!ciudad) {
      const result = await modifyBanda(id, ciudad, objBanda);
      res.json(result);
    } else {
      const ciudadNorm = await getCiudad(ciudad, provincia);
      const result = await modifyBanda(id, ciudadNorm, objBanda);
      res.json(result);
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

const modifyImgBnd = async (req, res) => {
  try {
    const id = req.params.id;
    const { bandaId, uid, titulo, descripcion, habilitado } = req.body;
    const objImagenBanda = {
      bandaId,
      uid,
      titulo,
      descripcion,
      habilitado,
    };
    const result = await modifyImagenBanda(id, objImagenBanda);
    res.json(result);
  } catch {
    res.status(500).json(e);
  }
};

const modifyMsgBnd = async (req, res) => {
  try {
    const id = req.params.id;
    const { bandaId, nombre, email, mensaje, habilitado } = req.body;
    const objMensajeBanda = {
      bandaId,
      nombre,
      email,
      mensaje,
      habilitado,
    };
    const result = await modifyMensajeBanda(id, objMensajeBanda);
    res.json(result);
  } catch {
    res.status(500).json(e);
  }
};

const addFotos = async (req, res) => {
  try {
    const objFiles = req.files;
    const { titulo, descripcion } = req.body;
    const id = req.params.id;
    const result = await service.add(id, objFiles, titulo, descripcion);
    res.json(result);
  } catch (e) {
    res.status(500).json(e);
  }
};

const createBandaFestival = async (req, res) => {
  try {
    const { festivalId, bandaId } = req.body;
    const obj = { festivalId, bandaId };
    const [result] = await createF_Banda(obj);
    res.json(result);
  } catch (e) {
    res.status(500).json(e);
  }
};

const createBandaLugar = async (req, res) => {
  try {
    const { lugarId, bandaId } = req.body;
    const obj = { lugarId, bandaId };
    const [result] = await createL_Banda(obj);
    res.json(result);
  } catch (e) {
    res.status(500).json(e);
  }
};

router.get("/argentina", all);
router.get("/single/:id", single);
router.get("/forEdit/:id", forEdit);
router.get("/name", name);
router.get("/:provincia", provincia);
router.post("/create", upload.array("imagenes"), validateCreate, create);
router.post("/addfotos/:id", upload.array("imagenes"), addFotos);
router.post("/bandafestival", createBandaFestival);
router.post("/bandalugar", createBandaLugar);
router.put("/modify/:id", validateModify, modify);
router.put("/modifyIb/:id", validateModify, modifyImgBnd);
router.put("/modifyMsg/:id", validateModify, modifyMsgBnd);

module.exports = router;
