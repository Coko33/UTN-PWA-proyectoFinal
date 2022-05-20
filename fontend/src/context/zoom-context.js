import React, { useState, useEffect, useMemo } from "react";
import { useMapEvents } from "react-leaflet";

const ZoomContext = React.createContext();

export function ZoomProvider() {
  const [zoomLevel, setZoomLevel] = useState();
  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
  });

  const value = useMemo(() => {
    return {
      zoomLevel,
    };
  }, [zoomLevel]);

  return <ZoomContext.Provider value={value} />; //{...props}
}

export function useZoom() {
  const context = React.useContext(ZoomContext);
  if (!context) {
    throw new Error("useZoom debe estar dentro del proveedor ZoomContext");
  }
  return context;
}
