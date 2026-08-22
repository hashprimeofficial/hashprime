export default function robots() {
    const disallowedRoutes = ['/admin', '/dashboard', '/api', '/register', '/login', '/forgot-password', '/markets'];

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: disallowedRoutes,
            },
            {
                userAgent: ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'GPTBot', 'PerplexityBot', 'ClaudeBot', 'Applebot'],
                allow: ['/', '/company-facts', '/compliance', '/grievance-redressal', '/hash-prime-groups', '/llms.txt', '/total-telecom-services', '/ac-sales-and-service', '/construction-and-works', '/fiberoptical-services'],
                disallow: disallowedRoutes,
            },
        ],
        sitemap: 'https://hashprime.in/sitemap.xml',
    };
}
