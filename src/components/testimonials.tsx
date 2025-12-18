"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    image_url?: string;
}

const defaultTestimonials = [
    {
        id: 1,
        name: "María G.",
        role: "Mamá de 3",
        content: "¡Ana Karen hizo que nuestro viaje fuera perfecto! No tuvimos que preocuparnos por nada, solo disfrutar.",
        rating: 5,
    },
    // ... keep defaults or reduce them if we expect DB data
];

interface TestimonialsProps {
    reviews?: Review[];
}

export function Testimonials({ reviews = [] }: TestimonialsProps) {
    const displayReviews = reviews.length > 0 ? reviews : defaultTestimonials;

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
                        {[...displayReviews, ...displayReviews].map((t, index) => (
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
                                <div className="flex items-center gap-4">
                                    {t.image_url && (
                                        <div className="relative h-12 w-12 rounded-full overflow-hidden border border-border">
                                            <img src={t.image_url} alt={t.name} className="object-cover w-full h-full" />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-foreground">{t.name}</h4>
                                        <p className="text-sm text-muted-foreground">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
