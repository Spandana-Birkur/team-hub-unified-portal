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
  const [theme, setTheme] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      let shouldBeDark = false;
      
      if (theme === 'dark') {
        shouldBeDark = true;
      } else if (theme === 'system') {
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      setIsDark(shouldBeDark);
      
      if (shouldBeDark) {
        root.classList.add('dark');
        // Apply dark theme with purple gradient and bright white text
        root.style.setProperty('--background', '220 14% 8%'); // Very dark background
        root.style.setProperty('--foreground', '0 0% 100%'); // Pure white text
        root.style.setProperty('--card', '220 13% 10%'); // Dark card background
        root.style.setProperty('--card-foreground', '0 0% 100%'); // Pure white text
        root.style.setProperty('--popover', '220 13% 10%');
        root.style.setProperty('--popover-foreground', '0 0% 100%'); // Pure white text
        root.style.setProperty('--primary', '263 70% 50%'); // Purple primary
        root.style.setProperty('--primary-foreground', '0 0% 100%'); // Pure white text
        root.style.setProperty('--secondary', '215 32% 15%'); // Dark secondary
        root.style.setProperty('--secondary-foreground', '0 0% 100%'); // Pure white text
        root.style.setProperty('--muted', '215 32% 15%');
        root.style.setProperty('--muted-foreground', '0 0% 100%'); // Pure white text
        root.style.setProperty('--accent', '263 70% 40%'); // Darker purple accent
        root.style.setProperty('--accent-foreground', '0 0% 100%'); // Pure white text
        root.style.setProperty('--destructive', '0 63% 31%');
        root.style.setProperty('--destructive-foreground', '0 0% 100%'); // Pure white text
        root.style.setProperty('--border', '215 32% 20%');
        root.style.setProperty('--input', '215 32% 20%');
        root.style.setProperty('--ring', '263 70% 50%');
        
        // Apply gradient background to body
        document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f0f23 50%, #1a1a2e 75%, #2d1b69 100%)';
        document.body.style.minHeight = '100vh';
        
        // Update sidebar colors for dark theme
        document.documentElement.style.setProperty('--sidebar-bg', 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #2d1b69 100%)');
        document.documentElement.style.setProperty('--sidebar-text', '#ffffff');
        document.documentElement.style.setProperty('--sidebar-hover', 'transparent'); // No hover effect
        document.documentElement.style.setProperty('--sidebar-active', 'rgba(139, 92, 246, 0.4)');
        
        // Update header colors for dark theme
        document.documentElement.style.setProperty('--header-bg', 'linear-gradient(90deg, #1a1a2e 0%, #16213e 50%, #2d1b69 100%)');
        document.documentElement.style.setProperty('--header-text', '#ffffff');
        document.documentElement.style.setProperty('--header-border', 'rgba(139, 92, 246, 0.2)');
        
        // Disable hover effects in dark mode
        document.documentElement.style.setProperty('--hover-bg', 'transparent');
        document.documentElement.style.setProperty('--hover-text', '#ffffff');
      } else {
        root.classList.remove('dark');
        // Apply light theme
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
        
        // Reset body background for light theme
        document.body.style.background = '#f8fafc';
        
        // Reset sidebar colors for light theme
        document.documentElement.style.setProperty('--sidebar-bg', '#1f2937');
        document.documentElement.style.setProperty('--sidebar-text', '#ffffff');
        document.documentElement.style.setProperty('--sidebar-hover', 'rgba(55, 65, 81, 1)');
        document.documentElement.style.setProperty('--sidebar-active', 'rgba(37, 99, 235, 1)');
        
        // Reset header colors for light theme
        document.documentElement.style.setProperty('--header-bg', '#ffffff');
        document.documentElement.style.setProperty('--header-text', '#111827');
        document.documentElement.style.setProperty('--header-border', '#e5e7eb');
        
        // Enable hover effects in light mode
        document.documentElement.style.setProperty('--hover-bg', 'rgba(0, 0, 0, 0.05)');
        document.documentElement.style.setProperty('--hover-text', 'inherit');
      }
      
      localStorage.setItem('theme', theme);
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
