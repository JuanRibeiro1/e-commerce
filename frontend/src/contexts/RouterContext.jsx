import React, { createContext, useContext, useState } from "react";

// ✅ Agora exportamos o RouterContext
export const RouterContext = createContext();

export function RouterProvider({ children }) {
  const [currentRoute, setCurrentRoute] = useState("/");

  const navigate = (route) => {
    setCurrentRoute(route);
    window.history.pushState({}, "", route);
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

// Hook oficial
export function useRouterContext() {
  return useContext(RouterContext);
}

// ✅ alias para manter compatibilidade
export const useRouter = useRouterContext;