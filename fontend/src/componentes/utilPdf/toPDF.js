import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import RubikBlack from "./../../fonts/Rubik/Rubik-Black.ttf";
import RubikRegular from "./../../fonts/Rubik/Rubik-Regular.ttf";
import { useParams } from "react-router-dom";

export default function ToPDF() {
  const [bandas, setBandas] = useState({
    nombre: "",
    año_inicio: "",
    año_fin: "",
    musicos: "",
    genero: "",
    ciudad: "",
    discos: "",
    descripcion: "",
  });

  const provincia = "Buenos Aires";

  const { data, error, loading } = useFetch(
    `http://localhost:3000/bandas/${provincia}`
  );

  Font.register(
    {
      family: "Rubik",
      format: "truetype",
      fonts: [
        { src: RubikBlack, fontWeight: 900 },
        { src: RubikRegular, fontWeight: 400 },
      ],
    },
    {
      family: "RubikRegular",
      format: "truetype",
      src: RubikRegular,
    }
  );

  Font.registerHyphenationCallback((word) => [word]);

  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      padding: "5%",
    },
    titulo: {
      fontFamily: "Rubik",
      fontWeight: "heavy",
      fontSize: "22px",
      marginBottom: "50pt",
    },
    view: {
      marginBottom: "10px",
      marginLeft: "5px",
      position: "relative",
      /* display: "flex",
      flexDirection: "row", */
    },
    tag: {
      fontFamily: "Rubik",
      fontSize: "16px", //para bandas con mucho texto 12px
      fontWeight: "normal",
      color: "white",
      backgroundColor: "black",
    },

    field: {
      fontFamily: "Rubik",
      fontSize: "16px", //para bandas con mucho texto 12px
      fontWeight: "normal",
    },
  });

  /* const Nprovincia = "Tierra del Fuego, Antártida e Islas del Atlántico Sur"; */
  return (
    <Document>
      <Page size={[566.9, 510.2]} style={styles.page}>
        <Text style={styles.titulo}>{provincia.toUpperCase()}</Text>
      </Page>

      {data &&
        data.bandas.map((banda) => (
          <Page size={[566.9, 510.2]} style={styles.page} key={banda.id}>
            <Text style={styles.titulo}>{banda.nombre.toUpperCase()}</Text>

            <View style={styles.view}>
              <Text style={styles.field}>
                <Text style={styles.tag}>{" Años: "}</Text>
                {!banda.año_inicio & !banda.año_fin ? (
                  <Text style={styles.field}>{" - "}</Text>
                ) : banda.año_inicio !== banda.año_fin ? (
                  <Text style={styles.field}>
                    {` ${banda.año_inicio || "?"} - ${
                      banda.año_fin === 2022 ? "presente" : banda.año_fin || "?"
                    }
                    `}
                  </Text>
                ) : (
                  <Text style={styles.field}>{` ${banda.año_inicio}`}</Text>
                )}
              </Text>
            </View>

            <View style={styles.view}>
              <Text style={styles.field}>
                <Text style={styles.tag}>{" Formación: "}</Text>
                {banda.musicos.length > 0 ? (
                  banda.musicos.map((musico, i) =>
                    i !== banda.musicos.length - 1 ? (
                      <Text style={styles.field}>
                        {` ${musico.nombre_musico}`}
                        {musico.instrumento ? ` (${musico.instrumento}),` : ","}
                      </Text>
                    ) : (
                      <Text style={styles.field}>
                        {` ${musico.nombre_musico}`}
                        {musico.instrumento ? ` (${musico.instrumento}).` : "."}
                      </Text>
                    )
                  )
                ) : (
                  <Text style={styles.field}>{" - "}</Text>
                )}
              </Text>
            </View>

            <View style={styles.view}>
              <Text style={styles.field}>
                <Text style={styles.tag}>{" Género: "}</Text>

                {banda.genero ? (
                  <Text style={styles.field}>{` ${banda.genero}.`}</Text>
                ) : (
                  <Text style={styles.field}>{" - "}</Text>
                )}
              </Text>
            </View>

            <View style={styles.view}>
              <Text style={styles.field}>
                <Text style={styles.tag}>{" Lugar: "}</Text>
                <Text
                  style={styles.field}
                >{` ${banda.ciudad}, ${banda.provincia}.`}</Text>
              </Text>
            </View>

            <View style={styles.view}>
              <Text style={styles.field}>
                <Text style={styles.tag}>{" Discos: "}</Text>
                {banda.discos.length > 0 ? (
                  banda.discos.map((disco, i) => (
                    <Text style={styles.field}>
                      {` "${disco.nombre_disco}"`}
                      {disco.año_disco !== null
                        ? i !== banda.discos.length - 1
                          ? ` (${disco.año_disco}),`
                          : ` (${disco.año_disco}).`
                        : i !== banda.discos.length - 1
                        ? ","
                        : "."}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.field}>{" - "}</Text>
                )}
              </Text>
            </View>

            <View style={styles.view}>
              <Text style={styles.field}>
                <Text style={styles.tag}>{" Descripción: "}</Text>
                {banda.descripcion ? (
                  <Text style={styles.field}>{` ${banda.descripcion}`}</Text>
                ) : (
                  <Text style={styles.field}>{" - "}</Text>
                )}
              </Text>
            </View>
          </Page>
        ))}
    </Document>
  );
}
