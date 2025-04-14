import { useEffect } from "react";
import "./App.css";
import Rotas from "./routes/router.jsx";
import { ROUTE_MENSAGENS } from "./constants/routes.jsx";

function App() {
  const path = window.location.pathname;
  const isRootPath = path === "/";

  useEffect(() => {
    if (isRootPath) {
      window.location.href = ROUTE_MENSAGENS;
    }
  }, [isRootPath]);

  return (
    <>
      <Rotas />
    </>
  );
}

export default App;
