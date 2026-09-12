import type { Metadata } from 'next';
import CareersContent from './CareersContent';

export const metadata: Metadata = {
  title: 'Careers | 100AFRO',
  description:
    'Applications for 100AFRO are currently closed. All of our current roles have been filled. Check back later, as we expect to open new positions as we grow.',
};

export default function CareersPage() {
  return <CareersContent />;
}
