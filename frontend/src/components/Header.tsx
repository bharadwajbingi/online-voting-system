import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Vote, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/voter/dashboard'} className="flex items-center">
              <Vote className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SecureVote</span>
            </Link>
            {title && <h1 className="ml-6 text-lg font-medium hidden sm:block">{title}</h1>}
          </div>
          
          {user && (
            <div className="flex items-center">
              <span className="mr-4 text-sm text-gray-700 hidden md:block">
                {user.role === 'admin' ? 'Admin' : 'Voter'}: {user.name}
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-1 hidden sm:inline-block">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;