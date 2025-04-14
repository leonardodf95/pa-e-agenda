import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import mockEvents from "../../../mock/events.json";
import Swal from "sweetalert2";
import NovoEventoModal from "../../components/modals/novo-evento/index.jsx";

function Agenda() {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setCategory] = useState("all");
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Transform mock events to FullCalendar format
  useEffect(() => {
    try {
      if (
        !mockEvents ||
        !Array.isArray(mockEvents) ||
        mockEvents.length === 0
      ) {
        console.warn("No events data available");
        setEvents([]);
        setFilteredEvents([]);
        return;
      }

      const transformedEvents = mockEvents.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start_date,
        end: event.end_date,
        description: event.description,
        createdBy: event.created_by,
        type: event.type || "other", // Ensure type exists
      }));

      setEvents(transformedEvents);
      setFilteredEvents(transformedEvents);
    } catch (error) {
      console.error("Error processing events:", error);
      setEvents([]);
      setFilteredEvents([]);
    }
  }, []);

  // Handle event click
  const handleEventClick = (clickInfo) => {
    Swal.fire({
      title: clickInfo.event.title,
      text: `Criado por: ${clickInfo.event.extendedProps.createdBy}`,
      html: `<p>${clickInfo.event.extendedProps.description}</p>`,
      icon: "info",
      showCloseButton: true,
      confirmButtonText: "Fechar",
    });
  };

  const handleFilterEvents = () => {
    // Always start filtering from the original events list
    let filtered = [...events];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (type !== "all") {
      filtered = filtered.filter((event) => event.type === type);
    }

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(
        (event) =>
          new Date(event.start) >= new Date(dateRange.start) &&
          new Date(event.end) <= new Date(dateRange.end)
      );
    }

    setFilteredEvents(filtered);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategory("all");
    setDateRange({ start: "", end: "" });
    setFilteredEvents([...events]); // Reset to original events
  };

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen md:pl-32 p-4">
      <NovoEventoModal isOpen={modalIsOpen} onRequestClose={handleCloseModal} />
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Agenda</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={handleOpenModal}
        >
          Adicionar Evento
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pesquisar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar evento..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={type}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="meeting">Reuniões</option>
              <option value="recess">Recesso</option>
              <option value="test">Provas</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2"
            onClick={handleFilterEvents}
          >
            Aplicar Filtros
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
            onClick={handleClearFilters}
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
          locale="pt-br"
          buttonText={{
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
          }}
          selectable={true}
          editable={true}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
          }}
          events={filteredEvents}
          eventClick={handleEventClick}
          eventColor="#4285F4"
          eventDisplay="block"
        />
      </div>
    </div>
  );
}

export default Agenda;
