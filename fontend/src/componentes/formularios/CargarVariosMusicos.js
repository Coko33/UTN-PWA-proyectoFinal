import React, { useState } from "react";
import "./../modales/ModalLateral.css";

export default function CargarVariosMusicos({ setForm, form }) {
  const [musicos, setMusicos] = useState([
    { nombre: "", instrumento: "", bio: "" },
  ]);

  const handleChangeInput = (index, event) => {
    const values = [...musicos];
    values[index][event.target.name] = event.target.value;
    setMusicos(values);
    setForm({ ...form, musicos });
  };

  const handleAddFields = () => {
    setMusicos([...musicos, { nombre: "", instrumento: "", bio: "" }]);
  };

  const handleRemoveFields = (index) => {
    const values = [...musicos];
    if (values.length > 1) {
      values.splice(index, 1);
      setMusicos(values);
    }
  };

  return (
    <>
      <div className="contenedor-tag">
        <label className="form-tag input musicos" htmlFor="nombre">
          Músicos
        </label>
      </div>

      {musicos.map((inputField, index) => (
        <div key={index}>
          <hr></hr>

          <label className="form-tag input" htmlFor="nombre">
            Nombre:
          </label>
          <input
            className="form-field input"
            placeholder="nombre y/o apodo del músico/a"
            type="text"
            name="nombre"
            label="Nombre"
            value={inputField.nombre}
            onChange={(event) => handleChangeInput(index, event)}
          />
          <label className="form-tag input" htmlFor="instrumento">
            Instrumento:
          </label>
          <input
            className="form-field input"
            placeholder="instrumento/s"
            type="text"
            name="instrumento"
            label="Instrumento"
            value={inputField.instrumento}
            onChange={(event) => handleChangeInput(index, event)}
          />
          <label className="form-tag input" htmlFor="bio">
            Bio:
          </label>
          <input
            className="form-field input"
            placeholder="mas información"
            type="text"
            name="bio"
            label="Bio"
            value={inputField.bio}
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
