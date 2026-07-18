// The home experience is rendered by the persistent HeroGate overlay
// (src/components/layout/HeroGate.tsx). This placeholder simply fills the
// screen behind it so there is never a flash of empty background.
export default function HomePage() {
  return <div className="min-h-screen bg-[var(--c-bg)]" />;
}
