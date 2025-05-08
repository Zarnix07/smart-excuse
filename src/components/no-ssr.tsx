"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle } from 'lucide-react';

export default function NoSSR() {
  const [clientOnlyText, setClientOnlyText] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // This effect runs only on the client after hydration
    const timer = setTimeout(() => {
      setClientOnlyText(
        `Generated on client: ${Math.random().toFixed(5)} at ${new Date().toLocaleTimeString()}`
      );
    }, 200); // Small delay to make loading state more noticeable if needed

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    // This content is shown briefly before the component truly mounts on the client.
    // Since this component is loaded with ssr:false, this specific return block might not be strictly necessary
    // for avoiding hydration errors, but it's a good pattern for components with client-only effects.
    return (
      <Card className="w-full max-w-md mx-auto my-4">
        <CardHeader>
          <CardTitle>Client-Side Component</CardTitle>
          <CardDescription>Initializing client-specific content...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto my-4 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <CheckCircle className="mr-2 h-6 w-6" />
          Client-Side Rendered Content
        </CardTitle>
        <CardDescription>
          This component is loaded using <code>next/dynamic</code> with <code>ssr: false</code>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {clientOnlyText ? (
          <div>
            <p className="text-lg font-semibold text-foreground">{clientOnlyText}</p>
            <p className="text-sm text-muted-foreground mt-1">
              (This proves the component rendered after client-side hydration)
            </p>
          </div>
        ) : (
          <div className="flex items-center text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Loading dynamic client content...</span>
          </div>
        )}
         <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
          If you inspect the initial HTML source sent by the server (View Page Source), the randomly generated number and time above should not be present. They are populated by JavaScript running in the browser.
        </p>
      </CardContent>
    </Card>
  );
}