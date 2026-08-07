"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Map, Ticket, Headphones } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AboutPage() {
    const { t } = useLanguage();
    const [activeImage, setActiveImage] = useState<"left" | "right">("right");
    const [aboutMe, setAboutMe] = useState({
        about_me_title: "",
        about_me_greeting: "",
        about_me_role: "",
        about_me_paragraphs: "",
        about_me_quote: "",
        about_me_image_grads: "/images/about-grads.jpg",
        about_me_image_solo: "/images/about-solo.jpg"
    });

    useEffect(() => {
        async function fetchAboutMe() {
            try {
                const { data, error } = await supabase.from('site_settings').select('*');
                if (error) throw error;
                if (data && data.length > 0) {
                    const settings: Record<string, string> = {};
                    data.forEach(item => { settings[item.key] = item.value; });
                    
                    setAboutMe(prev => ({
                        about_me_title: settings.about_me_title || "",
                        about_me_greeting: settings.about_me_greeting || "",
                        about_me_role: settings.about_me_role || "",
                        about_me_paragraphs: settings.about_me_paragraphs || "",
                        about_me_quote: settings.about_me_quote || "",
                        about_me_image_grads: settings.about_me_image_grads || prev.about_me_image_grads,
                        about_me_image_solo: settings.about_me_image_solo || prev.about_me_image_solo
                    }));
                }
            } catch (err) {
                console.error("Error fetching site settings from Supabase, falling back to static:", err);
            }
        }
        fetchAboutMe();
    }, []);

    const pageTitle = aboutMe.about_me_title || t("about_title");
    const greeting = aboutMe.about_me_greeting || t("about_greeting");
    const role = aboutMe.about_me_role || t("about_role");
    const quote = aboutMe.about_me_quote || t("about_quote");

    const paragraphs = [
        t("about_p1"),
        t("about_p2"),
        t("about_p3")
    ];

    return (
        <main className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-20 text-center">
                        {pageTitle}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                        {/* Image Stack */}
                        <div className="relative h-[600px] w-full flex items-center justify-center">
                            {/* Photo 1 (Left - Grads) */}
                            <div
                                className={`absolute w-[85%] aspect-[3/4] bg-white p-3 shadow-2xl transition-all duration-500 ease-out cursor-pointer ${activeImage === "left"
                                    ? "z-20 rotate-0 scale-105"
                                    : "z-10 -rotate-6 scale-95 opacity-90 hover:opacity-100"
                                    }`}
                                onMouseEnter={() => setActiveImage("left")}
                                onClick={() => setActiveImage("left")}
                                style={{ left: "0", top: "2.5rem" }}
                            >
                                <div className="relative w-full h-full overflow-hidden">
                                    <img
                                        src={aboutMe.about_me_image_grads}
                                        alt="Anna Karen Graduación Disney"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>

                            {/* Photo 2 (Right - Solo) */}
                            <div
                                className={`absolute w-[85%] aspect-[3/4] bg-white p-3 shadow-2xl transition-all duration-500 ease-out cursor-pointer ${activeImage === "right"
                                    ? "z-20 rotate-0 scale-105"
                                    : "z-10 rotate-6 scale-95 opacity-90 hover:opacity-100"
                                    }`}
                                onMouseEnter={() => setActiveImage("right")}
                                onClick={() => setActiveImage("right")}
                                style={{ right: "1rem", top: "0" }}
                            >
                                <div className="relative w-full h-full overflow-hidden">
                                    <img
                                        src={aboutMe.about_me_image_solo}
                                        alt="Anna Karen en Disney"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                            <p className="font-medium text-2xl text-purple-600 dark:text-purple-400 mb-2">
                                {greeting}
                            </p>
                            <p className="text-xl font-semibold text-foreground mb-4">
                                {role}
                            </p>
                            
                            <p>{paragraphs[0]}</p>
                            
                            {quote && (
                                <p className="italic text-foreground/80 border-l-4 border-purple-500/30 pl-4 py-2 my-6 bg-purple-50/50 dark:bg-purple-950/20 rounded-r-lg">
                                    {quote}
                                </p>
                            )}

                            <p>{paragraphs[1]}</p>
                            <p className="font-bold text-foreground pt-2">{paragraphs[2]}</p>
                        </div>
                    </div>

                    <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
                        <h2 className="text-2xl font-semibold text-foreground mt-12 mb-4">
                            {t("about_why_title")}
                        </h2>

                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <li className="bg-secondary/50 p-6 rounded-2xl hover:bg-secondary/70 transition-colors flex flex-col items-center text-center">
                                <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">{t("about_why_1_title")}</h3>
                                <p className="text-base text-muted-foreground">{t("about_why_1_desc")}</p>
                            </li>
                            <li className="bg-secondary/50 p-6 rounded-2xl hover:bg-secondary/70 transition-colors flex flex-col items-center text-center">
                                <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                                    <Map className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">{t("about_why_2_title")}</h3>
                                <p className="text-base text-muted-foreground">{t("about_why_2_desc")}</p>
                            </li>
                            <li className="bg-secondary/50 p-6 rounded-2xl hover:bg-secondary/70 transition-colors flex flex-col items-center text-center">
                                <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                                    <Ticket className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">{t("about_why_3_title")}</h3>
                                <p className="text-base text-muted-foreground">{t("about_why_3_desc")}</p>
                            </li>
                            <li className="bg-secondary/50 p-6 rounded-2xl hover:bg-secondary/70 transition-colors flex flex-col items-center text-center">
                                <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                                    <Headphones className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">{t("about_why_4_title")}</h3>
                                <p className="text-base text-muted-foreground">{t("about_why_4_desc")}</p>
                            </li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
