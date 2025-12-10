"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const images = [
    { src: "/images/gallery/1.jpg", alt: "Familia feliz en Magic Kingdom con el castillo de fondo" },
    { src: "/images/gallery/2.jpg", alt: "Pareja disfrutando en Disney Cruise Line con Mickey y Minnie" },
    { src: "/images/gallery/3.jpg", alt: "Café temático en Disney Cruise Line" },
    { src: "/images/gallery/4.jpg", alt: "Viajera disfrutando la cubierta del crucero Disney" },
    { src: "/images/gallery/5.jpg", alt: "Selfie divertida con Slinky Dog en Toy Story Land" },
    { src: "/images/gallery/6.jpg", alt: "Foto en Andy's Room en Disney Cruise Line" },
];

export function Gallery() {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setSelectedIndex(index);
    const closeLightbox = () => setSelectedIndex(null);

    const showNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % images.length));
    }, []);

    const showPrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length));
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") showNext();
            if (e.key === "ArrowLeft") showPrev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, showNext, showPrev]);

    return (
        <section className="py-24 bg-background">
            <div className="w-full px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Momentos Mágicos</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Capturando sonrisas y recuerdos que durarán toda la vida.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onClick={() => openLightbox(index)}
                            className={`relative rounded-3xl overflow-hidden group cursor-pointer ${index === 0 ? "md:col-span-2 md:row-span-2" :
                                index === 3 ? "md:row-span-2 align-middle" : "col-span-1 row-span-1"
                                }`}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
                        >
                            <X className="h-8 w-8" />
                        </button>

                        <button
                            onClick={showPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </button>

                        <button
                            onClick={showNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
                        >
                            <ChevronRight className="h-8 w-8" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[3/2] rounded-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()} // Prevent close on image click
                        >
                            <Image
                                src={images[selectedIndex].src}
                                alt={images[selectedIndex].alt}
                                fill
                                className="object-contain"
                                priority
                            />
                            <div className="absolute bottom-24 left-0 right-0 text-center text-white/90 text-sm md:text-base px-4 font-medium drop-shadow-md z-20 pointer-events-none">
                                {images[selectedIndex].alt}
                            </div>
                        </motion.div>

                        {/* Thumbnail Strip */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 z-50">
                            <div className="flex gap-2 p-2 bg-black/50 backdrop-blur-md rounded-full overflow-x-auto max-w-full">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedIndex(idx);
                                        }}
                                        className={`relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0 ${selectedIndex === idx
                                            ? "ring-2 ring-white scale-110 opacity-100"
                                            : "opacity-50 hover:opacity-100 hover:scale-105"
                                            }`}
                                    >
                                        <Image
                                            src={img.src}
                                            alt={`Thumbnail ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
