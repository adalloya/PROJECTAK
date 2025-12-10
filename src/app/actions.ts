'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function submitLead(formData: FormData) {
    const rawFormData = {
        client_name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        destination: formData.get('destination') as string,
        dates: formData.get('dates') as string,
        travelers: formData.get('travelers') as string,
        notes: formData.get('notes') as string,
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
