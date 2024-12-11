import '@mantine/core/styles.css';
import '@/app/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="pt-20">{children}</div>
      <Footer />
    </>
  );
}
