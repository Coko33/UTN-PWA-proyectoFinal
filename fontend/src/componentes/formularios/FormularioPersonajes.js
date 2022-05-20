import React, { useState, useRef } from "react";
import Message from "../layout/Message";
import "./../modales/ModalLateral.css";

export default function FormulariosPersonajes({
  isOpen,
  closeModal,
  createData,
  createDataPerso,
}) {
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
      errors.nombre = "El nombre del personaje es requerido.";
    } else if (!regex45.test(form.nombre.trim()) & (ev === "nombre")) {
      errors.nombre = "El máximo es 45 caracteres.";
    }

    if (!form.nombre.trim() & (ev === "descripcion")) {
      errors.descripcion = "La descripción es requerida.";
    } else if (
      !regex800.test(form.descripcion.trim()) &
      (ev === "descripcion")
    ) {
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
    const endpoint = "personajes/create";
    e.preventDefault();
    const data = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      bio: form.bio,
      ciudad: form.ciudad,
      provincia: form.provincia,
    };

    setErrors(validateForm(form));
    if (Object.keys(errors).length === 0) {
      createDataPerso(endpoint, data);
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
        <h2 className="form-banda-nombre">Datos del personaje:</h2>
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
            placeholder="Nombre del personaje"
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
            placeholder="Descripción breve del personaje"
            maxLength="45"
            onChange={handleChange}
            onBlur={(e) => handleBlur(e)}
            value={form.descripcion}
            rows="2"
          ></textarea>
          <label className="form-tag input" htmlFor="bio">
            Bio:
          </label>
          {errors.bio && <p className="validations">{errors.bio}</p>}
          <textarea
            className="form-field input"
            type="text"
            id="bio"
            name="bio"
            placeholder="Mas informacion sobre el personaje"
            maxLength="800"
            onChange={handleChange}
            onBlur={(e) => handleBlur(e)}
            value={form.bio}
            rows="6"
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
          <input
            type="submit"
            value="Enviar"
            className="form-boton-agregar verde"
          ></input>
        </form>
      </div>
    </div>
  );
}
