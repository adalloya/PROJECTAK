"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        question: "¿Cuánto cuestan sus servicios de planificación?",
        answer: "¡Nuestros servicios de planificación son 100% gratuitos para ti! Recibimos nuestra comisión directamente de Disney y otros proveedores, por lo que pagas el mismo precio (o a veces menos con ofertas exclusivas) que si reservaras directamente, pero con el valor añadido de nuestra experiencia y soporte.",
    },
    {
        question: "¿Con cuánta anticipación debo reservar mi viaje a Disney?",
        answer: "Recomendamos reservar con al menos 6-8 meses de anticipación para Disney World y 12 meses para Disney Cruise Line. Esto nos permite asegurar las mejores tarifas, disponibilidad en hoteles y las reservas de restaurantes más populares.",
    },
    {
        question: "¿Pueden ayudarme con reservas de restaurantes y Genie+?",
        answer: "¡Absolutamente! Nos encargamos de reservar tus restaurantes a las 6:00 AM el día que se abre tu ventana de reserva. También te brindamos una estrategia detallada para usar Genie+ y Lightning Lanes para minimizar tus tiempos de espera.",
    },
    {
        question: "¿Qué pasa si salen ofertas después de que ya reservé?",
        answer: "Monitoreamos constantemente las nuevas promociones. Si Disney lanza una oferta aplicable a tu viaje ya reservado, la aplicaremos automáticamente para reducir tu precio final.",
    },
    {
        question: "¿Trabajan con viajes que no sean de Disney?",
        answer: "Sí, somos especialistas en Universal Studios (Hollywood y Orlando), cruceros Royal Caribbean, y destinos de lujo selectos. Pregúntanos por tu destino soñado.",
    },
];

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// ... imports remain the same

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Preguntas Frecuentes</h1>
                        <p className="text-muted-foreground">Todo lo que necesitas saber para tu próxima aventura mágica.</p>
                    </motion.div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="border border-border rounded-2xl overflow-hidden bg-secondary/20"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="flex items-center justify-between w-full p-6 text-left font-medium active:bg-secondary/40 transition-colors"
                                >
                                    <span>{faq.question}</span>
                                    {openIndex === index ? (
                                        <Minus className="h-5 w-5 text-primary" />
                                    ) : (
                                        <Plus className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 fade-in duration-200">
                                        {faq.answer}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
