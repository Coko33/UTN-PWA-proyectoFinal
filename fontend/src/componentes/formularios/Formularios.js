import React, { useState } from "react";
import { helpHttp } from "./../helpers/helpHttp";
import FormularioLugares from "./FormularioLugares";
import FormularioBandas from "./FormularioBandas";
import FormularioPersonajes from "./FormularioPersonajes";
import Message from "./../layout/Message";
import Loader from "./../layout/Loader";
import "./../modales/Modales.css";

export default function Formularios({ isOpen, closeModal, selectedForm }) {
  const [error, setError] = useState(null);
  const [respuesta, setRespuesta] = useState(null);
  const [loading, setLoading] = useState(false);

  let api = helpHttp();

  const createData = (endpoint, data) => {
    setLoading(true);
    let options = {
      body: data,
      /* headers: { "content-type": "application/json" }, */
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
  const createDataPerso = (endpoint, data) => {
    setLoading(true);
    let options = {
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
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

  const closeRespuesta = () => {
    setRespuesta(false);
    setError(null);
  };

  return (
    <>
      {selectedForm === "lugares" ? (
        <div className={`form-container fixed form ${isOpen && "is-open"}`}>
          <div className="form-barra-titulo fucsia">
            <h4 className="form-titulo">AGREGAR LUGARES</h4>
            <button onClick={closeModal} className="form-boton-cerrar fucsia">
              X
            </button>
          </div>
          {loading && <Loader />}
          {respuesta && (
            <Message
              closeRespuesta={closeRespuesta}
              msgBar={"¡Gracias!"}
              msgField={"los datos han sido enviados"}
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
          <FormularioLugares createData={createData} />
        </div>
      ) : (
        <></>
      )}
      {selectedForm === "bandas" ? (
        <div className={`form-container fixed form ${isOpen && "is-open"}`}>
          <div className="form-barra-titulo amarillo">
            <h4 className="form-titulo">AGREGAR BANDAS</h4>
            <button onClick={closeModal} className="form-boton-cerrar">
              X
            </button>
          </div>
          {loading && <Loader />}
          {respuesta && (
            <Message
              closeRespuesta={closeRespuesta}
              msgBar={"¡Gracias!"}
              msgField={"los datos han sido enviados"}
              bgColor="var(--amarillo)"
            />
          )}
          {error && (
            <Message
              closeRespuesta={closeRespuesta}
              msgBar={"Error"}
              msgField={`${error.status}: ${error.statusText}`}
              bgColor="var(--amarillo)"
            />
          )}
          <FormularioBandas
            createData={createData}
            respuesta={respuesta}
            error={error}
          />
        </div>
      ) : (
        <></>
      )}
      {selectedForm === "personajes" ? (
        <div className={`form-container fixed form ${isOpen && "is-open"}`}>
          <div className="form-barra-titulo verde">
            <h4 className="form-titulo">AGREGAR PERSONAJES</h4>
            <button onClick={closeModal} className="form-boton-cerrar">
              X
            </button>
          </div>
          {loading && <Loader />}
          {respuesta && (
            <Message
              closeRespuesta={closeRespuesta}
              msgBar={"¡Gracias!"}
              msgField={"los datos han sido enviados"}
              bgColor="var(--verde)"
            />
          )}
          {error && (
            <Message
              closeRespuesta={closeRespuesta}
              msgBar={"Error"}
              msgField={`${error.status}: ${error.statusText}`}
              bgColor="var(--verde)"
            />
          )}
          <FormularioPersonajes
            createDataPerso={createDataPerso}
            respuesta={respuesta}
            error={error}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
