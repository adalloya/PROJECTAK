export type LeadStatus = 
    | 'new' 
    | 'contacted' 
    | 'proposal' 
    | 'won' 
    | 'reservation_60_plus' 
    | 'reservation_60_minus' 
    | 'disney_reserved' 
    | 'trip_completed' 
    | 'lost';

export interface Lead {
    id: string;
    created_at: string;
    client_name: string;
    email: string;
    phone: string;
    destination: string;
    dates: string;
    travelers: string;
    notes: string;
    status: LeadStatus;
    admin_notes?: string | null;
    probability?: number | null;
    check_in?: string | null;
    check_out?: string | null;
    provider_classification?: string | null;
    price?: number | null;
    commission?: number | null;
    payment_status?: string | null;
    booking_reference?: string | null;
    quote_sent_date?: string | null;
    estimated_sale_amount?: number | null;
}

export const LEAD_STATUSES: { value: LeadStatus; label: string; color: string }[] = [
    { value: 'new', label: 'Nuevo Lead', color: 'bg-blue-100 text-blue-800' },
    { value: 'contacted', label: 'Contactado', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'proposal', label: 'Cotización Enviada', color: 'bg-purple-100 text-purple-800' },
    { value: 'won', label: 'Ganada', color: 'bg-green-100 text-green-800' },
    { value: 'reservation_60_plus', label: 'Reserva > 60 días', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'reservation_60_minus', label: 'Reserva <= 60 días', color: 'bg-pink-100 text-pink-800' },
    { value: 'disney_reserved', label: 'Reserva Disney', color: 'bg-cyan-100 text-cyan-800' },
    { value: 'trip_completed', label: 'Viaje Realizado', color: 'bg-teal-100 text-teal-800' },
    { value: 'lost', label: 'Perdida', color: 'bg-red-100 text-red-800' },
];

export type TaskStatus = 'not_started' | 'in_process' | 'completed';

export interface Task {
    id: string;
    created_at: string;
    lead_id: string;
    title: string;
    description?: string | null;
    due_date: string;
    status: TaskStatus;
}

export const TASK_STATUSES: { value: TaskStatus; label: string; color: string }[] = [
    { value: 'not_started', label: 'No iniciada', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { value: 'in_process', label: 'En proceso', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { value: 'completed', label: 'Terminada', color: 'bg-green-100 text-green-800 border-green-200' },
];
