"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const destinations = [
    {
        id: 1,
        title: "Walt Disney World",
        description: "El lugar más mágico de la Tierra.",
        image: "/images/disney-world.png",
        href: "/destinations/disney-world",
    },
    {
        id: 2,
        title: "Disneyland Resort",
        description: "El lugar donde comenzó la magia.",
        image: "/images/disney-world.png", // Placeholder until we have a disneyland image
        href: "/destinations/disneyland",
    },
    {
        id: 3,
        title: "Disney Cruise Line",
        description: "Magia en alta mar.",
        image: "/images/disney-cruise.jpg",
        href: "/destinations/disney-cruise",
    },
    {
        id: 4,
        title: "Universal Studios",
        description: "Vive películas épicas en la vida real.",
        image: "/images/universal.png",
        href: "/destinations/universal-studios",
    },
];

export function Destinations({ hideTitle = false }: { hideTitle?: boolean }) {
    return (
        <section id="destinations" className="py-24 bg-background">
            <div className="w-full px-4">
                {!hideTitle && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Descubre la Magia</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Elige tu próxima aventura mágica de nuestra selección exclusiva de destinos premium.
                        </p>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {destinations.map((dest, index) => (
                        <Link href={dest.href} key={dest.id} className="block">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer"
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

                {!hideTitle && (
                    <div className="flex justify-center">
                        <Link href="/destinations">
                            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2">
                                Conocer Más Destinos
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
