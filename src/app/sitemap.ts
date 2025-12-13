import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://herewego-advisor.com'; // Replace with actual domain if different

    // Static routes
    const routes = [
        '',
        '/about',
        '/contact',
        '/services',
        '/faq',
        '/blog',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Destinations routes (could be dynamic, but static list for now based on known destinations)
    const destinations = [
        'disney-world',
        'disneyland',
        'disney-cruise',
        'universal-studios',
    ].map((slug) => ({
        url: `${baseUrl}/destinations/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...routes, ...destinations];
}
