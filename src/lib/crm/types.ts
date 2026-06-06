export type LeadStatus = 'new' | 'contacted' | 'proposal' | 'won' | 'lost';

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
    { value: 'lost', label: 'Perdida', color: 'bg-red-100 text-red-800' },
];
