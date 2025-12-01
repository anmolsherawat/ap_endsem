import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';

const Home = () => {
  const { darkMode } = useTheme();
  return (
    <div style={{ minHeight: '100vh', backgroundColor: darkMode ? '#111827' : '#fff' }}>
      <section style={{ position: 'relative', height: '600px', backgroundImage: "url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}></div>
        
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', backgroundColor: 'rgba(255, 107, 53, 0.95)', padding: '32px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', textAlign: 'center', color: 'white' }}>
            <img src="/logo.svg" alt="HostelMate" style={{ margin: '0 auto 10px', width: '150px', height: '75px', display: 'block' }} />
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>HostelMate</h1>
            <p style={{ fontSize: '20px' }}>Streamline your hostel operations with ease</p>
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 0', backgroundColor: '#111827' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', color: 'white' }}>
            <span style={{ color: '#FF6B35' }}>Hostel</span> Management Features
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginTop: '48px' }}>
            <div style={{ backgroundColor: '#1f2937', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ height: '192px', backgroundImage: "url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>Room Management</h3>
                <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6' }}>
                  Efficiently manage room allocations, track occupancy, and handle room assignments. 
                  View room availability and capacity in real-time.
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: '#1f2937', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ height: '192px', backgroundImage: "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>Student Management</h3>
                <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6' }}>
                  Register students, allocate rooms, and manage student information. 
                  Track student status and admission details easily.
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: '#1f2937', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ height: '192px', backgroundImage: "url('https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&q=80')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>Complaint System</h3>
                <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6' }}>
                  Submit and track complaints efficiently. Students can report issues 
                  and admins can resolve them quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 0', backgroundColor: darkMode ? '#1f2937' : '#f3f4f6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '48px', color: darkMode ? '#fff' : '#333' }}>
            Why Choose Our System?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: darkMode ? '#374151' : 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: darkMode ? '#fff' : '#111' }}>Digital Attendance</h3>
              <p style={{ color: darkMode ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>Track attendance digitally with real-time updates</p>
            </div>
            <div style={{ backgroundColor: darkMode ? '#374151' : 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: darkMode ? '#fff' : '#111' }}>Analytics Dashboard</h3>
              <p style={{ color: darkMode ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>Comprehensive statistics and visual reports</p>
            </div>
            <div style={{ backgroundColor: darkMode ? '#374151' : 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: darkMode ? '#fff' : '#111' }}>Secure & Safe</h3>
              <p style={{ color: darkMode ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>Role-based access control and data security</p>
            </div>
            <div style={{ backgroundColor: darkMode ? '#374151' : 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: darkMode ? '#fff' : '#111' }}>Fast & Efficient</h3>
              <p style={{ color: darkMode ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>Streamlined processes for better management</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
