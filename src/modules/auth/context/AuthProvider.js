import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    console.log("Cambio en el auth:", auth);
  }, [auth]);

  useEffect(() => {
    setAuth({
      username: localStorage.getItem("username"),
      rol: localStorage.getItem("rol"),
      name: localStorage.getItem("name"),
      token: localStorage.getItem("accessToken"),
    });
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export function UseAuthContext() {
  return useContext(AuthContext);
}
