"use client";

import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import { Star, Send } from "lucide-react";
import { submitReview } from "../../actions"; // We'll create this next
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewReviewPage() {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [isPending, startTransition] = useTransition();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        // Append rating manually since it's a state, not a simple input
        formData.append("rating", rating.toString());

        startTransition(async () => {
            const result = await submitReview(formData);
            if (result.success) {
                setSubmitted(true);
            } else {
                alert("Hubo un error al enviar tu reseña. Por favor intenta de nuevo.");
            }
        });
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-secondary/30 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-background p-8 rounded-3xl shadow-xl border border-border"
                >
                    <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Send className="h-10 w-10" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">¡Gracias por tu reseña!</h1>
                    <p className="text-muted-foreground mb-8">
                        Tu opinión nos ayuda a seguir creando magia. Tu comentario aparecerá pronto en nuestra página.
                    </p>
                    <Link href="/">
                        <Button className="w-full">Volver al Inicio</Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-secondary/30 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg w-full bg-background p-8 md:p-10 rounded-3xl shadow-xl border border-border"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Cuéntanos tu Experiencia</h1>
                    <p className="text-sm text-muted-foreground">Comparte tu magia con futuros viajeros.</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    {/* Rating Stars */}
                    <div className="flex flex-col items-center gap-2 mb-6">
                        <span className="text-sm font-medium text-muted-foreground">Califica tu viaje</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        className={cn(
                                            "h-8 w-8 transition-colors",
                                            (hoverRating || rating) >= star
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "fill-transparent text-muted-foreground/30"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Nombre</label>
                        <input
                            id="name"
                            name="name"
                            required
                            placeholder="Ej. Familia Pérez"
                            className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="role" className="text-sm font-medium">Tipo de Viaje</label>
                        <input
                            id="role"
                            name="role"
                            required
                            placeholder="Ej. Luna de Miel, Primera Visita, Cumpleaños..."
                            className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="image" className="text-sm font-medium">Foto (Opcional)</label>
                        <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="content" className="text-sm font-medium">Tu Comentario</label>
                        <textarea
                            id="content"
                            name="content"
                            required
                            rows={4}
                            placeholder="¿Qué fue lo que más disfrutaste? ¿Cómo te ayudó Anna?"
                            className="flex w-full rounded-xl border border-input bg-transparent px-3 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-12 text-base font-semibold rounded-xl"
                    >
                        {isPending ? "Enviando..." : "Enviar Reseña"}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
