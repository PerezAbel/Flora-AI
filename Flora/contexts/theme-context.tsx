import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

export type ThemeMode = 'light' | 'dark';
export const themeColors = {
  dark: { bg: '#171A19', card: '#242A27', raised: '#303A34', mint: '#79CBA4', muted: '#A6B2AB', text: '#F4F7F4', line: '#3A4740', orange: '#EE8B36' },
  light: { bg: '#FFFFFF', card: '#F0F7F2', raised: '#DCEFE2', mint: '#287A4A', muted: '#65806E', text: '#15211A', line: '#D1E3D6', orange: '#C7671B' },
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
