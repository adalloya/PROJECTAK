"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar, Users, MapPin, Mail, Phone, User, CheckCircle2, AlertCircle, Baby } from "lucide-react";
import { destinationsData } from "@/lib/destinations";

import { submitLead } from "../actions";
import { useTransition } from "react";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [selectedDestination, setSelectedDestination] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await submitLead(formData);
            if (result.success) {
                setSubmitted(true);
            } else {
                alert("Hubo un error al enviar la solicitud. Por favor intenta de nuevo.");
            }
        });
    };

    return (
        <main className="min-h-screen pt-24 pb-16 px-4 bg-secondary/10">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                            Solicitud de Cotización
                        </h1>
                        <div className="bg-white dark:bg-card p-8 rounded-3xl shadow-sm border border-border/50 text-left space-y-4 max-w-3xl mx-auto">
                            <p className="text-lg font-medium text-primary">
                                ¡Bienvenid@! Me llamo Anna Karen, agente certificada por Disney y Universal.
                            </p>
                            <p className="text-muted-foreground">
                                Si estás aquí es porque estás pensando en tener unas vacaciones inolvidables, ¡yo te puedo apoyar con la planeación!
                                Te pido leas con atención y llenes el siguiente formulario para hacerte llegar tu cotización. El tiempo de respuesta es de <span className="font-semibold text-foreground">24 a 72 horas</span>.
                            </p>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm space-y-2 text-blue-800 dark:text-blue-200">
                                <div className="flex gap-2">
                                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                                    <p>Al contratar tu paquete (hotel + tickets), obtienes asesoría previa y durante tu viaje sin costo adicional.</p>
                                </div>
                                <div className="flex gap-2">
                                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                                    <p>Los precios que recibes son oficiales de Disney y Universal.</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-muted-foreground border-t border-border pt-4 mt-4">
                                <p><span className="font-semibold text-red-500">* Importante:</span> El cliente es responsable de contar con documentación (visa, pasaporte) vigente. No se incluyen vuelos.</p>
                                <p>
                                    Si deseas únicamente compra de tickets: <br />
                                    • Walt Disney World: mínimo 3 días.<br />
                                    • Disneyland California: mínimo 2 días.<br />
                                    <span className="italic opacity-80">(Si es menor se agrega +5% por servicio).</span>
                                </p>
                                <p>Al recibir tu cotización, podemos realizar hasta 2 cambios sin costo.</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    {submitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-12 rounded-3xl text-center max-w-2xl mx-auto"
                        >
                            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-6" />
                            <h2 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-4">¡Solicitud Enviada!</h2>
                            <p className="text-lg text-green-700 dark:text-green-300">
                                Gracias por confiar en Here We Go Advisor. Anna Karen revisará tus detalles y te contactará pronto para comenzar la magia.
                            </p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-card p-8 md:p-12 rounded-[2rem] shadow-lg border border-border/50">

                            {/* Section 1: Client Info */}
                            <div>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" /> Tus Datos
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium">¿Eres un cliente nuevo?</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <label className="flex items-center space-x-3 p-4 border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                                                <input type="radio" name="client_status" value="new" className="h-4 w-4 text-primary" required />
                                                <span className="font-medium">Soy un cliente nuevo</span>
                                            </label>
                                            <label className="flex items-center space-x-3 p-4 border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                                                <input type="radio" name="client_status" value="existing" className="h-4 w-4 text-primary" required />
                                                <span className="font-medium">Ya soy parte de la familia</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">Nombre Completo</label>
                                        <input
                                            id="name"
                                            name="name"
                                            required
                                            className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="Ej. Ana García"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-medium">Teléfono / WhatsApp</label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="+52 55 1234 5678"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="email" className="text-sm font-medium">Correo Electrónico</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                                            placeholder="ejemplo@correo.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-border/50" />

                            {/* Section 2: Trip Details */}
                            <div>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" /> Detalles del Viaje
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="destination" className="text-sm font-medium">Destino de Interés</label>
                                        <select
                                            id="destination"
                                            name="destination"
                                            className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                                            onChange={(e) => setSelectedDestination(e.target.value)}
                                            required
                                        >
                                            <option value="">Selecciona un destino</option>
                                            {Object.values(destinationsData).map((dest) => (
                                                <option key={dest.slug} value={dest.title}>{dest.title}</option>
                                            ))}
                                            <option value="Universal Studios Hollywood">Universal Studios Hollywood</option>
                                            <option value="Aulani">Aulani, A Disney Resort & Spa</option>
                                            <option value="Adventures by Disney">Adventures by Disney</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>

                                    {/* Conditional Logic: Disney World Dining Plan */}
                                    {selectedDestination === "Walt Disney World Resort" && (
                                        <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                <input type="checkbox" name="dining_plan" className="h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary" />
                                                <span className="font-medium text-foreground/90">¿Te interesa agregar Plan de Comidas a tu paquete?</span>
                                            </label>
                                        </div>
                                    )}

                                    {/* Conditional Logic: Disneyland Hotels */}
                                    {selectedDestination.includes("Disneyland") && (
                                        <div className="md:col-span-2 bg-purple-50/50 p-6 rounded-xl border border-purple-100 space-y-3">
                                            <label className="text-sm font-medium block mb-2">Preferencia de Hospedaje:</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <label className="flex items-center space-x-3 p-3 bg-white border rounded-lg cursor-pointer hover:border-primary transition-colors">
                                                    <input type="radio" name="hotel_preference" value="Disney Hotel" className="h-4 w-4 text-primary" />
                                                    <span className="text-sm">Hotel Disney (On-Property)</span>
                                                </label>
                                                <label className="flex items-center space-x-3 p-3 bg-white border rounded-lg cursor-pointer hover:border-primary transition-colors">
                                                    <input type="radio" name="hotel_preference" value="Good Neighbor" className="h-4 w-4 text-primary" />
                                                    <span className="text-sm">Hotel Good Neighbor</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium">Tipo de Cotización</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <label className="flex items-center space-x-3 p-4 border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                                                <input type="radio" name="package_type" value="Paquete Completo" className="h-4 w-4 text-primary" required />
                                                <span className="text-sm font-medium">Paquete (Hotel + Tickets)</span>
                                            </label>
                                            <label className="flex items-center space-x-3 p-4 border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                                                <input type="radio" name="package_type" value="Solo Tickets" className="h-4 w-4 text-primary" required />
                                                <span className="text-sm font-medium">Solo Tickets</span>
                                            </label>
                                            <label className="flex items-center space-x-3 p-4 border rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                                                <input type="radio" name="package_type" value="Solo Asesoría" className="h-4 w-4 text-primary" required />
                                                <span className="text-sm font-medium">Solo Asesoría</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="checkin" className="text-sm font-medium">Check-in</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                            <input
                                                id="checkin"
                                                name="checkin"
                                                type="date"
                                                required
                                                className="flex h-12 w-full rounded-xl border border-input bg-background/50 pl-10 pr-4 py-2 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="checkout" className="text-sm font-medium">Check-out</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                            <input
                                                id="checkout"
                                                name="checkout"
                                                type="date"
                                                required
                                                className="flex h-12 w-full rounded-xl border border-input bg-background/50 pl-10 pr-4 py-2 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium">Viajeros</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="relative">
                                                <Users className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                                <input
                                                    type="number"
                                                    name="adults"
                                                    min="1"
                                                    defaultValue="2"
                                                    className="flex h-12 w-full rounded-xl border border-input bg-background/50 pl-10 pr-4 py-2 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                                                    placeholder="Adultos"
                                                />
                                                <span className="absolute right-3 top-3.5 text-xs text-muted-foreground">Adultos</span>
                                            </div>
                                            <div className="relative">
                                                <Baby className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                                <input
                                                    type="number"
                                                    name="children"
                                                    min="0"
                                                    defaultValue="0"
                                                    className="flex h-12 w-full rounded-xl border border-input bg-background/50 pl-10 pr-4 py-2 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                                                    placeholder="Niños"
                                                />
                                                <span className="absolute right-3 top-3.5 text-xs text-muted-foreground">Niños</span>
                                            </div>
                                            <div className="relative col-span-1 sm:col-span-1">
                                                <input
                                                    type="text"
                                                    name="children_ages"
                                                    className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                                                    placeholder="Edades niños (ej. 4, 8)"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-border/50" />

                            {/* Section 3: Notes */}
                            <div className="space-y-2">
                                <label htmlFor="notes" className="text-sm font-medium">Comentarios Adicionales</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    className="flex min-h-[120px] w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 outline-none resize-y"
                                    placeholder="¿Celebran algo especial? ¿Tienen algún hotel en mente? ¿Presupuesto aproximado?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className={cn(
                                    "w-full h-14 rounded-xl font-bold text-lg transition-all text-white shadow-lg hover:shadow-xl hover:-translate-y-1",
                                    isPending ? "bg-primary/70 cursor-wait" : "bg-gradient-to-r from-primary to-purple-600"
                                )}
                            >
                                {isPending ? "Enviando Solicitud..." : "Solicitar Cotización"}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
