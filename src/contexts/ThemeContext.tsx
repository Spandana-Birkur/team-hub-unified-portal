import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Force light theme - dark mode is disabled
  const [theme, setTheme] = useState<Theme>('light');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Don't load theme from localStorage - always use light
    // Force light theme on initialization
    setTheme('light');
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      // Always force light theme - ignore dark/system preferences
      const shouldBeDark = false;
      setIsDark(false);
      
      // Always apply light theme
      root.classList.remove('dark');
      // Apply light theme CSS variables
      root.style.setProperty('--background', '0 0% 100%');
      root.style.setProperty('--foreground', '222.2 84% 4.9%');
      root.style.setProperty('--card', '0 0% 100%');
      root.style.setProperty('--card-foreground', '222.2 84% 4.9%');
      root.style.setProperty('--popover', '0 0% 100%');
      root.style.setProperty('--popover-foreground', '222.2 84% 4.9%');
      root.style.setProperty('--primary', '221.2 83.2% 53.3%');
      root.style.setProperty('--primary-foreground', '210 40% 98%');
      root.style.setProperty('--secondary', '210 40% 96%');
      root.style.setProperty('--secondary-foreground', '222.2 84% 4.9%');
      root.style.setProperty('--muted', '210 40% 96%');
      root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
      root.style.setProperty('--accent', '210 40% 96%');
      root.style.setProperty('--accent-foreground', '222.2 84% 4.9%');
      root.style.setProperty('--destructive', '0 84.2% 60.2%');
      root.style.setProperty('--destructive-foreground', '210 40% 98%');
      root.style.setProperty('--border', '214.3 31.8% 91.4%');
      root.style.setProperty('--input', '214.3 31.8% 91.4%');
      root.style.setProperty('--ring', '221.2 83.2% 53.3%');
      
      // Remove any direct body styling that might cause white screen
      // Let Tailwind CSS handle the background via @apply bg-background
      document.body.style.background = '';
      document.body.style.minHeight = '';
      
      // Always use light theme sidebar colors
      document.documentElement.style.setProperty('--sidebar-bg', '#1f2937');
      document.documentElement.style.setProperty('--sidebar-text', '#ffffff');
      document.documentElement.style.setProperty('--sidebar-hover', 'rgba(55, 65, 81, 1)');
      document.documentElement.style.setProperty('--sidebar-active', 'rgba(37, 99, 235, 1)');
      
      // Always use light theme header colors
      document.documentElement.style.setProperty('--header-bg', '#ffffff');
      document.documentElement.style.setProperty('--header-text', '#111827');
      document.documentElement.style.setProperty('--header-border', '#e5e7eb');
      
      // Always enable hover effects (light mode)
      document.documentElement.style.setProperty('--hover-bg', 'rgba(0, 0, 0, 0.05)');
      document.documentElement.style.setProperty('--hover-text', 'inherit');
      
      // Don't save theme to localStorage since we're forcing light mode
      // localStorage.setItem('theme', 'light');
    };

    applyTheme();
  }, [theme]);

  // Override setTheme to prevent changing away from light mode
  const overrideSetTheme = (requestedTheme: Theme) => {
    // Always keep it as light, ignore the requested theme
    console.log(`Theme change to "${requestedTheme}" ignored - dark mode is disabled`);
    setTheme('light');
  };

  return (
    <ThemeContext.Provider value={{ theme: 'light', setTheme: overrideSetTheme, isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
};
