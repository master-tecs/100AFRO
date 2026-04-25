import type { Metadata } from 'next';
import CareersContent from './CareersContent';

export const metadata: Metadata = {
  title: 'Careers | 100AFRO',
  description:
    'Join the team building the voice of African culture online. Browse open roles in editorial, creative, growth, and leadership at 100AFRO.',
};

export default function CareersPage() {
  return <CareersContent />;
}
