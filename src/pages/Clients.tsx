import React, { useState } from 'react';
import Button from '../components/UI/Button';
import { Client } from '../types';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@ejemplo.com',
      phone: '123-456-7890',
      creditLimit: 1000,
      currentBalance: 500,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Add more sample clients here
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleAddClient = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsAddModalOpen(true);
  };

  const handleSaveClient = () => {
    if (selectedClient) {
      setClients(clients.map(c => c.id === selectedClient.id ? selectedClient : c));
    } else {
      const newClient: Client = {
        id: String(clients.length + 1),
        name: 'Nuevo Cliente',
        email: '',
        phone: '',
        creditLimit: 0,
        currentBalance: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setClients([...clients, newClient]);
    }
    setIsAddModalOpen(false);
    setSelectedClient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Clientes</h1>
        <Button onClick={handleAddClient}>Agregar Cliente</Button>
      </div>

      {/* Clients Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Nombre
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Correo
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Teléfono
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Límite de Crédito
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Balance Actual
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {client.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {client.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {client.phone}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${client.creditLimit.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            client.currentBalance > client.creditLimit * 0.8
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          ${client.currentBalance.toFixed(2)}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEditClient(client)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {selectedClient ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
            </h2>
            {/* Add form fields here */}
            <div className="mt-4 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setSelectedClient(null);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveClient}>Guardar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients; 