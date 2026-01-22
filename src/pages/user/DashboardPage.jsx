import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, MessageSquare, User, Settings, Search, ChefHat } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import RecipeCard from '../../components/recipe/RecipeCard';
import Button from '../../components/ui/Button';

const DashboardPage = ({ onNavigate }) => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ recipes: 0, reviews: 0 });
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // FIX: Both API calls already return parsed data
      const [recipesData, reviewsData] = await Promise.all([
        api.getUserRecipes(token),
        api.getUserReviews(token)
      ]);

      if (recipesData.success) {
        setStats(prev => ({ ...prev, recipes: recipesData.data.length }));
        setRecentRecipes(recipesData.data.slice(0, 3));
      }
      if (reviewsData.success) {
        setStats(prev => ({ ...prev, reviews: reviewsData.data.length }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
      <p className="text-gray-600 mb-8">Here's what's happening with your recipes</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 mb-2">Total Recipes</p>
              <p className="text-4xl font-bold">{stats.recipes}</p>
            </div>
            <BookOpen size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 mb-2">Total Reviews</p>
              <p className="text-4xl font-bold">{stats.reviews}</p>
            </div>
            <MessageSquare size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 mb-2">Profile Status</p>
              <p className="text-2xl font-bold">Active</p>
            </div>
            <User size={40} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button variant="primary" onClick={() => onNavigate('create-recipe')} className="py-4 flex items-center justify-center gap-2">
            <Plus size={20} />
            Create Recipe
          </Button>
          <Button variant="outline" onClick={() => onNavigate('my-recipes')} className="py-4 flex items-center justify-center gap-2">
            <BookOpen size={20} />
            My Recipes
          </Button>
          <Button variant="outline" onClick={() => onNavigate('profile')} className="py-4 flex items-center justify-center gap-2">
            <Settings size={20} />
            Edit Profile
          </Button>
          <Button variant="outline" onClick={() => onNavigate('recipes')} className="py-4 flex items-center justify-center gap-2">
            <Search size={20} />
            Browse Recipes
          </Button>
        </div>
      </div>

      {/* Recent Recipes */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Recent Recipes</h2>
          <Button variant="outline" onClick={() => onNavigate('my-recipes')}>
            View All
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        ) : recentRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <ChefHat size={64} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes yet</h3>
            <p className="text-gray-500 mb-4">Start sharing your culinary creations!</p>
            <Button variant="primary" onClick={() => onNavigate('create-recipe')}>
              Create Your First Recipe
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;