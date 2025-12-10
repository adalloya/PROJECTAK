"use client";

import { blogPosts } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function LatestBlogPosts() {
    const latestPosts = blogPosts.slice(0, 4); // Show top 4
    const [active, setActive] = useState(0);

    return (
        <section className="py-12 md:py-24 bg-secondary/5 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

            <div className="w-full max-w-[1400px] mx-auto px-6">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span>Blog de Expertos</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Tips y Secretos Mágicos</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Guías esenciales para planear tus vacaciones perfectas.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-stretch h-[550px]">

                    {/* Desktop Menu (Left Side) */}
                    <div className="hidden lg:flex flex-col gap-2 w-1/3 overflow-y-auto pr-2 custom-scrollbar">
                        {latestPosts.map((post, index) => (
                            <div
                                key={post.id}
                                onMouseEnter={() => setActive(index)}
                                className={cn(
                                    "p-5 rounded-xl cursor-pointer transition-all duration-300 border border-transparent relative group",
                                    active === index
                                        ? "bg-white shadow-md border-primary/20 translate-x-2"
                                        : "hover:bg-white/50 hover:translate-x-1"
                                )}
                            >
                                <div className="flex items-center text-xs text-muted-foreground mb-2">
                                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mr-2",
                                        active === index ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
                                        {post.category}
                                    </span>
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {post.date}
                                </div>
                                <h3 className={cn("text-lg font-bold leading-tight transition-colors", active === index ? "text-primary" : "text-foreground")}>
                                    {post.title}
                                </h3>
                                <p className={cn("text-xs mt-2 line-clamp-2", active !== index && "text-muted-foreground")}>
                                    {post.excerpt}
                                </p>
                            </div>
                        ))}
                        <div className="mt-auto pt-4 text-center">
                            <Link href="/blog" className="text-sm font-medium text-primary hover:underline inline-flex items-center">
                                Ver todos los artículos <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Preview (Right Side) */}
                    <div className="hidden lg:block w-2/3 relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-white">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 flex flex-col"
                            >
                                <div className="relative flex-grow overflow-hidden">
                                    <Image
                                        src={latestPosts[active].image}
                                        alt={latestPosts[active].title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-8 text-white bg-gradient-to-t from-black/95 to-transparent pt-32">
                                    <h3 className="text-3xl font-bold mb-3 leading-tight">{latestPosts[active].title}</h3>
                                    <p className="text-base text-white/90 mb-6 max-w-2xl line-clamp-2">{latestPosts[active].excerpt}</p>

                                    <Link href={`/blog/${latestPosts[active].slug}`}>
                                        <button className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 text-sm">
                                            Leer artículo completo <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Mobile Swiper (Horizontal Scroll) */}
                    <div className="lg:hidden w-full overflow-x-auto snap-x snap-mandatory flex gap-4 pb-8 scrollbar-hide px-4 -mx-4">
                        {latestPosts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="snap-center shrink-0 w-[80vw] bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50 flex flex-col h-[400px]"
                            >
                                <div className="relative h-48 bg-muted">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <span className="absolute top-4 left-4 bg-background/90 backdrop-blur text-foreground text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                                        {post.category}
                                    </span>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {post.date}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-tight">
                                        {post.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto text-primary font-semibold text-sm flex items-center">
                                        Leer más <ArrowRight className="h-3 w-3 ml-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
