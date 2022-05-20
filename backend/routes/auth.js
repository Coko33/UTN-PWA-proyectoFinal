const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const sha1 = require("sha1");
const privateKey = fs.readFileSync("./keys/private.pem");
const signOptions = { algorithm: "RS256", expiresIn: "2h" };
const service = require("./../models/auth");
const { validateLogin } = require("./../middlewares/auth");

const createToken = (payload) => jwt.sign(payload, privateKey, signOptions);

const auth = async (req, res) => {
  try {
    const { usuario, password } = req.body;
    const [user] = await service.authenticate(usuario, sha1(password));
    console.log(user);
    if (!user || user === undefined) {
      res.status(401);
    }
    if (!user.habilitado) {
      res.status(401).send("Confirma tu cuenta para seguir");
    }
    if (user.habilitado) {
      const token = createToken({ id: user.id, rol: user.rol });
      res.json({ JWT: token, info: { usuario } });
    }
  } catch (e) {
    res.sendStatus(500);
  }
};

router.post("/", validateLogin, auth);

module.exports = router;
