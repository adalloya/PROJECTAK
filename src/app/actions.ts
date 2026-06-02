'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
        phone: `${formData.get('country_code') || ''} ${formData.get('phone')}`.trim(),
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

        // 2. Send Email Notification via Resend
        try {
            await resend.emails.send({
                from: 'Here We Go Advisor <info@herewego.mx>',
                to: [process.env.ADMIN_EMAIL || 'annar.pasaportemagico@gmail.com'],
                subject: `✨ Nuevo Lead: ${rawFormData.client_name} - ${rawFormData.destination}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #4F46E5;">¡Nueva Solicitud de Cotización! 🪄</h1>
                        <p>Has recibido un nuevo lead desde el sitio web.</p>
                        
                        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 10px;">
                            <p><strong>👤 Cliente:</strong> ${rawFormData.client_name}</p>
                            <p><strong>📧 Email:</strong> ${rawFormData.email}</p>
                            <p><strong>📱 Teléfono:</strong> ${rawFormData.phone}</p>
                            <p><strong>🏰 Destino:</strong> ${rawFormData.destination}</p>
                            <p><strong>📅 Fechas:</strong> ${rawFormData.dates}</p>
                            <p><strong>👥 Viajeros:</strong> ${rawFormData.travelers}</p>
                            <hr style="border-color: #D1D5DB; margin: 15px 0;">
                            <p><strong>📝 Notas / Detalles:</strong></p>
                            <pre style="white-space: pre-wrap; font-family: inherit; color: #374151;">${rawFormData.notes}</pre>
                        </div>
                        
                        <p style="margin-top: 20px; font-size: 12px; color: #6B7280;">Este es un mensaje automático de tu sistema de leads.</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Email Sending Error:', emailError);
            // Don't fail the whole request just because email failed, but maybe log it well
        }

        // 3. Revalidate admin dashboard so new lead shows up immediately
        revalidatePath('/admin/dashboard');

        return { success: true, message: 'Lead submitted successfully' };

    } catch (error) {
        console.error('Server Action Error:', error);
        return { success: false, message: 'Internal Server Error' };
    }
}

export async function submitReview(formData: FormData) {
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const content = formData.get('content') as string;
    const rating = parseInt(formData.get('rating') as string);
    const imageFile = formData.get('image') as File | null;

    if (!name || !role || !content || !rating) {
        return { success: false, message: 'Faltan campos requeridos' };
    }

    let image_url = null;

    try {
        // Upload Image if present
        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('reviews')
                .upload(fileName, imageFile);

            if (uploadError) {
                console.error('Storage Upload Error:', uploadError);
                // Continue without image or return error? We'll continue without image for now but log it.
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('reviews')
                    .getPublicUrl(fileName);
                image_url = publicUrl;
            }
        }

        const { error } = await supabase
            .from('reviews')
            .insert([{
                name,
                role,
                content,
                rating,
                image_url,
                is_approved: true // Auto-approve for now
            }]);

        if (error) {
            console.error('Supabase Review Error:', error);
            return { success: false, message: 'Error saving review' };
        }

        revalidatePath('/'); // Update home page testimonials
        return { success: true };
    } catch (e) {
        console.error('Review Action Error:', e);
        return { success: false, message: 'Server error' };
    }
}

export async function deleteLead(leadId: string) {
    try {
        const { error } = await supabase
            .from('leads')
            .delete()
            .eq('id', leadId);

        if (error) {
            console.error('Error deleting lead:', error);
            return { success: false, message: 'Error deleting lead' };
        }

        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Server Action Delete Error:', error);
        return { success: false, message: 'Internal Server Error' };
    }
}
