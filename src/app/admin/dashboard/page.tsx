"use client";

import { useState } from "react";
import { Search, Filter, Phone, Mail, Calendar, User, FileText, CheckCircle2, XCircle, Clock, Save, X } from "lucide-react";
import { MOCK_LEADS } from "@/lib/crm/mock-data";
import { LEAD_STATUSES, Lead, LeadStatus } from "@/lib/crm/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function AdminDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]); // Start empty
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false); // New state for create modal
    const [isLoading, setIsLoading] = useState(true);

    // Fetch real data on mount
    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            // Cast status to LeadStatus to satisfy type checker
            const typedData = data.map(d => ({ ...d, status: d.status as LeadStatus }));
            setLeads(typedData);
        }
        setIsLoading(false);
    };


    // Filter leads
    const filteredLeads = leads.filter(lead =>
        lead.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group by status
    const leadsByStatus = LEAD_STATUSES.map(status => ({
        ...status,
        items: filteredLeads.filter(l => l.status === status.value)
    }));

    const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
        // Optimistic update
        setLeads(leads.map(lead =>
            lead.id === leadId ? { ...lead, status: newStatus } : lead
        ));
        if (selectedLead && selectedLead.id === leadId) {
            setSelectedLead({ ...selectedLead, status: newStatus });
        }

        // Update in DB
        await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
    };

    const handleSaveNotes = async (leadId: string, newNotes: string) => {
        // Optimistic update
        setLeads(leads.map(lead =>
            lead.id === leadId ? { ...lead, admin_notes: newNotes } : lead
        ));
        if (selectedLead && selectedLead.id === leadId) {
            setSelectedLead({ ...selectedLead, admin_notes: newNotes });
        }
        setIsEditing(false);

        // Update in DB
        await supabase.from('leads').update({ admin_notes: newNotes }).eq('id', leadId);
    }

    const handleCreateLead = async (formData: FormData) => {
        const newLead = {
            client_name: formData.get('client_name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            destination: formData.get('destination') as string,
            dates: formData.get('dates') as string,
            travelers: formData.get('travelers') as string,
            notes: formData.get('notes') as string,
            status: 'new' as LeadStatus,
        };

        const { data, error } = await supabase
            .from('leads')
            .insert([newLead])
            .select()
            .single();

        if (data) {
            setLeads([data, ...leads]);
            setIsCreating(false);
        } else {
            alert('Error al crear lead');
            console.error(error);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando CRM...</div>
    }

    return (
        <div className="p-6 md:p-10 pt-32 md:pt-36 max-w-[1600px] mx-auto">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">CRM - Here We Go Advisor</h1>
                    <p className="text-gray-500">Gestiona tus prospectos y oportunidades de venta.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                        />
                    </div>
                    <button className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50">
                        <Filter className="h-4 w-4" />
                    </button>

                    <button
                        onClick={() => setIsCreating(true)}
                        className="h-10 px-4 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <span className="text-xl leading-none">+</span> Nuevo Lead
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px]">
                {leadsByStatus.map((column) => (
                    <div key={column.value} className="min-w-[300px] flex-1 flex flex-col">
                        {/* Column Header */}
                        <div className={`p-4 rounded-t-xl border-b-2 ${column.color} bg-white border-opacity-50 flex justify-between items-center mb-4 shadow-sm`}>
                            <h3 className="font-bold text-sm uppercase tracking-wider">{column.label}</h3>
                            <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
                                {column.items.length}
                            </span>
                        </div>

                        {/* Cards Container */}
                        <div className="flex-1 space-y-4">
                            {column.items.map((lead) => (
                                <motion.div
                                    layoutId={lead.id}
                                    key={lead.id}
                                    onClick={() => {
                                        setSelectedLead(lead);
                                        setIsEditing(false);
                                    }}
                                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:border-primary/30 group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{lead.client_name}</h4>
                                        <span className="text-xs text-gray-400">{new Date(lead.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <div className="space-y-1 mb-3">
                                        <div className="flex items-center text-xs text-gray-500">
                                            <User className="h-3 w-3 mr-1.5" />
                                            {lead.travelers}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <MapPinIcon className="h-3 w-3 mr-1.5" />
                                            <span className="truncate max-w-[200px]">{lead.destination}</span>
                                        </div>
                                    </div>

                                    {lead.admin_notes && (
                                        <div className="mt-3 pt-3 border-t border-gray-50">
                                            <p className="text-xs text-gray-500 italic line-clamp-2">"{lead.admin_notes}"</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {column.items.length === 0 && (
                                <div className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                                    Sin Leads
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedLead && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                                        {selectedLead.client_name}
                                    </h2>
                                    <p className="text-sm text-gray-500 flex items-center mt-1">
                                        Creado el {new Date(selectedLead.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedLead(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="h-6 w-6 text-gray-400" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-8">

                                {/* Status Selector */}
                                <div>
                                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 block">Etapa del Lead</label>
                                    <div className="flex flex-wrap gap-2">
                                        {LEAD_STATUSES.map(status => (
                                            <button
                                                key={status.value}
                                                onClick={() => handleUpdateStatus(selectedLead.id, status.value)}
                                                className={cn(
                                                    "px-4 py-2 rounded-full text-xs font-bold border transition-all",
                                                    selectedLead.status === status.value
                                                        ? status.color + " border-transparent ring-2 ring-primary/20 ring-offset-2"
                                                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                                )}
                                            >
                                                {status.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <User className="h-4 w-4 text-primary" /> Contacto
                                            </h3>
                                            <div className="space-y-4 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                    <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline">{selectedLead.email}</a>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    <a href={`tel:${selectedLead.phone}`} className="text-blue-600 hover:underline">{selectedLead.phone}</a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-primary" /> Detalles del Viaje
                                            </h3>
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <span className="text-gray-500 block text-xs">Destino</span>
                                                    <span className="font-medium">{selectedLead.destination}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block text-xs">Fechas</span>
                                                    <span className="font-medium">{selectedLead.dates}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block text-xs">Viajeros</span>
                                                    <span className="font-medium">{selectedLead.travelers}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                Notas del Cliente
                                            </h3>
                                            <div className="bg-white border border-gray-200 p-4 rounded-xl text-sm italic text-gray-600 min-h-[80px]">
                                                "{selectedLead.notes}"
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                    Notas Administrativas
                                                </h3>
                                                {!isEditing && (
                                                    <button onClick={() => setIsEditing(true)} className="text-xs text-primary font-medium hover:underline">
                                                        Editar
                                                    </button>
                                                )}
                                            </div>

                                            {isEditing ? (
                                                <NoteEditor
                                                    initialValue={selectedLead.admin_notes || ""}
                                                    onSave={(val) => handleSaveNotes(selectedLead.id, val)}
                                                    onCancel={() => setIsEditing(false)}
                                                />
                                            ) : (
                                                <div
                                                    onClick={() => setIsEditing(true)}
                                                    className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-xl text-sm text-gray-700 min-h-[100px] cursor-text hover:border-yellow-200 transition-colors"
                                                >
                                                    {selectedLead.admin_notes || <span className="text-gray-400 not-italic">Haz clic para agregar notas privadas sobre este lead...</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-3xl">
                                <button
                                    onClick={() => setSelectedLead(null)}
                                    className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create Lead Modal */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                <h2 className="text-xl font-bold text-gray-900">Nuevo Lead Manual</h2>
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="h-6 w-6 text-gray-400" />
                                </button>
                            </div>

                            <form action={handleCreateLead} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente *</label>
                                    <input required name="client_name" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ej. Juan Pérez" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                        <input required name="email" type="email" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="juan@email.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                        <input name="phone" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="+52..." />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                                    <input name="destination" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ej. Disney World" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fechas</label>
                                        <input name="dates" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ej. Dic 2024" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Viajeros</label>
                                        <input name="travelers" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ej. 2 Adultos" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                                    <textarea name="notes" rows={3} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Detalles adicionales..." />
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all">
                                        Crear Lead
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MapPinIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
    )
}

function NoteEditor({ initialValue, onSave, onCancel }: { initialValue: string, onSave: (val: string) => void, onCancel: () => void }) {
    const [val, setVal] = useState(initialValue);
    return (
        <div className="space-y-2">
            <textarea
                value={val}
                onChange={(e) => setVal(e.target.value)}
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Escribe notas aquí..."
                autoFocus
            />
            <div className="flex gap-2 justify-end">
                <button onClick={onCancel} className="text-xs text-gray-500 font-medium px-3 py-1 hover:bg-gray-100 rounded-full">Cancelar</button>
                <button onClick={() => onSave(val)} className="text-xs bg-primary text-white font-medium px-3 py-1 rounded-full shadow-sm hover:bg-primary/90">Guardar Nota</button>
            </div>
        </div>
    )
}
