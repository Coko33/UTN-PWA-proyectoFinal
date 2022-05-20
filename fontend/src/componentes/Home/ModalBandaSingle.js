import React, { useRef, useState, useEffect } from "react";
import { helpHttp } from "../../componentes/helpers/helpHttp";
import { useModal } from "../../hooks/useModal";
import Comentarios from "../../componentes/mensajes/Comentarios";
import Fotos from "../../componentes/mensajes/Fotos";
import Message from "../../componentes/layout/Message";
import Loader from "../../componentes/layout/Loader";
import "./../modales/ModalLateral.css";

export default function ModalBandaSingle({
  url,
  bandaNombre,
  isOpen,
  closeModal,
  provincia,
}) {
  const [categoria, setCategoria] = useState(`${bandaNombre}`);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const bandaId = 288;
  let api = helpHttp();
  let endpoint = `bandas/single/${bandaId}`;

  useEffect(() => {
    setLoading(true);
    api.get(endpoint).then((res) => {
      if (!res.err) {
        setData(res);
        setError(null);
        console.log(data);
      } else {
        setData(null);
        setError(res);
      }
      setLoading(false);
    });
  }, [endpoint]);

  /*comentarios*/
  const [comDataBanda, setComDataBanda] = useState({});
  const [isOpenComentarios, openComentarios, closeComentarios] =
    useModal(false);
  const [isOpenFotos, openFotos, closeFotos] = useModal(false);

  const openCom = (id, nombre) => {
    openComentarios();
    setComDataBanda({ id, nombre });
  };

  const openFot = (id, nombre) => {
    openFotos();
    setComDataBanda({ id, nombre });
  };

  return (
    <div className={`form-container onFlex ${isOpen && "is-open"}`}>
      {
        <Comentarios
          dataBanda={comDataBanda}
          isOpen={isOpenComentarios}
          closeModal={closeComentarios}
        />
      }
      {
        <Fotos
          dataBanda={comDataBanda}
          isOpen={isOpenFotos}
          closeModal={closeFotos}
        />
      }
      <div className="form-barra-titulo amarillo">
        <h4 className="form-titulo">{categoria}</h4>
        <button onClick={closeModal} className="form-boton-cerrar">
          X
        </button>
      </div>
      {loading && <Loader />}
      {error && <Message msg={`Error ${error.status}: ${error.statusText}`} />}

      <div className="scroll-container">
        <div className="form-content" key={data.banda.id}>
          <h2 className="form-banda-nombre">{data.banda.nombre}</h2>
          <div className="form-field-container">
            <p className="form-tag">Ciudad:</p>
            <p className="form-field">
              {data.banda.ciudad}, {data.banda.provincia}
            </p>
          </div>
          {(data.banda.año_inicio || data.banda.año_fin) && (
            <div className="form-field-container">
              <p className="form-tag">Años:</p>
              <p className="form-field">
                {data.banda.año_inicio === data.banda.año_fin
                  ? `${data.banda.año_inicio}`
                  : `${data.banda.año_inicio || "?"} - ${
                      data.banda.año_fin || "?"
                    }`}
              </p>
            </div>
          )}
          {data.banda.descripcion && (
            <div className="form-field-container">
              <p className="form-tag">Descripción:</p>
              <p className="form-field">{data.banda.descripcion}</p>
            </div>
          )}
          {data.banda.musicos.length > 0 && (
            <div className="form-field-container">
              <p className="form-tag">Formación:</p>
              {data.banda.musicos.map((musico, i) =>
                musico.instrumento ? (
                  <p className="form-field" key={i}>
                    {musico.nombre_musico}: <b>{musico.instrumento}</b>.
                  </p>
                ) : (
                  <p className="form-field" key={i}>
                    {musico.nombre_musico}.
                  </p>
                )
              )}
            </div>
          )}
          {data.banda.genero && (
            <div className="form-field-container">
              <p className="form-tag">Género:</p>
              <p className="form-field">{data.banda.genero}</p>
            </div>
          )}
          {data.banda.discos.length > 0 && (
            <div className="form-field-container">
              <p className="form-tag">Discos:</p>
              {data.banda.discos.map((disco, i) => (
                <p className="form-field" key={i}>
                  {`"${disco.nombre_disco}"` || ""}
                  {disco.año_disco && ` (${disco.año_disco}).`}
                </p>
              ))}
            </div>
          )}
          {data.banda.fotos &&
            data.banda.fotos.map((foto, i) => (
              <div className="form-field-container foto" key={i}>
                <img
                  src={`https://s3.sa-east-1.amazonaws.com/${foto.uid}`}
                  alt=""
                  className="form-img"
                />
                <p className="form-field form-field-bajada titulo">
                  {foto.titulo_foto}{" "}
                </p>
                <p className="form-field form-field-bajada">
                  {foto.descripcion_foto}
                </p>
              </div>
            ))}
          {data.banda.lugares.length > 0 && (
            <div className="form-field-container">
              <p className="form-tag">Lugares:</p>
              {data.banda.lugares.map((lugar, i) => (
                <p className="form-field" key={i}>
                  {lugar}
                </p>
              ))}
            </div>
          )}
          {data.banda.festivales.length > 0 && (
            <div className="form-field-container">
              <p className="form-tag">Festivales:</p>
              {data.banda.festivales.map((festival, i) => (
                <p className="form-field" key={i}>
                  {festival}
                </p>
              ))}
            </div>
          )}
          <button
            onClick={() => openFot(data.banda.id, data.banda.nombre)}
            className="form-boton-agregar amarillo"
          >
            + AGREGAR FOTOS
          </button>
          {data.banda.mensajes.length !== 0 && (
            <div className="form-field-container">
              <p className="form-tag">Comentarios:</p>
              {data.banda.mensajes.map((mensaje, i) => (
                <div className="form-field-container mg-top" key={i}>
                  <b className="form-field">{mensaje.mb_nombre}</b>
                  <p className="form-field">{mensaje.dateString}</p>
                  <br></br>
                  <p className="form-field">{`"${mensaje.mb_mensaje}"`}</p>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => openCom(data.banda.id, data.banda.nombre)}
            className="form-boton-agregar amarillo"
          >
            + AGREGAR COMENTARIOS
          </button>
        </div>
      </div>
    </div>
  );
}
