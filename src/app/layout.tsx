import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Github } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Agentic AI Demo',
  description: 'A minimal chat experience showcasing an agentic AI backend and a simple Next.js frontend.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="bg-secondary grid grid-rows-[auto,1fr] min-h-[100dvh]">
          <header className="grid grid-cols-[1fr,auto] gap-2 p-4 bg-black/25">
            <div className="flex gap-4 flex-col md:flex-row md:items-center">
              <span className="text-white text-2xl font-semibold">Agentic AI Demo</span>
              <p className="text-sm text-white/80 max-w-xl">
                A lightweight starter with just the essentials: a chat UI on the frontend and a LangChain-powered agent on the backend.
              </p>
            </div>
            <div className="flex items-center justify-end">
              <Button asChild variant="header" size="default">
                <Link href="https://github.com/oktadev/auth0-assistant0" target="_blank">
                  <Github className="size-3" />
                  <span>Original Template</span>
                </Link>
              </Button>
            </div>
          </header>
          <main className="gradient-up bg-gradient-to-b from-white/10 to-white/0 relative grid border-input border-b-0">
            <div className="absolute inset-0">{children}</div>
          </main>
          <Toaster richColors />
        </div>
      </body>
    </html>
  );
}
