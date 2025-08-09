import { useState, useEffect, useCallback, useMemo } from 'react';
import { darkTheme } from '../components/theme/darkTheme';
import { lightTheme } from '../components/theme/lightTheme';

export const useTheme = () => {
  const [themeName, setThemeName] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    const newTheme = themeName === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    setThemeName(newTheme);
    window.dispatchEvent(new Event('themeChange'));
  }, [themeName]);

  const updateTheme = useCallback(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const resolvedTheme = storedTheme === 'dark' ? 'dark' : 'light';
    setThemeName(resolvedTheme);
  }, []);

  // ✅ useMemo — возвращает стабильный объект
  const themeObject = useMemo(() => {
    return themeName === 'dark' ? darkTheme : lightTheme;
  }, [themeName]);

  useEffect(() => {
    updateTheme();

    window.addEventListener('themeChange', updateTheme);
    window.addEventListener('storage', updateTheme);

    return () => {
      window.removeEventListener('themeChange', updateTheme);
      window.removeEventListener('storage', updateTheme);
    };
  }, [updateTheme]);

  return { themeName, themeObject, toggleTheme };
};
