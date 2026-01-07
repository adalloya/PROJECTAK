import { Hero } from "@/components/hero";
import { Destinations } from "@/components/destinations";
import { Testimonials } from "@/components/testimonials";
import { Gallery } from "@/components/gallery";
import { LatestBlogPosts } from "@/components/latest-blog-posts";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic'; // Force no-cache on Vercel
export const revalidate = 0;

export default async function Home() {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_approved', true) // Only approved reviews
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <main className="flex min-h-screen flex-col justify-between">
      <Hero />
      <Destinations />
      <Gallery />
      <LatestBlogPosts />
      <Testimonials reviews={reviews || []} />
    </main>
  );
}
