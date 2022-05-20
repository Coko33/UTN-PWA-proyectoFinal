const express = require("express");
const router = express.Router();
const service = require("./../models/lugares");
const { getCiudad } = require("./../services/ciudades");
const { validateCreate, validateModify } = require("./../middlewares/lugares");
const multer = require("multer");
const config = { dest: "./public/tmp" };
const upload = multer(config);

const all = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.size);
    const offset = page ? page * limit : 0;
    const lugares = await service.getAll({ limit, offset });
    const count = lugares.cantidad.habilitados;
    const totalPages = Math.ceil(count / limit);
    res.json({ ...lugares, totalPages: totalPages });
  } catch (e) {
    res.status(500).json(e);
  }
};

const provincia = async (req, res) => {
  try {
    const { provincia } = req.params;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.size);
    const offset = page ? page * limit : 0;
    const lugares = await service.getByProvincia({ limit, offset, provincia });
    const count = lugares.cantidad.habilitados;
    const totalPages = Math.ceil(count / limit);
    result = { ...lugares, totalPages: totalPages };
    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const create = async (req, res) => {
  try {
    const { nombre, descripcion, año_inicio, año_fin, ciudad, provincia } =
      req.body;

    let { refImagenes } = req.body;
    if (refImagenes != undefined) {
      refImagenes = JSON.parse(refImagenes);
    }

    const objLugar = {
      nombre,
      descripcion,
      año_inicio: parseInt(año_inicio) || null,
      año_fin: parseInt(año_fin) || null,
    };

    const objFiles = req.files;
    const ciudadNorm = await getCiudad(ciudad, provincia);
    const lugarId = await service.create(
      ciudadNorm,
      objLugar,
      refImagenes,
      objFiles
    );
    res.json(lugarId);
  } catch (e) {
    console.log(e);
    e.sql
      ? res.status(422).json({ code: e.code, errno: e.errno })
      : res.status(500).json(e);
  }
};

const modify = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, descripcion, año_inicio, año_fin, ciudad, provincia } =
      req.body;
    const objLugar = { nombre, descripcion, año_inicio, año_fin };
    if (!ciudad) {
      const result = await service.modify(id, ciudad, objLugar);
      res.json(result);
    } else {
      const ciudadNorm = await getCiudad(ciudad, provincia);
      const result = await service.modify(id, ciudadNorm, objLugar);
      res.json(result);
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

const lugaresBandas = async (req, res) => {
  try {
    const lugares_bandas = req.body;
    const result = await Promise.all(
      lugares_bandas.map(async (lugarBanda) => {
        await service.lugaresBandas(lugarBanda);
      })
    );
    res.json(result);
  } catch (e) {
    res.status(500).json(e);
  }
};

router.get("/argentina", all);
router.get("/:provincia", provincia);
router.post("/create", upload.array("imagenes"), validateCreate, create);
router.post("/lugaresbandas", lugaresBandas);
router.put("/modify/:id", validateModify, modify);
module.exports = router;
