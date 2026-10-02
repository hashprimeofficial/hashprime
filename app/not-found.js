import MaintenancePage from '@/components/MaintenancePage';

export const metadata = {
  title: 'Under Scheduled Updates & Enhancements | Hashprime',
  description: 'Our website is currently undergoing scheduled updates and enhancements. We’ll be back online on 21 October 2026. Thank you for your patience and understanding.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <MaintenancePage />;
}
