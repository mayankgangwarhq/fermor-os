import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false, className = '', size = 'md' }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
  const padding = size === 'sm' ? '4px 8px' : size === 'lg' ? '8px 16px' : '6px 12px';
  const minHeight = size === 'sm' ? '30px' : size === 'lg' ? '42px' : '36px';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`agrinext-theme-toggle ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        padding: padding,
        minHeight: minHeight,
        borderRadius: '10px',
        border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#fef08a' : '#475569',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '0.84rem',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease',
          transform: isDark ? 'rotate(15deg)' : 'rotate(0deg)',
        }}
      >
        {isDark ? (
          <Sun size={iconSize} color="#facc15" />
        ) : (
          <Moon size={iconSize} color="#0f172a" />
        )}
      </span>
      {showLabel && (
        <span style={{ color: isDark ? '#f8fafc' : '#334155', fontWeight: 700 }}>
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};
