import React, { useState, useRef, useEffect } from "react";
/* import { useForm } from "../../hooks/useForm"; */
import Message from "../layout/Message";
import "./../modales/ModalLateral.css";
import CargarVariasImagenes from "./CargarVariasImagenes";
import CargarVariosDiscos from "./CargarVariosDiscos";
import CargarVariosMusicos from "./CargarVariosMusicos";
import CargarVariosAudios from "./CargarVariosAudios";
import CargarVariosVideos from "./CargarVariosVideos";

export default function FormulariosLugares({
  isOpen,
  closeModal,
  createData,
  respuesta,
  error,
}) {
  const initialForm = {
    nombre: "",
    descripcion: "",
    ciudad: "",
    provincia: "",
    año_inicio: "",
    año_fin: "",
    genero: "",
    imagenes: [{ imagen: "", titulo: "", descripcion: "" }],
    musicos: [{ nombre: "", instrumento: "", bio: "" }],
    discos: [{ nombre: "", año: "", descripcion: "" }],
    audios: [{ link: "", titulo: "", descripcion: "" }],
    videos: [{ link: "", titulo: "", descripcion: "" }],
  };

  const { provincias } = require("../../assets/provincias.json");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validateForm = (form, ev) => {
    let errors = {};

    /* regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/; */
    let regex45 = /^.{0,45}$/;
    let regex255 = /^.{0,255}$/;

    if (!form.nombre.trim() & (ev === "nombre")) {
      errors.nombre = "El nombre de la banda es requerido.";
    } else if (!regex45.test(form.nombre.trim()) & (ev === "nombre")) {
      errors.nombre = "El máximo es 45 caracteres.";
    }

    if (!regex255.test(form.descripcion.trim()) & (ev === "descripcion")) {
      errors.descripcion = "El máximo es 255 caracteres.";
    }

    if (!regex45.test(form.genero.trim()) & (ev === "genero")) {
      errors.genero = "El máximo es 45 caracteres.";
    }

    if (!form.ciudad.trim() & (ev === "ciudad")) {
      errors.ciudad = "Indicar la ciudad de la banda.";
    } else if (!regex45.test(form.ciudad.trim()) & (ev === "ciudad")) {
      errors.ciudad = "El máximo es 45 caracteres.";
    }

    if (!form.provincia.trim() & (ev === "provincia")) {
      errors.provincia = "Indicar la provincia de la banda.";
    }

    return errors;
  };

  const handleBlur = (e) => {
    const ev = e.target.name;
    handleChange(e);
    setErrors(validateForm(form, ev));
  };

  const handleReset = () => {
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    const endpoint = "bandas/create";
    e.preventDefault();
    const data = new FormData();
    data.append("nombre", form.nombre);
    data.append("descripcion", form.descripcion);
    data.append("año_inicio", form.año_inicio);
    data.append("año_fin", form.año_fin);
    data.append("genero", form.genero);
    data.append("ciudad", form.ciudad);
    data.append("provincia", form.provincia);

    if (typeof form.imagenes[0].imagen != "string") {
      let refImagenes = [];
      for (let i = 0; i < form.imagenes.length; i++) {
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
      data.append("infoImagenes", JSON.stringify(refImagenes));
    }

    if (form.musicos) {
      let arrMusicos = [];
      for (let i = 0; i < form.musicos.length; i++) {
        if (form.musicos[i].nombre !== "") {
          arrMusicos.push({
            nombre: form.musicos[i].nombre || null,
            instrumento: form.musicos[i].instrumento || null,
            bio: form.musicos[i].bio || null,
          });
        }
      }
      data.append("arrMusicos", JSON.stringify(arrMusicos));
    }

    if (form.discos) {
      let arrDiscos = [];
      for (let i = 0; i < form.discos.length; i++) {
        if (form.discos[i].nombre !== "") {
          arrDiscos.push({
            nombre: form.discos[i].nombre || null,
            año: form.discos[i].año || null,
            descripcion: form.discos[i].descripcion || null,
          });
        }
      }
      data.append("arrDiscos", JSON.stringify(arrDiscos));
    }

    if (form.audios) {
      let arrAudios = [];
      for (let i = 0; i < form.audios.length; i++) {
        if (form.audios[i].nombre !== "") {
          arrAudios.push({
            link: form.audios[i].link || null,
            titulo: form.audios[i].titulo || null,
            descripcion: form.audios[i].descripcion || null,
          });
        }
      }
      data.append("arrAudios", JSON.stringify(arrAudios));
    }

    if (form.videos) {
      let arrVideos = [];
      for (let i = 0; i < form.videos.length; i++) {
        if (form.videos[i].nombre !== "") {
          arrVideos.push({
            link: form.videos[i].link || null,
            titulo: form.videos[i].titulo || null,
            descripcion: form.videos[i].descripcion || null,
          });
        }
      }
      data.append("arrVideos", JSON.stringify(arrVideos));
    }

    setErrors(validateForm(form));
    if (Object.keys(errors).length === 0) {
      handleReset();
      createData(endpoint, data);
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
        <h2 className="form-banda-nombre">Datos de la banda:</h2>
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
            placeholder="Nombre de la banda"
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
            placeholder="Descripción de la banda"
            maxLength="255"
            onChange={handleChange}
            onBlur={(e) => handleBlur(e)}
            value={form.descripcion}
            rows="4"
          ></textarea>
          <label className="form-tag input" htmlFor="años">
            Años:
          </label>
          <br></br>
          <p className="formDesde">Desde</p>
          <input
            className="form-field input inputAños"
            placeholder="1980"
            type="number"
            id="años"
            name="año_inicio"
            min="1970"
            max="1990"
            onChange={handleChange}
            value={form.año_inicio}
          />

          <p className="formDesde">Hasta</p>
          <input
            className="form-field input inputAños"
            placeholder="1990"
            type="number"
            id="años"
            name="año_fin"
            min="1980"
            max="2022"
            onChange={handleChange}
            value={form.año_fin}
          />
          <br></br>

          <label className="form-tag input" htmlFor="genero">
            Género:
          </label>
          {errors.genero && <p className="validations">{errors.genero}</p>}
          <input
            className="form-field input"
            type="text"
            id="genero"
            name="genero"
            placeholder="Género musical"
            maxLength="45"
            onChange={handleChange}
            onBlur={(e) => handleBlur(e)}
            value={form.genero}
          ></input>

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
          <CargarVariosMusicos setForm={setForm} form={form} />
          <CargarVariosDiscos setForm={setForm} form={form} />
          <CargarVariosAudios setForm={setForm} form={form} />
          <CargarVariosVideos setForm={setForm} form={form} />
          <input
            type="submit"
            value="Enviar"
            className="form-boton-agregar amarillo"
          ></input>
        </form>
      </div>
    </div>
  );
}
