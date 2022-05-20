import React, { useState } from "react";
import "./../modales/ModalLateral.css";

export default function CargarVariosAudios({ setForm, form }) {
  const initialForm = [{ link: "", titulo: "", descripcion: "" }];
  const [audios, setAudios] = useState(initialForm);

  const handleChangeInput = (index, event) => {
    const values = [...audios];
    values[index][event.target.name] = event.target.value;
    setAudios(values);
    setForm({ ...form, audios });
  };

  const handleAddFields = () => {
    setAudios([...audios, { link: "", titulo: "", descripcion: "" }]);
  };

  const handleRemoveFields = (index) => {
    const values = [...audios];
    if (values.length > 1) {
      values.splice(index, 1);
      setAudios(values);
    }
  };

  return (
    <>
      <div className="contenedor-tag">
        <label className="form-tag input musicos" htmlFor="nombre">
          Audios
        </label>
      </div>

      {audios.map((inputField, index) => (
        <div key={index}>
          <hr></hr>
          <label className="form-tag input" htmlFor="link">
            Link:
          </label>
          <input
            className="form-field input"
            placeholder="pegá el link del audio aquí"
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
            placeholder="título del audio"
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
            placeholder="descripción del audio"
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
