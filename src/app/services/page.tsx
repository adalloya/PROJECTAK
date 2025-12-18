"use client";

import { Navbar } from "@/components/navbar";

import { motion } from "framer-motion";
import { Check, Star, Sparkles, Map, Phone, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 -z-10" />
                <div className="container px-4 mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Tu Viaje Soñado, <span className="text-primary">A Tu Manera</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            Diseñamos experiencias mágicas personalizadas. Ya sea que necesites el paquete completo o solo nuestra guía experta, estamos aquí para hacer realidad tus sueños.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16 md:py-24">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">

                        {/* Option 1: Full Package */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border relative overflow-hidden group hover:shadow-xl transition-shadow"
                        >
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-xl font-medium text-sm">
                                Más Popular
                            </div>
                            <div className="mb-8">
                                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                                    <Sparkles size={32} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">Experiencia Completa</h3>
                                <p className="text-muted-foreground">
                                    Nos encargamos de ABSOLUTAMENTE todo. Tú solo preocúpate por empacar y disfrutar.
                                </p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "Boletos de parques",
                                    "Reservación de hoteles Disney/Universal",
                                    "Planeación personalizada",
                                    "Reservas de restaurantes y experiencias",
                                    "Acompañamiento digital durante el viaje",
                                    "Guía de uso de Apps (Ej. My Disney Experience)",
                                    "Tips para optimizar filas y tiempos"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/contact" className="block">
                                <Button className="w-full text-lg h-12 rounded-full shadow-md group-hover:scale-105 transition-transform">
                                    Cotizar Paquete Completo
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Option 2: Consulting Only */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-secondary/20 rounded-3xl p-8 md:p-12 border border-border/50 relative overflow-hidden hover:bg-secondary/30 transition-colors"
                        >
                            <div className="mb-8">
                                <div className="h-14 w-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                                    <Map size={32} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">Consultoría a la Carta</h3>
                                <p className="text-muted-foreground">
                                    ¿Ya tienes tus boletos? No te preocupes. Te ayudamos a organizar tu magia para aprovechar al máximo tu visita.
                                </p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "Estrategia de itinerario personalizada",
                                    "Asesoría en compra de Lightning Lane / Express Pass",
                                    "Guía de restaurantes imperdibles",
                                    "Tips de expertos para ahorrar tiempo",
                                    "Soporte para vincular tus reservaciones",
                                    "Recomendaciones según tu grupo de viaje",
                                    "Acceso a nuestras guías exclusivas"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/contact" className="block">
                                <Button variant="outline" className="w-full text-lg h-12 rounded-full border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                                    Solicitar Consultoría
                                </Button>
                            </Link>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Features/Trust Section */}
            <section className="py-16 bg-muted/30">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
                        <div className="flex flex-col items-center">
                            <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-primary">
                                <Phone size={24} />
                            </div>
                            <h4 className="font-bold mb-2">Soporte Continuo</h4>
                            <p className="text-sm text-muted-foreground">No estás solo. Te acompañamos antes y durante tu viaje.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-primary">
                                <Clock size={24} />
                            </div>
                            <h4 className="font-bold mb-2">Ahorra Tiempo</h4>
                            <p className="text-sm text-muted-foreground">Optimizamos tu día para que disfrutes más atracciones.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-primary">
                                <Star size={24} />
                            </div>
                            <h4 className="font-bold mb-2">Expertos Disney</h4>
                            <p className="text-sm text-muted-foreground">Conocemos los secretos para hacer tu visita inolvidable.</p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
}
