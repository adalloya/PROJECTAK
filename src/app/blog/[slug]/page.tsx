import { blogPosts, BlogPost } from "@/lib/blog";
import { BlogPostClient } from "@/components/blog-post-client";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
    
    let post: BlogPost | null = null;
    try {
        const { data: dbPost } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .single();
            
        if (dbPost) {
            post = {
                id: dbPost.id,
                slug: dbPost.slug,
                title: dbPost.title,
                excerpt: dbPost.excerpt,
                content: dbPost.content,
                date: dbPost.date,
                readTime: dbPost.read_time,
                image: dbPost.image,
                category: dbPost.category
            };
        }
    } catch (e) {
        console.error("Error querying blog post from Supabase, falling back to static lookup:", e);
    }

    if (!post) {
        post = blogPosts.find((p) => p.slug === slug) || null;
    }

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <BlogPostClient post={post} />
        </div>
    );
}
