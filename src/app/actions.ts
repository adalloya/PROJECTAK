'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function submitLead(formData: FormData) {
    const checkin = formData.get('checkin') as string;
    const checkout = formData.get('checkout') as string;
    const clientStatus = formData.get('client_status') as string === 'new' ? 'Cliente Nuevo' : 'Cliente Existente';
    const packageType = formData.get('package_type') as string;
    const hotelPref = formData.get('hotel_preference');
    const diningPlan = formData.get('dining_plan');
    const childrenAges = formData.get('children_ages') as string;

    // Construct detailed notes
    let detailedNotes = `[${clientStatus}]\n[Tipo: ${packageType}]`;
    if (hotelPref) detailedNotes += `\n[Hospedaje: ${hotelPref}]`;
    if (diningPlan) detailedNotes += `\n[Plan de Comidas: SÍ]`;
    detailedNotes += `\n\nNotas del Cliente:\n${formData.get('notes') as string}`;

    const rawFormData = {
        client_name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        destination: formData.get('destination') as string,
        dates: `In: ${checkin} | Out: ${checkout}`,
        travelers: `${formData.get('adults')} Adultos, ${formData.get('children')} Niños${childrenAges ? ` (Edades: ${childrenAges})` : ''}`,
        notes: detailedNotes,
        status: 'new', // Default status
    };

    try {
        // 1. Insert into Supabase
        const { error } = await supabase
            .from('leads')
            .insert([rawFormData]);

        if (error) {
            console.error('Supabase Error:', error);
            return { success: false, message: 'Error saving to database' };
        }

        // 2. Revalidate admin dashboard so new lead shows up immediately
        revalidatePath('/admin/dashboard');

        return { success: true, message: 'Lead submitted successfully' };

    } catch (error) {
        console.error('Server Action Error:', error);
        return { success: false, message: 'Internal Server Error' };
    }
}
