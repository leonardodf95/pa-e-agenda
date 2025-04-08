// src/components/Sidebar.tsx
import { useState } from "react";
import { FiHome, FiCalendar, FiUsers, FiLogOut, FiMenu } from "react-icons/fi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: <FiHome />, label: "Início" },
    { icon: <FiCalendar />, label: "Agenda" },
    { icon: <FiUsers />, label: "Reuniões" },
    { icon: <FiLogOut />, label: "Sair" },
  ];

  return (
    <div className="flex">
      {/* Botão para mobile */}
      <button
        className="md:hidden p-4 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-800 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-6 text-2xl font-bold border-b border-blue-700">
          E-Agenda
        </div>
        <nav className="flex flex-col gap-2 mt-4 px-4">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo da página principal (ajustado com padding para o menu) */}
      <div className="flex-1 p-4 md:pl-64">
        <h1 className="text-2xl font-semibold">Bem-vindo à E-Agenda!</h1>
        {/* Aqui entra o conteúdo das páginas */}
      </div>
    </div>
  );
};

export default Sidebar;
