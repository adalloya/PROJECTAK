import { blogPosts, BlogPost } from "@/lib/blog";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-32 pb-16">
                <article className="container px-4 mx-auto max-w-4xl">
                    {/* Back Link */}
                    <div className="mb-8">
                        <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver al Blog
                        </Link>
                    </div>

                    {/* Header */}
                    <header className="mb-10 text-center">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full font-medium">
                                {post.category}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-center text-sm text-muted-foreground gap-6">
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {post.date}
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                {post.readTime}
                            </div>
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                Autor: Equipo Expertos
                            </div>
                        </div>
                    </header>

                    {/* Featured Image Placeholder (Since we don't have real files yet) */}
                    <div className="relative aspect-video w-full bg-muted rounded-2xl mb-12 overflow-hidden flex items-center justify-center">
                        <div className="text-muted-foreground text-sm">Imagen Destacada: {post.title}</div>
                        {/* In a real scenario: <Image src={post.image} fill className="object-cover" /> */}
                    </div>

                    {/* Content */}
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none mx-auto"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* CTA Box */}
                    <div className="mt-16 bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
                        <h3 className="text-2xl font-bold mb-4">¿Te gustó este artículo?</h3>
                        <p className="text-muted-foreground mb-6">
                            Deja que nosotros nos encarguemos de aplicar todos estos tips en tu viaje. Nuestra planificación es 100% gratuita.
                        </p>
                        <Link href="/contact">
                            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-md">
                                Solicitar Cotización Gratis
                            </button>
                        </Link>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
