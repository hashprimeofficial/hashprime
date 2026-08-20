import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Company Facts | Hashprime',
    description: 'Official corporate and engineering facts for Hashprime.',
    robots: {
        index: false,
        follow: true,
    }
};

export default function MarketsPage() {
    redirect('/company-facts');
}
