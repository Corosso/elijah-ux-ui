import { useState, useEffect } from 'react';
import { AdminPanel } from '../components/AdminPanel';

export function AdminPage() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('admin-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('admin-theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => {
      // Restore public site preference on unmount
      const publicTheme = localStorage.getItem('theme');
      if (publicTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  return <AdminPanel isDark={isDark} toggleDark={toggleDark} />;
}
