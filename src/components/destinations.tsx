"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const destinations = [
    {
        id: 1,
        title: "Walt Disney World",
        description: "El lugar más mágico de la Tierra.",
        image: "/images/disney-world-castle.png",
        href: "/destinations/disney-world",
        color: "from-blue-600/90"
    },
    {
        id: 2,
        title: "Disneyland Resort",
        description: "El lugar donde comenzó la magia.",
        image: "/images/disneyland.png",
        href: "/destinations/disneyland",
        color: "from-purple-600/90"
    },
    {
        id: 3,
        title: "Disney Cruise Line",
        description: "Magia en alta mar.",
        image: "/images/disney-cruise.jpg",
        href: "/destinations/disney-cruise",
        color: "from-sky-700/90"
    },
    {
        id: 4,
        title: "Universal Studios",
        description: "Vive películas épicas en la vida real.",
        image: "/images/universal.png",
        href: "/destinations/universal-studios",
        color: "from-indigo-600/90"
    },
];

export function Destinations({ hideTitle = false }: { hideTitle?: boolean }) {
    const [active, setActive] = useState(0);

    return (
        <section id="destinations" className="py-12 md:py-24 bg-background overflow-hidden relative">
            <div className="w-full max-w-[1400px] mx-auto px-6">
                {!hideTitle && (
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
                        >
                            <Sparkles className="h-4 w-4" />
                            <span>Destinos Exclusivos</span>
                        </motion.div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Descubre la Magia</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Elige tu próxima aventura de nuestra colección premium.
                        </p>
                    </div>
                )}

                <div>
                    {/* Desktop Grid (Restored) */}
                    <div className="hidden lg:grid grid-cols-4 gap-6 mb-16">
                        {destinations.map((dest, index) => (
                            <Link href={dest.href} key={dest.id} className="block group relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="h-full w-full"
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${dest.image})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                                        <h3 className="text-xl font-bold mb-2">{dest.title}</h3>
                                        <p className="text-sm text-white/80 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2">
                                            {dest.description}
                                        </p>
                                        <div className="flex items-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 text-white/90">
                                            Explorar <ArrowRight className="ml-2 h-3 w-3" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Swiper (Kept as is) */}
                    <div className="lg:hidden w-full overflow-x-auto snap-x snap-mandatory flex gap-4 pb-8 scrollbar-hide px-4 -mx-4">
                        {destinations.map((dest) => (
                            <Link
                                key={dest.id}
                                href={dest.href}
                                className="snap-center shrink-0 w-[85vw] relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl"
                            >
                                <Image
                                    src={dest.image}
                                    alt={dest.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <h3 className="text-2xl font-bold mb-1">{dest.title}</h3>
                                    <p className="text-sm text-white/80 mb-3">{dest.description}</p>
                                    <div className="inline-flex items-center gap-2 text-sm font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                                        Explorar <ArrowRight className="h-3 w-3" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {!hideTitle && (
                        <div className="hidden lg:flex justify-center mt-8">
                            <Link href="/destinations">
                                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2">
                                    Conocer Más Destinos
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
