const express = require("express");
const router = express.Router();
const multer = require("multer");
const config = { dest: "./public/tmp" };
const upload = multer(config);
const service = require("./../services/mensajes");

const createImg = async (req, res) => {
  try {
    let { infoImagenes } = req.body;
    if (infoImagenes != undefined) {
      infoImagenes = JSON.parse(infoImagenes);
    }
    const files = req.files;
    const bandaId = await service.create(infoImagenes, files);
    res.json(bandaId);
  } catch (e) {
    res.status(500).json(e);
  }
};

const create = async (req, res) => {
  try {
    const { bandaId, nombre, mensaje, mail } = req.body;
    const objMsj = { bandaId, nombre, mensaje, mail };
    const msjId = await service.create(objMsj);
    res.json(msjId);
  } catch (e) {
    res.status(500).json(e);
  }
};

const modify = async (req, res) => {
  try {
    const { id } = req.parms;
    const { nombre, mail, mensaje, habilitado } = req.body;
    const objMensaje = { nombre, mail, mensaje, habilitado };
    const result = await modifyMensaje(id, objMensaje);
    res.json(result);
  } catch {
    res.status(500).json(e);
  }
};

router.post("/agregarimagen", upload.array("imagenes"), createImg);
router.post("/create", create);
router.post("/modify/:id", modify);

module.exports = router;
