export const INPUT_CLASS = 'w-full bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/10 rounded py-2.5 pl-3 pr-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-caption';

export const PAGE_INPUT = 'w-full border border-border rounded-lg py-3 px-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-caption bg-bg-primary dark:bg-bg-elevated';

export function extractCity(label: string): string {
  const parts = label.split(',');
  return parts[0]?.trim() || label;
}
