import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Engineering & Infrastructure Services | Hashprime',
    description: 'Explore our specialized services across telecom infrastructure, electrical engineering, construction, real estate, and technology solutions.',
    robots: {
        index: false,
        follow: true,
    }
};

export default function ServicesPage() {
    redirect('/hash-prime-groups');
}
