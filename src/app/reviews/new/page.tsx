"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useTransition, useRef, useCallback } from "react";
import { Star, Send, Upload, X, Crop as CropIcon } from "lucide-react";
import { submitReview } from "../../actions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import Cropper from "react-easy-crop";
// import { Point, Area } from "react-easy-crop/types"; // Broken import

type Point = { x: number; y: number };
type Area = { x: number; y: number; width: number; height: number; zoom?: number; rotation?: number };

export default function NewReviewPage() {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [isPending, startTransition] = useTransition();
    const [submitted, setSubmitted] = useState(false);

    // Image State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [finalImageBlob, setFinalImageBlob] = useState<Blob | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageError(null);
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Validation 1: Size (Max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setImageError("La imagen es demasiado pesada (>10MB). Por favor elige una más ligera.");
                return;
            }

            // Validation 2: Type
            if (!file.type.startsWith("image/")) {
                setImageError("El archivo seleccionado no es una imagen válida.");
                return;
            }

            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImageSrc(reader.result as string);
                setShowCropper(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const createCroppedImage = async () => {
        try {
            if (!imageSrc || !croppedAreaPixels) return;
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            setFinalImageBlob(croppedBlob);
            setShowCropper(false);
            setImageError(null);
        } catch (e) {
            console.error(e);
            setImageError("Error al procesar la imagen. Intenta con otra foto.");
        }
    };

    const cancelCrop = () => {
        setImageSrc(null);
        setFinalImageBlob(null);
        setShowCropper(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (formData: FormData) => {
        formData.append("rating", rating.toString());

        if (finalImageBlob) {
            formData.delete("image");
            formData.append("image", finalImageBlob, "review-image.jpg");
        }

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
            {/* Cropper Modal */}
            <AnimatePresence>
                {showCropper && imageSrc && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-md rounded-2xl overflow-hidden flex flex-col h-[500px]"
                        >
                            <div className="p-4 border-b flex justify-between items-center">
                                <h3 className="font-bold">Ajustar Imagen</h3>
                                <button onClick={cancelCrop}><X className="h-6 w-6" /></button>
                            </div>
                            <div className="relative flex-1 bg-black">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                            <div className="p-4 bg-white flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">Zoom</span>
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={cancelCrop} className="flex-1">Cancelar</Button>
                                    <Button onClick={createCroppedImage} className="flex-1 bg-primary text-white">Confirmar</Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
                        <label className="text-sm font-medium">Foto (Opcional)</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center",
                                imageError
                                    ? "border-red-300 bg-red-50 hover:bg-red-100"
                                    : "border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                            )}
                        >
                            {finalImageBlob ? (
                                <div className="relative">
                                    <img
                                        src={URL.createObjectURL(finalImageBlob)}
                                        alt="Preview"
                                        className="h-32 w-32 object-cover rounded-full mx-auto mb-2 border-4 border-white shadow-md"
                                    />
                                    <p className="text-sm text-green-600 font-medium">¡Foto lista!</p>
                                    <p className="text-xs text-gray-400">Clic para cambiar</p>
                                </div>
                            ) : (
                                <>
                                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <Upload className={cn("h-5 w-5", imageError ? "text-red-400" : "text-gray-400")} />
                                    </div>
                                    <p className={cn("text-sm font-medium", imageError ? "text-red-600" : "text-gray-600")}>
                                        {imageError ? "Error al cargar" : "Sube una foto"}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Haga clic para seleccionar</p>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Instructions & Error Display */}
                        <div className="px-1">
                            {imageError && (
                                <p className="text-xs font-bold text-red-500 mb-2 flex items-center gap-1 animate-in slide-in-from-top-1">
                                    <X className="h-3 w-3" /> {imageError}
                                </p>
                            )}
                            <div className="text-[10px] text-muted-foreground/80 space-y-1 bg-secondary/20 p-3 rounded-lg border border-border/40">
                                <p className="font-semibold text-foreground/70 mb-1">Recomendaciones para tu foto:</p>
                                <ul className="list-disc pl-3 space-y-0.5">
                                    <li>Usa una foto clara y bien iluminada (formatos JPG o PNG).</li>
                                    <li>El archivo no debe superar los 10MB antes de recortar.</li>
                                    <li>Podrás recortar la imagen para enfocar tu rostro o el grupo.</li>
                                </ul>
                            </div>
                        </div>
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

// Utility function to crop image
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("No 2d context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Canvas is empty"));
                return;
            }
            resolve(blob);
        }, "image/jpeg", 0.85);
    });
}
