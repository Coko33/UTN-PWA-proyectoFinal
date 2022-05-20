const express = require("express");
const router = express.Router();
const service = require("./../models/musicos");
const { validateCreate, validateModify } = require("./../middlewares/musicos");

const { getCiudad } = require("./../services/ciudades");

const all = (req, res) =>
  service
    .getAll()
    .then((response) => res.json(response))
    .catch((e) => res.status(500).json(e));

const single = (req, res) =>
  service
    .getSingle(req.params.id)
    .then(([response]) => res.json(response))
    .catch((e) => res.status(500).json(e));

const create = async (req, res) => {
  try {
    const { nombre, instrumento, bio, ciudad, provincia } = req.body;
    const ciudadNorm = await getCiudad(ciudad, provincia);
    const objMusico = { nombre, instrumento, bio };
    const result = await service.create(ciudadNorm, objMusico);
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
    const { nombre, instrumento, bio, ciudad, provincia } = req.body;
    const objMusico = { nombre, instrumento, bio };
    if (!ciudad) {
      const result = await service.modify(id, ciudad, objMusico);
      res.json(result);
    } else {
      const ciudadNorm = await getCiudad(ciudad, provincia);
      const result = await service.modify(id, ciudadNorm, objMusico);
      res.json(result);
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

router.get("/all", all);
router.get("/single/:id", single);
router.post("/create", validateCreate, create);
router.put("/modify/:id", validateModify, modify);

module.exports = router;
