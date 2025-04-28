// app/components/Navbar.jsx
'use client';
import Link from 'next/link';

export default function Navbar() {

  return (
    <nav style={{ background: '#1e1e1e', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' }}>
       <div> {/* Wrapper for left-side links */}
           <Link href="/" style={{ color: '#fff', marginRight: '15px', fontWeight: 'bold' }}>Home</Link>
       </div>

      
    </nav>
  );
}