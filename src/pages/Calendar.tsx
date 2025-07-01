import React, { useState } from 'react';
import Button from '../components/UI/Button';
import { Event } from '../types';

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Partido de Fútbol',
      description: 'Equipo local vs. Rivales',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-05-01'),
      type: 'deportes',
      expectedAttendance: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Add more sample events here
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleAddEvent = () => {
    setIsAddModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsAddModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (selectedEvent) {
      setEvents(events.map(e => e.id === selectedEvent.id ? selectedEvent : e));
    } else {
      const newEvent: Event = {
        id: String(events.length + 1),
        title: 'Nuevo Evento',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
        type: 'otros',
        expectedAttendance: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setEvents([...events, newEvent]);
    }
    setIsAddModalOpen(false);
    setSelectedEvent(null);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'deportes':
        return 'bg-blue-100 text-blue-800';
      case 'musica':
        return 'bg-purple-100 text-purple-800';
      case 'otros':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'deportes':
        return 'Deportes';
      case 'musica':
        return 'Música';
      case 'otros':
        return 'Otros';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Calendario</h1>
        <Button onClick={handleAddEvent}>Agregar Evento</Button>
      </div>

      {/* Calendar Grid */}
      <div className="mt-8">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Calendar Header */}
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div
              key={day}
              className="bg-gray-50 py-2 text-center text-sm font-semibold text-gray-700"
            >
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {Array.from({ length: 35 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i - date.getDay());
            const dayEvents = events.filter(
              (event) =>
                event.startDate.toDateString() === date.toDateString()
            );

            return (
              <div
                key={i}
                className="min-h-[100px] bg-white p-2 text-sm"
              >
                <div className="font-semibold">{date.getDate()}</div>
                <div className="mt-1 space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`rounded px-2 py-1 text-xs ${getEventTypeColor(
                        event.type
                      )}`}
                      onClick={() => handleEditEvent(event)}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Próximos Eventos</h2>
        <div className="mt-4 space-y-4">
          {events
            .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
            .map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
              >
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {event.startDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getEventTypeColor(
                      event.type
                    )}`}
                  >
                    {getEventTypeLabel(event.type)}
                  </span>
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {selectedEvent ? 'Editar Evento' : 'Agregar Nuevo Evento'}
            </h2>
            {/* Add form fields here */}
            <div className="mt-4 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setSelectedEvent(null);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveEvent}>Guardar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar; 