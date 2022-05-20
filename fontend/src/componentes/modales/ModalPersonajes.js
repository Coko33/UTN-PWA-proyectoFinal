import React, { useState, useRef, useEffect } from "react";
import { helpHttp } from "../helpers/helpHttp";
import { useModal } from "../../hooks/useModal";
import Message from "../layout/Message";
import Loader from "../layout/Loader";
import ComentariosPersonajes from "../mensajes/ComentariosPersonajes";
import FotosPersonajes from "../mensajes/FotosPersonajes";
import "./ModalLateral.css";

export default function ModalPersonajes({
  url,
  isOpen,
  closeModal,
  provincia,
}) {
  const [categoria, setCategoria] = useState(`PERSONAJES DE ${provincia}`);
  const [personajes, setPersonajes] = useState(null);

  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState(null);

  const containerScroll = useRef();
  const resetScroll = () => (containerScroll.current.scrollTop = 0);

  let api = helpHttp();
  let endpoint = `personajes/${provincia}?page=${page}&size=10}`;

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
  const [comDataPersonaje, setComDataPersonaje] = useState({});
  const [isOpenComentarios, openComentarios, closeComentarios] =
    useModal(false);
  const [isOpenFotos, openFotos, closeFotos] = useModal(false);

  const openCom = (id, nombre) => {
    openComentarios();
    setComDataPersonaje({ id, nombre });
  };

  const openFot = (id, nombre) => {
    openFotos();
    setComDataPersonaje({ id, nombre });
  };

  return (
    <div className={`form-container onFlex ${isOpen && "is-open"}`}>
      {
        <ComentariosPersonajes
          dataPersonaje={comDataPersonaje}
          isOpen={isOpenComentarios}
          closeModal={closeComentarios}
        />
      }
      {
        <FotosPersonajes
          dataPersonaje={comDataPersonaje}
          isOpen={isOpenFotos}
          closeModal={closeFotos}
        />
      }
      <div className="form-barra-titulo verde">
        <h4 className="form-titulo">{categoria}</h4>
        <button onClick={closeModal} className="form-boton-cerrar">
          X
        </button>
      </div>
      {loading && <Loader />}
      {error && <Message msg={`Error ${error.status}: ${error.statusText}`} />}

      <div className="scroll-container" ref={containerScroll}>
        {data &&
          data.personajes.map((personaje) => (
            <div className="form-content" key={personaje.id}>
              <h2 className="form-banda-nombre">{personaje.nombre}</h2>

              <div className="form-field-container">
                <p className="form-tag">Ciudad:</p>
                <p className="form-field">{personaje.ciudad}</p>
              </div>

              <div className="form-field-container">
                <p className="form-tag">Descripción:</p>
                <p className="form-field">{personaje.descripcion}</p>
              </div>

              <div className="form-field-container">
                <p className="form-tag">Bio:</p>
                <p className="form-field">{personaje.bio}</p>
              </div>
              {personaje.mensajes.length !== 0 && (
                <div className="form-field-container">
                  <p className="form-tag">Comentarios:</p>
                  {personaje.mensajes.map((mensaje, i) => (
                    <div className="form-field-container mg-top" key={i}>
                      <b className="form-field">{mensaje.mp_nombre}</b>
                      <p className="form-field">{mensaje.dateString}</p>
                      <br></br>
                      <p className="form-field">{`"${mensaje.mp_mensaje}"`}</p>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => openCom(personaje.id, personaje.nombre)}
                className="form-boton-agregar verde"
              >
                + AGREGAR COMENTARIOS
              </button>
            </div>
          ))}
        <div className="pagination-container">
          <button className="form-boton-agregar verde page" onClick={prevPage}>
            Anterior
          </button>
          {
            <p className="form-field page">
              pagina {page + 1} de {pages}
            </p>
          }
          <button className="form-boton-agregar verde page" onClick={nextPage}>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
