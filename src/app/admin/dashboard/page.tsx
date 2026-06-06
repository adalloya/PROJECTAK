"use client";

import { useState } from "react";
import { Search, Filter, Phone, Mail, Calendar, User, FileText, CheckCircle2, XCircle, Clock, Save, X, Trash2 } from "lucide-react";
import { MOCK_LEADS } from "@/lib/crm/mock-data";
import { LEAD_STATUSES, Lead, LeadStatus } from "@/lib/crm/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

import { supabase } from "@/lib/supabase";
import { submitLead, deleteLead } from "@/app/actions";
import { useEffect } from "react";

export default function AdminDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]); // Start empty
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false); // New state for create modal
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<LeadStatus>("new"); // Mobile tab state

    type SortOption = 'created_at' | 'check_in' | 'probability';
    const [sortBy, setSortBy] = useState<SortOption>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const handleExportCSV = () => {
        const headers = [
            "ID", "Fecha de Registro", "Cliente", "Email", "Teléfono", "Destino", 
            "Check-In", "Check-Out", "Viajeros", "Etapa", "Probabilidad (%)", 
            "Clasificación Proveedor", "Precio", "Comisión", "Status de Pago", 
            "Booking/Reference", "Fecha de Envío Cotización", "Monto Estimado", 
            "Notas del Cliente", "Notas del Admin"
        ];
        
        const rows = leads.map(l => [
            l.id,
            new Date(l.created_at).toLocaleString(),
            l.client_name,
            l.email,
            l.phone,
            l.destination,
            l.check_in || '',
            l.check_out || '',
            l.travelers,
            l.status,
            l.probability !== undefined && l.probability !== null ? `${l.probability}` : '',
            l.provider_classification || '',
            l.price || 0,
            l.commission || 0,
            l.payment_status || '',
            l.booking_reference || '',
            l.quote_sent_date || '',
            l.estimated_sale_amount || 0,
            l.notes || '',
            l.admin_notes || ''
        ]);
        
        const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `leads_herewego_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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


    // Filter and Sort leads
    const filteredAndSortedLeads = [...leads]
        .filter(lead =>
            lead.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'created_at') {
                comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            } else if (sortBy === 'check_in') {
                const dateA = a.check_in ? new Date(a.check_in).getTime() : 0;
                const dateB = b.check_in ? new Date(b.check_in).getTime() : 0;
                comparison = dateA - dateB;
            } else if (sortBy === 'probability') {
                const probA = a.probability || 0;
                const probB = b.probability || 0;
                comparison = probA - probB;
            }
            return sortOrder === 'desc' ? -comparison : comparison;
        });

    // Group by status
    const leadsByStatus = LEAD_STATUSES.map(status => ({
        ...status,
        items: filteredAndSortedLeads.filter(l => l.status === status.value)
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
        const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
        if (error) {
            console.error("Error al actualizar estado del lead:", error);
            alert(`Error al actualizar el estado: ${error.message}`);
            fetchLeads();
        }
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
        const { error } = await supabase.from('leads').update({ admin_notes: newNotes }).eq('id', leadId);
        if (error) {
            console.error("Error al guardar notas:", error);
            alert(`Error al guardar notas: ${error.message}`);
            fetchLeads();
        }
    }

    const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedLead) return;

        const formData = new FormData(e.currentTarget);
        const check_in = formData.get('check_in') as string;
        const check_out = formData.get('check_out') as string;

        const updatedFields = {
            client_name: formData.get('client_name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            destination: formData.get('destination') as string,
            dates: check_in && check_out ? `In: ${check_in} | Out: ${check_out}` : (selectedLead.dates || ''),
            check_in: check_in || null,
            check_out: check_out || null,
            travelers: formData.get('travelers') as string,
            notes: formData.get('notes') as string,
            admin_notes: formData.get('admin_notes') as string,
            probability: formData.get('probability') ? parseInt(formData.get('probability') as string) : null,
            provider_classification: formData.get('provider_classification') as string || null,
            price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
            commission: formData.get('commission') ? parseFloat(formData.get('commission') as string) : null,
            payment_status: formData.get('payment_status') as string || null,
            booking_reference: formData.get('booking_reference') as string || null,
            quote_sent_date: formData.get('quote_sent_date') ? formData.get('quote_sent_date') as string : null,
            estimated_sale_amount: formData.get('estimated_sale_amount') ? parseFloat(formData.get('estimated_sale_amount') as string) : null,
            status: formData.get('status') as LeadStatus,
        };

        const updatedLead = { ...selectedLead, ...updatedFields };

        // Optimistic update
        setLeads(leads.map(l => l.id === selectedLead.id ? updatedLead : l));
        setSelectedLead(updatedLead);
        setIsEditing(false);

        // Update in DB
        const { error } = await supabase
            .from('leads')
            .update(updatedFields)
            .eq('id', selectedLead.id);

        if (error) {
            console.error("Error al actualizar lead:", error);
            alert(`Error al actualizar el lead en la base de datos: ${error.message}`);
            fetchLeads(); // Revert on error
        }
    };

    const handleDeleteLead = async (leadId: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este lead? Esta acción no se puede deshacer.")) {
            return;
        }

        // Optimistic delete
        setLeads(leads.filter(l => l.id !== leadId));
        setSelectedLead(null);

        // Delete via Server Action
        const result = await deleteLead(leadId);

        if (!result.success) {
            alert("Error al eliminar el lead");
            fetchLeads(); // Revert on error
        }
    };


    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId as LeadStatus;
        handleUpdateStatus(draggableId, newStatus);
    };

    const handleCreateLead = async (formData: FormData) => {
        const check_in = formData.get('check_in') as string;
        const check_out = formData.get('check_out') as string;
        const newLead = {
            client_name: formData.get('client_name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            destination: formData.get('destination') as string,
            dates: check_in && check_out ? `In: ${check_in} | Out: ${check_out}` : '',
            check_in: check_in || null,
            check_out: check_out || null,
            travelers: formData.get('travelers') as string,
            notes: formData.get('notes') as string,
            status: 'new' as LeadStatus,
            probability: formData.get('probability') ? parseInt(formData.get('probability') as string) : null,
            provider_classification: formData.get('provider_classification') as string || null,
            price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
            commission: formData.get('commission') ? parseFloat(formData.get('commission') as string) : null,
            payment_status: formData.get('payment_status') as string || null,
            booking_reference: formData.get('booking_reference') as string || null,
            quote_sent_date: formData.get('quote_sent_date') ? formData.get('quote_sent_date') as string : null,
            estimated_sale_amount: formData.get('estimated_sale_amount') ? parseFloat(formData.get('estimated_sale_amount') as string) : null,
        };

        const { data, error } = await supabase
            .from('leads')
            .insert([newLead])
            .select()
            .single();

        if (data) {
            const typedLead = { ...data, status: data.status as LeadStatus };
            setLeads([typedLead, ...leads]);
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

                <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-56">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white"
                        />
                    </div>

                    {/* Sorting selector */}
                    <div className="flex items-center gap-1.5 border border-gray-300 rounded-full px-3 h-10 bg-white shadow-sm">
                        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Ordenar por:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="text-xs font-semibold text-gray-700 outline-none cursor-pointer bg-transparent pr-1"
                        >
                            <option value="created_at">Fecha Registro</option>
                            <option value="check_in">Fecha Check-in</option>
                            <option value="probability">Probabilidad</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            className="text-gray-500 hover:text-primary transition-colors text-xs font-bold pl-1.5 border-l border-gray-200"
                            title="Cambiar dirección de ordenamiento"
                        >
                            {sortOrder === 'asc' ? '▲' : '▼'}
                        </button>
                    </div>

                    {/* Excel download button */}
                    <button
                        onClick={handleExportCSV}
                        className="h-10 px-4 border border-green-600 text-green-700 hover:bg-green-50 rounded-full font-medium text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Descargar Excel
                    </button>

                    <button
                        onClick={() => setIsCreating(true)}
                        className="h-10 px-4 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <span className="text-xl leading-none">+</span> Nuevo Lead
                    </button>
                </div>
            </div>

            {/* Mobile Tabs */}
            <div className="flex md:hidden overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
                {LEAD_STATUSES.map((status) => (
                    <button
                        key={status.value}
                        onClick={() => setActiveTab(status.value)}
                        className={cn(
                            "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                            activeTab === status.value
                                ? `bg-${status.color.replace('border-', '')} text-white border-transparent shadow-md`
                                : "bg-white border-gray-200 text-gray-600"
                        )}
                        // Hack to match the status colors defined in types which use 'border-blue-500' etc. 
                        // We need a mapping or string manipulation. Simple fix for now:
                        style={activeTab === status.value ? { backgroundColor: status.color === 'border-gray-500' ? '#6b7280' : status.color === 'border-blue-500' ? '#3b82f6' : status.color === 'border-yellow-500' ? '#eab308' : status.color === 'border-green-500' ? '#22c55e' : '#ef4444' } : {}}
                    >
                        {status.label}
                    </button>
                ))}
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 overflow-hidden w-full h-[calc(100vh-220px)] min-h-[500px]">
                    {leadsByStatus.map((column) => (
                        // Show all on desktop, but only active one on mobile
                        <div
                            key={column.value}
                            className={cn(
                                "flex-1 min-w-0 flex-col bg-gray-50/50 rounded-xl border border-gray-100 transition-all",
                                // Mobile logic: hidden unless it's the active tab. Desktop: always flex.
                                activeTab === column.value ? "flex" : "hidden md:flex"
                            )}
                        >
                            {/* Column Header */}
                            <div className={`p-3 rounded-t-xl border-b-2 ${column.color} bg-white flex justify-between items-center mb-2 shadow-sm shrink-0`}>
                                <h3 className="font-bold text-xs lg:text-sm uppercase tracking-wider truncate text-gray-700">{column.label}</h3>
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
                                    {column.items.length}
                                </span>
                            </div>

                            {/* Cards Container */}
                            <Droppable droppableId={column.value}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={cn(
                                            "flex-1 space-y-3 p-2 overflow-y-auto custom-scrollbar",
                                            snapshot.isDraggingOver ? "bg-blue-50/50 ring-2 ring-primary/10 transition-colors" : ""
                                        )}
                                    >
                                        {column.items.map((lead, index) => (
                                            <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                        }}
                                                    >
                                                        <motion.div
                                                            layoutId={lead.id}
                                                            onClick={() => {
                                                                setSelectedLead(lead);
                                                                setIsEditing(false);
                                                            }}
                                                            className={cn(
                                                                "bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:border-primary/40 group relative overflow-hidden",
                                                                snapshot.isDragging ? "shadow-2xl rotate-2 scale-105 z-50 ring-2 ring-primary" : ""
                                                            )}
                                                        >
                                                            {/* Status Stripe */}
                                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${column.color.replace('border-', 'bg-')}`} />

                                                            <div className="pl-2">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors line-clamp-1">{lead.client_name}</h4>
                                                                    <span className="text-[10px] text-gray-400 shrink-0 ml-1">{new Date(lead.created_at).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}</span>
                                                                </div>
                                                                <div className="space-y-1 mb-2">
                                                                    <div className="flex items-center text-[10px] text-gray-500">
                                                                        <User className="h-3 w-3 mr-1.5 shrink-0" />
                                                                        <span className="truncate">{lead.travelers}</span>
                                                                    </div>
                                                                    <div className="flex items-center text-[10px] text-gray-500">
                                                                        <MapPinIcon className="h-3 w-3 mr-1.5 shrink-0" />
                                                                        <span className="truncate">{lead.destination}</span>
                                                                    </div>
                                                                    <div className="flex items-center text-[10px] text-gray-500">
                                                                        <Calendar className="h-3 w-3 mr-1.5 shrink-0" />
                                                                        <span className="truncate">
                                                                            {lead.check_in && lead.check_out 
                                                                                ? `${lead.check_in} al ${lead.check_out}` 
                                                                                : lead.dates || 'Sin fechas'}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {lead.status === 'proposal' && lead.probability !== undefined && lead.probability !== null && (
                                                                    <div className="mt-2 flex items-center">
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                                                            🎯 Probabilidad: {lead.probability}%
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                {lead.admin_notes && (
                                                                    <div className="mt-2 pt-2 border-t border-gray-50">
                                                                        <p className="text-[10px] text-gray-400 italic line-clamp-1">"{lead.admin_notes}"</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}

                                        {column.items.length === 0 && !snapshot.isDraggingOver && (
                                            <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs text-center p-4">
                                                Sin Leads en esta etapa
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>

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
                            {isEditing ? (
                                <form onSubmit={handleSaveEdit} className="flex flex-col min-h-0">
                                    {/* Edit Mode Body */}
                                    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)] text-sm">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h3 className="font-bold text-gray-900 border-b pb-2">Datos del Cliente</h3>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Nombre Completo</label>
                                                    <input required name="client_name" type="text" defaultValue={selectedLead.client_name} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                                                    <input required name="email" type="email" defaultValue={selectedLead.email} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono</label>
                                                    <input name="phone" type="text" defaultValue={selectedLead.phone} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Etapa del Lead</label>
                                                    <select name="status" defaultValue={selectedLead.status} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                                                        {LEAD_STATUSES.map(status => (
                                                            <option key={status.value} value={status.value}>{status.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="font-bold text-gray-900 border-b pb-2">Detalles del Viaje</h3>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Destino</label>
                                                    <input name="destination" type="text" defaultValue={selectedLead.destination} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Viajeros</label>
                                                    <input name="travelers" type="text" defaultValue={selectedLead.travelers} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Check-In</label>
                                                        <input name="check_in" type="date" defaultValue={selectedLead.check_in || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Check-Out</label>
                                                        <input name="check_out" type="date" defaultValue={selectedLead.check_out || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Clasificación</label>
                                                        <select name="provider_classification" defaultValue={selectedLead.provider_classification || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                                                            <option value="">Ninguno</option>
                                                            <option value="Paquetes Disney">Paquetes Disney</option>
                                                            <option value="Crucero Disney">Crucero Disney</option>
                                                            <option value="Otros">Otros</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Booking/Ref #</label>
                                                        <input name="booking_reference" type="text" defaultValue={selectedLead.booking_reference || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-bold text-gray-900 border-b pb-2">Información Financiera</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Monto Estimado</label>
                                                    <input name="estimated_sale_amount" type="number" step="any" defaultValue={selectedLead.estimated_sale_amount || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" placeholder="0.00" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Precio Final</label>
                                                    <input name="price" type="number" step="any" defaultValue={selectedLead.price || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" placeholder="0.00" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Comisión</label>
                                                    <input name="commission" type="number" step="any" defaultValue={selectedLead.commission || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" placeholder="0.00" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Status de Pago</label>
                                                    <select name="payment_status" defaultValue={selectedLead.payment_status || 'Pendiente'} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                                                        <option value="Pendiente">Pendiente</option>
                                                        <option value="Pagado">Pagado</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Fecha Envío Cot.</label>
                                                    <input name="quote_sent_date" type="date" defaultValue={selectedLead.quote_sent_date || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Probabilidad (%)</label>
                                                    <input name="probability" type="number" min="0" max="100" defaultValue={selectedLead.probability || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" placeholder="e.g. 80" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1 font-bold text-gray-900">Notas del Cliente</label>
                                                <textarea name="notes" rows={4} defaultValue={selectedLead.notes} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1 font-bold text-gray-900">Notas Administrativas</label>
                                                <textarea name="admin_notes" rows={4} defaultValue={selectedLead.admin_notes || ''} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" placeholder="Notas internas..." />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Edit Mode Footer */}
                                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-3xl">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors shadow-md"
                                        >
                                            Guardar Cambios
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    {/* Read Mode Body */}
                                    <div className="p-6 space-y-8">
                                        {/* Status Selector */}
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Etapa del Lead</label>
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

                                                            {/* WhatsApp Button */}
                                                            <a
                                                                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white text-xs font-bold rounded-full hover:bg-[#128C7E] transition-colors shadow-sm"
                                                            >
                                                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                                </svg>
                                                                WhatsApp
                                                            </a>
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
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Check-In</span>
                                                                <span className="font-medium">{selectedLead.check_in || 'Sin fecha'}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Check-Out</span>
                                                                <span className="font-medium">{selectedLead.check_out || 'Sin fecha'}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500 block text-xs">Viajeros</span>
                                                            <span className="font-medium">{selectedLead.travelers}</span>
                                                        </div>
                                                        {selectedLead.provider_classification && (
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Clasificación Proveedor</span>
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                                                    {selectedLead.provider_classification}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {selectedLead.booking_reference && (
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Booking / Reference</span>
                                                                <span className="font-mono font-medium text-gray-700">{selectedLead.booking_reference}</span>
                                                            </div>
                                                        )}
                                                        {selectedLead.quote_sent_date && (
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Fecha Envío Cotización</span>
                                                                <span className="font-medium">{selectedLead.quote_sent_date}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                {/* Financial info */}
                                                <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                        💰 Información Financiera
                                                    </h3>
                                                    <div className="space-y-3 text-sm">
                                                        <div>
                                                            <span className="text-gray-500 block text-xs">Monto Estimado de Venta</span>
                                                            <span className="font-semibold text-gray-800 text-base">
                                                                {selectedLead.estimated_sale_amount !== undefined && selectedLead.estimated_sale_amount !== null
                                                                    ? `$${Number(selectedLead.estimated_sale_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                                    : '$0.00'}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Precio Final</span>
                                                                <span className="font-semibold text-gray-800">
                                                                    {selectedLead.price !== undefined && selectedLead.price !== null
                                                                        ? `$${Number(selectedLead.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                                        : '$0.00'}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Comisión</span>
                                                                <span className="font-semibold text-green-700">
                                                                    {selectedLead.commission !== undefined && selectedLead.commission !== null
                                                                        ? `$${Number(selectedLead.commission).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                                        : '$0.00'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500 block text-xs mb-1">Status de Pago</span>
                                                            {selectedLead.payment_status === 'Pagado' ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                                                    ✓ Pagado
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                                    ⏰ Pendiente
                                                                </span>
                                                            )}
                                                        </div>
                                                        {selectedLead.probability !== undefined && selectedLead.probability !== null && (
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Probabilidad de Cierre</span>
                                                                <span className="font-bold text-purple-700">{selectedLead.probability}%</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                        Notas del Cliente
                                                    </h3>
                                                    <div className="bg-white border border-gray-200 p-4 rounded-xl text-sm italic text-gray-600 min-h-[80px]">
                                                        "{selectedLead.notes || 'Sin notas del cliente.'}"
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                        Notas Administrativas
                                                    </h3>
                                                    <div className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-xl text-sm text-gray-700 min-h-[80px]">
                                                        {selectedLead.admin_notes || <span className="text-gray-400 not-italic">Sin notas administrativas. Haz clic en "Editar" abajo para agregar.</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Read Mode Footer */}
                                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between gap-3 rounded-b-3xl mt-auto">
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteLead(selectedLead.id)}
                                            className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <Trash2 className="h-4 w-4" /> Eliminar Lead
                                        </button>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedLead(null)}
                                                className="px-6 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors shadow-md"
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
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
                            <form action={handleCreateLead} className="p-6 space-y-4 text-sm">
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                                        <input name="destination" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ej. Disney World" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Viajeros</label>
                                        <input name="travelers" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ej. 2 Adultos" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-In</label>
                                        <input name="check_in" type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out</label>
                                        <input name="check_out" type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Clasificación Proveedor</label>
                                        <select name="provider_classification" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                                            <option value="">Seleccionar...</option>
                                            <option value="Paquetes Disney">Paquetes Disney</option>
                                            <option value="Crucero Disney">Crucero Disney</option>
                                            <option value="Otros">Otros</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status de Pago</label>
                                        <select name="payment_status" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                                            <option value="">Seleccionar...</option>
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Pagado">Pagado</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Monto Estimado</label>
                                        <input name="estimated_sale_amount" type="number" step="any" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="0.00" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Precio Final</label>
                                        <input name="price" type="number" step="any" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="0.00" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Comisión</label>
                                        <input name="commission" type="number" step="any" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Booking/Ref #</label>
                                        <input name="booking_reference" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="12345" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Enviado Cot.</label>
                                        <input name="quote_sent_date" type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Probabilidad (%)</label>
                                        <input name="probability" type="number" min="0" max="100" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. 50" />
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
