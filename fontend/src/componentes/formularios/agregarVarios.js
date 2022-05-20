import React, { useState } from "react";
import "./FormularioMusicos.css";

export default function CargarVariosMusicos() {
  const [inputFields, setInputFields] = useState([
    { nombre: "", instrumento: "" },
    { nombre: "", instrumento: "" },
  ]);

  const handleChangeInput = (index, event) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("InputFields", inputFields);
  };

  const handleAddFields = () => {
    setInputFields([...inputFields, { nombre: "", instrumento: "" }]);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  return (
    <div className="FormularioMusicos">
      <h1>Agregar músicos</h1>
      <form onSubmit={handleSubmit}>
        {inputFields.map((inputField, index) => (
          <div key={index}>
            <hr></hr>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              name="nombre"
              label="Nombre"
              value={inputField.nombre}
              onChange={(event) => handleChangeInput(index, event)}
            />
            <label htmlFor="instrumento">Instrumento</label>
            <input
              type="text"
              name="instrumento"
              label="Instrumento"
              value={inputField.instrumento}
              onChange={(event) => handleChangeInput(index, event)}
            />
            <button onClick={() => handleRemoveFields(index)}> - </button>
            <button onClick={() => handleAddFields()}> + </button>
          </div>
        ))}
        <button onClick={handleSubmit}>Enviar</button>
      </form>
    </div>
  );
}
