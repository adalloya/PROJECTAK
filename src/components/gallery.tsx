"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

const images = [
    { src: "/images/gallery/1.jpg", alt: "Familia feliz en Magic Kingdom" },
    { src: "/images/gallery/2.jpg", alt: "Disfrutando Disney Cruise Line" },
    { src: "/images/gallery/3.jpg", alt: "Café temático Disney" },
    { src: "/images/gallery/4.jpg", alt: "Relax en la cubierta del crucero" },
    { src: "/images/gallery/5.jpg", alt: "Toy Story Land en Hollywood Studios" },
    { src: "/images/gallery/6.jpg", alt: "Diversión en Andy's Room" },
    { src: "/images/gallery/7.jpg", alt: "Momentos inolvidables en familia" },
    { src: "/images/gallery/8.jpg", alt: "Noche mágica en Disney" },
];

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.8
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.8
    })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

export function Gallery() {
    const [current, setCurrent] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [direction, setDirection] = useState(0);

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrent((prev) => (prev + newDirection + images.length) % images.length);
    }, []);

    // Auto-rotation logic
    useEffect(() => {
        if (isLightboxOpen) return;
        const timer = setInterval(() => {
            paginate(1);
        }, 4000);
        return () => clearInterval(timer);
    }, [isLightboxOpen, paginate]);

    // Keyboard navigation
    useEffect(() => {
        if (!isLightboxOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsLightboxOpen(false);
            if (e.key === "ArrowRight") paginate(1);
            if (e.key === "ArrowLeft") paginate(-1);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isLightboxOpen, paginate]);

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
                                    onClick={() => {
                                        setDirection(index > current ? 1 : -1);
                                        setCurrent(index);
                                    }}
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
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={current}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={images[current].src}
                                        alt={images[current].alt}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
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

            {/* Advanced Fullscreen Lightbox */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/98 flex flex-col items-center justify-center backdrop-blur-2xl"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        {/* Top Controls */}
                        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
                            <span className="text-white/80 font-medium ml-2">
                                {current + 1} / {images.length}
                            </span>
                            <button
                                className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                                onClick={() => setIsLightboxOpen(false)}
                            >
                                <X className="h-8 w-8" />
                            </button>
                        </div>

                        {/* Main Image Area */}
                        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-10">
                            {/* Navigation Arrows (Desktop) */}
                            <button
                                className="absolute left-4 z-50 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
                                onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </button>
                            <button
                                className="absolute right-4 z-50 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
                                onClick={(e) => { e.stopPropagation(); paginate(1); }}
                            >
                                <ChevronRight className="h-8 w-8" />
                            </button>

                            {/* Swipeable Image */}
                            <motion.div
                                key={current}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = swipePower(offset.x, velocity.x);
                                    if (swipe < -swipeConfidenceThreshold) {
                                        paginate(1);
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        paginate(-1);
                                    }
                                }}
                                className="absolute w-full max-w-6xl aspect-[4/5] md:aspect-video rounded-xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src={images[current].src}
                                    alt={images[current].alt}
                                    fill
                                    className="object-contain"
                                    priority
                                    draggable={false}
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-center pb-12">
                                    <p className="text-xl md:text-2xl font-bold tracking-tight">{images[current].alt}</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Bottom Thumbnails */}
                        <div className="absolute bottom-4 left-0 right-0 z-50 px-4">
                            <div className="flex justify-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDirection(index > current ? 1 : -1);
                                            setCurrent(index);
                                        }}
                                        className={cn(
                                            "relative w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-lg overflow-hidden transition-all duration-300 border-2",
                                            current === index
                                                ? "border-white scale-110 shadow-lg"
                                                : "border-transparent opacity-50 hover:opacity-100"
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

                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
