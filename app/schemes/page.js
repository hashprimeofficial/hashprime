import OurProjects from '@/components/OurProjects';
import InvestmentSchemes from '@/components/InvestmentSchemes';

export const metadata = {
    title: 'Services | Hashprime',
    description: 'Explore our premium financial projects and investment structures.',
};

export default function ServicesPage() {
    return (
        <main className="bg-white min-h-screen pt-20">
            <OurProjects />
            <InvestmentSchemes />
        </main>
    );
}
