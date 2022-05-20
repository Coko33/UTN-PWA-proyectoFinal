import React, { useState, useEffect, useRef } from "react";
import CargarVariasImagenes from "../formularios/CargarVariasImagenes";
import { helpHttp } from "../helpers/helpHttp";
import Message from "../layout/Message";
import Loader from "../layout/Loader";
import "./../modales/ModalLateral.css";
import "./Comentarios.css";

export default function FotosLugares({ dataLugar, isOpen, closeModal }) {
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [respuesta, setRespuesta] = useState(null);
  const [loading, setLoading] = useState(false);

  let api = helpHttp();
  const endpoint = "mensajesLugares/agregarimagen";

  const createData = (data) => {
    setLoading(true);
    let options = {
      body: data,
      /* headers: { "content-type": "multipart/form-data" }, */
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (typeof form.imagenes[0].imagen != "string") {
      let refImagenes = [];
      for (let i = 0; i < form.imagenes.length; i++) {
        data.append(
          "imagenes",
          form.imagenes[i].imagen || null,
          form.imagenes[i].imagen.name || null
        );
        refImagenes.push({
          lugarId: dataLugar.id,
          titulo: form.imagenes[i].titulo || null,
          descripcion: form.imagenes[i].descripcion || null,
        });
      }
      data.append("infoImagenes", JSON.stringify(refImagenes));
    }
    createData(data);
  };

  const containerScroll = useRef();
  const resetScroll = () => (containerScroll.current.scrollTop = 0);

  const closeRespuesta = () => {
    setRespuesta(false);
    setError(null);
  };

  return (
    <>
      <div className={`fondoComent ${isOpen && "is-open"}`}>
        <div className="container">
          <div className="form-barra-titulo fucsia">
            <h4 className="form-titulo">Agregar imágenes</h4>
            <button onClick={closeModal} className="form-boton-cerrar">
              X
            </button>
          </div>
          {loading && <Loader />}
          {respuesta && (
            <Message
              closeRespuesta={closeRespuesta}
              msgBar={"¡Gracias!"}
              msgField={"tu foto ha sido enviada"}
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
          <div className="scroll-container" ref={containerScroll}>
            <div className="cuerpo-container">
              <div className="container-tituloCom">
                <h3 className="tituloCom">Subí tu imagen de </h3>
                <h3 className="tituloCom nom">{dataLugar.nombre}</h3>
              </div>
              <CargarVariasImagenes setForm={setForm} form={form} />
              <button
                onClick={(e) => handleSubmit(e)}
                className="form-boton-agregar fucsia"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
