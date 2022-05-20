const express = require("express");
const router = express.Router();
const service = require("./../models/festivales");
const { getCiudad } = require("./../services/ciudades");
const { getLugar } = require("./../services/lugares");
const { createF_Banda } = require("./../models/bandas");
const {
  validateCreate,
  validateModify,
} = require("./../middlewares/festivales");
const multer = require("multer");
const config = { dest: "./public/tmp" };
const upload = multer(config);

const all = (req, res) =>
  service
    .getAll()
    .then((response) => res.json(response))
    .catch((e) => res.status(500).json(e));

const create = async (req, res) => {
  try {
    const {
      nombre,
      año,
      edicion,
      organizadores,
      descripcion,
      programacion,
      nombre_lugar,
      descripcion_lugar,
      ciudad,
      provincia,
    } = req.body;
    const ciudadNorm = await getCiudad(ciudad, provincia);
    const [lugarId] = await getLugar(
      nombre_lugar,
      descripcion_lugar,
      ciudadNorm
    );
    const objFestival = {
      nombre,
      edicion,
      año,
      descripcion,
      organizadores,
      lugarId: lugarId.id,
    };
    const objFiles = req.files;
    const result = await service.create(objFestival, objFiles);
    res.json(result);
  } catch (e) {
    e.sql
      ? res.status(422).json({ code: e.code, errno: e.errno })
      : console.log(e);
  }
};

const modify = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      nombre,
      edicion,
      año,
      descripcion,
      organizadores,
      nombre_lugar,
      descripcion_lugar,
      ciudad,
      provincia,
    } = req.body;
    const ciudadNorm = await getCiudad(ciudad, provincia);
    const [lugarId] = await getLugar(
      nombre_lugar,
      descripcion_lugar,
      ciudadNorm
    );
    const obj = {
      nombre,
      edicion,
      año,
      descripcion,
      organizadores,
      lugarId: lugarId.id,
    };
    const result = await service.modify(obj);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const createFestivalBanda = async (req, res) => {
  try {
    const { festivalId, bandaId } = req.body;
    const obj = { festivalId, bandaId };
    const [result] = await createF_Banda(obj);
    res.json(result);
  } catch (e) {
    res.status(500).json(e);
  }
};

router.get("/all", all);
router.post("/create", upload.array("imagen"), validateCreate, create);
router.post("/festivalesbanda", createFestivalBanda);
router.put("/modify/:id", validateModify, modify);

module.exports = router;
