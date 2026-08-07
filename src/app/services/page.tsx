"use client";

import { motion } from "framer-motion";
import { Check, Star, Sparkles, Map, Phone, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ServicesPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background pt-24">
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-purple-500/5 -z-10" />
                <div className="container px-4 mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            {t("serv_hero_title_1")} <span className="text-purple-600 dark:text-purple-400">{t("serv_hero_title_2")}</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            {t("serv_hero_sub")}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-12 md:py-20">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">

                        {/* Option 1: Full Package */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border relative overflow-hidden group hover:shadow-xl transition-shadow"
                        >
                            <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 rounded-bl-xl font-bold text-sm">
                                {t("serv_opt1_badge")}
                            </div>
                            <div className="mb-8">
                                <div className="h-14 w-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                                    <Sparkles size={32} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">{t("serv_opt1_title")}</h3>
                                <p className="text-muted-foreground">
                                    {t("serv_opt1_desc")}
                                </p>
                            </div>

                            <Link href="/contact" className="block">
                                <Button className="w-full text-lg h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-md group-hover:scale-105 transition-transform">
                                    {t("serv_opt1_btn")}
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Option 2: Consulting Only */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-secondary/20 rounded-3xl p-8 md:p-12 border border-border/50 relative overflow-hidden hover:bg-secondary/30 transition-colors"
                        >
                            <div className="mb-8">
                                <div className="h-14 w-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                                    <Map size={32} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">{t("serv_opt2_title")}</h3>
                                <p className="text-muted-foreground">
                                    {t("serv_opt2_desc")}
                                </p>
                            </div>

                            <Link href="/contact" className="block">
                                <Button variant="outline" className="w-full text-lg h-12 rounded-full border-purple-200 hover:bg-purple-50 hover:text-purple-700">
                                    {t("serv_opt2_btn")}
                                </Button>
                            </Link>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Features/Trust Section */}
            <section className="py-16 bg-muted/30">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
                        <div className="flex flex-col items-center">
                            <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-4 text-purple-600">
                                <Phone size={24} />
                            </div>
                            <h4 className="font-bold mb-2">{t("serv_feat1_title")}</h4>
                            <p className="text-sm text-muted-foreground">{t("serv_feat1_desc")}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-4 text-purple-600">
                                <Clock size={24} />
                            </div>
                            <h4 className="font-bold mb-2">{t("serv_feat2_title")}</h4>
                            <p className="text-sm text-muted-foreground">{t("serv_feat2_desc")}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-4 text-purple-600">
                                <Star size={24} />
                            </div>
                            <h4 className="font-bold mb-2">{t("serv_feat3_title")}</h4>
                            <p className="text-sm text-muted-foreground">{t("serv_feat3_desc")}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
