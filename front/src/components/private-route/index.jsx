import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import Menu from "../menu/index.jsx";
import styles from "./private-route.module.css";
import { ST__TOKEN_KEY } from "../../constants/ls_keys.js";
import { useEffect } from "react";
import api from "../../service/api.js";

export default function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem(ST__TOKEN_KEY);

  useEffect(() => {
    const token = localStorage.getItem(ST__TOKEN_KEY);
    if (token) {
      api.get("/verify");
    }
  }, []);

  return isAuthenticated ? (
    <div className={styles.privateRouteContainer}>
      <Menu />
      <div className={styles.privateRouteContent}>{children}</div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
