import React, { useState } from "react";
import Modal from "react-modal";

// Set the app element for accessibility
Modal.setAppElement("#root");

const NovoEventoModal = ({ isOpen, onRequestClose, onAddEvent }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    type: "meeting", // default value
    participants: [], // Array to store participants as {group: id, users: []}
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Mock data - can be replaced with API data later
  const userGroups = [
    {
      id: 1,
      name: "Professores",
      users: ["Prof. Silva", "Prof. Oliveira", "Prof. Santos"],
    },
    { id: 2, name: "Alunos 9º Ano", users: ["Aluno 1", "Aluno 2", "Aluno 3"] },
    {
      id: 3,
      name: "Pais/Responsáveis",
      users: ["Pai 1", "Mãe 2", "Responsável 3"],
    },
    {
      id: 4,
      name: "Administração",
      users: ["Diretor", "Coordenador", "Secretaria"],
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Check if a group is already selected
  const isGroupSelected = (groupId) => {
    return formData.participants.some((item) => item.group === groupId);
  };

  // Check if a specific user is selected
  const isUserSelected = (groupId, userName) => {
    const group = formData.participants.find((item) => item.group === groupId);
    return group ? group.users.includes(userName) : false;
  };

  // Add an entire group of participants
  const addGroup = (groupId) => {
    const group = userGroups.find((g) => g.id === groupId);

    if (!group) return;

    if (isGroupSelected(groupId)) {
      // Remove the group if already selected
      const updatedParticipants = formData.participants.filter(
        (item) => item.group !== groupId
      );
      setFormData({
        ...formData,
        participants: updatedParticipants,
      });
    } else {
      // Add the entire group with all users
      const updatedParticipants = [
        ...formData.participants,
        { group: groupId, groupName: group.name, users: [...group.users] },
      ];
      setFormData({
        ...formData,
        participants: updatedParticipants,
      });
    }
  };

  // Toggle a specific user in a group
  const toggleUserInGroup = (groupId, userName) => {
    const updatedParticipants = [...formData.participants];
    const groupIndex = updatedParticipants.findIndex(
      (item) => item.group === groupId
    );

    if (groupIndex === -1) {
      // If group doesn't exist, add it with just this user
      const group = userGroups.find((g) => g.id === groupId);
      updatedParticipants.push({
        group: groupId,
        groupName: group.name,
        users: [userName],
      });
    } else {
      // If group exists, check if user is there
      if (updatedParticipants[groupIndex].users.includes(userName)) {
        // Remove the user
        updatedParticipants[groupIndex].users = updatedParticipants[
          groupIndex
        ].users.filter((user) => user !== userName);
        // If group is empty, remove it
        if (updatedParticipants[groupIndex].users.length === 0) {
          updatedParticipants.splice(groupIndex, 1);
        }
      } else {
        // Add the user
        updatedParticipants[groupIndex].users.push(userName);
      }
    }

    setFormData({
      ...formData,
      participants: updatedParticipants,
    });
  };

  // Remove a single user from the participants list
  const removeUser = (groupId, userName) => {
    const updatedParticipants = [...formData.participants];
    const groupIndex = updatedParticipants.findIndex(
      (item) => item.group === groupId
    );

    if (groupIndex !== -1) {
      updatedParticipants[groupIndex].users = updatedParticipants[
        groupIndex
      ].users.filter((user) => user !== userName);

      // If group is empty, remove it
      if (updatedParticipants[groupIndex].users.length === 0) {
        updatedParticipants.splice(groupIndex, 1);
      }

      setFormData({
        ...formData,
        participants: updatedParticipants,
      });
    }
  };

  // Return total selected users
  const getTotalSelectedUsers = () => {
    return formData.participants.reduce(
      (total, group) => total + group.users.length,
      0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create new event object
    const newEvent = {
      ...formData,
      id: Date.now(), // temporary ID, should be replaced by backend
      created_at: new Date().toISOString(),
      status: "A",
    };

    // Call the onAddEvent function passed as props
    onAddEvent(newEvent);

    // Reset form and close modal
    setFormData({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      type: "meeting",
      participants: [],
    });
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Adicionar Novo Evento"
      className="bg-white rounded-lg w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto shadow-lg"
      overlayClassName="fixed inset-0 bg-[#00000050] flex justify-center items-center z-[1000]"
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="m-0 text-xl font-bold">Adicionar Novo Evento</h2>
        <button
          className="bg-transparent border-none text-2xl cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={onRequestClose}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-5">
          <label htmlFor="title" className="block mb-2 font-medium">
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-gray-300 rounded-md text-base"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="description" className="block mb-2 font-medium">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2.5 border border-gray-300 rounded-md text-base resize-vertical"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="start_date" className="block mb-2 font-medium">
            Data de Início
          </label>
          <input
            type="datetime-local"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-gray-300 rounded-md text-base"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="end_date" className="block mb-2 font-medium">
            Data de Término
          </label>
          <input
            type="datetime-local"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-gray-300 rounded-md text-base"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Participantes ({getTotalSelectedUsers()} selecionados)
          </label>

          {/* Dropdown for group selection */}
          <div className="relative">
            <div
              className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>
                {selectedGroup
                  ? userGroups.find((g) => g.id === selectedGroup)?.name
                  : "Selecione um grupo"}
              </span>
              <span>{dropdownOpen ? "▲" : "▼"}</span>
            </div>

            {dropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {userGroups.map((group) => (
                  <div
                    key={group.id}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                      onClick={() => {
                        setSelectedGroup(group.id);
                        addGroup(group.id);
                      }}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isGroupSelected(group.id)}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        <span>{group.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGroup(
                            selectedGroup === group.id ? null : group.id
                          );
                        }}
                        className="text-blue-600 text-sm"
                      >
                        {selectedGroup === group.id ? "Fechar" : "Detalhes"}
                      </button>
                    </div>

                    {selectedGroup === group.id && (
                      <div className="bg-gray-50 p-2">
                        {group.users.map((user) => (
                          <div key={user} className="flex items-center py-1">
                            <input
                              type="checkbox"
                              checked={isUserSelected(group.id, user)}
                              onChange={() => toggleUserInGroup(group.id, user)}
                              className="mr-2"
                            />
                            <span className="text-sm">{user}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Display selected participants */}
          {formData.participants.length > 0 && (
            <div className="mt-2 p-2 border border-gray-300 rounded-md max-h-32 overflow-y-auto">
              <h3 className="font-medium text-sm mb-1">
                Participantes selecionados:
              </h3>
              <ul className="space-y-2">
                {formData.participants.map((item) => (
                  <li key={item.group} className="text-sm">
                    <span className="font-medium">
                      {item.groupName} ({item.users.length}):
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.users.map((user) => (
                        <span
                          key={user}
                          className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs"
                        >
                          {user}
                          <button
                            type="button"
                            onClick={() => removeUser(item.group, user)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="type" className="block mb-2 font-medium">
            Tipo de Evento
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-gray-300 rounded-md text-base"
          >
            <option value="meeting">Reunião</option>
            <option value="test">Prova</option>
            <option value="recess">Recesso</option>
            <option value="other">Outro</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default NovoEventoModal;
