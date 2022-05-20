import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="fondo">
      <div className="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
