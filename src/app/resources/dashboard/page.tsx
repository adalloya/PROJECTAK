"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FileText, 
    LogOut, 
    Calendar, 
    Users, 
    Compass, 
    Bookmark, 
    Sparkles, 
    Eye, 
    ChevronRight, 
    MessageCircle,
    X,
    Lock,
    HelpCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Lead, ResourceItem } from "@/lib/crm/types";

// Local date getter YYYY-MM-DD
const getLocalYYYYMMDD = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// Format Spanish date
const formatSpanishDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
};

export default function ResourceDashboardPage() {
    const [lead, setLead] = useState<Lead | null>(null);
    const [resources, setResources] = useState<ResourceItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedPdf, setSelectedPdf] = useState<{ title: string; url: string } | null>(null);
    const router = useRouter();

    // Authenticate traveler from sessionStorage
    useEffect(() => {
        const stored = sessionStorage.getItem("client_resource_lead");
        if (!stored) {
            router.push("/resources/login");
            return;
        }

        try {
            const parsedLead = JSON.parse(stored) as Lead;
            const today = getLocalYYYYMMDD();
            
            // Check if access is expired
            if (parsedLead.check_out && parsedLead.check_out < today) {
                sessionStorage.removeItem("client_resource_lead");
                router.push("/resources/login");
                return;
            }

            setLead(parsedLead);
            fetchResources(parsedLead);
        } catch (e) {
            sessionStorage.removeItem("client_resource_lead");
            router.push("/resources/login");
        }
    }, [router]);

    const fetchResources = async (currentLead: Lead) => {
        try {
            const { data, error } = await supabase
                .from("resources")
                .select("*")
                .order("updated_at", { ascending: false });

            if (error) {
                console.warn("DB resources table not available, using fallbacks.", error);
            } else if (data) {
                setResources(data as ResourceItem[]);
            }
        } catch (err) {
            console.error("Failed to load resources:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("client_resource_lead");
        router.push("/resources/login");
    };

    if (loading || !lead) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-violet-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-slate-400 text-sm font-medium">Cargando tu portal mágico...</p>
                </div>
            </div>
        );
    }

    // Filter resources by category
    const finalWdwGuides = resources.filter(r => r.category === "wdw");
    const finalDlGuides = resources.filter(r => r.category === "dl");
    const finalDclGuides = resources.filter(r => r.category === "dcl");

    const hasAnyAccess = lead.resource_wdw || lead.resource_dl || lead.resource_dcl;

    // Contact WhatsApp Handler
    const handleContactWhatsApp = () => {
        const text = encodeURIComponent(
            `¡Hola Anna Karen! 👋 Soy ${lead.client_name}. Estoy en mi Centro de Recursos de mi viaje a ${lead.destination || "Disney"} y me gustaría hacer una consulta.`
        );
        window.open(`https://wa.me/5665663877501?text=${text}`, "_blank");
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 pb-24 relative overflow-hidden">
            {/* Background Magic Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/15 blur-[120px] pointer-events-none" />
            <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-900/15 blur-[120px] pointer-events-none" />

            {/* Header / Navbar style */}
            <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-violet-400" />
                        <span className="font-extrabold text-lg bg-gradient-to-r from-violet-300 via-fuchsia-200 to-indigo-300 bg-clip-text text-transparent">
                            Here We Go Advisor
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/50 transition-all text-xs font-semibold cursor-pointer"
                    >
                        <LogOut className="h-4.5 w-4.5" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 pt-10">
                {/* Welcome & Profile Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            ¡Hola, {lead.client_name}! ✨
                        </h1>
                    </div>
                    <p className="text-slate-400 text-sm md:text-base">
                        ¡Bienvenido a tu centro de recursos mágico! Aquí encontrarás guías personalizadas y esenciales para tu aventura.
                    </p>
                </motion.div>

                {/* Traveler Card Detail */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 md:p-8 mb-12 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                            <Compass className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Destino</span>
                            <span className="text-sm font-bold text-slate-200">{lead.destination || "Viaje Mágico"}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Fechas de Viaje</span>
                            <span className="text-sm font-bold text-slate-200">
                                {lead.check_in ? formatSpanishDate(lead.check_in) : "Por definir"} 
                                {lead.check_out ? ` al ${formatSpanishDate(lead.check_out)}` : ""}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Pasajeros</span>
                            <span className="text-sm font-bold text-slate-200">{lead.travelers || "Sin registrar"}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <Bookmark className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Clave de Reserva</span>
                            <span className="text-sm font-bold font-mono tracking-wider text-slate-200">
                                {lead.booking_reference || "Pendiente"}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content (PDF Sections) */}
                {!hasAnyAccess ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto"
                    >
                        <Lock className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-300 mb-2">Secciones no activadas</h3>
                        <p className="text-sm text-slate-500">
                            El administrador aún no ha habilitado ninguna sección de recursos para tu cuenta. Por favor contáctanos para habilitarlas.
                        </p>
                        <button
                            onClick={handleContactWhatsApp}
                            className="mt-6 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-full text-sm font-semibold transition-colors flex items-center gap-2 mx-auto cursor-pointer"
                        >
                            <MessageCircle className="h-4 w-4" />
                            <span>Contactar Asesor</span>
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-12">
                        {/* WALT DISNEY WORLD SECTION */}
                        {lead.resource_wdw && (
                            <motion.section
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-900">
                                    <div className="h-2 w-2 rounded-full bg-violet-400" />
                                    <h2 className="text-2xl font-bold tracking-tight text-violet-300">Walt Disney World (Orlando)</h2>
                                </div>
                                {finalWdwGuides.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {finalWdwGuides.map((guide, idx) => (
                                            <GuideCard 
                                                key={guide.id}
                                                guide={guide}
                                                index={idx}
                                                onView={(title, url) => setSelectedPdf({ title, url })}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 text-center text-slate-500 text-xs font-semibold">
                                        Próximamente disponible - Tu asesor está preparando tus guías mágicas.
                                    </div>
                                )}
                            </motion.section>
                        )}

                        {/* DISNEYLAND RESORT SECTION */}
                        {lead.resource_dl && (
                            <motion.section
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-900">
                                    <div className="h-2 w-2 rounded-full bg-fuchsia-400" />
                                    <h2 className="text-2xl font-bold tracking-tight text-fuchsia-300">Disneyland California</h2>
                                </div>
                                {finalDlGuides.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {finalDlGuides.map((guide, idx) => (
                                            <GuideCard 
                                                key={guide.id}
                                                guide={guide}
                                                index={idx}
                                                onView={(title, url) => setSelectedPdf({ title, url })}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 text-center text-slate-500 text-xs font-semibold">
                                        Próximamente disponible - Tu asesor está preparando tus guías mágicas.
                                    </div>
                                )}
                            </motion.section>
                        )}

                        {/* DISNEY CRUISE LINE SECTION */}
                        {lead.resource_dcl && (
                            <motion.section
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-900">
                                    <div className="h-2 w-2 rounded-full bg-indigo-400" />
                                    <h2 className="text-2xl font-bold tracking-tight text-indigo-300">Disney Cruise Line</h2>
                                </div>
                                {finalDclGuides.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {finalDclGuides.map((guide, idx) => (
                                            <GuideCard 
                                                key={guide.id}
                                                guide={guide}
                                                index={idx}
                                                onView={(title, url) => setSelectedPdf({ title, url })}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 text-center text-slate-500 text-xs font-semibold">
                                        Próximamente disponible - Tu asesor está preparando tus guías mágicas.
                                    </div>
                                )}
                            </motion.section>
                        )}
                    </div>
                )}
            </div>

            {/* Float Action WhatsApp Button */}
            <div className="fixed bottom-6 right-6 z-40 group">
                <div className="absolute -top-12 right-0 bg-slate-900 text-slate-100 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                    ¿Necesitas ayuda? Escríbenos 🪄
                </div>
                <button
                    onClick={handleContactWhatsApp}
                    className="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer border border-emerald-400/20"
                >
                    <MessageCircle className="h-7 w-7" />
                </button>
            </div>

            {/* SECURE PDF VIEWER MODAL */}
            <AnimatePresence>
                {selectedPdf && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex flex-col"
                    >
                        {/* Header bar */}
                        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-900">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-violet-400" />
                                <h3 className="font-bold text-slate-200 text-sm md:text-base tracking-wide truncate max-w-xs md:max-w-md">
                                    {selectedPdf.title}
                                </h3>
                                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-semibold uppercase tracking-wider">
                                    <Lock className="h-3 w-3" />
                                    <span>Vista Protegida</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedPdf(null)}
                                className="p-2 text-slate-400 hover:text-slate-100 rounded-full hover:bg-slate-900 transition-colors cursor-pointer"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Visualizer iframe & secure blockers wrapper */}
                        <div 
                            className="flex-1 w-full bg-slate-950 relative overflow-hidden flex justify-center items-center"
                            onContextMenu={(e) => e.preventDefault()} // Block right click
                        >
                            {/* PDF Render */}
                            <iframe
                                src={`${selectedPdf.url}#toolbar=0&navpanes=0&scrollbar=1`}
                                className="w-full h-full border-none max-w-5xl bg-slate-900 shadow-2xl rounded-t-xl"
                                title="Visor de Guías"
                            />

                            {/* Secure Overlay: Covers top bar controls where download/print buttons might float in Chrome/Firefox default PDF wrappers */}
                            <div className="absolute top-0 left-0 right-0 h-14 bg-transparent cursor-default select-none pointer-events-auto" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

// Subcomponent: Guide Card
interface GuideCardProps {
    guide: ResourceItem;
    index: number;
    onView: (title: string, url: string) => void;
}

function GuideCard({ guide, index, onView }: GuideCardProps) {
    const isAvailable = !!guide.pdf_url;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`group flex items-center justify-between p-5 rounded-2xl border transition-all ${
                isAvailable 
                    ? "bg-slate-900/40 hover:bg-slate-900/80 border-slate-800/80 hover:border-violet-500/30 cursor-pointer shadow-sm hover:shadow-md" 
                    : "bg-slate-900/10 border-slate-900/50 cursor-not-allowed opacity-50"
            }`}
            onClick={() => isAvailable && onView(guide.title, guide.pdf_url!)}
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-colors ${
                    isAvailable 
                        ? "bg-slate-800 text-violet-400 group-hover:bg-violet-500/10" 
                        : "bg-slate-950 text-slate-600"
                }`}>
                    <FileText className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-slate-200 group-hover:text-violet-300 transition-colors">
                        {guide.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        {isAvailable ? "Guía en PDF • Haz clic para abrir" : "Próximamente disponible"}
                    </p>
                </div>
            </div>
            <div>
                {isAvailable ? (
                    <div className="h-8 w-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm">
                        <Eye className="h-4 w-4" />
                    </div>
                ) : (
                    <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider border border-slate-800 px-2 py-1 rounded">
                        Espera
                    </div>
                )}
            </div>
        </motion.div>
    );
}
