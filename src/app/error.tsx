'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Ups! Algo salió mal.</h2>
            <p className="text-gray-500 mb-6 max-w-md">
                Hubo un error al cargar esta sección. Por favor intenta recargar.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
            >
                Intentar de nuevo
            </button>
        </div>
    );
}
