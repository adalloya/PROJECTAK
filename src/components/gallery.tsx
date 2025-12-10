"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X, ZoomIn } from "lucide-react";

const images = [
    { src: "/images/gallery/1.jpg", alt: "Familia feliz en Magic Kingdom" },
    { src: "/images/gallery/2.jpg", alt: "Disfrutando Disney Cruise Line" },
    { src: "/images/gallery/3.jpg", alt: "Café temático Disney" },
    { src: "/images/gallery/4.jpg", alt: "Relax en la cubierta del crucero" },
    { src: "/images/gallery/5.jpg", alt: "Toy Story Land en Hollywood Studios" },
    { src: "/images/gallery/6.jpg", alt: "Diversión en Andy's Room" },
];

export function Gallery() {
    const [current, setCurrent] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Auto-rotation logic
    useEffect(() => {
        if (isLightboxOpen) return; // Pause rotation when lightbox is open
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [isLightboxOpen]);

    // Handle Escape key to close lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsLightboxOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <section className="py-12 md:py-24 bg-background overflow-hidden">
            <div className="w-full max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

                    {/* Left Column: Content & Selector (Desktop) */}
                    <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="mb-8"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-primary">Momentos Mágicos</h2>
                            <p className="text-lg text-muted-foreground">
                                Capturando sonrisas y recuerdos que durarán toda la vida.
                                Cada viaje es una historia única.
                            </p>
                        </motion.div>

                        {/* Thumbnails Selector (Hidden on Mobile, Visible on Desktop) */}
                        <div className="hidden lg:grid grid-cols-3 gap-3">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrent(index)}
                                    className={cn(
                                        "relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 border-2",
                                        current === index
                                            ? "border-primary scale-105 shadow-md ring-2 ring-primary/20"
                                            : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                                    )}
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Featured Image (Desktop) / Main Slider (Mobile) */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <motion.div
                            layout
                            className="relative aspect-[4/3] md:aspect-[16/10] bg-gray-100 rounded-[2rem] overflow-hidden shadow-2xl cursor-zoom-in group"
                            onClick={() => setIsLightboxOpen(true)}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.7 }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={images[current].src}
                                        alt={images[current].alt}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* Gradient Overlay for Text Visibility */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:p-8">
                                        <p className="text-white text-lg md:text-xl font-medium drop-shadow-md">
                                            {images[current].alt}
                                        </p>
                                    </div>

                                    {/* Icon hint */}
                                    <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ZoomIn className="h-5 w-5" />
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Mobile Indicators */}
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 lg:hidden z-10">
                                {images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all duration-300 bg-white/50 backdrop-blur-sm",
                                            current === idx ? "w-6 bg-white" : "w-1.5"
                                        )}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Fullscreen Lightbox */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <X className="h-8 w-8" />
                        </button>

                        <div
                            className="relative w-full max-w-6xl aspect-[4/3] md:aspect-video rounded-xl overflow-hidden shadow-2xl bg-black"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={images[current].src}
                                alt={images[current].alt}
                                fill
                                className="object-contain"
                                priority
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white text-center">
                                <p className="text-xl font-medium">{images[current].alt}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
