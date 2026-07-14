import type { Metadata } from 'next';
import { Playfair_Display, Manrope } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'QuestDAO | Proof of Skill',
  description: 'The first meritocratic Stacks academy. Learn Clarity, earn Soulbound Badges, and govern the protocol.',
  other: {
    'talentapp:project_verification': 'ca087a253a986b205e9d6578e475cf5d584c511b4714dde08c56be3f540fefa909c083c1c0a19ee7f159a15b88707c583b7ceb45e4372892ac278bb57689e474'
  }
};

import { authenticate } from '../src/lib/stacks-integration';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize Stacks connection utilities
  if (typeof window !== 'undefined') {
    console.log('Stacks integration ready. Authing available via:', authenticate);
  }

  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
      <body className="antialiased min-h-dvh pt-16 bg-background text-foreground selection:bg-primary selection:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
