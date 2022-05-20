const fs = require("fs");
const publickey = fs.readFileSync("./keys/public.pem");
const jwt = require("jsonwebtoken");
const { schemas } = require("./schemas/auth");

const securedUser = (req, res, next) => {
  try {
    let { authorization } = req.headers;
    const { id } = jwt.verify(authorization, publickey);
    req.id = id;
    next();
  } catch (e) {
    res.sendStatus(401);
  }
};

const securedAdmin = (req, res, next) => {
  try {
    let { authorization } = req.headers;
    const { id } = jwt.verify(authorization, publickey);
    const { rol } = jwt.verify(authorization, publickey);
    req.id = id;
    if (rol === "admin") {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    res.sendStatus(401);
  }
};

const validateLogin = (req, res, next) => {
  const { error, value } = schemas.logIn.validate(req.body);
  error ? res.status(422).json({ error: error.details[0].message }) : next();
};

module.exports = { securedUser, securedAdmin, validateLogin };
