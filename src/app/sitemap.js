export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bks-shipman.com';

    // Daftar rute statis
    const routes = ["", "/about", "/vessels", "/exhibitions", "/careers"].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: route === "" ? 1 : 0.8,
    }));

    return [...routes];
}