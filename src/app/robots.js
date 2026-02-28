export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bks-shipman.com';

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin",
                "/dashboard",
                "/api",
                "/_next",
                "/private",
                "/*.json",
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}