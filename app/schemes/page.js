import OurProjects from '@/components/OurProjects';
import DetailedSchemes from '@/components/DetailedSchemes';

export const metadata = {
    title: 'Services | Hashprime',
    description: 'Explore our premium financial projects and investment structures.',
};

export default function ServicesPage() {
    return (
        <main className="bg-[#121212] min-h-screen pt-20">
            <OurProjects />
            <DetailedSchemes />
        </main>
    );
}
