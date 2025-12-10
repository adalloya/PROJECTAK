import { Destinations } from "@/components/destinations";
import { Navbar } from "@/components/navbar";


export default function DestinationsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Todos Nuestros Destinos</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                        Explora el catálogo completo de experiencias mágicas que hemos seleccionado para ti.
                    </p>
                </div>
                {/* Reusing existing component but we might want to hide the title/button inside it or pass props. 
            For now, let's just use the component as the grid provider.
            However, the component has its own title and section padding.
            Let's create a dedicated wrapper here or just render the component.
        */}
                <Destinations hideTitle />
            </main>

        </div>
    );
}
