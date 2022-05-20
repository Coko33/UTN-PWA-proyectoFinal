import React from "react";
import L, { map } from "leaflet";
import { imageOverlay } from "leaflet";

const imageUrl = "https://s3.sa-east-1.amazonaws.com/Cordoba.png";
const imageBounds = [
  [-32.142932663607 - 3, -63.8017532741662 - 3.6], // abajo izquierda
  [-32.142932663607 + 3.3, -63.8017532741662 + 2.7], // arriba derecha
];

export const layer = L.imageOverlay(imageUrl, imageBounds).addTo(map);

export default function MapLayer() {
  return layer;
}
