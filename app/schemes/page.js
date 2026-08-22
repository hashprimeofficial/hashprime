import OurProjects from '@/components/OurProjects';
import DetailedSchemes from '@/components/DetailedSchemes';

export const metadata = {
    title: 'Schemes & Yield Plans | Hashprime',
    description: 'Explore structured yield schemes and execution models by Hashprime.',
};

export default function ServicesPage() {
    return (
        <main className="bg-[#121212] min-h-screen pt-20">
            <OurProjects />
            <DetailedSchemes />
        </main>
    );
}
