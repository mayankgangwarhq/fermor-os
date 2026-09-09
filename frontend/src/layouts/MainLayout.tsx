import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { BottomNav } from '../components/layout/BottomNav';
import { BrandLogoIntro } from '../components/common/BrandLogoIntro';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [showSplash, setShowSplash] = React.useState(false);

  const getActivePage = () => {
    const path = location.pathname.replace('/', '');
    if (!path || path === 'dashboard') return 'dashboard';
    if (path.startsWith('farms')) return 'farm';
    if (path.startsWith('crops')) return 'crops';
    if (path.startsWith('disease')) return 'disease';
    if (path.startsWith('pest')) return 'pests';
    if (path.startsWith('early-warning') || path.startsWith('farmer/early-warning')) return 'early-warning';
    if (path.startsWith('hotspots') || path.startsWith('farmer/hotspots')) return 'hotspots';
    if (path.startsWith('follow-up') || path.startsWith('farmer/follow-up')) return 'follow-up';
    if (path.startsWith('official') || path.startsWith('farmer/official')) return 'official';
    if (path.startsWith('weather')) return 'weather';
    if (path.startsWith('alerts')) return 'alerts';
    if (path.startsWith('contact') || path.startsWith('farmer/contact')) return 'contact';
    if (path.startsWith('feedback') || path.startsWith('farmer/feedback')) return 'feedback';
    if (path.startsWith('profile')) return 'profile';
    if (path.startsWith('settings')) return 'settings';
    return path;
  };

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'farm':
      case 'farms':
        navigate('/farms');
        break;
      case 'crops':
        navigate('/crops');
        break;
      case 'crop_intel':
      case 'disease':
      case 'disease-detection':
        navigate('/disease-detection');
        break;
      case 'pests':
      case 'pest-monitoring':
        navigate('/pest-monitoring');
        break;
      case 'early-warning':
      case 'early_warning':
        navigate('/early-warning');
        break;
      case 'hotspots':
      case 'hotspot-map':
        navigate('/hotspots');
        break;
      case 'follow-up':
      case 'followup':
        navigate('/follow-up');
        break;
      case 'official':
      case 'official-dashboard':
        navigate('/official/dashboard');
        break;
      case 'weather':
        navigate('/weather');
        break;
      case 'alerts':
      case 'notifications':
        navigate('/alerts');
        break;
      case 'contact':
      case 'support':
        navigate('/contact');
        break;
      case 'feedback':
        navigate('/feedback');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'ai':
        navigate('/ai');
        break;
      case 'mandi':
      case 'mandi-rates':
        navigate('/mandi-rates');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'how-it-works':
        navigate('/how-it-works');
        break;
      case 'why-agrinext':
        navigate('/why-agrinext');
        break;
      case 'role-selection':
        navigate('/role-selection');
        break;
      case 'marketplace':
        navigate('/marketplace');
        break;
      case 'experts':
        navigate('/experts');
        break;
      case 'schemes':
        navigate('/schemes');
        break;
      case 'equipment':
        navigate('/equipment');
        break;
      case 'economics':
        navigate('/economics');
        break;
      case 'landing':
        navigate('/');
        break;
      default:
        navigate(`/${page}`);
    }
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: isDark ? '#0B1220' : '#f8fafc' }}>
      {showSplash && <BrandLogoIntro onComplete={() => setShowSplash(false)} />}
      <Header activePage={getActivePage()} onNavigate={handleNavigate} onReplayIntro={() => setShowSplash(true)} />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar activePage={getActivePage()} onNavigate={handleNavigate} />

        <main style={{ flex: 1, padding: '28px 20px', maxWidth: '1240px', margin: '0 auto', width: '100%', paddingBottom: '96px', minWidth: 0 }}>
          <Outlet context={{ onNavigate: handleNavigate }} />
        </main>
      </div>

      <BottomNav activePage={getActivePage()} onNavigate={handleNavigate} />
    </div>
  );
};
