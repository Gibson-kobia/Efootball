import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Efootball Showdown 2025 | Premium Esports Tournament',
  description: 'Join the ultimate eFootball 2025 tournament. 1,000 players. $10,000 prize pool. December 10-13, 2025.',
  keywords: 'efootball, tournament, esports, gaming, competition',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

