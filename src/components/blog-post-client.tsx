"use client";

import { BlogPost, getLocalizedBlogPost } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const blogLabels = {
    es: {
        back: "Volver al Blog",
        author: "Autor: Equipo Expertos",
        ctaTitle: "¿Te gustó este artículo?",
        ctaDesc: "Deja que nosotros nos encarguemos de aplicar todos estos tips en tu viaje. Nuestra planificación es 100% gratuita.",
        ctaBtn: "Solicitar Cotización Gratis"
    },
    en: {
        back: "Back to Blog",
        author: "Author: Expert Team",
        ctaTitle: "Enjoyed this article?",
        ctaDesc: "Let us handle applying all these expert tips to your vacation. Our planning service is 100% free.",
        ctaBtn: "Get a Free Quote"
    },
    pt: {
        back: "Voltar ao Blog",
        author: "Autor: Equipe de Especialistas",
        ctaTitle: "Gostou deste artigo?",
        ctaDesc: "Deixe-nos cuidar de aplicar todas essas dicas na sua viagem. Nosso planejamento é 100% gratuito.",
        ctaBtn: "Solicitar Orçamento Grátis"
    }
};

export function BlogPostClient({ post }: { post: BlogPost }) {
    const { language } = useLanguage();
    const locPost = getLocalizedBlogPost(post, language);
    const ui = blogLabels[language] || blogLabels.es;

    return (
        <main className="pt-28 pb-16">
            <article className="container px-4 mx-auto max-w-4xl">
                {/* Back Link */}
                <div className="mb-8">
                    <Link href="/blog" className="inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-purple-600 font-bold transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {ui.back}
                    </Link>
                </div>

                {/* Header */}
                <header className="mb-10 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                            {locPost.category}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
                        {locPost.title}
                    </h1>

                    <div className="flex items-center justify-center text-sm text-slate-500 gap-6 flex-wrap">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {locPost.date}
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {locPost.readTime}
                        </div>
                        <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            {ui.author}
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="relative aspect-video w-full bg-muted rounded-2xl mb-12 overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                    <Image
                        src={locPost.image}
                        alt={locPost.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 1024px) 100vw, 896px"
                    />
                </div>

                {/* Content */}
                <div
                    className="prose prose-lg dark:prose-invert max-w-none mx-auto text-slate-800 dark:text-slate-200 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: locPost.content }}
                />

                {/* CTA Box */}
                <div className="mt-16 bg-purple-50/60 dark:bg-purple-950/20 border border-purple-500/20 rounded-3xl p-8 text-center shadow-lg">
                    <h3 className="text-2xl font-extrabold mb-4 text-slate-900 dark:text-white">{ui.ctaTitle}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-xl mx-auto">
                        {ui.ctaDesc}
                    </p>
                    <Link href="/contact">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3.5 rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-purple-600/20">
                            {ui.ctaBtn}
                        </button>
                    </Link>
                </div>
            </article>
        </main>
    );
}
