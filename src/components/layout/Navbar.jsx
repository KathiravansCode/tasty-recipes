import React, { useState } from 'react';
import { ChefHat, Menu, X, Plus, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Navbar = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setMobileMenuOpen(false);
  };

  const NavLink = ({ page, children, mobile = false }) => {
    const isActive = currentPage === page;
    const baseClass = mobile 
      ? 'text-left py-3 px-4 rounded-lg transition-all duration-200'
      : 'transition-all duration-200 relative';
    
    const activeClass = mobile
      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold'
      : 'text-orange-500 font-semibold';
    
    const inactiveClass = mobile
      ? 'text-gray-700 hover:bg-orange-50'
      : 'text-gray-700 hover:text-orange-500';

    return (
      <button 
        onClick={() => { onNavigate(page); setMobileMenuOpen(false); }} 
        className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
      >
        {children}
        {!mobile && isActive && (
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
        )}
      </button>
    );
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => onNavigate('home')}
          >
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <ChefHat className="text-white" size={28} />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-gray-800">Tasty</span>
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Recipes</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink page="home">Home</NavLink>
            <NavLink page="recipes">Recipes</NavLink>
            
            {user ? (
              <>
                <NavLink page="dashboard">Dashboard</NavLink>
                <NavLink page="my-recipes">My Recipes</NavLink>
                
                {/* User Menu */}
                <div className="flex items-center gap-3">
                  <Button 
                    variant="primary" 
                    onClick={() => onNavigate('create-recipe')} 
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    <Plus size={20} />
                    Add Recipe
                  </Button>
                  
                  <button
                    onClick={() => onNavigate('profile')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
                  >
                    <UserIcon size={20} className="text-gray-700" />
                    <span className="font-medium text-gray-700">{user.name}</span>
                  </button>
                  
                  <button 
                    onClick={handleLogout} 
                    className="text-red-500 hover:text-red-600 transition-colors duration-200 p-2 hover:bg-red-50 rounded-lg"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => onNavigate('login')} className="px-6">
                  Login
                </Button>
                <Button variant="primary" onClick={() => onNavigate('register')} className="px-6">
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-orange-500 transition-colors duration-200 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            <div className="flex flex-col gap-2">
              <NavLink page="home" mobile>Home</NavLink>
              <NavLink page="recipes" mobile>Recipes</NavLink>
              
              {user ? (
                <>
                  <NavLink page="dashboard" mobile>Dashboard</NavLink>
                  <NavLink page="my-recipes" mobile>My Recipes</NavLink>
                  <NavLink page="profile" mobile>Profile</NavLink>
                  
                  <Button 
                    variant="primary" 
                    onClick={() => { onNavigate('create-recipe'); setMobileMenuOpen(false); }} 
                    className="w-full mt-2"
                  >
                    <Plus size={20} className="inline mr-2" />
                    Add Recipe
                  </Button>
                  
                  <button 
                    onClick={handleLogout} 
                    className="text-left text-red-500 hover:text-red-600 py-3 px-4 rounded-lg hover:bg-red-50 transition-all duration-200 mt-2"
                  >
                    <LogOut size={20} className="inline mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }} 
                    className="w-full mt-2"
                  >
                    Login
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }} 
                    className="w-full mt-2"
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;