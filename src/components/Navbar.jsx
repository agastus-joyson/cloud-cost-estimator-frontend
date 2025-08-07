import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600';

  return (
    <nav className="bg-white shadow-md py-4 mb-14">
      <div className="container mx-auto flex justify-center gap-10">
        <Link to="/" className={`text-lg ${isActive('/')}`}>
          Home
        </Link>
        <Link to="/history" className={`text-lg ${isActive('/history')}`}>
          History
        </Link>
      </div>
    </nav>
  );
}