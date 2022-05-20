import React, { useState } from "react";
import "./../modales/ModalLateral.css";

export default function CargarVariosVideos({ setForm, form }) {
  const initialForm = [{ link: "", titulo: "", descripcion: "" }];
  const [videos, setVideos] = useState(initialForm);

  const handleChangeInput = (index, event) => {
    const values = [...videos];
    values[index][event.target.name] = event.target.value;
    setVideos(values);
    setForm({ ...form, videos });
  };

  const handleAddFields = () => {
    setVideos([...videos, { link: "", titulo: "", descripcion: "" }]);
  };

  const handleRemoveFields = (index) => {
    const values = [...videos];
    if (values.length > 1) {
      values.splice(index, 1);
      setVideos(values);
    }
  };

  return (
    <>
      <div className="contenedor-tag">
        <label className="form-tag input musicos" htmlFor="nombre">
          Videos
        </label>
      </div>

      {videos.map((inputField, index) => (
        <div key={index}>
          <hr></hr>
          <label className="form-tag input" htmlFor="link">
            Link:
          </label>
          <input
            className="form-field input"
            placeholder="pegá el link del video aquí"
            type="text"
            name="link"
            label="Link"
            value={inputField.link}
            onChange={(event) => handleChangeInput(index, event)}
          />
          <label className="form-tag input" htmlFor="titulo">
            Título:
          </label>
          <input
            className="form-field input"
            placeholder="título del video"
            type="text"
            name="titulo"
            label="Titulo"
            value={inputField.titulo}
            onChange={(event) => handleChangeInput(index, event)}
          />
          <label className="form-tag input" htmlFor="descripcion">
            Descripción:
          </label>
          <input
            className="form-field input"
            placeholder="descripción del video"
            type="text"
            name="descripcion"
            label="Descripcion"
            value={inputField.descripcion}
            onChange={(event) => handleChangeInput(index, event)}
          />
          <button type="button" onClick={() => handleRemoveFields(index)}>
            {" "}
            -{" "}
          </button>
          <button type="button" onClick={() => handleAddFields()}>
            {" "}
            +{" "}
          </button>
        </div>
      ))}
    </>
  );
}
