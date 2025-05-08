"use client";

import dynamic from 'next/dynamic';
import { Brain, Loader2 } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { useState, useEffect } from 'react';

// Dynamically import the NoSSR component with SSR turned off
const NoSSR = dynamic(() => import('@/components/no-ssr'), {
  ssr: false,
  loading: () => ( // Optional loading component shown while the NoSSR component's code is being fetched
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px] w-full max-w-md mx-auto my-4 border rounded-lg shadow-md bg-card">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Loading Client-Side Component...</p>
      <p className="text-xs text-muted-foreground mt-1">(Fetching component code)</p>
    </div>
  )
});

export default function Page() {
  const [yearForFooter, setYearForFooter] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setYearForFooter(new Date().getFullYear().toString());
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 bg-background">
      <header className="w-full max-w-lg mb-8 flex justify-between items-center">
        <div className="flex items-center">
          <Brain className="h-10 w-10 mr-3 text-primary" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
             No-SSR Demo
          </h1>
        </div>
        <ModeToggle />
      </header>

      <main className="w-full flex flex-col items-center gap-6">
        <p className="text-center text-md sm:text-lg text-foreground max-w-xl px-2">
          The component displayed below is loaded dynamically only on the client-side.
          This means its content is not part of the initial server-rendered HTML, which is useful for components
          that rely on browser-specific APIs or generate highly dynamic content.
        </p>
        <NoSSR />
      </main>

      <footer className="mt-12 text-center text-muted-foreground text-sm">
        {isClient && yearForFooter ? (
          <p>&copy; {yearForFooter} Smart Excuse Inc. (No-SSR Demo Page)</p>
        ) : (
          // Fallback for SSR or initial client render before year is set
          <p>&nbsp;</p> 
        )}
      </footer>
    </div>
  );
}