import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogoNav } from "../../SVGs/LogoNav";
import "./Nav.css";

export default function Nav() {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const openMenu = () => setIsOpenMenu(true);
  const closeMenu = () => setIsOpenMenu(false);
  return (
    <>
      <div className="manzanaMenuBtn" onClick={() => openMenu()}>
        <img
          className="manzanaEstatica"
          src="https://s3.sa-east-1.amazonaws.com/manzanaLogo.png"
          alt="Créditos y reseña"
        ></img>
      </div>
      <div className={`containerLogoInstrucciones ${isOpenMenu && "isOpen"}`}>
        <div className="bordeBlanco">
          <div className="cerrar" onClick={() => closeMenu()}>
            <p>X</p>
          </div>
          <div className="container-logo" onClick={() => closeMenu()}>
            <NavLink to="/">
              <div className="logoHome">
                <LogoNav />
              </div>
              <img
                className="manzanaNav"
                src="https://s3.sa-east-1.amazonaws.com/manzana+logo.png"
                alt=""
              ></img>
            </NavLink>
          </div>
          <div className="containerInstrucciones">
            <div className="instrucciones">
              <p>
                En esta Aplicación podés ver las bandas, lugares y personajes
                que fueron parte del Rock en cada una de las provincias del país
                en la década del ´80. Además podés sumar otras bandas o agregar
                información, fotos y anécdotas para seguir enriqueciendo el
                mapeo.
              </p>
            </div>
            <div className="creditos">
              <div className="cred">
                <p className="credBold">Investigación:</p>
                <p className="credNombre">
                  Raúl Dirty Ortiz / Carlos Rolando / María Sol Bruno
                </p>
              </div>
              <div className="cred">
                <p className="credBold">Textos:</p>
                <p className="credNombre">Raúl Dirty Ortiz</p>
              </div>
              <div className="cred">
                <p className="credBold">Idea, diseño y producción:</p>
                <p className="credNombre">
                  Complejo Histórico Cultural Manzana de las Luces
                </p>
              </div>
            </div>
          </div>
          <div className="logosAbajo">
            <div className="logosSingle">
              <img
                src="https://s3.sa-east-1.amazonaws.com/logoManzana.png"
                alt="logo manzana de las luces"
              ></img>
            </div>
            <div className="logosSingle">
              <img
                src="https://s3.sa-east-1.amazonaws.com/logoMuseos.png"
                alt="logo manzana de las luces"
              ></img>
            </div>
            <div className="logosSingle">
              <img
                src="https://s3.sa-east-1.amazonaws.com/logoMinisterio.png"
                alt="logo manzana de las luces"
              ></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
