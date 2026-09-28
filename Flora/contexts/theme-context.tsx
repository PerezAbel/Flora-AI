import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

export type ThemeMode = 'light' | 'dark';
export const themeColors = {
  dark: { bg: '#101B12', card: '#182317', raised: '#202D20', mint: '#4BB477', muted: '#A6B2AB', text: '#F4F7F4', line: '#304531', orange: '#EE8B36' },
  light: { bg: '#F7F5F0', card: '#FFFFFF', raised: '#EEECE6', mint: '#1E6B3B', muted: '#818477', text: '#2d2d2d', line: '#DEDAD2', orange: '#B95D16' },
} as const;

type ThemeContextValue = { mode: ThemeMode; colors: typeof themeColors.dark; setMode: (mode: ThemeMode) => void; toggle: () => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const value = useMemo<ThemeContextValue>(() => ({ mode, colors: themeColors[mode] as typeof themeColors.dark, setMode, toggle: () => setMode(value => value === 'dark' ? 'light' : 'dark') }), [mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('ThemeProvider is required');
  return value;
}
