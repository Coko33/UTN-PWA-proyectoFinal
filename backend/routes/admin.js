const express = require("express");
const router = express.Router();
const pendientes = require("./../services/pendientes");

const getAdmin = async (req, res) => {
  try {
    const insertsPendientes = await pendientes.getAll();
    res.json({ insertsPendientes });
  } catch (e) {
    res.status(500).json(e);
  }
};

router.get("/all", getAdmin);
module.exports = router;
