import React, { useState, useEffect } from "react";
import { Logo } from "../../SVGs/Logo";
import manzana from "./../../assets/img/manzanaLogo.png";
import "./Intro.css";

export default function Intro() {
  return (
    <>
      <div className="introContainer">
        <img className="manzana" src={manzana} alt="logo manzana"></img>
        <div className="soloLogo">
          <Logo />
        </div>
      </div>
    </>
  );
}
