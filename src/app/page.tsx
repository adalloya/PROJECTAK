import { Hero } from "@/components/hero";
import { Destinations } from "@/components/destinations";
import { Testimonials } from "@/components/testimonials";
import { Gallery } from "@/components/gallery";
import { LatestBlogPosts } from "@/components/latest-blog-posts";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Cache on Vercel CDN for 60s (ISR) to reduce Supabase queries

export default async function Home() {
  let reviews: any[] | null = null;
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (!error && data !== null) {
      reviews = data;
    }
  } catch (e) {
    console.error("Error fetching reviews for homepage:", e);
  }

  return (
    <main className="flex min-h-screen flex-col justify-between">
      <Hero />
      <Destinations />
      <Gallery />
      <LatestBlogPosts />
      <Testimonials reviews={reviews} />
    </main>
  );
}
