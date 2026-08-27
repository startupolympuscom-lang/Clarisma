import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesBento from './components/ServicesBento';
import About from './components/About';
import TargetAudience from './components/TargetAudience';
import SpecializedPrograms from './components/SpecializedPrograms';
import Process from './components/Process';
import IkigaiChart from './components/IkigaiChart';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FounderPage from './components/FounderPage';
import RetreatsPage from './components/RetreatsPage';
import ShopPage from './components/ShopPage';
import Portal from './components/Portal';
import Login from './components/Login';
import Signup from './components/Signup';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Handle hash links
const HashLinkHandler = () => {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (hash && pathname === '/') {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [hash, pathname]);
  return null;
};

const HomePage: React.FC<{ onNavigate: (dest: string) => void }> = ({ onNavigate }) => {
  const [settings, setSettings] = React.useState<any>({});
  
  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to fetch settings', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <main className="flex flex-col gap-24 md:gap-32 pb-20">
      {settings.show_hero !== 'false' && <Hero />}
      {settings.show_about !== 'false' && <About onNavigate={onNavigate} />}
      {settings.show_services !== 'false' && <ServicesBento onNavigate={onNavigate} />}
      {settings.show_target_audience !== 'false' && <TargetAudience />}
      {settings.show_specialized_programs !== 'false' && <SpecializedPrograms />}
      {settings.show_process !== 'false' && <Process />}
      {settings.show_ikigai !== 'false' && <IkigaiChart />}
      {settings.show_testimonials !== 'false' && <Testimonials />}
      {settings.show_contact !== 'false' && <Contact />}
    </main>
  );
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (destination: string) => {
    if (destination === 'founder') {
      navigate('/founder');
    } else if (destination === 'retreats') {
      navigate('/retreats');
    } else if (destination === 'shop') {
      navigate('/shop');
    } else if (destination === 'admin') {
      navigate('/admin');
    } else if (destination === 'signup') {
      navigate('/signup');
    } else if (destination === 'home') {
      navigate('/');
    } else if (destination.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/' + destination);
      } else {
        const element = document.querySelector(destination);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-clarisma-red text-white selection:bg-clarisma-gold selection:text-clarisma-red overflow-x-hidden">
        <ScrollToTop />
        <HashLinkHandler />
        {/* Dynamic Background Gradients */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-clarisma-gold/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-clarisma-orange/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <Navbar 
            onNavigate={handleNavigation}
          />
          
          <Routes>
            <Route path="/" element={<HomePage onNavigate={handleNavigation} />} />
            <Route path="/founder" element={<FounderPage onBack={() => navigate('/')} />} />
            <Route path="/retreats" element={
              <RetreatsPage 
                onBack={() => navigate('/')} 
                onAdminAccess={() => navigate('/admin')}
              />
            } />
            <Route path="/shop" element={<ShopPage onBack={() => navigate('/')} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/portal" element={
              <Portal
                onBack={() => navigate('/')}
                onUnauthorized={() => navigate('/login')}
              />
            } />
            {/* Old admin link - send visitors to the new login */}
            <Route path="/admin" element={<Login />} />
            {/* Fallback to home */}
            <Route path="*" element={<HomePage onNavigate={handleNavigation} />} />
          </Routes>
          
          <Footer onNavigate={handleNavigation} />
        </div>
      </div>
    );
};

export default App;