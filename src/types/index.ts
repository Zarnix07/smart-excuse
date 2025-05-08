export type ExcuseContext = 'work' | 'school' | 'social' | 'family';
export type UrgencyLevel = 'High' | 'Medium' | 'Low' | '';
export type BelievabilityLevel = 'Very Believable' | 'Somewhat Believable' | 'A Little Stretchy' | '';

export interface SavedExcuse {
  id: string;
  text: string;
  context: ExcuseContext;
  urgency?: UrgencyLevel;
  believability?: BelievabilityLevel;
  createdAt: string;
}
