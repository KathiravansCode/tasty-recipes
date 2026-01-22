import React, { useState } from 'react';
import { ChefHat, Star, User, MessageSquare, Clock } from 'lucide-react';

const RecipeCard = ({ recipe, onNavigate }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer card-hover animate-fade-in group"
      onClick={() => onNavigate('recipe-detail', recipe.id)}
    >
      {/* Image Container */}
      <div className="relative h-52 bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 skeleton" />
        )}
        
        {recipe.imageUrl && !imageError ? (
          <img 
            src={`http://localhost:8080/${recipe.imageUrl}`} 
            alt={recipe.title}
            className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat size={64} className="text-orange-300 animate-float" />
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white backdrop-blur-md bg-opacity-90 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          <Star size={16} className="fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-sm">
            {recipe.averageRating ? recipe.averageRating.toFixed(1) : '0.0'}
          </span>
        </div>

        {/* New Badge (if created within last 7 days) */}
        {new Date() - new Date(recipe.createdAt) < 7 * 24 * 60 * 60 * 1000 && (
          <div className="absolute top-3 left-3 badge badge-primary shadow-lg">
            New
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800 group-hover:text-orange-500 transition-colors duration-300">
          {recipe.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>
        
        {/* Meta Information */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg">
            <User size={16} className="text-orange-500" />
            <span className="font-medium">{recipe.userName}</span>
          </div>
          
          <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg">
            <MessageSquare size={16} className="text-blue-500" />
            <span>{recipe.reviewCount || 0}</span>
          </div>

          <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg">
            <Clock size={16} className="text-green-500" />
            <span>{formatDate(recipe.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;