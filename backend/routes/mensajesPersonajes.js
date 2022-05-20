const express = require("express");
const router = express.Router();
const service = require("../services/mensajesPersonajes");

const create = async (req, res) => {
  try {
    const { personajeId, nombre, mensaje, mail } = req.body;
    const objMsj = { personajeId, nombre, mensaje, mail };
    const msjId = await service.create(objMsj);
    res.json(msjId);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

router.post("/create", create);

module.exports = router;
