import React, { useState, useEffect } from 'react';
import { ChefHat } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RecipesPage from './pages/recipes/RecipesPage';
import RecipeDetailPage from './pages/recipes/RecipeDetailPage';
import DashboardPage from './pages/user/DashboardPage';
import MyRecipesPage from './pages/user/MyRecipesPage';
import CreateRecipePage from './pages/recipes/CreateRecipePage';
import MyProfilePage from './pages/user/MyProfilePage';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState(null);
  const [queryParams, setQueryParams] = useState(null);
  const { user, loading } = useAuth();

  const handleNavigate = (page, params = null, query = null) => {
    setCurrentPage(page);
    setPageParams(params);
    setQueryParams(query);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    // Redirect to login if trying to access protected pages without auth
    const protectedPages = ['dashboard', 'my-recipes', 'create-recipe', 'edit-recipe', 'profile'];
    if (!loading && !user && protectedPages.includes(currentPage)) {
      setCurrentPage('login');
    }
  }, [user, loading, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChefHat size={64} className="text-orange-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'recipes':
        return <RecipesPage onNavigate={handleNavigate} searchQuery={queryParams?.search} />;
      case 'recipe-detail':
        return <RecipeDetailPage recipeId={pageParams} onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'my-recipes':
        return <MyRecipesPage onNavigate={handleNavigate} />;
      case 'create-recipe':
        return <CreateRecipePage onNavigate={handleNavigate} />;
      case 'edit-recipe':
        return <CreateRecipePage onNavigate={handleNavigate} editRecipeId={pageParams} />;
      case 'profile':
        return <MyProfilePage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;