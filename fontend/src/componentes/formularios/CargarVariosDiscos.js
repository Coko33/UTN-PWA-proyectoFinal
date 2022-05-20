import React, { useEffect, useState } from "react";
import "./../modales/ModalLateral.css";

export default function CargarVariosDiscos({ setForm, form }) {
  const initialForm = [{ nombre: "", año: "", descripcion: "" }];
  const [discos, setDiscos] = useState(initialForm);

  const handleChangeInput = (index, event) => {
    const values = [...discos];
    values[index][event.target.name] = event.target.value;
    setDiscos(values);
    setForm({ ...form, discos });
  };

  const handleAddFields = () => {
    setDiscos([...discos, { nombre: "", año: "", descripcion: "" }]);
  };

  const handleRemoveFields = (index) => {
    const values = [...discos];
    if (values.length > 1) {
      values.splice(index, 1);
      setDiscos(values);
    }
  };

  return (
    <>
      <div className="contenedor-tag">
        <label className="form-tag input musicos" htmlFor="nombre">
          Discos
        </label>
      </div>

      {discos.map((inputField, index) => (
        <>
          <hr></hr>
          <div className="container-discos" key={index}>
            <div className="container-discos-nombre">
              <label className="form-tag input" htmlFor="nombre">
                Título:
              </label>
              <input
                className="form-field input"
                placeholder="título del álbum, disco o casete"
                type="text"
                name="nombre"
                label="Nombre"
                value={inputField.nombre}
                onChange={(event) => handleChangeInput(index, event)}
              />
            </div>
            <div className="container-discos-año">
              <label className="form-tag input discos" htmlFor="año">
                Año:
              </label>
              <input
                className="form-field input inputDiscos"
                placeholder="1980"
                type="number"
                id="año"
                name="año"
                min="1970"
                max="2022"
                value={inputField.año}
                onChange={(event) => handleChangeInput(index, event)}
              />
            </div>
          </div>

          <label className="form-tag input discos" htmlFor="descripcion">
            Descripción:
          </label>
          <input
            className="form-field input inputDiscos"
            placeholder="descripción del disco"
            type="text"
            id="decripcion"
            name="descripcion"
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
        </>
      ))}
    </>
  );
}
