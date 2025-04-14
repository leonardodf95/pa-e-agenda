import React, { useState } from "react";
import Modal from "react-modal";

// Configuração necessária para acessibilidade
Modal.setAppElement("#root");

function ModalNovaMensagem(props) {
  const [newMessage, setNewMessage] = useState({
    title: "",
    message: "",
    type: "info",
    recipients: [], // Agora vai armazenar objetos {group: id, users: []}
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Simulação de dados de usuários e grupos
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

  const closeModal = () => {
    props.closeModal();
    // Reset do formulário
    setNewMessage({
      title: "",
      message: "",
      type: "info",
      recipients: [],
    });
  };

  // Manipula mudanças nos campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMessage({
      ...newMessage,
      [name]: value,
    });
  };

  // Verifica se um grupo já está selecionado
  const isGroupSelected = (groupId) => {
    return newMessage.recipients.some((item) => item.group === groupId);
  };

  // Verifica se um usuário específico está selecionado
  const isUserSelected = (groupId, userName) => {
    const group = newMessage.recipients.find((item) => item.group === groupId);
    return group ? group.users.includes(userName) : false;
  };

  // Adiciona um grupo inteiro de destinatários
  const addGroup = (groupId) => {
    const group = userGroups.find((g) => g.id === groupId);

    if (!group) return;

    if (isGroupSelected(groupId)) {
      // Remove o grupo se já estiver selecionado
      const updatedRecipients = newMessage.recipients.filter(
        (item) => item.group !== groupId
      );
      setNewMessage({
        ...newMessage,
        recipients: updatedRecipients,
      });
    } else {
      // Adiciona o grupo inteiro com todos os usuários
      const updatedRecipients = [
        ...newMessage.recipients,
        { group: groupId, groupName: group.name, users: [...group.users] },
      ];
      setNewMessage({
        ...newMessage,
        recipients: updatedRecipients,
      });
    }
  };

  // Toggle a specific user in a group
  const toggleUserInGroup = (groupId, userName) => {
    const updatedRecipients = [...newMessage.recipients];
    const groupIndex = updatedRecipients.findIndex(
      (item) => item.group === groupId
    );

    if (groupIndex === -1) {
      // Se o grupo não existe, adicione-o com apenas este usuário
      const group = userGroups.find((g) => g.id === groupId);
      updatedRecipients.push({
        group: groupId,
        groupName: group.name,
        users: [userName],
      });
    } else {
      // Se o grupo existe, verifique se o usuário está lá
      if (updatedRecipients[groupIndex].users.includes(userName)) {
        // Remove o usuário
        updatedRecipients[groupIndex].users = updatedRecipients[
          groupIndex
        ].users.filter((user) => user !== userName);
        // Se o grupo ficou vazio, remova-o
        if (updatedRecipients[groupIndex].users.length === 0) {
          updatedRecipients.splice(groupIndex, 1);
        }
      } else {
        // Adiciona o usuário
        updatedRecipients[groupIndex].users.push(userName);
      }
    }

    setNewMessage({
      ...newMessage,
      recipients: updatedRecipients,
    });
  };

  // Remove um único usuário da lista de destinatários
  const removeUser = (groupId, userName) => {
    const updatedRecipients = [...newMessage.recipients];
    const groupIndex = updatedRecipients.findIndex(
      (item) => item.group === groupId
    );

    if (groupIndex !== -1) {
      updatedRecipients[groupIndex].users = updatedRecipients[
        groupIndex
      ].users.filter((user) => user !== userName);

      // Se o grupo ficou vazio, remova-o
      if (updatedRecipients[groupIndex].users.length === 0) {
        updatedRecipients.splice(groupIndex, 1);
      }

      setNewMessage({
        ...newMessage,
        recipients: updatedRecipients,
      });
    }
  };

  // Retorna o total de usuários selecionados
  const getTotalSelectedUsers = () => {
    return newMessage.recipients.reduce(
      (total, group) => total + group.users.length,
      0
    );
  };

  // Submete o formulário e cria nova mensagem
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação básica
    if (
      !newMessage.title ||
      !newMessage.message ||
      getTotalSelectedUsers() === 0
    ) {
      alert(
        "Por favor, preencha todos os campos e selecione pelo menos um destinatário."
      );
      return;
    }

    // Cria a nova mensagem
    const message = {
      type: newMessage.type,
      title: newMessage.title,
      message: newMessage.message,
      created_at: new Date().toISOString(),
      sender: "Você", // Poderia vir de um contexto de autenticação
      status: "A",
      // Formato mais detalhado dos destinatários
      recipients: newMessage.recipients,
    };

    console.log("Mensagem criada:", message);
    closeModal();
  };

  return (
    <Modal
      isOpen={props.open}
      onRequestClose={closeModal}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={false}
      shouldFocusAfterRender={true}
      shouldReturnFocusAfterClose={true}
      contentLabel="Nova Mensagem"
      className="w-full max-w-[750px] max-h-[850px] bg-white p-4 relative rounded mx-4"
      overlayClassName="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-800">Nova Mensagem</h2>
        <button
          onClick={closeModal}
          className="text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            name="title"
            value={newMessage.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o título da mensagem"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            name="type"
            value={newMessage.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="info">Informativo</option>
            <option value="homework">Tarefa</option>
            <option value="exam">Prova</option>
            <option value="event">Evento</option>
            <option value="other">Outro</option>
          </select>
        </div>

        {/* Mensagem */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensagem
          </label>
          <textarea
            name="message"
            value={newMessage.message}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o conteúdo da mensagem"
          ></textarea>
        </div>

        {/* Destinatários */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destinatários ({getTotalSelectedUsers()} selecionados)
          </label>

          {/* Dropdown para seleção de grupos */}
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

          {/* Exibir destinatários selecionados */}
          {newMessage.recipients.length > 0 && (
            <div className="mt-2 p-2 border border-gray-300 rounded-md max-h-32 overflow-y-auto">
              <h3 className="font-medium text-sm mb-1">
                Destinatários selecionados:
              </h3>
              <ul className="space-y-2">
                {newMessage.recipients.map((item) => (
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

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Enviar Mensagem
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalNovaMensagem;
