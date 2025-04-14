import React from "react";
import { Route, createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../components/private-route/index.jsx";
import Mensagens from "../pages/mensagens/index.jsx";
import Login from "../pages/login/index.jsx";
import Agenda from "../pages/agenda/index.jsx";

export const ROUTE_MENSAGENS = "/mensagens";
export const ROUTE_AGENDA = "/agenda";
export const ROUTE_LOGIN = "/login";

const router = createBrowserRouter([
  {
    path: ROUTE_MENSAGENS,
    element: (
      <PrivateRoute>
        <Mensagens />
      </PrivateRoute>
    ),
  },
  {
    path: ROUTE_AGENDA,
    element: (
      <PrivateRoute>
        <Agenda />
      </PrivateRoute>
    ),
  },
  {
    path: ROUTE_LOGIN,
    element: <Login />,
  },
]);

export default router;
