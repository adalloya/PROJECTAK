"use client";

import { Destinations } from "@/components/destinations";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function DestinationsPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background">
            <main className="pt-28 pb-12">
                <div className="text-center mb-12 px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
                        {t("dest_title")}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        {t("dest_subtitle")}
                    </p>
                </div>
                <Destinations hideTitle />
            </main>
        </div>
    );
}
