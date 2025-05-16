// app/components/Navbar.jsx
'use client';
import Link from 'next/link';

export default function Navbar() {

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        RepoFileExporter
      </Link>
    </nav>
  );
}