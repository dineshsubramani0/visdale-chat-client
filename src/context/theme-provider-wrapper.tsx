import { ThemeProvider } from './theme-provider';
import { useEffect, useState } from 'react';

export function ThemeProviderWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('vite-ui-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  if (theme === null) {
    return null;
  }

  return <ThemeProvider defaultTheme="system">{children}</ThemeProvider>;
}
