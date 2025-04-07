// src/components/Login.jsx
import React from "react";
import { SendLogin } from "../../service/user/login.js";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const loginData = {
      email,
      password,
    };

    try {
      const result = await SendLogin(loginData);
      if (result) {
        console.log("result :>> ", result);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Cabeçalho com o nome da aplicação */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">E-Agenda</h1>
          <p className="text-gray-600 mt-2">
            Conectando escola, alunos e famílias
          </p>
        </div>

        {/* Formulário de Login */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
              placeholder="Digite seu e-mail"
              required
              name="email"
              value={email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
              placeholder="Digite sua senha"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
            />
          </div>

          {/* Botão de Login */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
            disabled={loading}
            onClick={handleLogin}
          >
            Entrar
          </button>
        </form>

        {/* Links adicionais */}
        {/* <div className="mt-4 text-center text-sm">
          <a href="#" className="text-blue-600 hover:underline">
            Esqueceu sua senha?
          </a>
          <p className="mt-2 text-gray-600">
            Não tem uma conta?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Registre-se
            </a>
          </p>
        </div> */}

        {/* Detalhe decorativo escolar */}
        <div className="mt-6 flex justify-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
