import { Hero } from "@/components/hero";
import { Destinations } from "@/components/destinations";
import { Testimonials } from "@/components/testimonials";
import { Gallery } from "@/components/gallery";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between">
      <Hero />
      <Destinations />
      <Gallery />
      <Testimonials />
    </main>
  );
}
