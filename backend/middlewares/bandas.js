const { schemas } = require("./schemas/bandas");
const multer = require("multer");
const upload = multer();

const validateCreate = (req, res, next) => {
  console.log(req);
  const { error, value } = schemas.create.validate(req.body);
  error ? res.status(422).json({ error: error.details[0].message }) : next();
};
const validateModify = (req, res, next) => {
  const obj = { ...req.body, ...req.params };
  const { error, value } = schemas.modify.validate(obj);
  error ? res.status(422).json({ error: error.details[0].message }) : next();
};

module.exports = { validateCreate, validateModify };
