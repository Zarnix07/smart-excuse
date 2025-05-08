// @ts-nocheck
"use client";

import type { GenerateExcuseInput } from '@/ai/flows/generate-excuse';
import { generateExcuse } from '@/ai/flows/generate-excuse';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { BelievabilityLevel, ExcuseContext, SavedExcuse, UrgencyLevel } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bookmark, Briefcase, Heart, Loader2, School, Sparkles, Users, Zap, ArrowDownCircle, CheckCircle2, Smile, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  context: z.enum(['work', 'school', 'social', 'family'], {
    required_error: "Please select a context.",
  }),
  urgency: z.enum(['High', 'Medium', 'Low', '']).optional(),
  believability: z.enum(['Very Believable', 'Somewhat Believable', 'A Little Stretchy', '']).optional(),
});

type ExcuseFormValues = z.infer<typeof formSchema>;

interface ExcuseGeneratorProps {
  onExcuseSaved: (excuse: SavedExcuse) => void;
}

const contextOptions: { value: ExcuseContext; label: string; icon: React.ElementType }[] = [
  { value: 'work', label: 'Work', icon: Briefcase },
  { value: 'school', label: 'School', icon: School },
  { value: 'social', label: 'Social Event', icon: Users },
  { value: 'family', label: 'Family Gathering', icon: Heart },
];

const urgencyOptions: { value: UrgencyLevel; label: string; icon: React.ElementType }[] = [
  { value: 'High', label: 'High Urgency', icon: Zap },
  { value: 'Medium', label: 'Medium Urgency', icon: Users }, // Using Users icon as ChevronsUpDown not fitting well
  { value: 'Low', label: 'Low Urgency', icon: ArrowDownCircle },
];

const believabilityOptions: { value: BelievabilityLevel; label: string; icon: React.ElementType }[] = [
  { value: 'Very Believable', label: 'Very Believable', icon: CheckCircle2 },
  { value: 'Somewhat Believable', label: 'Somewhat Believable', icon: Smile },
  { value: 'A Little Stretchy', label: 'A Little Stretchy', icon: Wand2 },
];

export function ExcuseGenerator({ onExcuseSaved }: ExcuseGeneratorProps) {
  const [generatedExcuse, setGeneratedExcuse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<ExcuseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      context: 'work',
      urgency: '',
      believability: '',
    },
  });

  const onSubmit: SubmitHandler<ExcuseFormValues> = async (data) => {
    setIsGenerating(true);
    setGeneratedExcuse(null);
    try {
      const input: GenerateExcuseInput = {
        context: data.context as ExcuseContext,
        urgency: data.urgency || undefined,
        believability: data.believability || undefined,
      };
      const result = await generateExcuse(input);
      if (result.excuse) {
        setGeneratedExcuse(result.excuse);
      } else {
        toast({ title: "Error", description: "Failed to generate excuse. Please try again.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error generating excuse:", error);
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveExcuse = () => {
    if (generatedExcuse) {
      const newExcuse: SavedExcuse = {
        id: crypto.randomUUID(),
        text: generatedExcuse,
        context: form.getValues('context') as ExcuseContext,
        urgency: form.getValues('urgency') as UrgencyLevel,
        believability: form.getValues('believability') as BelievabilityLevel,
        createdAt: new Date().toISOString(),
      };
      onExcuseSaved(newExcuse);
      toast({ title: "Excuse Saved!", description: "Your brilliant excuse is now saved." });
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Sparkles className="mr-2 h-6 w-6 text-accent" />
          Craft Your Next Excuse
        </CardTitle>
        <CardDescription>Tell us the situation, and we'll handle the rest.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Context</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a context" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contextOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center">
                            <opt.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {urgencyOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center">
                              <opt.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                              {opt.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="believability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Believability (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select believability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {believabilityOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center">
                              <opt.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                              {opt.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Excuse
            </Button>
          </form>
        </Form>
      </CardContent>
      {generatedExcuse && (
        <CardFooter className="flex-col items-start gap-4 pt-6 border-t">
          <h3 className="text-lg font-semibold text-foreground">Your Generated Excuse:</h3>
          <Card className="w-full bg-secondary/50 p-4 shadow-inner">
            <p className="text-secondary-foreground">{generatedExcuse}</p>
          </Card>
          <Button onClick={handleSaveExcuse} variant="outline" className="w-full sm:w-auto">
            <Bookmark className="mr-2 h-4 w-4" />
            Save Excuse
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
