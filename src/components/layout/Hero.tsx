'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import HeroGate from '@/components/layout/HeroGate';
import HeroMobile from '@/components/layout/HeroMobile';

/**
 * Chooses the landing experience by viewport: the desktop split-screen gate or
 * the mobile stacked-tile landing. While the breakpoint is still unknown
 * (server / first client render) it defaults to the desktop gate.
 */
export default function Hero() {
  const isMobile = useIsMobile();
  return isMobile ? <HeroMobile /> : <HeroGate />;
}
