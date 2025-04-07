import { ST__TOKEN_KEY } from "../../constants/ls_keys.js";
import api from "../api.js";

export async function SendLogin({ email, password }) {
  try {
    const result = await api.post("/api/v1/login", {
      email,
      password,
    });

    if (result.status === 200) {
      const { token } = result.data;
      localStorage.setItem(ST__TOKEN_KEY, token);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error during login:", error);
    return false;
  }
}
