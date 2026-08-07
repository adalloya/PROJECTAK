import { notFound } from "next/navigation";
import { destinationsData, Destination } from "@/lib/destinations";
import { DestinationDetailClient } from "@/components/destination-detail-client";
import { supabase } from "@/lib/supabase";

interface DestinationPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export function generateStaticParams() {
    return Object.keys(destinationsData).map((slug) => ({
        slug,
    }));
}

export default async function DestinationPage({ params }: DestinationPageProps) {
    const { slug } = await params;
    
    let destination: Destination | null = null;
    try {
        const { data: dbDest } = await supabase
            .from('destinations')
            .select('*')
            .eq('slug', slug)
            .single();
            
        if (dbDest) {
            destination = {
                slug: dbDest.slug,
                title: dbDest.title,
                subtitle: dbDest.subtitle || "",
                heroImage: dbDest.hero_image,
                overview: dbDest.overview,
                highlights: Array.isArray(dbDest.highlights) ? dbDest.highlights : [],
                mustDos: Array.isArray(dbDest.must_dos) ? dbDest.must_dos : [],
                tips: Array.isArray(dbDest.tips) ? dbDest.tips : []
            };
        }
    } catch (e) {
        console.error("Error querying destination from Supabase, falling back to static lookup:", e);
    }

    if (!destination) {
        destination = destinationsData[slug];
    }

    if (!destination) {
        notFound();
    }

    return <DestinationDetailClient destination={destination} />;
}
