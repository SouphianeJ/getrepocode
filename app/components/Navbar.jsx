// app/components/Navbar.jsx
'use client';
import Link from 'next/link';

export default function Navbar() {

  return (
    <nav className="navbar">
      <Link href="https://myhub-gateway.vercel.app/" className="navbar-brand"></Link>
      <Link href="/" className="nav-item">
        Repo-FileExporter
      </Link>
    </nav>
  );
}