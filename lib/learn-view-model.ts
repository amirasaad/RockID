export type LearnTopicItemViewModel = {
  title: string;
  slug: string;
  href: string;
};

export type LearnTopicsViewModel = {
  items: LearnTopicItemViewModel[];
};

export function createLearnTopicsViewModel(topics: string[]): LearnTopicsViewModel {
  return {
    items: topics.map((topic) => {
      const slug = createLearnTopicSlug(topic);
      return {
        title: topic,
        slug,
        href: `/learn/${slug}`,
      };
    }),
  };
}

export function createLearnTopicSlug(topic: string): string {
  return topic
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
