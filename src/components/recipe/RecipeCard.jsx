import React from 'react';
import { ChefHat, Star, User, MessageSquare } from 'lucide-react';

const RecipeCard = ({ recipe, onNavigate }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer" onClick={() => onNavigate('recipe-detail', recipe.id)}>
    <div className="relative h-48 bg-gray-200">
      {recipe.imageUrl ? (
        <img src={`http://localhost:8080/${recipe.imageUrl}`} alt={recipe.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ChefHat size={64} className="text-gray-400" />
        </div>
      )}
      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center gap-1">
        <Star size={16} className="fill-yellow-400 text-yellow-400" />
        <span className="font-semibold text-sm">{recipe.averageRating ? recipe.averageRating.toFixed(1) : '0.0'}</span>
      </div>
    </div>
    
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2 line-clamp-2">{recipe.title}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <User size={16} />
          <span>{recipe.userName}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare size={16} />
          <span>{recipe.reviewCount || 0} reviews</span>
        </div>
      </div>
    </div>
  </div>
);

export default RecipeCard;