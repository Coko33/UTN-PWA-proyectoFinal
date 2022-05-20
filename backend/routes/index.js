var express = require("express");
var router = express.Router();
const { getBandasPoints } = require("./../models/bandas");
const { getCiudadesPoints } = require("./../models/ciudades");
const { getLugaresPoints } = require("./../models/lugares");
const { getPersonajesPoints } = require("./../models/personajes");
const { getFestivalesPoints } = require("./../models/festivales");

const all = async (req, res) => {
  try {
    const bandas = await getBandasPoints();
    const ciudades = await getCiudadesPoints();
    const lugares = await getLugaresPoints();
    const personajes = await getPersonajesPoints();
    const festivales = await getFestivalesPoints();
    const data = {
      ciudades,
      bandas,
      lugares,
      personajes,
      festivales,
    };
    res.json(data);
  } catch (e) {
    res.status(500).json(e);
  }
};

const provincia = async (req, res) => {
  try {
    const { provincia } = req.params;
    const bandas = await getBandasPoints(provincia);
    const ciudades = await getCiudadesPoints(provincia);
    const lugares = await getLugaresPoints(provincia);
    const personajes = await getPersonajesPoints(provincia);
    const festivales = await getFestivalesPoints(provincia);
    const data = { ciudades, bandas, lugares, personajes, festivales };
    res.json(data);
  } catch (e) {
    res.status(500).json(e);
  }
};

router.get("/all", all);
router.get("/:provincia", provincia);

module.exports = router;
