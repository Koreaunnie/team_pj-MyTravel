import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthenticationContext = createContext(null);

function AuthenticationProvider({ children }) {
  const [userToken, setUserToken] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserToken(decoded);
    }
  }, []);

  function login(token) {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUserToken(decoded);
  }

  function logout() {
    localStorage.removeItem("token");
    setUserToken({});
  }

  function hasAccess(email) {
    return email === userToken.sub;
  }

  const isAuthenticated = Date.now() < userToken.exp * 1000;

  let isAdmin = false;

  let isPartner = false;

  if (userToken.scope) {
    isAdmin = userToken.scope.split(" ").includes("admin");
  }

  if (userToken.scope) {
    isPartner = userToken.scope.split(" ").includes("partner");
  }

  return (
    <AuthenticationContext.Provider
      value={{
        email: userToken.sub,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isPartner,
        hasAccess,
        userToken,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export default AuthenticationProvider;
