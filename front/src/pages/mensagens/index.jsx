import React from "react";
import MessageList from "../../components/message-list/index.jsx";

const Mensagens = () => {
  return (
    <div className="bg-gray-50 min-h-screen md:pl-32 p-4">
      {/* Cabeçalho */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-800">
          Bem vindo de volta Usuário!
        </h1>
      </header>
      {/* Mensagens */}
      <MessageList />
    </div>
  );
};

export default Mensagens;
