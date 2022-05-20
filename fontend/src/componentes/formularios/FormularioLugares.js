import React, { useState, useRef } from "react";
import Message from "../layout/Message";
import "./../modales/ModalLateral.css";
import CargarVariasImagenes from "./CargarVariasImagenes";

export default function FormulariosLugares({ isOpen, closeModal, createData }) {
  const initialForm = {
    nombre: "",
    descripcion: "",
    ciudad: "",
    provincia: "",
    imagenes: [{ imagen: "", titulo: "", descripcion: "" }],
  };

  const { provincias } = require("./../../assets/provincias.json");

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validateForm = (form, ev) => {
    let errors = {};
    let regex45 = /^.{0,45}$/;
    let regex800 = /^.{0,800}$/;

    if (!form.nombre.trim() & (ev === "nombre")) {
      errors.nombre = "El nombre del lugar es requerido.";
    } else if (!regex45.test(form.nombre.trim()) & (ev === "nombre")) {
      errors.nombre = "El máximo es 45 caracteres.";
    }

    if (!regex800.test(form.descripcion.trim()) & (ev === "descripcion")) {
      errors.descripcion = "El máximo es 800 caracteres.";
    }

    if (!form.ciudad.trim() & (ev === "ciudad")) {
      errors.ciudad = "Indicar la ciudad del lugar.";
    } else if (!regex45.test(form.ciudad.trim()) & (ev === "ciudad")) {
      errors.ciudad = "El máximo es 45 caracteres.";
    }

    if (!form.provincia.trim() & (ev === "provincia")) {
      errors.provincia = "Indicar la provincia del lugar.";
    }

    return errors;
  };

  const handleBlur = (e) => {
    const ev = e.target.name;
    handleChange(e);
    setErrors(validateForm(form, ev));
  };

  const handleReset = (e) => {
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    const endpoint = "lugares/create";
    e.preventDefault();
    const data = new FormData();
    data.append("nombre", form.nombre);
    data.append("descripcion", form.descripcion);
    data.append("ciudad", form.ciudad);
    data.append("provincia", form.provincia);
    if (typeof form.imagenes[0].imagen != "string") {
      let refImagenes = [];
      for (var i = 0; i < form.imagenes.length; i++) {
        data.append(
          "imagenes",
          form.imagenes[i].imagen || null,
          form.imagenes[i].imagen.name || null
        );
        refImagenes.push({
          titulo: form.imagenes[i].titulo || null,
          descripcion: form.imagenes[i].descripcion || null,
        });
      }
      data.append("refImagenes", JSON.stringify(refImagenes));
    }

    setErrors(validateForm(form));
    if (Object.keys(errors).length === 0) {
      createData(endpoint, data);
      handleReset();
    } else {
      return;
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="scroll-container agregar">
      <div className="form-content">
        <h2 className="form-banda-nombre">Datos del lugar:</h2>
        <form onSubmit={handleSubmit} className="form-field-container">
          <label className="form-tag input" htmlFor="nombre">
            Nombre:
          </label>
          {errors.nombre && <p className="validations">{errors.nombre}</p>}
          <input
            className="form-field input"
            type="text"
            id="nombre"
            name="nombre"
            placeholder="Nombre del lugar"
            maxLength="45"
            onChange={handleChange}
            onBlur={(e) => handleBlur(e)}
            value={form.nombre}
            autoFocus
            required
          ></input>
          <label className="form-tag input" htmlFor="descripcion">
            Descripción:
          </label>
          {errors.descripcion && (
            <p className="validations">{errors.descripcion}</p>
          )}
          <textarea
            className="form-field input"
            type="text"
            id="descripcion"
            name="descripcion"
            placeholder="Descripción del lugar"
            maxLength="45"
            onChange={handleChange}
            onBlur={(e) => handleBlur(e)}
            value={form.descripcion}
            rows="4"
          ></textarea>
          <label className="form-tag input" htmlFor="ciudad">
            Ciudad:
          </label>
          {errors.ciudad && <p className="validations">{errors.ciudad}</p>}
          <input
            className="form-field input"
            type="text"
            id="ciudad"
            name="ciudad"
            placeholder="Ciudad"
            maxLength="45"
            onChange={handleChange}
            onBlur={(e) => handleBlur(e)}
            value={form.ciudad}
            required
          ></input>
          <label className="form-tag input" htmlFor="provincia">
            Provincia:
          </label>
          {errors.provincia && (
            <p className="validations">{errors.provincia}</p>
          )}
          <select
            className="form-field input"
            id="provincia"
            name="provincia"
            onChange={handleChange}
            onBlur={(e) => handleBlur(e)}
            required
          >
            <option value="">Elige una provincia</option>
            {provincias.map((prov, i) => (
              <option key={i} value={prov.iso_nombre}>
                {prov.nombre}
              </option>
            ))}
          </select>
          <CargarVariasImagenes setForm={setForm} form={form} />
          <input
            type="submit"
            value="Enviar"
            className="form-boton-agregar fucsia"
          ></input>
        </form>
      </div>
    </div>
  );
}
