"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, translations, TranslationKey, LANGUAGE_OPTIONS } from "./translations";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('es');
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // 1. Check saved language preference in localStorage
        const savedLang = localStorage.getItem('user_language_preference') as Language | null;

        if (savedLang && (savedLang === 'es' || savedLang === 'en' || savedLang === 'pt')) {
            setLanguageState(savedLang);
        } else {
            // 2. Auto-detect browser preferred language
            const browserLang = navigator.language || (navigator as any).userLanguage || '';
            const lowerLang = browserLang.toLowerCase();

            if (lowerLang.startsWith('en')) {
                setLanguageState('en');
            } else if (lowerLang.startsWith('pt')) {
                setLanguageState('pt');
            } else {
                setLanguageState('es');
            }
        }
        setIsInitialized(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('user_language_preference', lang);
        if (typeof document !== 'undefined') {
            document.documentElement.lang = lang;
        }
    };

    const t = (key: TranslationKey): string => {
        const langDict = translations[language] || translations.es;
        return langDict[key] || translations.es[key] || String(key);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        // Fallback default if hook is called outside provider
        return {
            language: 'es',
            setLanguage: () => {},
            t: (key: TranslationKey) => translations.es[key] || String(key),
        };
    }
    return context;
};
