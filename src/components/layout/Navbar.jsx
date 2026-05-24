import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { onNavigate(page); setMobileMenuOpen(false); }}
        className={`relative px-4 py-2 font-medium transition-colors duration-300 ${
          mobile ? 'w-full text-left' : ''
        } ${isActive ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}`}
      >
        {children}
        {!mobile && isActive && (
          <motion.div
            layoutId="navbar-indicator"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
            initial={false}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </motion.button>
    );
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-card sticky top-0 z-50 border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50" />
              <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-2xl">
                <ChefHat className="text-white" size={28} />
              </div>
            </motion.div>
            <span className="text-2xl font-bold">
              <span className="gradient-text">Tasty</span>
              <span className="text-gray-800">Recipes</span>
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink page="home">Home</NavLink>
            <NavLink page="recipes">Recipes</NavLink>
            
            {user ? (
              <>
                <NavLink page="dashboard">Dashboard</NavLink>
                <NavLink page="my-recipes">My Recipes</NavLink>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="primary"
                    onClick={() => onNavigate('create-recipe')}
                    className="flex items-center gap-2 ml-2"
                  >
                    <Plus size={18} />
                    New Recipe
                  </Button>
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('profile')}
                  className="flex items-center gap-2 px-4 py-2 ml-2 glass rounded-xl hover:bg-white/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <UserIcon size={16} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-800">{user.name}</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors ml-2"
                  title="Logout"
                >
                  <LogOut size={20} />
                </motion.button>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" onClick={() => onNavigate('login')}>
                    Login
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="primary" onClick={() => onNavigate('register')}>
                    Register
                  </Button>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-white/20"
            >
              <div className="flex flex-col gap-2">
                <NavLink page="home" mobile>Home</NavLink>
                <NavLink page="recipes" mobile>Recipes</NavLink>
                
                {user ? (
                  <>
                    <NavLink page="dashboard" mobile>Dashboard</NavLink>
                    <NavLink page="my-recipes" mobile>My Recipes</NavLink>
                    <NavLink page="profile" mobile>Profile</NavLink>
                    
                    <motion.div whileTap={{ scale: 0.95 }} className="mt-2">
                      <Button
                        variant="primary"
                        onClick={() => { onNavigate('create-recipe'); setMobileMenuOpen(false); }}
                        className="w-full"
                      >
                        <Plus size={20} className="inline mr-2" />
                        New Recipe
                      </Button>
                    </motion.div>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="text-left text-red-500 hover:bg-red-50 py-3 px-4 rounded-xl transition-colors mt-2"
                    >
                      <LogOut size={20} className="inline mr-2" />
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.div whileTap={{ scale: 0.95 }} className="mt-2">
                      <Button
                        variant="outline"
                        onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                        className="w-full"
                      >
                        Login
                      </Button>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="primary"
                        onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }}
                        className="w-full"
                      >
                        Register
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;