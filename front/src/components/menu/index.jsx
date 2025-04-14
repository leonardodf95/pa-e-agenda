// src/components/Sidebar.tsx
import { useState } from "react";
import { FiCalendar, FiUsers, FiLogOut, FiMenu, FiInbox } from "react-icons/fi";
import { ROUTE_AGENDA, ROUTE_MENSAGENS } from "../../constants/routes.jsx";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <FiInbox />,
      label: "Mensagens",
      cb: () => handleNavigation(ROUTE_MENSAGENS),
    },
    {
      icon: <FiCalendar />,
      label: "Agenda",
      cb: () => handleNavigation(ROUTE_AGENDA),
    },
    { icon: <FiLogOut />, label: "Sair", cb: handleLogout },
  ];

  function handleLogout() {
    // Adicione aqui a lógica para logout
    console.log("Logout");
  }

  function handleNavigation(route) {
    if (route) {
      navigate(route);
    }
  }

  const path = window.location.pathname;
  const classNameItemActive =
    "bg-blue-700 text-white flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors";
  const classNameItemInactive =
    "bg-blue-800 text-white flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors";

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
              className={
                path === `/${item.label.toLowerCase()}`
                  ? classNameItemActive
                  : classNameItemInactive
              }
              onClick={item.cb}
              type="button"
              aria-label={item.label}
              title={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
