import { useTheme } from '../context/ThemeContext';

const LIGHT = {
  pageBg: '#F0F4F8',
  cardBg: '#FFFFFF',
  cardBgAlt: '#F8FAFC',
  cardBorder: '#E2E8F0',
  cardShadow: '0 1px 3px rgba(15,23,42,0.05), 0 4px 16px rgba(15,23,42,0.04)',
  cardShadowHover: '0 8px 32px rgba(15,23,42,0.10)',
  text: '#0F172A',
  textSec: '#475569',
  textMuted: '#94A3B8',
  inputBg: '#F8FAFC',
  inputBorder: '#CBD5E1',
  divider: '#F1F5F9',
  // primary indigo
  primary: '#6366F1',
  primaryHover: '#4F46E5',
  primaryBg: '#EEF2FF',
  primaryText: '#4338CA',
  primaryGrad: 'linear-gradient(135deg,#6366F1,#4F46E5)',
  // teal
  teal: '#0D9488',
  tealBg: '#F0FDFA',
  tealText: '#0F766E',
  tealGrad: 'linear-gradient(135deg,#14B8A6,#0D9488)',
  // success
  success: '#10B981',
  successBg: '#ECFDF5',
  successText: '#065F46',
  successGrad: 'linear-gradient(135deg,#34D399,#10B981)',
  // warning
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  warningText: '#92400E',
  warningGrad: 'linear-gradient(135deg,#FBBF24,#F59E0B)',
  // danger
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  dangerText: '#991B1B',
  dangerGrad: 'linear-gradient(135deg,#F87171,#EF4444)',
  // violet
  violet: '#8B5CF6',
  violetBg: '#F5F3FF',
  violetText: '#5B21B6',
  violetGrad: 'linear-gradient(135deg,#A78BFA,#8B5CF6)',
};

const DARK = {
  pageBg: '#0B1120',
  cardBg: '#1E293B',
  cardBgAlt: '#162032',
  cardBorder: '#334155',
  cardShadow: '0 1px 3px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.18)',
  cardShadowHover: '0 8px 32px rgba(0,0,0,0.35)',
  text: '#F1F5F9',
  textSec: '#94A3B8',
  textMuted: '#64748B',
  inputBg: '#0F172A',
  inputBorder: '#334155',
  divider: '#1E293B',
  primary: '#818CF8',
  primaryHover: '#6366F1',
  primaryBg: 'rgba(99,102,241,0.14)',
  primaryText: '#A5B4FC',
  primaryGrad: 'linear-gradient(135deg,#6366F1,#4F46E5)',
  teal: '#2DD4BF',
  tealBg: 'rgba(20,184,166,0.14)',
  tealText: '#5EEAD4',
  tealGrad: 'linear-gradient(135deg,#14B8A6,#0D9488)',
  success: '#34D399',
  successBg: 'rgba(16,185,129,0.14)',
  successText: '#6EE7B7',
  successGrad: 'linear-gradient(135deg,#34D399,#10B981)',
  warning: '#FBBF24',
  warningBg: 'rgba(245,158,11,0.14)',
  warningText: '#FCD34D',
  warningGrad: 'linear-gradient(135deg,#FBBF24,#F59E0B)',
  danger: '#F87171',
  dangerBg: 'rgba(239,68,68,0.14)',
  dangerText: '#FCA5A5',
  dangerGrad: 'linear-gradient(135deg,#F87171,#EF4444)',
  violet: '#A78BFA',
  violetBg: 'rgba(139,92,246,0.14)',
  violetText: '#C4B5FD',
  violetGrad: 'linear-gradient(135deg,#A78BFA,#8B5CF6)',
};

export function useTokens() {
  const { theme } = useTheme();
  return theme === 'dark' ? DARK : LIGHT;
}
