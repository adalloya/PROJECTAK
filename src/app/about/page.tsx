"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Map, Ticket, Headphones } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AboutPage() {
    const [activeImage, setActiveImage] = useState<"left" | "right">("right");
    const [aboutMe, setAboutMe] = useState({
        about_me_title: "¿Quién Soy?",
        about_me_greeting: "¡Hola! Soy Anna Karen.",
        about_me_role: "Creadora de Here We Go Advisor y Agente Certificada Disney.",
        about_me_paragraphs: JSON.stringify([
            "Mi amor por Disney comenzó desde pequeña, tuve la oportunidad de trabajar en Walt Disney World a través del programa Disney College Program. Ahí descubrí que lo que más disfruto es organizar, planear y ayudar a que cada familia viva su propia versión de la magia.",
            "Hoy me dedico a diseñar experiencias personalizadas para que tú solamente te preocupes por sonreír y crear recuerdos. Conozco los secretos que hacen la diferencia: desde el mejor lugar para ver los fuegos artificiales hasta esos detalles que elevan cualquier itinerario.",
            "No solo reservo viajes: transformo tus sueños Disney en momentos inolvidables."
        ]),
        about_me_quote: '"Here We Go Advisor nació con una idea muy sencilla: la magia se disfruta más cuando la planeación no te quita tiempo, energía ni ilusión."',
        about_me_image_grads: "/images/about-grads.jpg",
        about_me_image_solo: "/images/about-solo.jpg"
    });

    useEffect(() => {
        async function fetchAboutMe() {
            try {
                const { data, error } = await supabase.from('site_settings').select('*');
                if (error) throw error;
                if (data && data.length > 0) {
                    const settings: Record<string, string> = {};
                    data.forEach(item => { settings[item.key] = item.value; });
                    
                    setAboutMe(prev => ({
                        about_me_title: settings.about_me_title || prev.about_me_title,
                        about_me_greeting: settings.about_me_greeting || prev.about_me_greeting,
                        about_me_role: settings.about_me_role || prev.about_me_role,
                        about_me_paragraphs: settings.about_me_paragraphs || prev.about_me_paragraphs,
                        about_me_quote: settings.about_me_quote || prev.about_me_quote,
                        about_me_image_grads: settings.about_me_image_grads || prev.about_me_image_grads,
                        about_me_image_solo: settings.about_me_image_solo || prev.about_me_image_solo
                    }));
                }
            } catch (err) {
                console.error("Error fetching site settings from Supabase, falling back to static:", err);
            }
        }
        fetchAboutMe();
    }, []);

    const parsedParagraphs = (() => {
        try {
            const arr = JSON.parse(aboutMe.about_me_paragraphs);
            return Array.isArray(arr) ? arr : [aboutMe.about_me_paragraphs];
        } catch (e) {
            return [aboutMe.about_me_paragraphs];
        }
    })();

    return (
        <main className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-20 text-center">
                        {aboutMe.about_me_title}
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
                                        src={aboutMe.about_me_image_grads}
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
                                        src={aboutMe.about_me_image_solo}
                                        alt="Anna Karen en Disney"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                            <p className="font-medium text-2xl text-primary mb-2">
                                {aboutMe.about_me_greeting}
                            </p>
                            <p className="text-xl font-semibold text-foreground mb-4">
                                {aboutMe.about_me_role}
                            </p>
                            
                            {parsedParagraphs.map((para: string, idx: number) => {
                                const isLast = idx === parsedParagraphs.length - 1;
                                
                                if (idx === 0) {
                                    return (
                                        <div key={idx} className="space-y-6">
                                            <p>{para}</p>
                                            {aboutMe.about_me_quote && (
                                                <p className="italic text-foreground/80 border-l-4 border-primary/20 pl-4 py-2 my-6 bg-secondary/10 rounded-r-lg">
                                                    {aboutMe.about_me_quote}
                                                </p>
                                            )}
                                        </div>
                                    );
                                }
                                
                                return (
                                    <p key={idx} className={isLast ? "font-bold text-foreground pt-2" : ""}>
                                        {para}
                                    </p>
                                );
                            })}
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
