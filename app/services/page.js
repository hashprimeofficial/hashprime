import OurServices from '@/components/OurServices';

export const metadata = {
    title: 'Services | Hashprime',
    description: 'Explore our premium financial infrastructure and services.',
};

export default function ServicesPage() {
    return (
        <main className="bg-[#0B1120] min-h-screen pt-20">
            <OurServices />
        </main>
    );
}
