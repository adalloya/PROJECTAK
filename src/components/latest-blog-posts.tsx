"use client";

import { blogPosts } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";

export function LatestBlogPosts() {
    const latestPosts = blogPosts.slice(0, 3);

    return (
        <section className="py-24 bg-secondary/10">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold tracking-tight mb-4"
                    >
                        Tips y Secretos Mágicos
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        Descubre nuestras guías expertas para planear las vacaciones perfectas en Disney y Universal.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {latestPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-border/50"
                        >
                            <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden bg-muted">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-background/90 backdrop-blur text-foreground text-xs px-2 py-1 rounded-full font-medium border border-border">
                                        {post.category}
                                    </span>
                                </div>
                            </Link>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center text-xs text-muted-foreground mb-3">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {post.date}
                                </div>

                                <Link href={`/blog/${post.slug}`} className="block mb-3">
                                    <h3 className="text-xl font-bold hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                </Link>

                                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto pt-4 border-t border-border/50">
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Leer más
                                        <ArrowRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/blog">
                        <button className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-full font-medium transition-all">
                            Ver todos los artículos
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
