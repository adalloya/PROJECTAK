"use client";

import { blogPosts, getLocalizedBlogPost } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function BlogPage() {
    const { t, language } = useLanguage();
    const [postsList, setPostsList] = useState<any[]>(blogPosts);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                if (data && data.length > 0) {
                    setPostsList(data.map(item => ({
                        id: item.id,
                        slug: item.slug,
                        title: item.title,
                        excerpt: item.excerpt,
                        content: item.content,
                        date: item.date,
                        readTime: item.read_time,
                        image: item.image,
                        category: item.category
                    })));
                }
            } catch (err) {
                console.error("Error fetching blog posts from Supabase, falling back to static:", err);
            }
        }
        fetchPosts();
    }, []);

    const localizedList = postsList.map(p => getLocalizedBlogPost(p, language));

    return (
        <div className="min-h-screen bg-background">
            <main className="pt-28 pb-16">
                {/* Header */}
                <div className="container px-4 mx-auto mb-16 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white"
                    >
                        {t("blog_title")}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
                    >
                        {t("blog_subtitle")}
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {localizedList.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl hover:border-purple-500/30 transition-all flex flex-col h-full"
                            >
                                <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-purple-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">
                                            {post.category}
                                        </span>
                                    </div>
                                </Link>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center text-xs text-slate-500 mb-4 space-x-4">
                                        <div className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {post.date}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {post.readTime}
                                        </div>
                                    </div>

                                    <Link href={`/blog/${post.slug}`} className="block mb-3">
                                        <h2 className="text-xl font-bold hover:text-purple-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                    </Link>

                                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                                        >
                                            {t("blog_read_more")}
                                            <ArrowRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
