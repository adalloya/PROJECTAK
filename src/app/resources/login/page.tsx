"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, AlertCircle, KeyRound, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Lead } from "@/lib/crm/types";

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

const MOCK_FALLBACK_CLIENT: Lead = {
    id: "mock-lead-123",
    created_at: new Date().toISOString(),
    client_name: "Familia Pérez",
    email: "perez@example.com",
    phone: "+52 55 1234 5678",
    destination: "Walt Disney World & Disneyland",
    dates: `In: 2026-06-05 | Out: 2026-06-12`,
    check_in: "2026-06-05",
    check_out: "2026-06-12",
    travelers: "2 Adultos, 2 Niños",
    notes: "",
    status: "disney_reserved",
    resource_access_enabled: true,
    resource_pin: "1234",
    resource_wdw: true,
    resource_dl: true,
    resource_dcl: false,
    booking_reference: "WDW987654"
};

export default function ResourceLoginPage() {
    const [pin, setPin] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    // Check if client is already logged in
    useEffect(() => {
        const stored = sessionStorage.getItem("client_resource_lead");
        if (stored) {
            try {
                const lead = JSON.parse(stored) as Lead;
                const today = getLocalYYYYMMDD();
                if (!lead.check_out || lead.check_out >= today) {
                    router.push("/resources/dashboard");
                } else {
                    sessionStorage.removeItem("client_resource_lead");
                }
            } catch (e) {
                sessionStorage.removeItem("client_resource_lead");
            }
        }
    }, [router]);

    // Handle keypress from physical keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (loading) return;
            if (e.key >= "0" && e.key <= "9") {
                handleNumberPress(e.key);
            } else if (e.key === "Backspace") {
                handleBackspace();
            } else if (e.key === "Escape") {
                setPin("");
                setErrorMsg(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [pin, loading]);

    // Trigger validation when pin reaches 4 digits
    useEffect(() => {
        if (pin.length === 4) {
            validatePin(pin);
        }
    }, [pin]);

    const handleNumberPress = (num: string) => {
        if (pin.length < 4) {
            setErrorMsg(null);
            setPin(prev => prev + num);
        }
    };

    const handleBackspace = () => {
        setErrorMsg(null);
        setPin(prev => prev.slice(0, -1));
    };

    const validatePin = async (enteredPin: string) => {
        setLoading(true);
        setErrorMsg(null);

        try {
            // Query DB for matching pin & active status
            const { data, error } = await supabase
                .from("leads")
                .select("*")
                .eq("resource_pin", enteredPin);

            let matchedLead: Lead | null = null;

            if (error) {
                console.warn("Error checking database pin, attempting fallback check", error);
            } else if (data && data.length > 0) {
                // Find any matching lead with access enabled
                matchedLead = data.find(l => l.resource_access_enabled === true) || null;
                
                // If not found but there is a matching pin that is disabled, set disabled error
                if (!matchedLead && data.some(l => l.resource_pin === enteredPin)) {
                    setErrorMsg("El acceso al centro de recursos está desactivado por el administrador.");
                    setPin("");
                    setLoading(false);
                    return;
                }
            }

            // Fallback for review/demo purposes
            if (!matchedLead && enteredPin === "1234") {
                matchedLead = MOCK_FALLBACK_CLIENT;
            }

            if (!matchedLead) {
                setErrorMsg("Código PIN incorrecto o acceso no habilitado.");
                setPin("");
                setLoading(false);
                return;
            }

            // Expiration validation (check_out date)
            const todayStr = getLocalYYYYMMDD();
            if (matchedLead.check_out && matchedLead.check_out < todayStr) {
                setErrorMsg(`Tu acceso expiró el ${formatSpanishDate(matchedLead.check_out)}.`);
                setPin("");
                setLoading(false);
                return;
            }

            // Store user details in sessionStorage
            sessionStorage.setItem("client_resource_lead", JSON.stringify(matchedLead));

            // Redirect to dashboard
            router.push("/resources/dashboard");
        } catch (e) {
            console.error("Login Error:", e);
            setErrorMsg("Ocurrió un error de conexión. Intente de nuevo.");
            setPin("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Magic Gradients */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-violet-900/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-fuchsia-900/20 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo and Magic Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center justify-center p-4 bg-violet-500/10 rounded-3xl border border-violet-500/20 mb-4 shadow-inner"
                    >
                        <KeyRound className="h-10 w-10 text-violet-400" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-300 via-fuchsia-200 to-indigo-300 bg-clip-text text-transparent"
                    >
                        Centro de Recursos
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-slate-400 text-sm mt-2"
                    >
                        Ingresa tu código PIN de 4 dígitos para acceder a tus guías de viaje
                    </motion.p>
                </div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-[2.5rem] p-8 shadow-2xl relative"
                >
                    {/* PIN Input Dots */}
                    <div className="flex justify-center items-center gap-6 mb-8 mt-2">
                        {[0, 1, 2, 3].map((index) => (
                            <motion.div
                                key={index}
                                animate={pin.length > index ? { scale: [1, 1.2, 1], backgroundColor: "#a78bfa" } : { scale: 1, backgroundColor: "#334155" }}
                                transition={{ duration: 0.2 }}
                                className="w-5 h-5 rounded-full border border-slate-700/50 shadow-inner"
                            />
                        ))}
                    </div>

                    {/* Feedback messages */}
                    <div className="h-8 mb-4 flex items-center justify-center text-center">
                        <AnimatePresence mode="wait">
                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="flex items-center gap-2 text-rose-400 text-xs font-semibold bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20"
                                >
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{errorMsg}</span>
                                </motion.div>
                            )}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2 text-violet-400 text-xs font-semibold"
                                >
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Validando acceso...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Numeric Keypad Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                            <button
                                key={num}
                                type="button"
                                disabled={loading || pin.length >= 4}
                                onClick={() => handleNumberPress(num)}
                                className="h-16 text-2xl font-bold bg-slate-800/40 hover:bg-slate-800/80 active:bg-violet-900/30 text-slate-100 rounded-2xl border border-slate-800 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => { setPin(""); setErrorMsg(null); }}
                            className="h-16 text-sm font-semibold text-slate-400 hover:text-slate-200 bg-transparent hover:bg-slate-800/20 rounded-2xl transition-all cursor-pointer transform active:scale-95 flex items-center justify-center"
                        >
                            Limpiar
                        </button>
                        <button
                            type="button"
                            disabled={loading || pin.length >= 4}
                            onClick={() => handleNumberPress("0")}
                            className="h-16 text-2xl font-bold bg-slate-800/40 hover:bg-slate-800/80 active:bg-violet-900/30 text-slate-100 rounded-2xl border border-slate-800 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                        >
                            0
                        </button>
                        <button
                            type="button"
                            disabled={pin.length === 0}
                            onClick={handleBackspace}
                            className="h-16 text-slate-400 hover:text-slate-200 bg-slate-800/20 hover:bg-slate-800/60 rounded-2xl transition-all cursor-pointer transform active:scale-95 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
                            </svg>
                        </button>
                    </div>
                </motion.div>

                {/* Back to main site link */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => router.push("/")}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-400 text-xs font-semibold transition-colors bg-transparent border-0 cursor-pointer"
                    >
                        <span>Volver al sitio principal</span>
                        <ArrowRight className="h-3 w-3" />
                    </button>
                </div>
            </div>
        </main>
    );
}
