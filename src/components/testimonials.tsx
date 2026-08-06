"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    image_url?: string;
}

const defaultTestimonials: Review[] = [
    {
        id: 1,
        name: "María G.",
        role: "Mamá de 3 • Disney World",
        content: "¡Ana Karen hizo que nuestro viaje fuera perfecto! No tuvimos que preocuparnos por nada, solo disfrutar cada momento en los parques.",
        rating: 5,
    },
    {
        id: 2,
        name: "Familia Aguirre",
        role: "Disney Cruise Line",
        content: "Cansadísimos pero con el corazón muy feliz. Mil gracias por tu acompañamiento, definitivamente no lo hubiéramos logrado solitos.",
        rating: 5,
    },
    {
        id: 3,
        name: "Nayely Morales",
        role: "Crucero Disney Destiny",
        content: "Excelente servicio de principio a fin. En nuestro viaje al crucero de Disney todo salió perfecto. 100% recomendada.",
        rating: 5,
    }
];

interface TestimonialsProps {
    reviews?: Review[] | null;
}

export function Testimonials({ reviews }: TestimonialsProps) {
    const listToDisplay = Array.isArray(reviews) && reviews.length > 0 ? reviews : defaultTestimonials;
    const [isPaused, setIsPaused] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    if (listToDisplay.length === 0) {
        return null;
    }

    // Duplicate list enough times to ensure seamless infinite loop
    let itemsToRepeat = [...listToDisplay];
    while (itemsToRepeat.length < 8) {
        itemsToRepeat = [...itemsToRepeat, ...listToDisplay];
    }
    const marqueeItems = [...itemsToRepeat, ...itemsToRepeat];

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const scrollAmount = 360;
        scrollContainerRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <section className="py-20 bg-gradient-to-b from-slate-50/50 via-purple-50/20 to-slate-50/50 dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-3"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        <MessageSquareQuote className="h-3.5 w-3.5" />
                        <span>Experiencias Reales</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Lo Que Dicen Nuestros Viajeros
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
                        Historias de magia, acompañamiento y momentos inolvidables diseñados por Here We Go Advisor.
                    </p>
                </motion.div>

                {/* Controls Bar */}
                <div className="flex items-center justify-between mt-6 px-2">
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Pasa el cursor sobre una reseña para pausar la lectura
                    </span>
                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            onClick={() => scroll('left')}
                            className="p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all text-slate-700 dark:text-slate-200"
                            aria-label="Reseña anterior"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all text-slate-700 dark:text-slate-200"
                            aria-label="Siguiente reseña"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Marquee & Scroll Container */}
            <div 
                className="relative w-full fade-edges-mask py-4"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scrollbar-none scroll-smooth"
                >
                    <motion.div
                        className="flex gap-6 px-4 shrink-0"
                        animate={{
                            x: isPaused ? undefined : ["0%", "-50%"],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: Math.max(30, marqueeItems.length * 4),
                                ease: "linear",
                            },
                        }}
                        style={{ width: "fit-content" }}
                    >
                        {marqueeItems.map((t, index) => {
                            const initials = t.name ? t.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'HW';
                            return (
                                <div
                                    key={`${t.id}-${index}`}
                                    className="flex-shrink-0 w-[320px] sm:w-[380px] min-h-[230px] max-h-[280px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col justify-between group"
                                >
                                    {/* Top Card Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex gap-1">
                                            {[...Array(Math.max(0, Math.min(5, Math.floor(t.rating || 5))))].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <Quote className="h-6 w-6 text-primary/20 group-hover:text-primary/40 transition-colors" />
                                    </div>

                                    {/* Review Body */}
                                    <div className="flex-1 my-2 overflow-y-auto scrollbar-none pr-1">
                                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic font-medium leading-relaxed">
                                            "{t.content}"
                                        </p>
                                    </div>

                                    {/* Card Footer (Author Info) */}
                                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
                                        {t.image_url && typeof t.image_url === 'string' && t.image_url.trim() !== '' ? (
                                            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 shadow-sm">
                                                <img
                                                    src={t.image_url}
                                                    alt={t.name}
                                                    className="object-cover w-full h-full"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                                                {initials}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                                {t.name}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                                                {t.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
