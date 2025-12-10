"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Instagram, Facebook, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Destinos", href: "/#destinations" },
        { name: "Nosotros", href: "/about" },
        { name: "Nuestros Servicios", href: "/services" },
        { name: "Blog", href: "/blog" },
        { name: "FAQ", href: "/faq" },
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
                            <div className="relative h-28 w-28 overflow-hidden transform hover:scale-105 transition-transform">
                                <Image src="/logo.png" alt="Here We Go Advisor" fill className="object-contain" />
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
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-extrabold text-black hover:text-primary transition-colors tracking-wide"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <Link href="/contact">
                            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-full font-bold transition-colors text-sm shadow-md hover:shadow-lg transform active:scale-95 border-2 border-transparent hover:border-primary/20">
                                Solicitar cotización
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-black hover:text-primary"
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
                        className="md:hidden bg-white/95 backdrop-blur-xl border-b border-black/10 shadow-xl"
                    >
                        <div className="px-4 py-6 space-y-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-lg font-bold text-black hover:text-primary pl-2 border-l-4 border-transparent hover:border-primary transition-all"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex items-center justify-center space-x-8 py-6 border-t border-black/10">
                                <Link href="https://www.instagram.com/herewego_advisor/" target="_blank" className="text-black hover:text-primary transition-all hover:scale-110">
                                    <Instagram className="h-7 w-7" />
                                </Link>
                                <Link href="https://www.facebook.com/profile.php?id=61553712201003" target="_blank" className="text-black hover:text-primary transition-all hover:scale-110">
                                    <Facebook className="h-7 w-7" />
                                </Link>
                                <Link href="https://www.tiktok.com/@herewego_advisor?_r=1&_t=ZS-925JVbNLuqo" target="_blank" className="text-black hover:text-primary transition-all hover:scale-110">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-7 w-7"
                                    >
                                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                    </svg>
                                </Link>
                            </div>

                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-center py-3 text-base font-bold bg-primary text-primary-foreground rounded-xl shadow-lg active:scale-95 transition-all"
                            >
                                Solicitar cotización
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
