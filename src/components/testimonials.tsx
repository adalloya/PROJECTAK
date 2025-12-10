"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
    {
        id: 1,
        name: "María G.",
        role: "Mamá de 3",
        content: "¡Ana Karen hizo que nuestro viaje fuera perfecto! No tuvimos que preocuparnos por nada, solo disfrutar.",
        rating: 5,
    },
    {
        id: 2,
        name: "Carlos R.",
        role: "Viajero Frecuente",
        content: "He ido a Disney muchas veces, pero esta fue la mejor experiencia. El servicio VIP vale cada centavo.",
        rating: 5,
    },
    {
        id: 3,
        name: "Familia López",
        role: "Primer Viaje a Disney",
        content: "Estábamos abrumados con tanta información, pero Ana nos guió paso a paso. Universal Studios fue un éxito.",
        rating: 5,
    },
    {
        id: 4,
        name: "Sofía M.",
        role: "Luna de Miel",
        content: "Fue el viaje más romántico y sin estrés. Ana se encargó de cada detalle, desde el hotel hasta las reservas de cena.",
        rating: 5,
    },
    {
        id: 5,
        name: "Ricardo D.",
        role: "Viaje de Amigos",
        content: "Increíble experiencia en Epcot. La guía de bebidas y comidas fue top. Definitivamente volveremos a reservar.",
        rating: 5,
    },
    {
        id: 6,
        name: "Familia Torres",
        role: "Vacaciones de Verano",
        content: "El crucero de Disney superó nuestras expectativas. Los niños amaron el club y nosotros el área de adultos.",
        rating: 5,
    },
];

export function Testimonials() {
    return (
        <section className="py-24 bg-secondary/30 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Lo Que Dicen Nuestros Viajeros</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Historias reales de magia y aventura creadas por Here We Go Advisor.
                    </p>
                </motion.div>
            </div>

            <div className="relative w-full fade-edges-mask">
                <div className="flex overflow-hidden">
                    <motion.div
                        className="flex gap-8 px-4"
                        animate={{
                            x: ["0%", "-50%"],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 40,
                                ease: "linear",
                            },
                        }}
                        style={{ width: "fit-content" }}
                    >
                        {/* Render list twice for seamless loop */}
                        {[...testimonials, ...testimonials].map((t, index) => (
                            <div
                                key={`${t.id}-${index}`}
                                className="flex-shrink-0 w-[400px] bg-background/60 backdrop-blur-md p-8 rounded-3xl border border-border/50 shadow-sm hover:border-primary/20 transition-colors"
                                style={{ whiteSpace: "normal" }} // Ensure text wraps inside card
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-lg text-foreground/90 mb-6 italic leading-relaxed">"{t.content}"</p>
                                <div>
                                    <h4 className="font-bold text-foreground">{t.name}</h4>
                                    <p className="text-sm text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
