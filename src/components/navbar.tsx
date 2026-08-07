"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Instagram, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSelector } from "@/components/language-selector";

export function Navbar() {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [logoSrc, setLogoSrc] = useState("/logo.png");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        // Holiday Logo Logic
        const now = new Date();
        const cutoff = new Date("2026-01-01T00:00:00");
        if (now < cutoff) {
            setLogoSrc("/logo-xmas.png");
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: t("nav_destinations"), href: "/#destinations" },
        { name: t("nav_about"), href: "/about" },
        { name: t("nav_services"), href: "/services" },
        { name: t("nav_blog"), href: "/blog" },
        { name: t("nav_faq"), href: "/faq" },
        { name: t("nav_resources"), href: "/resources/login" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white/80 backdrop-blur-md"
            )}
        >
            <div className="max-w-[1400px] mx-auto px-6 w-full">
                <div className="flex items-center justify-between h-24">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center">
                            <div className="relative h-20 w-20 md:h-28 md:w-28 overflow-hidden transform hover:scale-105 transition-transform">
                                <Image src={logoSrc} alt="Here We Go Advisor" fill className="object-contain" sizes="(max-width: 768px) 80px, 112px" priority loading="eager" />
                            </div>
                        </Link>

                        {/* Social Icons - Desktop Left */}
                        <div className="hidden md:flex items-center space-x-3 border-l border-black/20 pl-6">
                            <Link href="https://www.instagram.com/herewego_advisor/" target="_blank" className="text-black hover:text-primary transition-colors hover:scale-110 transform duration-200">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="https://www.facebook.com/profile.php?id=61553712201003" target="_blank" className="text-black hover:text-primary transition-colors hover:scale-110 transform duration-200">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="https://www.tiktok.com/@herewego_advisor?_r=1&_t=ZS-925JVbNLuqo" target="_blank" className="text-black hover:text-primary transition-colors hover:scale-110 transform duration-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center space-x-7">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-extrabold text-black hover:text-purple-600 transition-colors tracking-wide"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Language Selector */}
                        <LanguageSelector />

                        <Link href="/contact">
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full font-bold transition-all text-sm shadow-md hover:shadow-lg shadow-purple-500/20 transform active:scale-95 border-2 border-transparent">
                                {t("nav_quote")}
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Controls (Language + Hamburger) */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <LanguageSelector />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-black hover:text-purple-600"
                        >
                            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-black/10 shadow-xl"
                    >
                        <div className="px-6 py-6 space-y-5">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-base font-bold text-black hover:text-purple-600 pl-2 border-l-4 border-transparent hover:border-purple-600 transition-all"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex items-center justify-center space-x-8 py-4 border-t border-black/10">
                                <Link href="https://www.instagram.com/herewego_advisor/" target="_blank" className="text-black hover:text-purple-600 transition-all hover:scale-110">
                                    <Instagram className="h-6 w-6" />
                                </Link>
                                <Link href="https://www.facebook.com/profile.php?id=61553712201003" target="_blank" className="text-black hover:text-purple-600 transition-all hover:scale-110">
                                    <Facebook className="h-6 w-6" />
                                </Link>
                                <Link href="https://www.tiktok.com/@herewego_advisor?_r=1&_t=ZS-925JVbNLuqo" target="_blank" className="text-black hover:text-purple-600 transition-all hover:scale-110">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6"
                                    >
                                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                    </svg>
                                </Link>
                            </div>

                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-center py-3 text-base font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
                            >
                                {t("nav_quote")}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
