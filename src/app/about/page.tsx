"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Map, Ticket, Headphones } from "lucide-react";

export default function AboutPage() {
    const [activeImage, setActiveImage] = useState<"left" | "right">("right");

    return (
        <main className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-20 text-center">
                        ¿Quién Soy?
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                        {/* Image Stack - "Photos on Table" Effect */}
                        <div className="relative h-[600px] w-full flex items-center justify-center">
                            {/* Photo 1 (Left - Grads) */}
                            <div
                                className={`absolute w-[85%] aspect-[3/4] bg-white p-3 shadow-2xl transition-all duration-500 ease-out cursor-pointer ${activeImage === "left"
                                    ? "z-20 rotate-0 scale-105"
                                    : "z-10 -rotate-6 scale-95 opacity-90 hover:opacity-100"
                                    }`}
                                onMouseEnter={() => setActiveImage("left")}
                                onClick={() => setActiveImage("left")}
                                style={{ left: "0", top: "2.5rem" }}
                            >
                                <div className="relative w-full h-full overflow-hidden">
                                    <img
                                        src="/images/about-grads.jpg"
                                        alt="Anna Karen Graduación Disney"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>

                            {/* Photo 2 (Right - Solo) */}
                            <div
                                className={`absolute w-[85%] aspect-[3/4] bg-white p-3 shadow-2xl transition-all duration-500 ease-out cursor-pointer ${activeImage === "right"
                                    ? "z-20 rotate-0 scale-105"
                                    : "z-10 rotate-6 scale-95 opacity-90 hover:opacity-100"
                                    }`}
                                onMouseEnter={() => setActiveImage("right")}
                                onClick={() => setActiveImage("right")}
                                style={{ right: "1rem", top: "0" }}
                            >
                                <div className="relative w-full h-full overflow-hidden">
                                    <img
                                        src="/images/about-solo.jpg"
                                        alt="Anna Karen en Disney"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                            <p className="font-medium text-2xl text-primary mb-2">
                                ¡Hola! Soy Anna Karen.
                            </p>
                            <p className="text-xl font-semibold text-foreground mb-4">
                                Creadora de Here We Go Advisor y Agente Certificada Disney.
                            </p>
                            <p>
                                Mi amor por Disney comenzó desde pequeña, tuve la oportunidad de trabajar en Walt Disney World a través del programa <strong>Disney College Program</strong>. Ahí descubrí que lo que más disfruto es organizar, planear y ayudar a que cada familia viva su propia versión de la magia.
                            </p>
                            <p className="italic text-foreground/80 border-l-4 border-primary/20 pl-4 py-2 my-6 bg-secondary/10 rounded-r-lg">
                                "Here We Go Advisor nació con una idea muy sencilla: la magia se disfruta más cuando la planeación no te quita tiempo, energía ni ilusión."
                            </p>
                            <p>
                                Hoy me dedico a diseñar experiencias personalizadas para que tú solamente te preocupes por sonreír y crear recuerdos. Conozco los secretos que hacen la diferencia: desde el mejor lugar para ver los fuegos artificiales hasta esos detalles que elevan cualquier itinerario.
                            </p>
                            <p className="font-bold text-foreground pt-2">
                                No solo reservo viajes: transformo tus sueños Disney en momentos inolvidables.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
                        <h2 className="text-2xl font-semibold text-foreground mt-12 mb-4">¿Por Qué Elegirnos?</h2>

                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <li className="bg-secondary/50 p-6 rounded-2xl hover:bg-secondary/70 transition-colors flex flex-col items-center text-center">
                                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Concierge Personalizado</h3>
                                <p className="text-base text-muted-foreground">Planificación uno a uno con un experto dedicado que aprende las preferencias de tu familia.</p>
                            </li>
                            <li className="bg-secondary/50 p-6 rounded-2xl hover:bg-secondary/70 transition-colors flex flex-col items-center text-center">
                                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary">
                                    <Map className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Arquitectura de Itinerario</h3>
                                <p className="text-base text-muted-foreground">Diseñamos tus días para maximizar la magia y minimizar las esperas, a tu propio ritmo.</p>
                            </li>
                            <li className="bg-secondary/50 p-6 rounded-2xl hover:bg-secondary/70 transition-colors flex flex-col items-center text-center">
                                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary">
                                    <Ticket className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Reservas y Extras</h3>
                                <p className="text-base text-muted-foreground">Nos encargamos de las reservas difíciles y experiencias exclusivas, para que tú no tengas que madrugar.</p>
                            </li>
                            <li className="bg-secondary/50 p-6 rounded-2xl hover:bg-secondary/70 transition-colors flex flex-col items-center text-center">
                                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary">
                                    <Headphones className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Soporte antes y durante tu viaje</h3>
                                <p className="text-base text-muted-foreground">Mientras viajas, permanecemos atentos para resolver cualquier contratiempo al instante.</p>
                            </li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
