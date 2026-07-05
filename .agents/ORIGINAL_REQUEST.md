## 2026-07-05T03:05:05Z

Update the Hashprime company website "About Us" page, SEO metadata, and geographic SEO targeting with the provided engineering & infrastructure company description, mission, and vision statements.

Working directory: `/Users/mohammedarif/hashprime-main`
Integrity mode: development

## Requirements

### R1. About Page Content Update
Update the About Us page (`app/company/page.js`) and the landing page component (`components/AboutHashPrime.jsx`) with the exact description, mission, and vision text provided by the user:
- Description: "Hashprime is a multi-service engineering and infrastructure company dedicated to delivering reliable, innovative, and high-quality solutions across the telecom, electrical, construction, real estate, and technology sectors..."
- Mission: "To deliver dependable engineering, infrastructure, and technology solutions..."
- Vision: "To be recognized as one of India's most trusted engineering and technology companies..."

### R2. SEO Metadata & Keywords Update
Remove all remaining digital asset/cryptocurrency SEO keywords, meta tags, and description strings, and replace them with engineering, telecom infrastructure, electrical, real estate, and technology keywords/descriptions.

### R3. Geographic (GEO) SEO Optimization
Incorporate India-focused engineering and technology market targeting (National level targeting) across layouts, meta tags, and JSON-LD schemas.

## Acceptance Criteria

### Content Correctness
- [ ] The updated "About Us" content matches the user-provided text exactly on both `/company` and the home page.
- [ ] All references to cryptocurrency are completely removed from keywords, metadata, and site descriptions.

### Build and SEO Standards
- [ ] Next.js metadata is updated to target engineering, telecom infrastructure, and Indian markets (National level targeting).
- [ ] The application compiles successfully under `npm run build` without any compilation errors.
