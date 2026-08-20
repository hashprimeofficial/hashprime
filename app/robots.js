export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/dashboard', '/api'],
            },
            {
                userAgent: ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'GPTBot', 'PerplexityBot', 'ClaudeBot', 'Applebot'],
                allow: ['/', '/company-facts', '/compliance', '/grievance-redressal', '/hash-prime-groups', '/llms.txt'],
                disallow: ['/admin', '/dashboard', '/api'],
            },
        ],
        sitemap: 'https://hashprime.in/sitemap.xml',
    };
}
