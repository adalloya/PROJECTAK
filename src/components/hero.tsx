"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full"
                >
                    <source
                        src="https://cdn1.parksmedia.wdprapps.disney.com/dam/disney-cruise-line/why-cruise-disney/video/disney-cruise-line-Landing-1280x544.mp4?1700669308278"
                        type="video/mp4"
                    />
                </video>
                <div className="absolute inset-0 bg-black/40" /> {/* Overlay for text readability */}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6"
                >
                    Viajes Mágicos.
                    <br />
                    <span className="text-white/90">Diseñados para Ti.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-lg md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
                >
                    Vive Disney como nunca antes. Itinerarios a medida, planificación sin esfuerzo y recuerdos para toda la vida.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link
                        href="/contact"
                        className="px-8 py-4 bg-white text-black text-lg font-medium rounded-full hover:bg-white/90 transition-all hover:scale-105"
                    >
                        Comienza tu Viaje
                    </Link>
                    <Link
                        href="#destinations"
                        className="px-8 py-4 bg-transparent border border-white/30 text-white text-lg font-medium rounded-full hover:bg-white/10 transition-all backdrop-blur-sm"
                    >
                        Explorar Destinos
                    </Link>
                </motion.div>
            </div>
            {/* Curved Divider */}
            <div className="absolute -bottom-1 left-0 w-full leading-none z-20">
                <svg
                    className="relative block w-full h-[50px] md:h-[100px]"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,0 C400,100 800,100 1200,0 V120 H0 V0 Z"
                        className="fill-background"
                    />
                </svg>
            </div>
        </div>
    );
}
