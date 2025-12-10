"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-background border-t border-border py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="relative h-12 w-12 overflow-hidden rounded-full">
                                <Image src="/logo.png" alt="Here We Go Advisor Logo" fill className="object-cover" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight">Here We Go Advisor</h3>
                        </div>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            Tu socio exclusivo para crear experiencias Disney a medida. Nosotros nos encargamos de los detalles mientras tú creas los recuerdos.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="https://www.instagram.com/herewego_advisor/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="https://www.tiktok.com/@herewego_advisor?_r=1&_t=ZS-925JVbNLuqo" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
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
                            <Link href="https://www.facebook.com/profile.php?id=61553712201003" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="mailto:annar.pasaportemagico@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Mail className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Destinos</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Disney World</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Disneyland</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Disney Cruise Line</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Universal Studios</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Adventures by Disney</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Soporte</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contáctanos</Link></li>
                            <li><Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">Preguntas Frecuentes</Link></li>
                            <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Términos de Servicio</Link></li>
                            <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Política de Privacidad</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Here We Go Advisor. Todos los derechos reservados.</p>
                    <div className="mt-4 md:mt-0">
                        Diseñado con magia.
                    </div>
                </div>
            </div>
        </footer>
    );
}
