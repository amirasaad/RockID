export type RockMatch = {
  name: string;
  category: string;
  confidence: 'High' | 'Medium' | 'Low';
  score: number;
};

export const topMatches: RockMatch[] = [
  {
    name: 'Granite',
    category: 'Igneous intrusive',
    confidence: 'Medium',
    score: 72,
  },
  {
    name: 'Granitic Gneiss',
    category: 'Metamorphic',
    confidence: 'Low',
    score: 18,
  },
  {
    name: 'Quartz Diorite',
    category: 'Igneous intrusive',
    confidence: 'Low',
    score: 10,
  },
];

export const recentFinds = [
  { id: 'granite-trail', title: 'Granite near trail', date: 'Apr 28, 2026', confidence: 'Medium' },
  { id: 'sandstone-ridge', title: 'Sandstone ridge', date: 'Apr 24, 2026', confidence: 'High' },
];

export const learnTopics = [
  'Igneous Rocks',
  'Sedimentary Rocks',
  'Metamorphic Rocks',
  'Grain Size Guide',
  'Common Look-alikes',
];
