import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const MessageCard = ({ message, onMarkAsRead }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTypeIcon = () => {
    switch (message.type) {
      case "info":
        return "📢";
      case "homework":
        return "📚";
      case "event":
        return "📅";
      default:
        return "📌";
    }
  };

  const handleMarkAsRead = () => {
    if (onMarkAsRead) {
      onMarkAsRead(message.id);
    }
  };

  // Determine background color based on message type
  const getTypeBackground = () => {
    switch (message.type) {
      case "info":
        return "bg-blue-100";
      case "homework":
        return "bg-green-100";
      case "event":
        return "bg-yellow-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div
      className={`rounded-lg shadow-md p-4 mb-4 ${getTypeBackground()} flex justify-between flex-col`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className="text-2xl mr-2">{getTypeIcon()}</div>
          <div className="font-bold text-lg">{message.title}</div>
        </div>
        <button
          onClick={handleMarkAsRead}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className=" text-gray-500 hover:text-gray-700 hover:scale-3d font-bold p-2 rounded flex items-center justify-center"
          title="Marcar como lido"
          aria-label="Marcar como lido"
        >
          {isHovered ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>

      {/* conteudo da mensagem */}
      <p className="text-gray-700">{message.message}</p>

      <div className="mt-2">
        <div className="mt-3 text-sm text-gray-600">
          {message.sender && <p>De: {message.sender}</p>}
          <p className="text-gray-500">
            {message.created_at &&
              new Date(message.created_at).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
