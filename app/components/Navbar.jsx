// app/components/Navbar.jsx
'use client';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

export default function Navbar() {
  const { user, loadingAuth } = useAuth();

  return (
    <nav style={{ background: '#1e1e1e', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' }}>
       <div> {/* Wrapper for left-side links */}
           <Link href="/" style={{ color: '#fff', marginRight: '15px', fontWeight: 'bold' }}>Home</Link>
           <Link href="/ask" style={{ color: '#fff', marginRight: '15px' }}>Ask AI</Link>
            <Link href="/repocodefile" style={{ color: '#fff', marginRight: '15px' }}>About</Link>
           {user && ( // Optionally only show to logged-in users
             <Link href="/promptDB" style={{ color: '#fff', marginRight: '15px' }}>DB</Link>
           )}
       </div>

      <div> {/* Wrapper for right-side auth links */}
        {loadingAuth ? (
          <span style={{ color: '#aaa' }}>Chargement...</span>
        ) : user ? (
          <>
            <span style={{ color: "orange", marginRight: '10px' }}>{user.email}</span>
            <Link href="/logout" style={{ color: '#f0f0f0' }}>Déconnexion</Link>
          </>
        ) : (
          <Link href="/auth" style={{ color: '#f0f0f0' }}>Connexion</Link>
        )}
      </div>
    </nav>
  );
}