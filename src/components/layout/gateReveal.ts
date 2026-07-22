// Coordinates a subpage's entrance with the home-screen gate.
//
// When a category is chosen, the curtain (HeroGate) takes ~1.5s to slide open
// over the destination page. If the page ran its own fade-in on mount, it would
// play *behind* the closed curtain and be invisible. So the gate marks a pending
// reveal here; the destination page consumes it on mount and defers its own
// entrance so the gallery fade overlaps the tail of the curtain open — the fade
// is almost finished by the time the curtain (GATE_OPEN_DURATION ≈ 1.5s) is done.

const GATE_OPEN_MS = 800;

let pending = false;

/** Called by the gate when it starts opening toward a page. */
export function markGateReveal() {
  pending = true;
}

/**
 * Consumed by a destination page on mount. Returns the delay (ms) to wait before
 * revealing its content: the curtain-open duration when arriving via the gate, or
 * a tiny delay for a direct navigation (navbar/link).
 */
export function consumeGateRevealDelay(): number {
  const viaGate = pending;
  pending = false;
  return viaGate ? GATE_OPEN_MS : 60;
}
