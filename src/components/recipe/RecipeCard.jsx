import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Star, User, MessageSquare, Clock, Eye } from 'lucide-react';

const RecipeCard = ({ recipe, onNavigate }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={() => onNavigate('recipe-detail', recipe.id)}
      className="modern-card cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative h-56 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 skeleton" />
        )}
        
        {recipe.imageUrl && !imageError ? (
          <motion.img
            src={`http://localhost:8080/${recipe.imageUrl}`}
            alt={recipe.title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full flex items-center justify-center"
          >
            <ChefHat size={64} className="text-purple-300" />
          </motion.div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Floating Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="absolute top-4 right-4 glass-dark px-4 py-2 rounded-full flex items-center gap-2 shadow-xl"
        >
          <Star size={16} className="fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-sm text-white">
            {recipe.averageRating ? recipe.averageRating.toFixed(1) : '0.0'}
          </span>
        </motion.div>

        {/* New Badge */}
        {new Date() - new Date(recipe.createdAt) < 7 * 24 * 60 * 60 * 1000 && (
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="absolute top-4 left-4 badge-primary shadow-lg"
          >
            ✨ New
          </motion.div>
        )}

        {/* Hover View Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="bg-white/90 p-4 rounded-full">
            <Eye size={32} className="text-purple-600" />
          </div>
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <motion.h3
          className="font-bold text-xl mb-2 line-clamp-2 text-gray-800 group-hover:gradient-text transition-all duration-300"
        >
          {recipe.title}
        </motion.h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>
        
        {/* Meta Information */}
        <div className="flex flex-wrap gap-2 text-sm">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 glass px-3 py-2 rounded-lg"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <User size={12} className="text-white" />
            </div>
            <span className="font-medium text-gray-700">{recipe.userName}</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 glass px-3 py-2 rounded-lg"
          >
            <MessageSquare size={16} className="text-blue-500" />
            <span className="text-gray-700">{recipe.reviewCount || 0}</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 glass px-3 py-2 rounded-lg"
          >
            <Clock size={16} className="text-green-500" />
            <span className="text-gray-700">{formatDate(recipe.createdAt)}</span>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </motion.div>
  );
};

export default RecipeCard;