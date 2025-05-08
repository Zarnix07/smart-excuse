"use client";

import { ExcuseGenerator } from '@/components/excuse-generator';
import { SavedExcuses } from '@/components/saved-excuses';
import type { SavedExcuse } from '@/types';
import { Brain } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ModeToggle } from '@/components/mode-toggle';

const LOCAL_STORAGE_KEY = 'smartExcuseApp_savedExcuses';

export default function HomePage() {
  const [savedExcuses, setSavedExcuses] = useState<SavedExcuse[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedExcuses = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedExcuses) {
        setSavedExcuses(JSON.parse(storedExcuses));
      }
    } catch (error) {
      console.error("Failed to load excuses from localStorage:", error);
      // Optionally clear corrupted data
      // localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedExcuses));
      } catch (error) {
        console.error("Failed to save excuses to localStorage:", error);
      }
    }
  }, [savedExcuses, isClient]);

  const handleAddSavedExcuse = (excuse: SavedExcuse) => {
    setSavedExcuses((prevExcuses) => [excuse, ...prevExcuses]);
  };

  const handleDeleteSavedExcuse = (id: string) => {
    setSavedExcuses((prevExcuses) => prevExcuses.filter((excuse) => excuse.id !== id));
  };
  
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 bg-background">
      <header className="w-full max-w-lg mb-8 flex justify-between items-center">
        <div className="flex items-center">
          <Brain className="h-10 w-10 mr-3 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">
            Smart Excuse
          </h1>
        </div>
        <ModeToggle />
      </header>
      
      <main className="w-full flex flex-col items-center gap-8">
        <ExcuseGenerator onExcuseSaved={handleAddSavedExcuse} />
        {isClient && <SavedExcuses excuses={savedExcuses} onDeleteExcuse={handleDeleteSavedExcuse} />}
      </main>

      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Smart Excuse Inc. Your alibis, intelligently crafted.</p>
      </footer>
    </div>
  );
}
