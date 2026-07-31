// Heading/display font stack, per locale:
//   he → Rubik, ar → Cairo, ru → Rubik (Cyrillic), en → Arimo.
export const displayFont = (locale: string): string => {
  switch (locale) {
    case 'he':
    case 'ru':
      return 'var(--font-rubik), sans-serif';
    case 'ar':
      return 'var(--font-cairo), sans-serif';
    default:
      return 'var(--font-arimo), sans-serif';
  }
};
