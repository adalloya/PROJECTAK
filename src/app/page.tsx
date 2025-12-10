import { Hero } from "@/components/hero";
import { Destinations } from "@/components/destinations";
import { Testimonials } from "@/components/testimonials";
import { Gallery } from "@/components/gallery";
import { LatestBlogPosts } from "@/components/latest-blog-posts";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between">
      <Hero />
      <Destinations />
      <Gallery />
      <LatestBlogPosts />
      <Testimonials />
    </main>
  );
}
