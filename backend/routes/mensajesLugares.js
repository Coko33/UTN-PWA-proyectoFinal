const express = require("express");
const router = express.Router();
const multer = require("multer");
const config = { dest: "./public/tmp" };
const upload = multer(config);
const service = require("../services/mensajesLugares");

const createImg = async (req, res) => {
  try {
    let { infoImagenes } = req.body;
    if (infoImagenes != undefined) {
      infoImagenes = JSON.parse(infoImagenes);
    }
    const files = req.files;
    const lugarId = await service.create(infoImagenes, files);
    res.json(lugarId);
  } catch (e) {
    res.status(500).json(e);
  }
};

const create = async (req, res) => {
  try {
    const { lugarId, nombre, mensaje, mail } = req.body;
    const objMsj = { lugarId, nombre, mensaje, mail };
    const msjId = await service.create(objMsj);
    res.json(msjId);
  } catch (e) {
    res.status(500).json(e);
  }
};

router.post("/agregarimagen", upload.array("imagenes"), createImg);
router.post("/create", create);

module.exports = router;
