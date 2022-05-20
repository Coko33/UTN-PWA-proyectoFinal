import React, { useState, useEffect } from "react";
import { MapContainer, SVGOverlay, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Provincia.css";
import BandasMarcadores from "./Home/BandasMarcadores";
import { useParams, NavLink } from "react-router-dom";

//provincias
import { BuenosAires } from "../SVGs/provincias/BuenosAires";
import { Catamarca } from "../SVGs/provincias/Catamarca";
import { Chaco } from "../SVGs/provincias/Chaco";
import { Chubut } from "../SVGs/provincias/Chubut";
import { Corodoba } from "../SVGs/provincias/Cordoba";
import { Corrientes } from "../SVGs/provincias/Corrientes";
import { EntreRios } from "../SVGs/provincias/EntreRios";
import { Formosa } from "../SVGs/provincias/Formosa";
import { Jujuy } from "../SVGs/provincias/Jujuy";
import { LaPampa } from "../SVGs/provincias/LaPampa";
import { LaRioja } from "../SVGs/provincias/LaRioja";
import { Mendoza } from "../SVGs/provincias/Mendoza";
import { Misiones } from "../SVGs/provincias/Misiones";
import { Neuquen } from "../SVGs/provincias/Neuquen";
import { RioNegro } from "../SVGs/provincias/RioNegro";
import { Salta } from "../SVGs/provincias/Salta";
import { SantaCruz } from "../SVGs/provincias/SantaCruz";
import { SantiagoDelEstero } from "../SVGs/provincias/SantiagoDelEstero";
import { SantaFe } from "../SVGs/provincias/SantaFe";
import { SanJuan } from "../SVGs/provincias/SanJuan";
import { SanLuis } from "../SVGs/provincias/SanLuis";
import { TierraDelFuego } from "../SVGs/provincias/TierraDelFuego";
import { Tucuman } from "../SVGs/provincias/Tucuman";

import Modales from "./modales/Modales";

export default function Provincia() {
  const widthS = window.innerWidth;
  let { provincia } = useParams();
  const { provincias } = require("./../../src/assets/provincias.json");
  const {
    provinciasBounds,
  } = require("./../../src/assets/provinciasBounds.json");
  const [currentLocation, setCurrentLocation] = useState();
  const [nombreProvincia, setNombreProvincia] = useState();
  const [zoom, setZoom] = useState();
  const [bounds, setBounds] = useState([]);

  useEffect(() => {
    const setearBounds = () => {
      let prov = provincia[0].toUpperCase() + provincia.slice(1);
      let boundsProv = provinciasBounds[prov.replace(/ /g, "")];
      setBounds(boundsProv);
    };

    const setearLocacion = () => {
      let prov = provincias.filter((prov) => prov.iso_nombre === provincia);
      let loc = {
        lat: prov[0].centroide.lat.toString(),
        lng: prov[0].centroide.lon.toString(),
      };
      if (widthS > 1441) {
        setZoom(7);
      } else if (widthS > 1081) {
        setZoom(6);
      } else {
        setZoom(5);
      }
      setCurrentLocation(loc);
      setNombreProvincia(prov[0].nombre);
    };
    setearBounds();
    setearLocacion();
  }, []);

  return (
    <>
      <div className="ArgVolverBtn">
        <NavLink to="/">
          <img className="argIco" src="" alt="Créditos y reseña"></img>
        </NavLink>
      </div>
      {currentLocation && (
        <MapContainer
          center={currentLocation}
          zoom={zoom}
          zoomControl={true}
          minZoom={4}
          maxZoom={12}
          zoomSnap={0.25}
          wheelPxPerZoomLevel={200}
        >
          {provincia === "Buenos Aires" ? (
            <SVGOverlay className="SVGMap svg-buenosaires" bounds={bounds}>
              <BuenosAires />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Catamarca" ? (
            <SVGOverlay className="SVGMap svg-catamarca" bounds={bounds}>
              <Catamarca />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Chaco" ? (
            <SVGOverlay className="SVGMap svg-chaco" bounds={bounds}>
              <Chaco />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Chubut" ? (
            <SVGOverlay className="SVGMap svg-chubut" bounds={bounds}>
              <Chubut />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Cordoba" ? (
            <SVGOverlay className="SVGMap svg-cordoba" bounds={bounds}>
              <Corodoba />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Corrientes" ? (
            <SVGOverlay className="SVGMap svg-corrientes" bounds={bounds}>
              <Corrientes />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Entre Rios" ? (
            <SVGOverlay className="SVGMap svg-entrerios" bounds={bounds}>
              <EntreRios />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Formosa" ? (
            <SVGOverlay className="SVGMap svg-formosa" bounds={bounds}>
              <Formosa />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Jujuy" ? (
            <SVGOverlay className="SVGMap svg-jujuy" bounds={bounds}>
              <Jujuy />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "La Pampa" ? (
            <SVGOverlay className="SVGMap svg-lapampa" bounds={bounds}>
              <LaPampa />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "La Rioja" ? (
            <SVGOverlay className="SVGMap svg-larioja" bounds={bounds}>
              <LaRioja />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Mendoza" ? (
            <SVGOverlay className="SVGMap svg-mendoza" bounds={bounds}>
              <Mendoza />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Misiones" ? (
            <SVGOverlay className="SVGMap svg-misiones" bounds={bounds}>
              <Misiones />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Neuquen" ? (
            <SVGOverlay className="SVGMap svg-neuquen" bounds={bounds}>
              <Neuquen />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Rio Negro" ? (
            <SVGOverlay className="SVGMap svg-rionegro" bounds={bounds}>
              <RioNegro />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Salta" ? (
            <SVGOverlay className="SVGMap svg-salta" bounds={bounds}>
              <Salta />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Santa Cruz" ? (
            <SVGOverlay className="SVGMap svg-santacruz" bounds={bounds}>
              <SantaCruz />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Santiago del Estero" ? (
            <SVGOverlay
              className="SVGMap svg-santiagodelestero"
              bounds={bounds}
            >
              <SantiagoDelEstero />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Santa Fe" ? (
            <SVGOverlay className="SVGMap svg-santafe" bounds={bounds}>
              <SantaFe />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "San Juan" ? (
            <SVGOverlay className="SVGMap svg-sanjuan" bounds={bounds}>
              <SanJuan />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "San Luis" ? (
            <SVGOverlay className="SVGMap svg-sanluis" bounds={bounds}>
              <SanLuis />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Tierra del Fuego" ? (
            <SVGOverlay className="SVGMap svg-tierradelfuego" bounds={bounds}>
              <TierraDelFuego />
            </SVGOverlay>
          ) : (
            <></>
          )}
          {provincia === "Tucuman" ? (
            <SVGOverlay className="SVGMap svg-tucuman" bounds={bounds}>
              <Tucuman />
            </SVGOverlay>
          ) : (
            <></>
          )}

          <BandasMarcadores
            provincias={provincias}
            url={`http://localhost:3000/${provincia}`}
          />
        </MapContainer>
      )}
      {nombreProvincia && (
        <h1 className="titulo-provincia">
          <span className="titulo-provincia-span">{nombreProvincia}</span>
        </h1>
      )}
      <Modales provincia={provincia} />
    </>
  );
}
