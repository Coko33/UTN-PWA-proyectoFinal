import React, { useState, useEffect } from "react";
import { helpHttp } from "../helpers/helpHttp";
import Message from "../layout/Message";
import Loader from "../layout/Loader";
import "./../modales/ModalLateral.css";
import "./Comentarios.css";

export default function ComentariosLugares({ dataLugar, isOpen, closeModal }) {
  const initialForm = {
    nombre: "",
    mensaje: "",
    mail: "",
  };
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [respuesta, setRespuesta] = useState(null);
  const [loading, setLoading] = useState(false);

  let api = helpHttp();
  const endpoint = "mensajesLugares/create";

  const createData = (data) => {
    setLoading(true);
    let options = {
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    };
    api.post(endpoint, options).then((res) => {
      if (!res.err) {
        setRespuesta(true);
        setLoading(false);
        setTimeout(() => setRespuesta(false), 3000);
      } else {
        setLoading(false);
        setError(res);
        setTimeout(() => {
          setRespuesta(false);
          setError(null);
        }, 3000);
      }
    });
  };

  const handleReset = () => {
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      lugarId: dataLugar.id,
      nombre: form.nombre,
      mensaje: form.mensaje,
      mail: form.mail,
    };
    handleReset();
    createData(data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const closeRespuesta = () => {
    setRespuesta(false);
    setError(null);
  };

  return (
    <>
      <div className={`fondoComent ${isOpen && "is-open"}`}>
        <div className="container">
          <div className="form-barra-titulo fucsia">
            <h4 className="form-titulo">Tu comentario</h4>
            <button onClick={closeModal} className="form-boton-cerrar">
              X
            </button>
          </div>
          {loading && <Loader />}
          {respuesta && (
            <Message
              closeRespuesta={closeRespuesta}
              msgBar={"¡Gracias!"}
              msgField={"tu comentario se publicará pronto"}
              bgColor="var(--fucsia)"
            />
          )}
          {error && (
            <Message
              closeRespuesta={closeRespuesta}
              msgBar={"Error"}
              msgField={`${error.status}: ${error.statusText}`}
              bgColor="var(--fucsia)"
            />
          )}
          <div className="cuerpo-container">
            <div className="container-tituloCom">
              <h3 className="tituloCom">Contanos mas sobre </h3>
              <h3 className="tituloCom nom">{dataLugar.nombre}</h3>
            </div>
            <form onSubmit={handleSubmit} className="form-field-container">
              <label className="form-tag input" htmlFor="nombre">
                Nombre o alias:
              </label>
              <input
                className="form-field input"
                type="text"
                id="nombre"
                name="nombre"
                placeholder="tu nombre o alias"
                onChange={handleChange}
                value={form.nombre}
                autoFocus
                required
              ></input>
              <label className="form-tag input" htmlFor="mensaje">
                Comentario:
              </label>
              <textarea
                className="form-field input"
                type="text"
                id="mensaje"
                name="mensaje"
                placeholder={`datos que quieras agregar sobre ${dataLugar.nombre}`}
                onChange={handleChange}
                value={form.mensaje}
                rows="4"
              ></textarea>
              <label className="form-tag input" htmlFor="mail">
                Mail:
              </label>
              <input
                className="form-field input"
                type="email"
                id="mail"
                name="mail"
                placeholder="tu email (no lo publicaremos)"
                onChange={handleChange}
                value={form.mail}
                autoFocus
                required
              ></input>
              <input
                type="submit"
                value="Enviar"
                className="form-boton-agregar fucsia"
              ></input>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
