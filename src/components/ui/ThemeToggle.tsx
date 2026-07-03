'use client';

import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'light') {
      document.documentElement.classList.add('light');
      setLight(true);
    }
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle('light', next);
    localStorage.setItem('theme', next ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggle}
      className="text-[var(--c-dim)] hover:text-[var(--c-text)] transition-colors duration-300 p-1"
      aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {light ? <Moon size={14} /> : <Sun size={14} />}
    </button>
  );
}
