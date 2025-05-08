"use client";

import { useState, useEffect } from 'react';
import { ExcuseGenerator } from '@/components/excuse-generator';
import { SavedExcuses } from '@/components/saved-excuses';
import { ModeToggle } from '@/components/mode-toggle';
import type { SavedExcuse } from '@/types';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LOCAL_STORAGE_KEY = 'smartExcuseAppSavedExcuses';

export default function HomePage() {
  const [savedExcuses, setSavedExcuses] = useState<SavedExcuse[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  // Signal that the component has mounted and client-side logic can run
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load excuses from localStorage once isClient is true
  useEffect(() => {
    if (isClient) {
      try {
        const storedExcuses = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedExcuses) {
          setSavedExcuses(JSON.parse(storedExcuses));
        }
      } catch (error) {
        console.error("Error loading excuses from localStorage:", error);
        // Optionally clear corrupted data:
        // localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, [isClient]);

  // Save excuses to localStorage whenever they change, if isClient is true
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedExcuses));
      } catch (error) {
        console.error("Error saving excuses to localStorage:", error);
      }
    }
  }, [savedExcuses, isClient]);
  
  // Set current year for footer
  useEffect(() => {
    if (isClient) {
      setCurrentYear(new Date().getFullYear());
    }
  }, [isClient]);

  const handleExcuseSaved = (excuse: SavedExcuse) => {
    setSavedExcuses((prevExcuses) => [excuse, ...prevExcuses]);
  };

  const handleDeleteExcuse = (id: string) => {
    setSavedExcuses((prevExcuses) => prevExcuses.filter((e) => e.id !== id));
  };

  return (
    <main className="container mx-auto min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 bg-background text-foreground">
      <header className="w-full flex justify-between items-center mb-8 md:mb-12 py-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <BrainCircuit className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Smart Excuse Generator
          </h1>
        </div>
        <ModeToggle />
      </header>

      <div className="w-full flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-8 lg:space-y-0">
        <section aria-labelledby="excuse-generator-heading" className="lg:flex-1 w-full">
          <h2 id="excuse-generator-heading" className="sr-only">Excuse Generator</h2>
          <ExcuseGenerator onExcuseSaved={handleExcuseSaved} />
        </section>
        
        <section aria-labelledby="saved-excuses-heading" className="lg:flex-1 w-full">
          <h2 id="saved-excuses-heading" className="sr-only">Saved Excuses</h2>
          {isClient ? (
            <SavedExcuses excuses={savedExcuses} onDeleteExcuse={handleDeleteExcuse} />
          ) : (
            <Card className="w-full max-w-lg mt-0 lg:mt-8 shadow-xl border-border">
              <CardHeader>
                <CardTitle className="flex items-center text-xl sm:text-2xl text-card-foreground">
                  Loading Saved Excuses...
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      <footer className="w-full mt-12 md:mt-16 pt-6 pb-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>
          &copy; {currentYear !== null ? currentYear : '----'} Firebase Studio. All rights reserved.
        </p>
        <p className="mt-1">Powered by Genkit &amp; Next.js</p>
      </footer>
    </main>
  );
}