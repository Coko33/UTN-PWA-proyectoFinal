import React, { useState, useRef, useEffect } from "react";
import { helpHttp } from "../helpers/helpHttp";
import { useModal } from "../../hooks/useModal";
import Message from "../layout/Message";
import Loader from "../layout/Loader";
import ComentariosLugares from "../mensajes/ComentariosLugares";
import FotosLugares from "../mensajes/FotosLugares";
import "./ModalLateral.css";

export default function ModalLugares({ url, isOpen, closeModal, provincia }) {
  const [categoria, setCategoria] = useState(`LUGARES DE ${provincia}`);
  const [lugares, setLugares] = useState(null);
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState(null);

  const containerScroll = useRef();
  const resetScroll = () => (containerScroll.current.scrollTop = 0);

  let api = helpHttp();
  let endpoint = `lugares/${provincia}?page=${page}&size=10`;

  useEffect(() => {
    setLoading(true);
    api.get(endpoint).then((res) => {
      if (!res.err) {
        setPages(res.totalPages);
        setData(res);
        setError(null);
      } else {
        setData(null);
        setError(res);
      }
      setLoading(false);
    });
  }, [endpoint]);

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
      resetScroll();
    }
  };

  const nextPage = () => {
    if (page < pages - 1) {
      setPage(page + 1);
      resetScroll();
    } else {
      setPage(page);
    }
  };

  /*comentarios*/
  const [comDataLugar, setComDataLugar] = useState({});
  const [isOpenComentarios, openComentarios, closeComentarios] =
    useModal(false);
  const [isOpenFotos, openFotos, closeFotos] = useModal(false);

  const openCom = (id, nombre) => {
    openComentarios();
    setComDataLugar({ id, nombre });
  };

  const openFot = (id, nombre) => {
    openFotos();
    setComDataLugar({ id, nombre });
  };

  return (
    <div className={`form-container ${isOpen && "is-open"}`}>
      {
        <ComentariosLugares
          dataLugar={comDataLugar}
          isOpen={isOpenComentarios}
          closeModal={closeComentarios}
        />
      }
      {
        <FotosLugares
          dataLugar={comDataLugar}
          isOpen={isOpenFotos}
          closeModal={closeFotos}
        />
      }
      <div className="form-barra-titulo fucsia">
        <h4 className="form-titulo">{categoria}</h4>
        <button onClick={closeModal} className="form-boton-cerrar">
          X
        </button>
      </div>
      {loading && <Loader />}
      {error && <Message msg={`Error ${error.status}: ${error.statusText}`} />}

      <div className="scroll-container" ref={containerScroll}>
        {data &&
          data.lugares.map((lugar) => (
            <div className="form-content" key={lugar.id}>
              <h2 className="form-banda-nombre">{lugar.nombre}</h2>
              <div className="form-field-container">
                <p className="form-tag">Ciudad:</p>
                <p className="form-field">
                  {lugar.ciudad}, {lugar.provincia}
                </p>
              </div>
              {(lugar.año_inicio || lugar.año_fin) && (
                <div className="form-field-container">
                  <p className="form-tag">Años:</p>
                  <p className="form-field">
                    {lugar.año_inicio === lugar.año_fin
                      ? `${lugar.año_inicio}`
                      : `${lugar.año_inicio || "?"} - ${lugar.año_fin || "?"}`}
                  </p>
                </div>
              )}
              {lugar.descripcion && (
                <div className="form-field-container">
                  <p className="form-tag">Descripción:</p>
                  <p className="form-field">{lugar.descripcion}</p>
                </div>
              )}

              {lugar.fotos &&
                lugar.fotos.map((foto, i) => (
                  <div className="form-field-container foto" key={i}>
                    <img
                      src={`https://s3.sa-east-1.amazonaws/${foto.uid}`}
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

              {lugar.festivales.length !== 0 && (
                <div className="form-field-container">
                  <p className="form-tag">Festivales:</p>
                  {lugar.festivales.map((festival, i) => (
                    <div className="form-field-container mg-top" key={i}>
                      <p className="form-field" key={i}>
                        {festival.f_nombre}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => openFot(lugar.id, lugar.nombre)}
                className="form-boton-agregar fucsia"
              >
                + AGREGAR FOTOS
              </button>
              {lugar.mensajes.length !== 0 && (
                <div className="form-field-container">
                  <p className="form-tag">Comentarios:</p>
                  {lugar.mensajes.map((mensaje, i) => (
                    <div className="form-field-container mg-top" key={i}>
                      <b className="form-field">{mensaje.ml_nombre}</b>
                      <p className="form-field">{mensaje.dateString}</p>
                      <br></br>
                      <p className="form-field">{`"${mensaje.ml_mensaje}"`}</p>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => openCom(lugar.id, lugar.nombre)}
                className="form-boton-agregar fucsia"
              >
                + AGREGAR COMENTARIOS
              </button>
              <hr></hr>
            </div>
          ))}
        <div className="pagination-container">
          <button className="form-boton-agregar fucsia page" onClick={prevPage}>
            Anterior
          </button>
          {
            <p className="form-field page">
              pagina {page + 1} de {pages}
            </p>
          }
          <button className="form-boton-agregar fucsia page" onClick={nextPage}>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
