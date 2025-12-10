import { Lead } from "./types";

export const MOCK_LEADS: Lead[] = [
    {
        id: "1",
        created_at: new Date().toISOString(),
        client_name: "Juan Pérez",
        email: "juan@example.com",
        phone: "+52 55 1234 5678",
        destination: "Walt Disney World",
        dates: "Julio 2024",
        travelers: "2 Adultos, 2 Niños",
        notes: "Primer viaje, quieren hotel temático.",
        status: "new",
        admin_notes: ""
    },
    {
        id: "2",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        client_name: "María González",
        email: "maria@example.com",
        phone: "+52 55 8765 4321",
        destination: "Universal Orlando",
        dates: "Octubre 2024",
        travelers: "2 Adultos",
        notes: "Interesados en Halloween Horror Nights.",
        status: "contacted",
        admin_notes: "Envié mensaje por WhatsApp."
    },
    {
        id: "3",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        client_name: "Carlos López",
        email: "carlos@example.com",
        phone: "+52 81 1234 5678",
        destination: "Disney Cruise Line",
        dates: "Diciembre 2024",
        travelers: "Fam. Grande (6 personas)",
        notes: "Buscan camarotes comunicados.",
        status: "proposal",
        admin_notes: "Cotización enviada con Wish y Fantasy."
    },
    {
        id: "4",
        created_at: new Date(Date.now() - 400000000).toISOString(),
        client_name: "Ana Smith",
        email: "ana@test.com",
        phone: "+1 555 010 2020",
        destination: "Disneyland California",
        dates: "Septiembre 2024",
        travelers: "1 Adulto, 1 Niño",
        notes: "Solo boletos.",
        status: "lost",
        admin_notes: "Compró directo en la web."
    }
];
