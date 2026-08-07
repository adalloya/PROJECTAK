"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LANGUAGE_OPTIONS, Language } from "@/lib/i18n/translations";
import { Globe, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSelector({ className }: { className?: string }) {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeOption = LANGUAGE_OPTIONS.find(opt => opt.code === language) || LANGUAGE_OPTIONS[0];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className={cn("relative inline-block text-left", className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                aria-label="Select Language"
            >
                <Globe className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span className="uppercase tracking-wider font-extrabold">{activeOption.code}</span>
                <ChevronDown className={cn("h-3 w-3 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                        Idioma / Language
                    </div>
                    {LANGUAGE_OPTIONS.map((opt) => {
                        const isSelected = opt.code === language;
                        return (
                            <button
                                key={opt.code}
                                onClick={() => {
                                    setLanguage(opt.code);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full text-left px-3.5 py-2 text-xs font-bold flex items-center justify-between transition-colors",
                                    isSelected
                                        ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300"
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="text-base">{opt.flag}</span>
                                    <span>{opt.name}</span>
                                </span>
                                {isSelected && <Check className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
