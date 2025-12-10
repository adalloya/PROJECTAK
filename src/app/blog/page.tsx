"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { blogPosts } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-32 pb-16">
                {/* Header */}
                <div className="container px-4 mx-auto mb-16 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
                    >
                        Blog & Tips Mágicos
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        Consejos expertos, guías de ahorro y todo lo que necesitas saber para planear el viaje perfecto.
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow flex flex-col h-full"
                            >
                                <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
                                    {/* Fallback image logic or real image if available. 
                                        Since we don't have real implementation of these image files locally yet, 
                                        we will use a placeholder styling but try to load the image.
                                      */}
                                    <div className="absolute inset-0 bg-secondary/30" />
                                    {/* Using a gradient overlay as placeholder if image fails or just as style */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                                            {post.category}
                                        </span>
                                    </div>
                                </Link>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center text-xs text-muted-foreground mb-4 space-x-4">
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
                                        <h2 className="text-xl font-bold hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                    </Link>

                                    <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                                        >
                                            Leer artículo completo
                                            <ArrowRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
