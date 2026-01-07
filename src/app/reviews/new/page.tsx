import { motion, AnimatePresence } from "framer-motion";
import { useState, useTransition, useRef, useCallback } from "react";
import { Star, Send, Upload, X, Crop as CropIcon } from "lucide-react";
import { submitReview } from "../../actions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";

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
    const [imageError, setImageError] = useState<string | null>(null); // New error state
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageError(null); // Reset error
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Validation 1: Size (Max 10MB to avoid browser freeze before crop)
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

    // ... [Inside return JSX, replace the image upload section] ...

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
                                     {/* Preview the blob */}
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
                </form >
            </motion.div >
        </div >
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

    // set canvas size to match the bounding box
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // draw image
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

    // As Blob
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Canvas is empty"));
                return;
            }
            resolve(blob);
        }, "image/jpeg", 0.85); // Compress quality 0.85
    });
}
