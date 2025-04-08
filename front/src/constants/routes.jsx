import React from "react";
import { Route, createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../components/private-route/index.jsx";
import Dashboard from "../pages/dashboard/index.jsx";
import Login from "../pages/login/index.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
