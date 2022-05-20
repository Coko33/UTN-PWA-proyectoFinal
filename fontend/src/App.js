import React, { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  HashRouter,
  Link,
} from "react-router-dom";
import "./App.css";
import ToPDF from "./componentes/utilPdf/toPDF";
import Nav from "./componentes/layout/Nav";
import { PDFViewer } from "@react-pdf/renderer";
import Login from "./componentes/admin/Login";
import Panel from "./componentes/admin/Panel";
import Intro from "./componentes/layout/Intro";
import RedirectProvincia from "./componentes/RedirectProvincia";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./componentes/ProtectedRoute";

function App() {
  const Argentina = lazy(() => {
    return Promise.all([
      import("./componentes/Home/Argentina"),
      new Promise((resolve) => setTimeout(resolve, 3900)),
    ]).then(([moduleExports]) => moduleExports);
  });
  const Provincia = lazy(() => import("./componentes/Provincia"));

  return (
    <HashRouter>
      <Suspense fallback={<Intro />}>
        <AuthProvider>
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route
              path="/panel"
              element={
                <ProtectedRoute>
                  <Panel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <>
                  <Nav />
                  <Argentina />
                </>
              }
            />
            <Route path="provincias/:provincia" element={<Argentina />}></Route>
            <Route
              path="/:provincia"
              element={
                <>
                  <Nav />
                  <Provincia />
                </>
              }
            ></Route>

            <Route
              path="/fichas"
              element={
                <PDFViewer
                  style={{
                    position: "absolute",
                    width: "60%",
                    marginLeft: "20%",
                    height: "800px",
                    top: "100px",
                  }}
                >
                  <ToPDF style={{ width: "80%" }}></ToPDF>
                </PDFViewer>
              }
            />
          </Routes>
        </AuthProvider>
      </Suspense>
    </HashRouter>
  );
}

export default App;
