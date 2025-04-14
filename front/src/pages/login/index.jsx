// src/components/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SendLogin } from "../../service/user/login.js";
import { ST__TOKEN_KEY } from "../../constants/ls_keys.js";
import { ROUTE_MENSAGENS } from "../../constants/routes.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }
    setLoading(true);
    setError("");

    const loginData = {
      email,
      password,
    };

    try {
      const result = await SendLogin(loginData);
      if (result) {
        navigate(ROUTE_MENSAGENS);
      } else {
        setError("E-mail ou senha inválidos");
      }
    } catch (error) {
      console.log("error :>> ", error);
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  }
  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleLogin(event);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem(ST__TOKEN_KEY);
    if (token) {
      navigate(ROUTE_MENSAGENS);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Lado com imagem */}
        <div className="md:w-1/2 bg-blue-200 flex items-center justify-center p-6">
          <img
            src="https://img.freepik.com/vetores-premium/estudantes-na-sala-de-aula-fazendo-anotacoes-desenho-animado-vetorial_701961-429.jpg"
            alt="Educação"
            className="max-h-80 object-contain rounded-xl shadow-lg"
          />
        </div>

        {/* Lado do formulário */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-4 text-center">
            Bem-vindo à E-Agenda
          </h2>
          <p className="text-gray-600 text-center">
            Sua agenda escolar virtual
          </p>
          <p className="text-gray-600 text-center mb-6">
            conectando escola, alunos e famílias
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                name="email"
                value={email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                required
                autoComplete="email"
                autoFocus
                aria-label="E-mail"
                aria-required="true"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                name="password"
                value={password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                required
                autoComplete="current-password"
                aria-label="Senha"
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleLogin}
              disabled={loading}
              aria-label="Entrar"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
                  ></path>
                </svg>
              ) : (
                "Entrar"
              )}
            </button>
            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}

            <p className="text-sm text-center text-gray-500 mt-4">
              Ainda não tem uma conta?{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Fale com a escola
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
