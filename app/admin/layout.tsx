import { ReactNode } from 'react';
import { Providers } from '../providers';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950">
      <Providers>
        {children}
      </Providers>
    </div>
  );
}
