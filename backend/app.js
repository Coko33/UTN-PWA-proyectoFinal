var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
//middlewares
const { securedAdmin } = require("./middlewares/auth");

const dotenv = require("dotenv");
dotenv.config();

const indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const personajes = require("./routes/personajes");
const musicos = require("./routes/musicos");
const ciudades = require("./routes/ciudades");
const bandas = require("./routes/bandas");
const auth = require("./routes/auth");
const perfil = require("./routes/perfil");
const lugares = require("./routes/lugares");
const festivales = require("./routes/festivales");
const admin = require("./routes/admin");
const mensajes = require("./routes/mensajes");
const mensajesLugares = require("./routes/mensajesLugares");
const mensajesPersonajes = require("./routes/mensajesPersonajes");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/personajes", personajes);
app.use("/musicos", musicos);
app.use("/ciudades", ciudades);
app.use("/bandas", bandas);
app.use("/auth", auth);
app.use("/perfil", securedAdmin, perfil);
app.use("/lugares", lugares);
app.use("/festivales", festivales);
app.use("/admin", securedAdmin, admin);
app.use("/mensajes", mensajes);
app.use("/mensajeslugares", mensajesLugares);
app.use("/mensajespersonajes", mensajesPersonajes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).json({ message: "Página no encontrada" });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
});

module.exports = app;
