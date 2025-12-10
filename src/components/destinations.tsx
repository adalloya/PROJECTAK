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
        image: "/images/disney-world.png",
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

                <div className="flex flex-col lg:flex-row gap-8 items-stretch h-[600px] lg:h-[500px]">

                    {/* Desktop Menu (Left Side) */}
                    <div className="hidden lg:flex flex-col gap-2 w-1/3">
                        {destinations.map((dest, index) => (
                            <div
                                key={dest.id}
                                onMouseEnter={() => setActive(index)}
                                className={cn(
                                    "p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 border-transparent relative overflow-hidden group",
                                    active === index
                                        ? "bg-white shadow-lg border-primary/20 scale-105 z-10"
                                        : "hover:bg-gray-50 text-muted-foreground"
                                )}
                            >
                                <div className="relative z-10 flex justify-between items-center">
                                    <h3 className={cn("text-xl font-bold", active === index && "text-primary")}>
                                        {dest.title}
                                    </h3>
                                    {active === index && (
                                        <motion.div layoutId="arrow">
                                            <ArrowRight className="h-5 w-5 text-primary" />
                                        </motion.div>
                                    )}
                                </div>
                                <p className={cn("text-sm mt-1", active !== index && "opacity-70")}>
                                    {dest.description}
                                </p>
                            </div>
                        ))}

                        {!hideTitle && (
                            <Link href="/destinations" className="mt-auto">
                                <button className="w-full py-4 text-center text-primary font-medium hover:underline flex items-center justify-center gap-2">
                                    Ver todos los destinos <ArrowRight className="h-4 w-4" />
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Desktop Preview (Right Side) */}
                    <div className="hidden lg:block w-2/3 relative rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={destinations[active].image}
                                    alt={destinations[active].title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className={cn("absolute inset-0 bg-gradient-to-tr to-transparent opacity-80", destinations[active].color)} />
                                <div className="absolute top-0 right-0 left-0 bottom-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                                <div className="absolute bottom-12 left-12 right-12 text-white">
                                    <h3 className="text-4xl font-bold mb-3">{destinations[active].title}</h3>
                                    <p className="text-lg text-white/90 mb-8 max-w-lg">{destinations[active].description}</p>

                                    <Link href={destinations[active].href}>
                                        <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2">
                                            Explorar este destino <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Mobile Swiper (Horizontal Scroll) */}
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

                </div>
            </div>
        </section>
    );
}
