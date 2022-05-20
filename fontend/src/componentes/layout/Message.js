import React from "react";
import "./Message.css";
import "./../modales/ModalLateral.css";

const Message = ({ msgBar, msgField, bgColor, closeModal, closeRespuesta }) => {
  let styles = {
    backgroundColor: bgColor,
  };
  return (
    <div className="fondo">
      <div className="message-container">
        <div className="form-barra-titulo" style={styles}>
          <h4 className="form-titulo">{msgBar}</h4>
          <button onClick={closeRespuesta} className="form-boton-cerrar">
            X
          </button>
        </div>
        <p className="msgField">{msgField}</p>
      </div>
    </div>
  );
};

export default Message;
