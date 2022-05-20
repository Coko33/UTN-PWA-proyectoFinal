import React, { useState, useEffect } from "react";
import { helpHttp } from "../helpers/helpHttp";
import { useModal } from "../../hooks/useModal";
import Message from "../layout/Message";
import Loader from "../layout/Loader";
import Comentarios from "../mensajes/Comentarios";
import Fotos from "../mensajes/Fotos";

export default function Single(idBanda, isOpen, closeModal, provincia) {
  const [categoria, setCategoria] = useState(`BANDAS DE ${provincia}`);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  let api = helpHttp();
  let endpoint = `bandas/single/${idBanda}`;

  useEffect(() => {
    setLoading(true);
    api.get(endpoint).then((res) => {
      if (!res.err) {
        setData(res);
        setError(null);
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
          {data.banda.genero && (
            <div className="form-field-container">
              <p className="form-tag">Género:</p>
              <p className="form-field">{data.banda.genero}</p>
            </div>
          )}
          {data.musicos.length > 0 && (
            <div className="form-field-container">
              <p className="form-tag">Formación:</p>
              {data.musicos.map((musico, i) =>
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
          {data.discos.length > 0 && (
            <div className="form-field-container">
              <p className="form-tag">Discos:</p>
              {data.discos.map((disco, i) => (
                <p className="form-field" key={i}>
                  {`"${disco.nombre_disco}"` || ""}
                  {disco.año_disco && ` (${disco.año_disco}).`}
                </p>
              ))}
            </div>
          )}
          {data.canciones && (
            <div className="form-field-container">
              <p className="form-tag">Canciones:</p>
              <p className="form-field">{data.canciones}</p>
            </div>
          )}
          {data.audios.length > 0 && (
            <div className="form-field-container">
              <p className="form-tag">Audios:</p>
              {data.audios.map((audio, i) => (
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
          {data.videos.length > 0 && (
            <div className="form-field-container">
              <p className="form-tag">Videos:</p>
              {data.videos.map((video, i) => (
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

          {data.fotos &&
            data.fotos.map((foto, i) => (
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
          {data.lugares.length > 0 && (
            <div className="form-field-container">
              <p className="form-tag">Lugares:</p>
              {data.lugares.map((lugar, i) => (
                <p className="form-field" key={i}>
                  {lugar}
                </p>
              ))}
            </div>
          )}
          {data.festivales.length > 0 && (
            <div className="form-field-container">
              <p className="form-tag">Festivales:</p>
              {data.festivales.map((festival, i) => (
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
          {data.mensajes.length !== 0 && (
            <div className="form-field-container">
              <p className="form-tag">Comentarios:</p>
              {data.mensajes.map((mensaje, i) => (
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
          <hr></hr>
        </div>
      </div>
    </div>
  );
}
