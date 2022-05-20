import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import ModalBandas from "./ModalBandas";
import ModalLugares from "./ModalLugares";
import ModalPersonajes from "./ModalPersonajes";
import Formularios from "../formularios/Formularios";
import "./Modales.css";

export default function Modales({ provincia }) {
  const [isOpenModalLugares, openModalLugares, closeModalLugares] =
    useModal(false);
  const [isOpenModalBandas, openModalBandas, closeModalBandas] =
    useModal(false);
  const [isOpenModalPersonajes, openModalPersonajes, closeModalPersonajes] =
    useModal(false);
  const [isOpenFormularios, openFormularios, closeFormularios] =
    useModal(false);

  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const openAdd = () => {
    setIsOpenAdd(!isOpenAdd);
    closeModalBandas();
    closeModalLugares();
    closeModalPersonajes();
  };

  const handleModalContainerClick = (e) => e.stopPropagation();

  const [selectedForm, setSelectedForm] = useState(null);
  const openSelectedForm = (f) => {
    openFormularios();
    setSelectedForm(f);
  };

  const url = "http://localhost:3000/";

  if (provincia === "") {
    provincia = "Argentina";
  }

  const openLugares = () => {
    openModalLugares();
    closeModalBandas();
    closeModalPersonajes();
  };
  const openBandas = () => {
    openModalBandas();
    closeModalLugares();
    closeModalPersonajes();
  };
  const openPersonajes = () => {
    openModalPersonajes();
    closeModalLugares();
    closeModalBandas();
  };

  return (
    <>
      {provincia && (
        <ModalLugares
          url={url}
          provincia={provincia}
          isOpen={isOpenModalLugares}
          closeModal={closeModalLugares}
        />
      )}
      {provincia && (
        <ModalBandas
          url={url}
          isOpen={isOpenModalBandas}
          closeModal={closeModalBandas}
          provincia={provincia}
        />
      )}
      {provincia && (
        <ModalPersonajes
          url={url}
          isOpen={isOpenModalPersonajes}
          closeModal={closeModalPersonajes}
          provincia={provincia}
        />
      )}

      <div className="footer-container">
        <div className="footer-flex-container">
          <button
            onClick={() => openLugares()}
            className="footer-boton footer-boton-ref"
          >
            <img
              className="footer-icon-ref"
              src="https://s3.sa-east-1.amazonaws.com/RefCirculo.svg"
              alt=""
            />
            Lugares
          </button>

          <button
            onClick={() => openBandas()}
            className="footer-boton footer-boton-ref"
          >
            <img
              className="footer-icon-ref triangulo"
              src="https://s3.sa-east-1.amazonaws.com/RefTriangulo.svg"
              alt=""
            />
            Bandas
          </button>

          <button
            onClick={() => openPersonajes()}
            className="footer-boton footer-boton-ref "
          >
            <img
              className="footer-icon-ref"
              src="https://s3.sa-east-1.amazonaws.com/RefCuadrado.svg"
              alt=""
            />
            Personajes
          </button>

          <div className="footer-masInfo">
            <p>
              Aportá
              <br></br>más datos
            </p>
            <p id="flecha">&#11015;</p>
          </div>
          <button
            onClick={() => openAdd()}
            className="footer-boton footer-boton-agregar"
          >
            +
          </button>
        </div>
      </div>

      <div
        onClick={() => openAdd()}
        className={`modal-agregar-fondo ${isOpenAdd && "is-openAdd"}`}
      >
        <div
          className="modal-agregar-contenedorBotones"
          onClick={handleModalContainerClick}
        >
          <button
            onClick={() => openSelectedForm("lugares")}
            className="modal-agregar-boton"
          >
            <p>+</p>
            <p className="fucsia">lugares</p>
          </button>
          <button
            onClick={() => openSelectedForm("bandas")}
            className="modal-agregar-boton"
          >
            <p>+</p>
            <p className="amarillo">bandas</p>
          </button>
          <button
            onClick={() => openSelectedForm("personajes")}
            className="modal-agregar-boton"
          >
            <p>+</p>
            <p className="verde">Personajes</p>
          </button>
          <Formularios
            isOpen={isOpenFormularios}
            closeModal={closeFormularios}
            selectedForm={selectedForm}
          />
        </div>
      </div>
    </>
  );
}
