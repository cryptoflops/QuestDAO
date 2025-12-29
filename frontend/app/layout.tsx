import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Playfair_Display, Manrope } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const MobileNav = dynamic(() => import('@/components/MobileNav'), { ssr: false });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'QuestDAO | Proof of Skill',
  description: 'The first meritocratic Stacks academy. Learn Clarity, earn Soulbound Badges, and govern the protocol.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
      <body className="antialiased min-h-screen pt-16 bg-transparent text-foreground selection:bg-stacks-orange selection:text-white">
        <Providers>
          <Navbar />
          {children}
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
