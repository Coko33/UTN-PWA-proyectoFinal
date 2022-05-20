import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const initialForm = {
    usuario: "",
    password: "",
  };
  const [form, setForm] = useState(initialForm);
  const [errorLogin, setErrorLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = "auth";
    try {
      await login(endpoint, form);
      navigate("../panel");
    } catch (e) {
      setErrorLogin(e);
      console.log(errorLogin);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="title-container__login">
      <h1>Ingresar usuario y contraseña</h1>
      <div className="formLogin">
        {errorLogin && <h3>Usuario o contraseña incorrectos</h3>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="usuario">Usuario</label>
          <input
            className="inputLogin"
            type="text"
            name="usuario"
            onChange={handleChange}
            placeholder="usuario"
            value={form.usuario}
          ></input>
          <label htmlFor="password">Contraseña</label>
          <input
            className="inputLogin"
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="contraseña"
            value={form.password}
          ></input>
          <input
            type="submit"
            value="Enviar"
            className="btnLogin form-boton-agregar amarillo"
          ></input>
        </form>
      </div>
    </div>
  );
}
