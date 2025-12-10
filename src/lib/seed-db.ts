
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pknsyqtvdqzqplvioshl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrbnN5cXR2ZHF6cXBsdmlvc2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzOTQxOTMsImV4cCI6MjA4MDk3MDE5M30.g73F3Sj_RMpOV2eWQlS9_Q3yMBUFd_dN1wozjQKEXDw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MOCK_LEADS = [
    {
        client_name: "Familia Rodríguez",
        email: "rodriguez@email.com",
        phone: "+52 55 1234 5678",
        destination: "Walt Disney World",
        dates: "Diciembre 2025",
        travelers: "2 Adultos, 3 Niños",
        notes: "Quieren hotel con piscina grande. Primera vez en Disney.",
        status: "new",
        admin_notes: ""
    },
    {
        client_name: "Ana y Carlos",
        email: "parejaviajeros@test.com",
        phone: "+52 81 8765 4321",
        destination: "Universal Orlando",
        dates: "Octubre 2025",
        travelers: "2 Adultos",
        notes: "Interesados en Halloween Horror Nights. Hotel Premier si es posible.",
        status: "contacted",
        admin_notes: "Les envié info de Hard Rock Hotel."
    },
    {
        client_name: "Roberto Méndez",
        email: "roberto.m@empresa.com",
        phone: "+1 305 555 0199",
        destination: "Disney Cruise Line",
        dates: "Verano 2026",
        travelers: "4 Adultos",
        notes: "Crucero por el Caribe. Celebración de aniversario.",
        status: "proposal",
        admin_notes: "Cotización enviada: Disney Treasure y Disney Wish."
    },
    {
        client_name: "Lucía Fernández",
        email: "lucia.fer@gmail.com",
        phone: "+34 600 123 456",
        destination: "Disneyland Paris",
        dates: "Septiembre 2025",
        travelers: "1 Adulto, 1 Niño (5 años)",
        notes: "Solo entradas y hotel. Sin vuelos.",
        status: "new",
        admin_notes: ""
    },
    {
        client_name: "Grupo Graduación Tec",
        email: "graduacion2025@tec.mx",
        phone: "+52 55 9988 7766",
        destination: "Walt Disney World",
        dates: "Junio 2026",
        travelers: "15 Adultos",
        notes: "Viaje de graduación. Buscan presupuesto económico.",
        status: "lost",
        admin_notes: "El presupuesto era muy bajo para la temporada."
    }
];

async function seed() {
    console.log('🌱 Adding mock leads...');

    const { error } = await supabase
        .from('leads')
        .insert(MOCK_LEADS);

    if (error) {
        console.error('❌ Error seeding data:', error);
    } else {
        console.log('✅ Success! 5 mock leads added.');
    }
}

seed();
