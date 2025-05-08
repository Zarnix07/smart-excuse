// This is an AI-powered tool to generate excuses based on the context.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExcuseContextSchema = z.enum(['work', 'school', 'social', 'family']);

const GenerateExcuseInputSchema = z.object({
  context: ExcuseContextSchema.describe('The context for which the excuse is needed (work, school, social, family).'),
  urgency: z.string().optional().describe('The urgency level of the excuse (e.g., high, medium, low).'),
  believability: z.string().optional().describe('The desired believability level of the excuse (e.g., very believable, somewhat believable).'),
});

export type GenerateExcuseInput = z.infer<typeof GenerateExcuseInputSchema>;

const GenerateExcuseOutputSchema = z.object({
  excuse: z.string().describe('The generated excuse.'),
});

export type GenerateExcuseOutput = z.infer<typeof GenerateExcuseOutputSchema>;

export async function generateExcuse(input: GenerateExcuseInput): Promise<GenerateExcuseOutput> {
  return generateExcuseFlow(input);
}

const generateExcusePrompt = ai.definePrompt({
  name: 'generateExcusePrompt',
  input: {
    schema: GenerateExcuseInputSchema,
  },
  output: {
    schema: GenerateExcuseOutputSchema,
  },
  prompt: `You are an AI-powered excuse generator. Generate an excuse based on the following context:

Context: {{{context}}}

{% if urgency %}Urgency: {{{urgency}}}{% endif %}
{% if believability %}Believability: {{{believability}}}{% endif %}

The excuse should sound natural and believable for the given situation.`,
});

const generateExcuseFlow = ai.defineFlow(
  {
    name: 'generateExcuseFlow',
    inputSchema: GenerateExcuseInputSchema,
    outputSchema: GenerateExcuseOutputSchema,
  },
  async input => {
    const {output} = await generateExcusePrompt(input);
    return output!;
  }
);
