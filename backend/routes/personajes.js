const express = require("express");
const router = express.Router();
const service = require("./../models/personajes");
const { getCiudad } = require("./../services/ciudades");
const {
  validateCreate,
  validateModify,
} = require("./../middlewares/personajes");

const all = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.size);
    const offset = page ? page * limit : 0;
    const personajes = await service.getAll({ limit, offset });
    const count = personajes.cantidad.habilitados;
    const totalPages = Math.ceil(count / limit);
    res.json({ ...personajes, totalPages: totalPages });
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
    const personajes = await service.getByProvincia({
      limit,
      offset,
      provincia,
    });
    const count = personajes.cantidad.habilitados;
    const totalPages = Math.ceil(count / limit);
    res.json({ ...personajes, totalPages: totalPages });
  } catch (e) {
    res.status(500).json(e);
  }
};

/* rol, estrellas, */
const create = async (req, res) => {
  try {
    const { nombre, descripcion, bio, ciudad, provincia } = req.body;
    console.log(req.body);
    const objPersonaje = { nombre, descripcion, bio };
    const ciudadNorm = await getCiudad(ciudad, provincia);
    const personajeId = await service.create(ciudadNorm, objPersonaje);
    res.json(personajeId);
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

    const { nombre, descripcion, bio, rol, estrellas, ciudad, provincia } =
      req.body;
    const objPersonaje = {
      nombre,
      descripcion,
      bio,
      rol,
      estrellas,
    };
    if (!ciudad) {
      const result = await service.modify(id, ciudad, objPersonaje);
      res.json(result);
    } else {
      const ciudadNorm = await getCiudad(ciudad, provincia);
      const result = await service.modify(id, ciudadNorm, objPersonaje);
      res.json(result);
    }
  } catch (e) {
    res.status(500).json(e);
  }
};
router.get("/argentina", all);
router.get("/:provincia", provincia);
router.post("/create", validateCreate, create);
router.put("/modify/:id", validateModify, modify);

module.exports = router;
