const express = require("express");
const router = express.Router();

const getProfile = (req, res) => {
  res.json({ message: "usuario autenticado", id: req.id });
};
router.get("/", getProfile);
module.exports = router;
