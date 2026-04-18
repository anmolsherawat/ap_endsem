import React from 'react';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className="min-h-screen soft-gradient-bg">
      <section className="relative py-28 md:py-40">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800/40 border border-slate-700/30 mb-10">
              <span className="text-sm text-slate-400">✨ Premium Hostel Management</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-semibold mb-8 leading-tight">
              <span className="gradient-text">HostelMate</span>
            </h1>
            <p className={`text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Streamline your hostel operations with an elegant, intuitive, and powerful management system built for the future.
            </p>
            <div className="flex gap-5 justify-center flex-wrap">
              <a 
                href="/login" 
                className="btn-primary px-12 py-4.5 text-lg font-semibold text-white rounded-2xl"
              >
                Get Started
              </a>
              <a 
                href="#features" 
                className={`px-12 py-4.5 text-lg font-semibold rounded-2xl btn-ghost ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="text-center mb-20">
            <h2 className={`text-4xl md:text-5xl font-semibold mb-5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Powerful Features
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Everything you need to manage your hostel efficiently and beautifully
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: '🏠', 
                title: 'Room Management', 
                desc: 'Efficiently manage room allocations, track occupancy, and handle room assignments with real-time availability.' 
              },
              { 
                icon: '👥', 
                title: 'Student Management', 
                desc: 'Register students, allocate rooms, and manage student information with ease and clarity.' 
              },
              { 
                icon: '📝', 
                title: 'Complaint System', 
                desc: 'Submit and track complaints efficiently. Students can report issues and admins can resolve them quickly.' 
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="card-premium p-10 glow-border"
              >
                <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center text-3xl mb-7">
                  {feature.icon}
                </div>
                <h3 className={`text-2xl font-semibold mb-5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-auto max-w-5xl"></div>

      <section className="py-24 md:py-28">
        <div className="max-w-6xl mx-auto px-8 lg:px-12">
          <div className="text-center mb-20">
            <h2 className={`text-4xl md:text-5xl font-semibold mb-5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Why Choose HostelMate?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
            {[
              { icon: '📊', title: 'Analytics', desc: 'Comprehensive stats' },
              { icon: '🔒', title: 'Secure', desc: 'Role-based access' },
              { icon: '⚡', title: 'Fast', desc: 'Optimized performance' },
              { icon: '🎨', title: 'Beautiful', desc: 'Premium design' }
            ].map((item, i) => (
              <div 
                key={i} 
                className="card-premium p-8 text-center"
              >
                <div className="text-4xl mb-5">{item.icon}</div>
                <h3 className={`text-lg font-semibold mb-2.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {item.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
