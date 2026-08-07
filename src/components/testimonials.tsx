"use client";

import { useState, useRef } from "react";
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
        content: "¡Ana Karen hizo que nuestro viaje fuera perfecto! No tuvimos que preocuparnos por nada, solo disfrutar cada momento en los parques. La guía de Lightning Lane y recomendaciones de restaurantes fueron excepcionales.",
        rating: 5,
    },
    {
        id: 2,
        name: "Familia Aguirre",
        role: "Disney Cruise Line",
        content: "Cansadísimos pero con el corazón muy feliz. Mil gracias por tu acompañamiento, definitivamente no lo hubiéramos logrado solitos. Claro que esperemos volver y te andaremos buscando, pero por lo pronto 100% recomendada.",
        rating: 5,
    },
    {
        id: 3,
        name: "Nayely Morales",
        role: "Crucero Disney Destiny",
        content: "Excelente servicio de principio a fin. En nuestro viaje al crucero de Disney todo salió perfecto. Se nota que conoce muy bien el destino, hace recomendaciones muy acertadas y siempre estuvo al pendiente.",
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
        const scrollAmount = 400;
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
                <div className="flex items-center justify-end mt-6 px-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition-all text-slate-700 dark:text-slate-200"
                            aria-label="Reseña anterior"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition-all text-slate-700 dark:text-slate-200"
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
                                duration: Math.max(35, marqueeItems.length * 4.5),
                                ease: "linear",
                            },
                        }}
                        style={{ width: "fit-content" }}
                    >
                        {marqueeItems.map((t, index) => {
                            const initials = t.name ? t.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'HW';
                            const hasImageUrl = t.image_url && typeof t.image_url === 'string' && t.image_url.trim() !== '';

                            return (
                                <div
                                    key={`${t.id}-${index}`}
                                    className="flex-shrink-0 w-[340px] sm:w-[400px] h-[360px] sm:h-[390px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-7 sm:p-8 rounded-3xl border-2 border-slate-200/90 dark:border-slate-800/90 shadow-md hover:shadow-2xl hover:border-purple-500 hover:shadow-purple-500/15 transition-all duration-300 flex flex-col group relative overflow-hidden"
                                >
                                    {/* Blurred Background Image Texture */}
                                    {hasImageUrl ? (
                                        <div 
                                            className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-25 blur-xl scale-110 pointer-events-none group-hover:scale-125 group-hover:opacity-30 transition-all duration-700"
                                            style={{ backgroundImage: `url(${t.image_url})` }}
                                        />
                                    ) : (
                                        <div 
                                            className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent blur-2xl pointer-events-none"
                                        />
                                    )}

                                    {/* Quote watermark top right */}
                                    <Quote className="absolute top-6 right-6 h-8 w-8 text-purple-600/15 dark:text-purple-400/20 group-hover:text-purple-600/35 transition-colors pointer-events-none z-10" />

                                    {/* Card Content Container */}
                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* 1. TOP: User Avatar Image */}
                                        <div className="flex items-center gap-4 mb-3">
                                            {hasImageUrl ? (
                                                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-purple-500/30 shadow-md shrink-0 group-hover:scale-105 group-hover:border-purple-500 transition-all">
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
                                                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-primary text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-md border-2 border-purple-500/30 group-hover:scale-105 group-hover:border-purple-500 transition-all">
                                                    {initials}
                                                </div>
                                            )}

                                            {/* 2. Below Image: Customer Name & Role */}
                                            <div className="min-w-0">
                                                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                                                    {t.name}
                                                </h4>
                                                <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold truncate mt-0.5">
                                                    {t.role}
                                                </p>
                                            </div>
                                        </div>

                                        {/* 3. Below Name: Rating Stars */}
                                        <div className="flex gap-1.5 mb-4">
                                            {[...Array(Math.max(0, Math.min(5, Math.floor(t.rating || 5))))].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>

                                        {/* 4. Review Content (6+ lines comfortably) */}
                                        <div className="flex-1 overflow-y-auto scrollbar-none pr-1">
                                            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 italic font-medium leading-relaxed">
                                                "{t.content}"
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
