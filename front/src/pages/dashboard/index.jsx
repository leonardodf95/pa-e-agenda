// src/pages/Dashboard.tsx
import React, { useState } from "react";
import { FiSend } from "react-icons/fi";

const mensagensMock = [
  {
    id: 1,
    tipo: "recebida",
    conteudo: "Reunião agendada para segunda-feira às 14h.",
    data: "2024-07-01",
    autor: "Coordenação",
  },
  {
    id: 2,
    tipo: "enviada",
    conteudo: "Solicito uma reunião sobre o desempenho do aluno.",
    data: "2024-06-30",
    autor: "Responsável",
  },
  {
    id: 3,
    tipo: "recebida",
    conteudo: "Feriado escolar na próxima sexta-feira.",
    data: "2024-06-28",
    autor: "Secretaria",
  },
];

const Dashboard = () => {
  const [mensagens, setMensagens] = useState(mensagensMock);
  const [filtro, setFiltro] = useState("todas");
  const [novaMensagem, setNovaMensagem] = useState("");

  const mensagensFiltradas =
    filtro === "todas" ? mensagens : mensagens.filter((m) => m.tipo === filtro);

  const enviarMensagem = () => {
    if (!novaMensagem.trim()) return;

    const nova = {
      id: mensagens.length + 1,
      tipo: "enviada",
      conteudo: novaMensagem,
      data: new Date().toISOString().split("T")[0],
      autor: "Você",
    };

    setMensagens([nova, ...mensagens]);
    setNovaMensagem("");
  };

  return (
    <div className="p-4 md:ml-64">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">
        Mensagens e Eventos
      </h2>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          className="border rounded-lg px-4 py-2 text-sm"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="todas">Todas</option>
          <option value="enviada">Enviadas</option>
          <option value="recebida">Recebidas</option>
        </select>
        {/* Você pode adicionar um filtro por data aqui */}
      </div>

      {/* Lista de mensagens */}
      <div className="space-y-4 mb-6">
        {mensagensFiltradas.length === 0 ? (
          <p className="text-gray-500">Nenhuma mensagem encontrada.</p>
        ) : (
          mensagensFiltradas.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-lg shadow-md ${
                msg.tipo === "enviada"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-green-100 text-green-900"
              }`}
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">{msg.autor}</span>
                <span>{msg.data}</span>
              </div>
              <p>{msg.conteudo}</p>
            </div>
          ))
        )}
      </div>

      {/* Enviar nova mensagem */}
      <div className="bg-white border rounded-lg p-4 shadow-md">
        <label className="block mb-2 font-medium text-gray-700">
          Nova mensagem
        </label>
        <textarea
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
          className="w-full border rounded-lg p-2 mb-3 resize-none focus:ring focus:ring-blue-200"
          rows={3}
          placeholder="Escreva sua mensagem..."
        />
        <button
          onClick={enviarMensagem}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiSend /> Enviar
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
