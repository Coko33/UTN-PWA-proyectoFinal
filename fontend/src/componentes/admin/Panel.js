import React, { useState, useEffect } from "react";
import { helpHttp } from "../helpers/helpHttp";
import { useNavigate } from "react-router-dom";
import Loader from "./../layout/Loader";
import Message from "../layout/Message";
import "./Admin.css";
import { useAuth } from "../../context/authContext";

export default function Panel() {
  const [data, setData] = useState(null);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [respuesta, setRespuesta] = useState(null);
  const [resMsj, setResMsj] = useState("");

  let navigate = useNavigate();

  const { logout } = useAuth();

  const paginas = [];
  for (let i = 0; i < pages; i++) {
    paginas.push(i);
  }

  const provincia = "argentina";

  let api = helpHttp();
  let endpoint = "admin/all"; /* `bandas/${provincia}?page=${page}&size=10`; */

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
        navigate("../login");
      }
      setTimeout(() => setLoading(false), 500);
    });
  }, [respuesta]);

  const cerrarSesion = () => {
    logout();
    /* localStorage.removeItem("JWT");
    localStorage.removeItem("user"); */
    navigate("../");
  };

  const validateItem = (entidad, id) => {
    const endpoint = `bandas/${entidad}/${id}`;
    const dataToPut = { habilitado: 1 };
    let options = {
      body: JSON.stringify(dataToPut),
      headers: { "content-type": "application/json" },
    };
    api.put(endpoint, options).then((res) => {
      if (!res.err) {
        setResMsj(`Se habilitó ${entidad}: ${id}`);
        setRespuesta(true);
      } else {
        console.log("Hubo un error");
      }
    });
  };

  const deleteItem = (entidad, id) => {
    const endpoint = `bandas/${entidad}/${id}`;
    const dataToPut = { habilitado: 0, eliminado: 1 };
    let options = {
      body: JSON.stringify(dataToPut),
      headers: { "content-type": "application/json" },
    };
    api.put(endpoint, options).then((res) => {
      if (!res.err) {
        setResMsj(`Se eliminó ${entidad}: ${id}`);
        setRespuesta(true);
      } else {
        console.log("Hubo un error");
      }
    });
  };

  const editItem = (entidad, banda) => {
    const endpoint = `bandas/${entidad}/${banda.id}`;
    setDataToEdit(banda);
    console.log(endpoint);
  };

  const closeRespuesta = () => {
    setRespuesta(false);
    setError(null);
  };

  return (
    <>
      {loading && <Loader />}
      {respuesta && (
        <Message
          closeRespuesta={closeRespuesta}
          msgBar={"Ok!"}
          msgField={resMsj}
          bgColor="var(--amarilo)"
        />
      )}
      <div className="panelContainer">
        <div className="title-container__panel">
          <h1>Panel de administracion</h1>
          <button
            className="cerrarSesion btnLogin form-boton-agregar"
            onClick={() => cerrarSesion()}
          >
            cerrar sesión
          </button>

          <div className="container-bandasConfirm">
            <h3>
              <b>Bandas pendientes de confirmación</b>
            </h3>
            {data && !data.insertsPendientes.bandas.length && (
              <p className="emptyConfirm">
                (no hay bandas pendientes de confirmación)
              </p>
            )}
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Género</th>
                  <th>Años</th>
                  <th>Ciudad</th>
                  <th>Provincia</th>
                  <th className="columnHabilitar">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.insertsPendientes.bandas.map((banda, i) => (
                    <tr key={i}>
                      <td>{banda.id || null}</td>
                      <td>{banda.nombre || null}</td>
                      <td>{banda.descripcion || null}</td>
                      <td>{banda.genero || null}</td>
                      <td>
                        {`${banda.año_inicio} - ${banda.año_fin}` || null}
                      </td>
                      <td>{banda.ciudad || null}</td>
                      <td>{banda.provincia || null}</td>
                      <td>
                        <div className="flexHabilitar">
                          <button
                            className="btnPanel form-boton-agregar verdeBtn"
                            onClick={() => validateItem("modify", banda.id)}
                          >
                            habilitar
                          </button>
                          <button
                            className="btnPanel form-boton-agregar rojoBtn"
                            onClick={() => deleteItem("modify", banda.id)}
                          >
                            eliminar
                          </button>
                          <button
                            className="btnPanel form-boton-agregar amarilloBtn"
                            onClick={() => editItem("modify", banda)}
                          >
                            editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="container-bandasConfirm">
            <h3>
              <b>Imagenes de bandas pendientes de confirmación</b>
            </h3>
            {data && !data.insertsPendientes.fotosBandas.length && (
              <p className="emptyConfirm">
                (no hay imagenes de bandas pendientes de confirmación)
              </p>
            )}
            <table className="table">
              <thead>
                <tr>
                  <th>Id de la imagen</th>
                  <th>Id de la banda</th>
                  <th>Imagen</th>
                  <th>Titulo</th>
                  <th>Descripcion</th>
                  <th>Fecha</th>
                  <th className="columnHabilitar">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.insertsPendientes.fotosBandas.map((fotoBanda, i) => (
                    <tr key={i}>
                      <td>{fotoBanda.id || null}</td>
                      <td>{fotoBanda.bandaId || null}</td>
                      <td>
                        <img
                          src={`https://s3.sa-east-1.amazonaws.com/${fotoBanda.uid}`}
                          alt=""
                          className="toConfirm-img"
                        />
                      </td>
                      <td>{fotoBanda.titulo || null}</td>
                      <td>{fotoBanda.descripcion || null}</td>
                      <td>{fotoBanda.ts_create || null}</td>
                      <td>
                        <div className="flexHabilitar">
                          <button
                            className="btnPanel form-boton-agregar verdeBtn"
                            onClick={() =>
                              validateItem("modifyIb", fotoBanda.id)
                            }
                          >
                            habilitar
                          </button>
                          <button
                            className="btnPanel form-boton-agregar rojoBtn"
                            onClick={() => deleteItem("modifyIb", fotoBanda.id)}
                          >
                            eliminar
                          </button>
                          <button
                            className="btnPanel form-boton-agregar amarillo"
                            onClick={() => editItem("modify", fotoBanda)}
                          >
                            editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="container-bandasConfirm">
            <h3>
              <b>Mensajes de usuarios pendientes de confirmación</b>
            </h3>
            {data && !data.insertsPendientes.mensajesBandas.length && (
              <p className="emptyConfirm">
                (no hay mensajes pendientes de confirmación)
              </p>
            )}
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>bandaId</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Mensaje</th>
                  <th>Fecha</th>
                  <th className="columnHabilitar">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.insertsPendientes.mensajesBandas.map((mensaje, i) => (
                    <tr key={i}>
                      <td>{mensaje.id || null}</td>
                      <td>{mensaje.bandaId || null}</td>
                      <td>{mensaje.nombre || null}</td>
                      <td>{mensaje.email || null}</td>
                      <td>{mensaje.mensaje || null}</td>
                      <td>{mensaje.fecha || null}</td>
                      <td>
                        <div className="flexHabilitar">
                          <button
                            className="btnPanel form-boton-agregar verdeBtn"
                            onClick={() =>
                              validateItem("modifyMsg", mensaje.id)
                            }
                          >
                            habilitar
                          </button>
                          <button
                            className="btnPanel form-boton-agregar rojoBtn"
                            onClick={() => deleteItem("modifyIb", mensaje.id)}
                          >
                            eliminar
                          </button>
                          <button
                            className="btnPanel form-boton-agregar amarillo"
                            onClick={() => editItem("modify", mensaje.id)}
                          >
                            editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
