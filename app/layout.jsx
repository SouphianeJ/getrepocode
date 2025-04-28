// app/layout.jsx
import Navbar from './components/Navbar'; // Importez le composant Navbar
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        
          <Navbar />  {/* Utilisez le composant Navbar ici */}
          {children}
        
      </body>
    </html>
  );
}