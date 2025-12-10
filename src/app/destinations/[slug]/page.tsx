import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Star, Sparkles, Map, Film, Trees, Globe, Utensils, Ticket } from "lucide-react";
import { destinationsData } from "@/lib/destinations";
import { Button } from "@/components/ui/button";

// Helper to map string icon names to Lucide components
const IconMap: Record<string, any> = {
    castle: Sparkles,
    globe: Globe,
    film: Film,
    tree: Trees,
    mountain: Map,
    wand: Sparkles,
    star: Star,
    utensils: Utensils,
    island: Map,
    ticket: Ticket,
};

interface DestinationPageProps {
    params: {
        slug: string;
    };
}

export function generateStaticParams() {
    return Object.keys(destinationsData).map((slug) => ({
        slug,
    }));
}

export default function DestinationPage({ params }: DestinationPageProps) {
    const destination = destinationsData[params.slug];

    if (!destination) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <Image
                    src={destination.heroImage}
                    alt={destination.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-20">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                        {destination.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl drop-shadow-md">
                        {destination.subtitle}
                    </p>
                </div>
                <div className="absolute top-24 left-4 md:left-8 z-20">
                    <Link
                        href="/#destinations"
                        className="flex items-center text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                {/* Overview Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl mb-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-semibold mb-6">Sobre el Destino</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {destination.overview}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content - Highlights */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <Sparkles className="text-primary h-8 w-8" />
                                Lo Más Destacado
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {destination.highlights.map((highlight, idx) => {
                                    const Icon = IconMap[highlight.icon] || Star;
                                    return (
                                        <div key={idx} className="bg-secondary/30 rounded-2xl p-6 hover:bg-secondary/50 transition-colors border border-transparent hover:border-primary/10">
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <h4 className="font-bold text-lg mb-2">{highlight.title}</h4>
                                            <p className="text-muted-foreground text-sm">{highlight.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <Star className="text-yellow-500 h-8 w-8" />
                                Imperdibles
                            </h3>
                            <ul className="space-y-4">
                                {destination.mustDos.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-4 bg-secondary/20 p-4 rounded-xl">
                                        <CheckCircle2 className="text-green-500 h-6 w-6 flex-shrink-0 mt-0.5" />
                                        <span className="text-foreground/90 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Sidebar - Tips & CTA */}
                    <div className="space-y-8">
                        <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 sticky top-24">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">Tips Expertos</span>
                            </h3>
                            <ul className="space-y-6 mb-8">
                                {destination.tips.map((tip, idx) => (
                                    <li key={idx} className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-2 border-primary/30">
                                        {tip}
                                    </li>
                                ))}
                            </ul>

                            <hr className="border-primary/10 my-8" />

                            <div className="text-center">
                                <h4 className="font-bold text-lg mb-2">¿Listo para la aventura?</h4>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Déjanos planear cada detalle de tu viaje a {destination.title}.
                                </p>
                                <Link href="/contact" className="w-full block">
                                    <Button className="w-full rounded-full h-12 text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all hover:scale-[1.02]">
                                        Cotizar Este Destino
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
