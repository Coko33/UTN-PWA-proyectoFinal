import React, { useState, useEffect, useRef } from "react";
import { helpHttp } from "../helpers/helpHttp";
import { Marker, Popup, Tooltip, useMapEvents } from "react-leaflet";
import {
  IconCirculo,
  IconCiudad,
  IconCuadrado,
  IconProvincia,
  IconTriangulo,
} from "./IconLocation";
import { useFetch } from "../../hooks/useFetch";
import Message from "../layout/Message";
import Loader from "../layout/Loader";
import L from "leaflet";

import Single from "./../modales/Single";

const BandasMarcadores = ({ url, zoom }) => {
  const { data, error, loading } = useFetch(url);

  /*zoom acual*/
  const [zoomLevel, setZoomLevel] = useState(5);
  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
  });
  if (!data) return null;

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Message
        msg={`Error ${error.status}: ${error.statusText}`}
        bgColor="#dc3545"
      />
    );
  }
  const { provincias } = require("./../../../src/assets/provincias.json");
  const ciudades = data.ciudades;
  const bandas = data.bandas;
  const lugares = data.lugares;
  const personajes = data.personajes;

  const openBandaSingle = (banda) => {
    console.log(banda);
  };

  const markersCiudades = ciudades.map((ciudad, i) => {
    let position = { lat: ciudad.lat, lng: ciudad.lng };
    return (
      <Marker
        key={i}
        position={position}
        icon={L.icon({
          iconUrl: "https://s3.sa-east-1.amazonaws.com/RefCiudades.svg",
          iconRetinaUrl: "https://s3.sa-east-1.amazonaws.com/RefCiudades.svg",
          iconAnchor: null,
          shadowUrl: null,
          shadowSize: null,
          shadowAnchor: null,
          iconSize: [(14 * zoomLevel) / 5, (14 * zoomLevel) / 5],
          className: "leaflet-venue-icon",
        })}
      >
        {zoomLevel > 5 ? (
          <Tooltip className="tooltip-ciudades" permanent>
            <p className="nombre-ciudades">{ciudad.ciudad}</p>
          </Tooltip>
        ) : (
          <></>
        )}
      </Marker>
    );
  });

  const markersBandas = bandas.map((banda, i) => {
    let lat = banda.lat + (Math.random() * (0.2 - -0.2) + -0.2);
    let lng = banda.lng + (Math.random() * (0.2 - -0.2) + -0.2);
    let position = { lat, lng };
    return (
      <Marker
        key={i}
        position={position}
        eventHandlers={{ click: () => openBandaSingle(banda) }}
        icon={L.icon({
          iconUrl: "https://s3.sa-east-1.amazonaws.com/RefTria_op50.svg",
          iconRetinaUrl: "https://s3.sa-east-1.amazonaws.com/RefTria_op50.svg",
          iconAnchor: null,
          shadowUrl: null,
          shadowSize: null,
          shadowAnchor: null,
          iconSize: [(16 * zoomLevel) / 5, (16 * zoomLevel) / 5],
          className: "leaflet-venue-icon",
        })}
      >
        {zoomLevel > 9 ? (
          <Tooltip className="tooltip-bandas" permanent>
            <p className="nombre-bandas amarillo">{banda.nombre}</p>
          </Tooltip>
        ) : (
          <></>
        )}
      </Marker>
    );
  });

  const markersLugares = lugares.map((lugar, i) => {
    let lat = lugar.lat + (Math.random() * (0.2 - -0.2) + -0.2);
    let lng = lugar.lng + (Math.random() * (0.2 - -0.2) + -0.2);
    let position = { lat, lng };
    return (
      <Marker
        key={i}
        position={position}
        icon={L.icon({
          iconUrl: "https://s3.sa-east-1.amazonaws.com/RefCirc_op50.svg",
          iconRetinaUrl: "https://s3.sa-east-1.amazonaws.com/RefCirc_op50.svg",
          iconAnchor: null,
          shadowUrl: null,
          shadowSize: null,
          shadowAnchor: null,
          iconSize: [(14 * zoomLevel) / 5, (14 * zoomLevel) / 5],
          className: "leaflet-venue-icon",
        })}
      >
        {zoomLevel > 9 ? (
          <Tooltip className="tooltip-bandas" permanent>
            <p className="nombre-bandas fucsia">{lugar.nombre}</p>
          </Tooltip>
        ) : (
          <></>
        )}
      </Marker>
    );
  });

  const markersPersonajes = personajes.map((personaje, i) => {
    let lat = personaje.lat + (Math.random() * (0.2 - -0.2) + -0.2);
    let lng = personaje.lng + (Math.random() * (0.2 - -0.2) + -0.2);
    let position = { lat, lng };
    return (
      <Marker
        key={i}
        position={position}
        icon={L.icon({
          iconUrl: "https://s3.sa-east-1.amazonaws.com/RefCuad_op50.svg",
          iconRetinaUrl: "https://s3.sa-east-1.amazonaws.com/RefCuad_op50.svg",
          iconAnchor: null,
          shadowUrl: null,
          shadowSize: null,
          shadowAnchor: null,
          iconSize: [(14 * zoomLevel) / 5, (14 * zoomLevel) / 5],
          className: "leaflet-venue-icon",
        })}
      >
        {zoomLevel > 9 ? (
          <Tooltip className="tooltip-bandas" permanent>
            <p className="nombre-bandas verde">{personaje.nombre}</p>
          </Tooltip>
        ) : (
          <></>
        )}
      </Marker>
    );
  });

  return [markersCiudades, markersBandas, markersLugares, markersPersonajes];
};

export default BandasMarcadores;
