import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Star } from 'lucide-react';
import { api } from '../services/api';
import RecipeCard from '../components/recipe/RecipeCard';
import Button from '../components/ui/Button';

const HomePage = ({ onNavigate }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await api.getRecipes(0, 6);
      const data = await response.json();
      if (data.success) {
        setRecipes(data.data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onNavigate('recipes', null, { search: searchQuery });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-linear-to-r from-orange-500 to-red-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Delicious Recipes</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">Share and explore amazing dishes from around the world</p>
          
          <div className="flex gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-6 py-4 rounded-lg text-gray-800 text-lg outline-none"
            />
            <Button variant="secondary" onClick={handleSearch} className="px-8 py-4 text-lg">
              <Search size={24} />
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Recipes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Latest Recipes</h2>
          <Button variant="outline" onClick={() => onNavigate('recipes')}>
            View All
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TastyRecipes?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-orange-500" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Share Recipes</h3>
              <p className="text-gray-600">Share your favorite recipes with the community</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-orange-500" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Rate & Review</h3>
              <p className="text-gray-600">Rate and review recipes from other users</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-orange-500" size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Discover</h3>
              <p className="text-gray-600">Find new and exciting recipes every day</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;