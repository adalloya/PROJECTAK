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
        <main className="min-h-screen bg-background pb-16 sm:pb-20">
            {/* Hero Section */}
            <div className="relative min-h-[460px] h-[55vh] sm:h-[60vh] w-full overflow-hidden flex flex-col justify-center">
                <Image
                    src={locDest.heroImage}
                    alt={locDest.title}
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-black/60 to-black/30" />
                
                {/* Back Button */}
                <div className="absolute top-20 sm:top-24 left-4 sm:left-8 z-20">
                    <Link
                        href="/#destinations"
                        className="inline-flex items-center text-white/90 hover:text-white transition-colors bg-black/40 hover:bg-black/60 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-md"
                    >
                        <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {ui.back}
                    </Link>
                </div>

                {/* Hero Title & Subtitle */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-16 sm:pt-20 pb-12">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 sm:mb-4 drop-shadow-lg leading-tight max-w-4xl">
                        {locDest.title}
                    </h1>
                    <p className="text-base sm:text-xl md:text-2xl text-white/95 font-medium max-w-2xl drop-shadow-md leading-relaxed">
                        {locDest.subtitle}
                    </p>
                </div>
            </div>

            {/* Container with Overview Card */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 md:-mt-20 relative z-10">
                {/* Overview Card */}
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl mb-10 sm:mb-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-xl sm:text-2xl font-extrabold mb-4 sm:mb-6 text-slate-900 dark:text-white">{ui.overview}</h2>
                        <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                            {locDest.overview}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
                    {/* Main Content - Highlights */}
                    <div className="lg:col-span-2 space-y-8 sm:space-y-12">
                        <section>
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-6 sm:mb-8 flex items-center gap-2.5 sm:gap-3 text-slate-900 dark:text-white">
                                <Sparkles className="text-purple-600 h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
                                {ui.highlights}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {locDest.highlights.map((highlight, idx) => {
                                    const Icon = IconMap[highlight.icon] || Star;
                                    return (
                                        <div key={idx} className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-5 sm:p-6 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all border border-slate-200/90 dark:border-slate-800/90 hover:border-purple-500/30 shadow-md">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 sm:mb-4">
                                                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                            </div>
                                            <h4 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-slate-900 dark:text-white">{highlight.title}</h4>
                                            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">{highlight.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-6 sm:mb-8 flex items-center gap-2.5 sm:gap-3 text-slate-900 dark:text-white">
                                <Star className="text-amber-400 h-6 w-6 sm:h-7 sm:w-7 fill-amber-400 shrink-0" />
                                {ui.mustDos}
                            </h3>
                            <ul className="space-y-3 sm:space-y-4">
                                {locDest.mustDos.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 sm:gap-4 bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 p-3.5 sm:p-4 rounded-xl shadow-sm">
                                        <CheckCircle2 className="text-emerald-500 h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-800 dark:text-slate-200 text-xs sm:text-base font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Sidebar - Tips & CTA */}
                    <div className="space-y-8">
                        <div className="bg-white/95 dark:bg-slate-900/95 border border-purple-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:sticky lg:top-28 shadow-xl">
                            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                                <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">{ui.tips}</span>
                            </h3>
                            <ul className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
                                {locDest.tips.map((tip, idx) => (
                                    <li key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-3.5 sm:pl-4 border-l-2 border-purple-500/40">
                                        {tip}
                                    </li>
                                ))}
                            </ul>

                            <hr className="border-slate-200 dark:border-slate-800 my-6 sm:my-8" />

                            <div className="text-center">
                                <h4 className="font-extrabold text-base sm:text-lg mb-2 text-slate-900 dark:text-white">{ui.ctaTitle}</h4>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-5 sm:mb-6">
                                    {ui.ctaDesc} {locDest.title}.
                                </p>
                                <Link href="/contact" className="w-full block">
                                    <Button className="w-full rounded-full h-11 sm:h-12 text-sm sm:text-base font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02]">
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
