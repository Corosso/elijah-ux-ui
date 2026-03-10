import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDarkMode } from './hooks/useDarkMode';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { LegalPage } from './pages/LegalPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  const [isDark, toggleDark] = useDarkMode();
  const [user, setUser] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-gold/30 selection:text-gold-hover">
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar isDark={isDark} toggleDark={toggleDark} user={user} onLogin={() => setUser("Test User")} onLogout={() => setUser(null)} />
              <HomePage isDark={isDark} />
              <Footer />
            </>
          }
        />
        <Route
          path="/legal"
          element={
            <>
              <Navbar isDark={isDark} toggleDark={toggleDark} user={user} onLogin={() => setUser("Test User")} onLogout={() => setUser(null)} />
              <LegalPage />
              <Footer />
            </>
          }
        />
        <Route path="/admin-panel-97x" element={<AdminPage />} />
      </Routes>
    </div>
  );
}
