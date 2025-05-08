// @ts-nocheck
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SavedExcuse } from '@/types';
import { Bookmark, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SavedExcusesProps {
  excuses: SavedExcuse[];
  onDeleteExcuse: (id: string) => void;
}

export function SavedExcuses({ excuses, onDeleteExcuse }: SavedExcusesProps) {
  if (excuses.length === 0) {
    return (
      <Card className="w-full max-w-lg mt-8 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
             <Bookmark className="mr-2 h-6 w-6 text-accent" />
            Saved Excuses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You haven't saved any excuses yet. Generate one and save it for later!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mt-8 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Bookmark className="mr-2 h-6 w-6 text-accent" />
          Your Saved Excuses
        </CardTitle>
        <CardDescription>Quick access to your most reliable alibis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {excuses.slice().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((excuse) => (
          <Card key={excuse.id} className="p-4 bg-background shadow-md">
            <p className="text-foreground mb-2">{excuse.text}</p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Context: {excuse.context}
                {excuse.urgency && `, Urgency: ${excuse.urgency}`}
                {excuse.believability && `, Believability: ${excuse.believability}`}
                <br />
                Saved: {formatDistanceToNow(new Date(excuse.createdAt), { addSuffix: true })}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteExcuse(excuse.id)}
                aria-label="Delete excuse"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
