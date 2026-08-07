"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Star, Sparkles, Map, Film, Trees, Globe, Utensils, Ticket } from "lucide-react";
import { Destination, getLocalizedDestination } from "@/lib/destinations";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

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

const labels = {
    es: {
        back: "Volver",
        overview: "Sobre el Destino",
        highlights: "Lo Más Destacado",
        mustDos: "Imperdibles",
        tips: "Tips Expertos",
        ctaTitle: "¿Listo para la aventura?",
        ctaDesc: "Déjanos planear cada detalle de tu viaje a",
        ctaBtn: "Cotizar Este Destino"
    },
    en: {
        back: "Back",
        overview: "About the Destination",
        highlights: "Highlights",
        mustDos: "Must-Do Experiences",
        tips: "Expert Tips",
        ctaTitle: "Ready for the Adventure?",
        ctaDesc: "Let us plan every detail of your trip to",
        ctaBtn: "Get a Quote for This Destination"
    },
    pt: {
        back: "Voltar",
        overview: "Sobre o Destino",
        highlights: "Destaques",
        mustDos: "Imperdíveis",
        tips: "Dicas de Especialistas",
        ctaTitle: "Pronto para a Aventura?",
        ctaDesc: "Deixe-nos planejar cada detalhe da sua viagem para",
        ctaBtn: "Solicitar Orçamento para Este Destino"
    }
};

export function DestinationDetailClient({ destination }: { destination: Destination }) {
    const { language } = useLanguage();
    const locDest = getLocalizedDestination(destination, language);
    const ui = labels[language] || labels.es;

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <Image
                    src={locDest.heroImage}
                    alt={locDest.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-20">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                        {locDest.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl drop-shadow-md">
                        {locDest.subtitle}
                    </p>
                </div>
                <div className="absolute top-24 left-4 md:left-8 z-20">
                    <Link
                        href="/#destinations"
                        className="flex items-center text-white/90 hover:text-white transition-colors bg-black/30 hover:bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold shadow-md"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {ui.back}
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                {/* Overview Card */}
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 md:p-12 shadow-2xl mb-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-extrabold mb-6 text-slate-900 dark:text-white">{ui.overview}</h2>
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                            {locDest.overview}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content - Highlights */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h3 className="text-2xl sm:text-3xl font-extrabold mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
                                <Sparkles className="text-purple-600 h-7 w-7" />
                                {ui.highlights}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {locDest.highlights.map((highlight, idx) => {
                                    const Icon = IconMap[highlight.icon] || Star;
                                    return (
                                        <div key={idx} className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500/30 shadow-md">
                                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{highlight.title}</h4>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{highlight.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-2xl sm:text-3xl font-extrabold mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
                                <Star className="text-amber-400 h-7 w-7 fill-amber-400" />
                                {ui.mustDos}
                            </h3>
                            <ul className="space-y-4">
                                {locDest.mustDos.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-4 bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-xl shadow-sm">
                                        <CheckCircle2 className="text-emerald-500 h-6 w-6 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-800 dark:text-slate-200 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Sidebar - Tips & CTA */}
                    <div className="space-y-8">
                        <div className="bg-white/90 dark:bg-slate-900/90 border border-purple-500/20 rounded-3xl p-8 sticky top-28 shadow-xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">{ui.tips}</span>
                            </h3>
                            <ul className="space-y-5 mb-8">
                                {locDest.tips.map((tip, idx) => (
                                    <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-4 border-l-2 border-purple-500/40">
                                        {tip}
                                    </li>
                                ))}
                            </ul>

                            <hr className="border-slate-200 dark:border-slate-800 my-8" />

                            <div className="text-center">
                                <h4 className="font-extrabold text-lg mb-2 text-slate-900 dark:text-white">{ui.ctaTitle}</h4>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6">
                                    {ui.ctaDesc} {locDest.title}.
                                </p>
                                <Link href="/contact" className="w-full block">
                                    <Button className="w-full rounded-full h-12 text-base font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02]">
                                        {ui.ctaBtn}
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
