import React, { useState, useEffect } from "react";
import "./../modales/ModalLateral.css";

export default function CargarVariasImagenes({ setForm, form }) {
  const imagenesInicio = [{ imagen: "", titulo: "", descripcion: "" }];
  const [imagenes, setImagenes] = useState(imagenesInicio);
  const [previewUrl, setPreviewUrl] = useState([]);

  let selectedFile = React.createRef();

  const previewImagen = (index, event) => {
    const reader = new FileReader();
    const files = event.target.files;
    if (files && files.length) {
      reader.onload = (e) => {
        setPreviewUrl({ ...previewUrl, [index]: reader.result });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleChangeInput = (index, event) => {
    const values = [...imagenes];
    if (event.target.name === "imagen") {
      values[index].imagen = event.target.files[0];
      setImagenes(values);
      setForm({ ...form, imagenes });
      previewImagen(index, event);
    } else {
      values[index][event.target.name] = event.target.value;
      setImagenes(values);
      setForm({ ...form, imagenes });
    }
  };

  const handleAddFields = () => {
    const values = [...imagenes];
    if (values.length < 5)
      setImagenes([...imagenes, { imagen: "", titulo: "", descripcion: "" }]);
  };

  const handleRemoveFields = (index) => {
    const values = [...imagenes];
    if (values.length > 1) {
      values.splice(index, 1);
      setImagenes(values);
    }
  };

  return (
    <>
      {imagenes &&
        imagenes.map((imagen, index) => (
          <div key={index}>
            <hr></hr>
            <label className="form-tag input" htmlFor="imagen">
              Imagen:
            </label>
            <input
              className="form-field input"
              type="file"
              name="imagen"
              id="imagen"
              label="Imagen"
              ref={selectedFile}
              onChange={(event) => handleChangeInput(index, event)}
            />
            {imagenes[0].imagen !== "" && (
              <img
                className="previewImg"
                alt="preview"
                src={previewUrl[index]}
              />
            )}
            <label className="form-tag input" htmlFor="Titulo">
              Título:
            </label>
            <input
              className="form-field input"
              placeholder="título de la imagen"
              type="text"
              name="titulo"
              id="titulo"
              label="Título"
              value={imagen.titulo}
              onChange={(event) => handleChangeInput(index, event)}
            />
            <label className="form-tag input" htmlFor="descripcion">
              Descripción:
            </label>
            <input
              className="form-field input"
              placeholder="descripción de la imagen"
              type="text"
              name="descripcion"
              id="descripcion"
              label="Descripcion"
              value={imagen.descripcion}
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
