const axios = require("axios");

const getCiudad = async (ciudad, provincia) => {
  try {
    const urlProvincias = `https://apis.datos.gob.ar/georef/api/provincias?nombre=${provincia}`;
    const dataProvincias = await axios.get(urlProvincias);
    const [dataProvincia] = dataProvincias.data.provincias;
    const idProvincia = dataProvincia.id;
    const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${idProvincia}&nombre=${ciudad}`;
    const data = await axios.get(url);

    if (data.data.cantidad === 1) {
      [dataCiudad] = data.data.localidades;
      const result = {
        nombre: dataCiudad.localidad_censal.nombre,
        lat: dataCiudad.centroide.lat,
        lon: dataCiudad.centroide.lon,
        provincia: dataCiudad.provincia.nombre,
      };
      return result;
    } else if (data.data.cantidad > 1) {
      [dataCiudad] = data.data.localidades;
      const result = {
        nombre: dataCiudad.localidad_censal.nombre,
        lat: dataCiudad.centroide.lat,
        lon: dataCiudad.centroide.lon,
        provincia: dataCiudad.provincia.nombre,
      };
      return result;
    }
  } catch (e) {
    throw e;
  }
};

module.exports = { getCiudad };
