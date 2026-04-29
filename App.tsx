import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesBento from './components/ServicesBento';
import About from './components/About';
import TargetAudience from './components/TargetAudience';
import SpecializedPrograms from './components/SpecializedPrograms';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FounderPage from './components/FounderPage';
import RetreatsPage from './components/RetreatsPage';
import AdminPage from './components/AdminPage';

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

const HomePage: React.FC<{ onNavigate: (dest: string) => void }> = ({ onNavigate }) => (
  <main className="flex flex-col gap-24 md:gap-32 pb-20">
    <Hero />
    <About onNavigate={onNavigate} />
    <ServicesBento onNavigate={onNavigate} />
    <TargetAudience />
    <SpecializedPrograms />
    <Process />
    <Testimonials />
    <Contact />
  </main>
);

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Intro Music Effect
  useEffect(() => {
    // Energetic, short professional intro sound
    const introAudio = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_7368686d63.mp3'); 
    introAudio.volume = 0.4; // Set volume to 40% to be pleasant, not startling

    const playAudio = async () => {
      try {
        await introAudio.play();
      } catch (err) {
        // Autoplay was prevented by the browser. 
        // We add a one-time listener to play it on the first interaction.
        console.log("Autoplay prevented. Waiting for user interaction.");
        
        const enableAudio = () => {
          introAudio.play().catch(e => console.log("Audio play failed again", e));
          // Remove listeners once executed
          document.removeEventListener('click', enableAudio);
          document.removeEventListener('keydown', enableAudio);
          document.removeEventListener('touchstart', enableAudio);
        };

        document.addEventListener('click', enableAudio);
        document.addEventListener('keydown', enableAudio);
        document.addEventListener('touchstart', enableAudio);
      }
    };

    playAudio();
  }, []);

  const handleNavigation = (destination: string) => {
    if (destination === 'founder') {
      navigate('/founder');
    } else if (destination === 'retreats') {
      navigate('/retreats');
    } else if (destination === 'admin') {
      navigate('/admin');
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
            <Route path="/admin" element={<AdminPage onBack={() => navigate('/')} />} />
            {/* Fallback to home */}
            <Route path="*" element={<HomePage onNavigate={handleNavigation} />} />
          </Routes>
          
          <Footer />
        </div>
      </div>
    );
};

export default App;