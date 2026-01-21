import React, { useState } from 'react';
import { ChefHat, Menu, X, Plus, LogOut } from 'lucide-react';
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

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <ChefHat className="text-orange-500" size={32} />
            <span className="text-2xl font-bold text-gray-800">Tasty<span className="text-orange-500">Recipes</span></span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => onNavigate('home')} className={`hover:text-orange-500 transition ${currentPage === 'home' ? 'text-orange-500 font-semibold' : 'text-gray-700'}`}>
              Home
            </button>
            <button onClick={() => onNavigate('recipes')} className={`hover:text-orange-500 transition ${currentPage === 'recipes' ? 'text-orange-500 font-semibold' : 'text-gray-700'}`}>
              Recipes
            </button>
            
            {user ? (
              <>
                <button onClick={() => onNavigate('dashboard')} className={`hover:text-orange-500 transition ${currentPage === 'dashboard' ? 'text-orange-500 font-semibold' : 'text-gray-700'}`}>
                  Dashboard
                </button>
                <button onClick={() => onNavigate('my-recipes')} className={`hover:text-orange-500 transition ${currentPage === 'my-recipes' ? 'text-orange-500 font-semibold' : 'text-gray-700'}`}>
                  My Recipes
                </button>
                <button onClick={() => onNavigate('profile')} className={`hover:text-orange-500 transition ${currentPage === 'profile' ? 'text-orange-500 font-semibold' : 'text-gray-700'}`}>
                  Profile
                </button>
                <Button variant="primary" onClick={() => onNavigate('create-recipe')} className="flex items-center gap-2">
                  <Plus size={20} />
                  Add Recipe
                </Button>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-600 transition flex items-center gap-2">
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => onNavigate('login')}>
                  Login
                </Button>
                <Button variant="primary" onClick={() => onNavigate('register')}>
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <button onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-orange-500">
                Home
              </button>
              <button onClick={() => { onNavigate('recipes'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-orange-500">
                Recipes
              </button>
              
              {user ? (
                <>
                  <button onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-orange-500">
                    Dashboard
                  </button>
                  <button onClick={() => { onNavigate('my-recipes'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-orange-500">
                    My Recipes
                  </button>
                  <button onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-orange-500">
                    Profile
                  </button>
                  <Button variant="primary" onClick={() => { onNavigate('create-recipe'); setMobileMenuOpen(false); }} className="w-full">
                    Add Recipe
                  </Button>
                  <button onClick={handleLogout} className="text-left text-red-500 hover:text-red-600">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }} className="w-full">
                    Login
                  </Button>
                  <Button variant="primary" onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }} className="w-full">
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