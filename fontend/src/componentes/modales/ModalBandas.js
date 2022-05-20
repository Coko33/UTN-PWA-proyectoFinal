import React, { useRef, useState, useEffect } from "react";
import { helpHttp } from "../helpers/helpHttp";
import { useModal } from "../../hooks/useModal";
import Message from "../layout/Message";
import Loader from "../layout/Loader";
import Comentarios from "../mensajes/Comentarios";
import Fotos from "../mensajes/Fotos";
import "./ModalLateral.css";

export default function ModalBandas({ url, isOpen, closeModal, provincia }) {
  const [categoria, setCategoria] = useState(`BANDAS DE ${provincia}`);
  const [bandas, setBandas] = useState(null);
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState(null);

  const containerScroll = useRef();
  const resetScroll = () => (containerScroll.current.scrollTop = 0);

  let api = helpHttp();
  let endpoint = `bandas/${provincia}?page=${page}&size=10`;

  useEffect(() => {
    setLoading(true);
    api.get(endpoint).then((res) => {
      if (!res.err) {
        setData(res);
        setError(null);
        setPages(res.totalPages);
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

      <div className="scroll-container" ref={containerScroll}>
        {data &&
          data.bandas.map((banda) => (
            <div className="form-content" key={banda.id}>
              <h2 className="form-banda-nombre">{banda.nombre}</h2>
              <div className="form-field-container">
                <p className="form-tag">Ciudad:</p>
                <p className="form-field">
                  {banda.ciudad}, {banda.provincia}
                </p>
              </div>
              {(banda.año_inicio || banda.año_fin) && (
                <div className="form-field-container">
                  <p className="form-tag">Años:</p>
                  <p className="form-field">
                    {banda.año_inicio === banda.año_fin
                      ? `${banda.año_inicio}`
                      : `${banda.año_inicio || "?"} - ${banda.año_fin || "?"}`}
                  </p>
                </div>
              )}
              {banda.descripcion && (
                <div className="form-field-container">
                  <p className="form-tag">Descripción:</p>
                  <p className="form-field">{banda.descripcion}</p>
                </div>
              )}
              {banda.genero && (
                <div className="form-field-container">
                  <p className="form-tag">Género:</p>
                  <p className="form-field">{banda.genero}</p>
                </div>
              )}
              {banda.musicos.length > 0 && (
                <div className="form-field-container">
                  <p className="form-tag">Formación:</p>
                  {banda.musicos.map((musico, i) =>
                    musico.instrumento ? (
                      <p className="form-field" key={i}>
                        <b>{musico.nombre_musico}:</b> {musico.instrumento}.
                      </p>
                    ) : (
                      <p className="form-field" key={i}>
                        {musico.nombre_musico}.
                      </p>
                    )
                  )}
                </div>
              )}
              {banda.discos.length > 0 && (
                <div className="form-field-container">
                  <p className="form-tag">Discos:</p>
                  {banda.discos.map((disco, i) => (
                    <p className="form-field" key={i}>
                      {`"${disco.nombre_disco}"` || ""}
                      {disco.año_disco && ` (${disco.año_disco}).`}
                    </p>
                  ))}
                </div>
              )}
              {banda.canciones && (
                <div className="form-field-container">
                  <p className="form-tag">Canciones:</p>
                  <p className="form-field">{banda.canciones}</p>
                </div>
              )}
              {banda.audios.length > 0 && (
                <div className="form-field-container">
                  <p className="form-tag">Audios:</p>
                  {banda.audios.map((audio, i) => (
                    <>
                      <a
                        key={i}
                        href={audio.au_link}
                        target="_blank"
                        rel="noreferrer"
                        className="form-field"
                      >
                        {audio.au_titulo}
                      </a>
                      <p className="form-field">{audio.au_descripcion}</p>
                      <br></br>
                    </>
                  ))}
                </div>
              )}
              {banda.videos.length > 0 && (
                <div className="form-field-container">
                  <p className="form-tag">Videos:</p>
                  {banda.videos.map((video, i) => (
                    <>
                      <a
                        key={i}
                        href={video.vi_link}
                        target="_blank"
                        rel="noreferrer"
                        className="form-field"
                      >
                        {video.vi_titulo}
                      </a>
                      <p className="form-field">{video.vi_descripcion}</p>
                      <br></br>
                    </>
                  ))}
                </div>
              )}

              {banda.fotos &&
                banda.fotos.map((foto, i) => (
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
              {banda.lugares.length > 0 && (
                <div className="form-field-container">
                  <p className="form-tag">Lugares:</p>
                  {banda.lugares.map((lugar, i) => (
                    <p className="form-field" key={i}>
                      {lugar}
                    </p>
                  ))}
                </div>
              )}
              {banda.festivales.length > 0 && (
                <div className="form-field-container">
                  <p className="form-tag">Festivales:</p>
                  {banda.festivales.map((festival, i) => (
                    <p className="form-field" key={i}>
                      {festival}
                    </p>
                  ))}
                </div>
              )}
              <button
                onClick={() => openFot(banda.id, banda.nombre)}
                className="form-boton-agregar amarillo"
              >
                + AGREGAR FOTOS
              </button>
              {banda.mensajes.length !== 0 && (
                <div className="form-field-container">
                  <p className="form-tag">Comentarios:</p>
                  {banda.mensajes.map((mensaje, i) => (
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
                onClick={() => openCom(banda.id, banda.nombre)}
                className="form-boton-agregar amarillo"
              >
                + AGREGAR COMENTARIOS
              </button>
              <hr></hr>
            </div>
          ))}
        <div className="pagination-container">
          <button
            className="form-boton-agregar amarillo page"
            onClick={prevPage}
          >
            Anterior
          </button>
          {
            <p className="form-field page">
              pagina {page + 1} de {pages}
            </p>
          }
          <button
            className="form-boton-agregar amarillo page"
            onClick={nextPage}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
