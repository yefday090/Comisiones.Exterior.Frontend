export interface AgendaEvent {
  id: string;
  title: string;
  description: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  tipo: 'Normal' | 'Extemporanea' | 'Extra Oficial';
  estado: 'Pendiente' | 'Confirmada' | 'Cancelada';
  assignedTo: string;  // username
  color?: string;
}
