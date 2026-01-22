import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Star, TrendingUp } from 'lucide-react';
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
      const data = await api.getRecipes(0, 6);
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
      <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-24 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Discover Delicious Recipes
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Share and explore amazing dishes from around the world
          </p>
          
          {/* Search Bar */}
          <div className="flex gap-2 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <input
              type="text"
              placeholder="Search for recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-6 py-4 rounded-xl text-gray-800 text-lg outline-none backdrop-blur-md bg-white bg-opacity-90 focus:bg-opacity-100 transition-all duration-300 shadow-lg"
            />
            <Button 
              variant="glass" 
              onClick={handleSearch} 
              className="px-8 py-4 text-lg"
            >
              <Search size={24} />
            </Button>
          </div>
        </div>
      </div>

      {/* Latest Recipes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Latest Recipes</h2>
            <p className="text-gray-600">Fresh recipes from our community</p>
          </div>
          <Button variant="outline" onClick={() => onNavigate('recipes')}>
            View All
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-96 skeleton"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <div 
                key={recipe.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <RecipeCard recipe={recipe} onNavigate={onNavigate} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Why Choose TastyRecipes?</h2>
          <p className="text-center text-gray-600 mb-12">Join our community of food lovers</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen size={40} />,
                title: 'Share Recipes',
                description: 'Share your favorite recipes with the community',
                gradient: 'from-blue-400 to-blue-600'
              },
              {
                icon: <Star size={40} />,
                title: 'Rate & Review',
                description: 'Rate and review recipes from other users',
                gradient: 'from-yellow-400 to-orange-500'
              },
              {
                icon: <TrendingUp size={40} />,
                title: 'Discover',
                description: 'Find new and exciting recipes every day',
                gradient: 'from-green-400 to-emerald-600'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="glass rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-500 transform hover:scale-105 animate-fade-in group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`bg-gradient-to-br ${feature.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Share Your Recipes?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community and start sharing your culinary creations today
          </p>
          <Button 
            variant="glass" 
            onClick={() => onNavigate('register')}
            className="px-8 py-4 text-lg"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;