import OurProjects from '@/components/OurProjects';
import DetailedSchemes from '@/components/DetailedSchemes';

export const metadata = {
    title: 'Engineering & Infrastructure Services | Hashprime',
    description: 'Explore our specialized services across telecom infrastructure, electrical engineering, construction, real estate, and technology solutions.',
};

export default function ServicesPage() {
    return (
        <main className="bg-[#121212] min-h-screen pt-20">
            <OurProjects />
            <DetailedSchemes />
        </main>
    );
}
