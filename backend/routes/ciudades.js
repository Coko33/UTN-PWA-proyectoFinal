const express = require("express");
const router = express.Router();
const service = require("./../models/ciudades");
const { getCiudad } = require("./../services/ciudades");

const all = (req, res) =>
  service
    .getAll()
    .then((response) => res.json(response))
    .catch((e) => res.status(500).json(e));

const create = async (req, res) => {
  try {
    const { nombre, provincia } = req.body;
    const ciudadNorm = await getCiudad(nombre, provincia);
    const result = await service.createCiudad(ciudadNorm);
    res.json(result);
  } catch (e) {
    e.sql
      ? res.status(422).json({ code: e.code, errno: e.errno })
      : res.status(500).json(e);
  }
};

router.get("/all", all);
router.post("/create", create);
module.exports = router;
