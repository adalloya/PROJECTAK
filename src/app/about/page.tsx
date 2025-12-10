"use client";

import { motion } from "framer-motion";
import { Sparkles, Map, Ticket, Headphones } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-center">
                        Creamos Magia.
                    </h1>

                    <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
                        <div className="relative w-full md:w-1/2 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/images/ana-karen.jpg"
                                alt="Ana Karen - Here We Go Advisor"
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl" />
                        </div>
                        <div className="w-full md:w-1/2 space-y-6 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                <strong>Here We Go Advisor</strong> nació de una simple creencia: los momentos más mágicos no deberían ser estresantes de planear.
                            </p>
                            <p>
                                Hola, soy <strong>Ana Karen</strong>, tu Agente Certificada Disney. Mi pasión es diseñar experiencias personalizadas donde tú solo te preocupes por sonreír.
                            </p>
                            <p>
                                Conozco cada camino secreto, menú oculto y el lugar perfecto para ver los fuegos artificiales. No solo reservo viajes; diseño recuerdos inolvidables para tu familia.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
                        <h2 className="text-2xl font-semibold text-foreground mt-12 mb-4">¿Por Qué Elegirnos?</h2>

                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <li className="bg-secondary/50 p-6 rounded-2xl hover:bg-secondary/70 transition-colors">
                                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Concierge Personalizado</h3>
                                <p className="text-base text-muted-foreground">Planificación uno a uno con un experto dedicado que aprende las preferencias de tu familia.</p>
                            </li>
                            <li className="bg-secondary/50 p-6 rounded-2xl hover:bg-secondary/70 transition-colors">
                                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary">
                                    <Map className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Arquitectura de Itinerario</h3>
                                <p className="text-base text-muted-foreground">Diseñamos tus días para maximizar la magia y minimizar las esperas, a tu propio ritmo.</p>
                            </li>
                            <li className="bg-secondary/50 p-6 rounded-2xl hover:bg-secondary/70 transition-colors">
                                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary">
                                    <Ticket className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Reservas y Extras</h3>
                                <p className="text-base text-muted-foreground">Nos encargamos de las reservas difíciles y experiencias exclusivas, para que tú no tengas que madrugar.</p>
                            </li>
                            <li className="bg-secondary/50 p-6 rounded-2xl hover:bg-secondary/70 transition-colors">
                                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary">
                                    <Headphones className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Soporte 24/7</h3>
                                <p className="text-base text-muted-foreground">Mientras viajas, permanecemos atentos para resolver cualquier contratiempo al instante.</p>
                            </li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
