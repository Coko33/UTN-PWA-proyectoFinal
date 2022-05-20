import { createContext, useContext, useState } from "react";
import { helpHttp } from "../componentes/helpers/helpHttp";

export const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("There is not auth provider");
  return context;
};

export function AuthProvider({ children }) {
  let api = helpHttp();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (endpoint, form) => {
    let options = {
      body: JSON.stringify(form),
      headers: { "content-type": "application/json" },
    };

    await api.post(endpoint, options).then((res) => {
      if (!res.err) {
        setLoading(false);
        localStorage.setItem("JWT", res.JWT);
        setUser(res.info.usuario);
      } else {
        console.log(res.err);
      }
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("JWT");
  };

  return (
    <authContext.Provider value={{ login, user, logout, loading }}>
      {children}
    </authContext.Provider>
  );
}
