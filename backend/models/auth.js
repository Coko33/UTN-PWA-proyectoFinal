const bd = require("./../utils/bd");
const T = require("./../utils/schemas");

const authenticate = (usuario, password) =>
  bd(`${T.USUARIOS}`)
    .where({ usuario, password })
    .select("id", "usuario", "rol", "habilitado");
module.exports = { authenticate };
