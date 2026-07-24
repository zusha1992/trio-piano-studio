// Heading/display font stack, direction-aware: Rubik for Hebrew, Arimo for Latin.
export const displayFont = (isHe: boolean) =>
  isHe ? 'var(--font-rubik), sans-serif' : 'var(--font-arimo), sans-serif';
