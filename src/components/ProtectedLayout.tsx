'use client';

import { usePathname } from 'next/navigation';
import MainLayout from '@/components/MainLayout';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}
