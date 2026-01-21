import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Star, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';

const MyRecipesPage = ({ onNavigate }) => {
  const { token } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, recipeId: null, recipeName: '' });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      const response = await api.getUserRecipes(token);
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

  const handleDelete = async () => {
    try {
      const response = await api.deleteRecipe(deleteModal.recipeId, token);
      const data = await response.json();

      if (data.success) {
        setToast({ message: 'Recipe deleted successfully', type: 'success' });
        setRecipes(recipes.filter(r => r.id !== deleteModal.recipeId));
      } else {
        setToast({ message: 'Failed to delete recipe', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'An error occurred', type: 'error' });
    } finally {
      setDeleteModal({ isOpen: false, recipeId: null, recipeName: '' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Recipes</h1>
        <Button variant="primary" onClick={() => onNavigate('create-recipe')} className="flex items-center gap-2">
          <Plus size={20} />
          Add New Recipe
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 bg-gray-200 cursor-pointer" onClick={() => onNavigate('recipe-detail', recipe.id)}>
                {recipe.imageUrl ? (
                  <img src={`http://localhost:8080/${recipe.imageUrl}`} alt={recipe.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ChefHat size={64} className="text-gray-400" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{recipe.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>

                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span>{recipe.averageRating ? recipe.averageRating.toFixed(1) : '0.0'}</span>
                  <span>•</span>
                  <span>{recipe.reviewCount || 0} reviews</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => onNavigate('recipe-detail', recipe.id)} className="flex-1 text-sm py-2 flex items-center justify-center gap-1">
                    <Eye size={16} />
                    View
                  </Button>
                  <Button variant="secondary" onClick={() => onNavigate('edit-recipe', recipe.id)} className="flex-1 text-sm py-2 flex items-center justify-center gap-1">
                    <Edit size={16} />
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => setDeleteModal({ isOpen: true, recipeId: recipe.id, recipeName: recipe.title })}
                    className="px-3 py-2"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ChefHat size={64} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes yet</h3>
          <p className="text-gray-500 mb-4">Start sharing your favorite recipes with the community!</p>
          <Button variant="primary" onClick={() => onNavigate('create-recipe')}>
            Create Your First Recipe
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, recipeId: null, recipeName: '' })} title="Delete Recipe">
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete "<strong>{deleteModal.recipeName}</strong>"? This action cannot be undone.
        </p>
        <div className="flex gap-2">
          <Button variant="danger" onClick={handleDelete} className="flex-1">
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false, recipeId: null, recipeName: '' })} className="flex-1">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyRecipesPage;