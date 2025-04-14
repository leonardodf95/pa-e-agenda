import React, { useState, useEffect } from "react";
import MessageCard from "../message-card";
import messagesData from "../../../mock/messages.json";
import ModalNovaMensagem from "../modals/nova-mensagem/index.jsx";

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Funções para manipular o modal
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Carrega mensagens do mock
  useEffect(() => {
    setMessages(messagesData);
  }, []);

  return (
    <div className="w-full h-full p-5">
      <ModalNovaMensagem
        open={modalIsOpen}
        closeModal={() => setModalIsOpen(false)}
      />
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-4xl font-bold text-blue-800">Mensagens</h1>
        <button
          className="bg-blue-600 text-white hover:bg-blue-100 hover:text-blue-600 px-4 py-2 rounded"
          onClick={openModal}
        >
          Nova Mensagem
        </button>
      </div>

      {messages.length === 0 ? (
        <p>Nenhuma mensagem encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageList;
