import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast from '../../components/ui/Toast';

const Textarea = ({ label, error, className = '', ...props }) => (
  <div className="mb-4 animate-fade-in">
    {label && <label className="block text-gray-700 font-medium mb-2">{label}</label>}
    <textarea
      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300 resize-none backdrop-blur-sm bg-white bg-opacity-90 ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const CreateRecipePage = ({ onNavigate, editRecipeId = null }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    steps: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingRecipe, setFetchingRecipe] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editRecipeId) {
      fetchRecipe();
    }
  }, [editRecipeId]);

  const fetchRecipe = async () => {
    setFetchingRecipe(true);
    try {
      const data = await api.getRecipeById(editRecipeId);
      if (data.success) {
        const recipe = data.data;
        setFormData({
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          steps: recipe.steps
        });
        if (recipe.imageUrl) {
          setImagePreview(`http://localhost:8080/${recipe.imageUrl}`);
        }
      }
    } catch (error) {
      setToast({ message: error.message || 'Failed to fetch recipe', type: 'error' });
    } finally {
      setFetchingRecipe(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setToast({ message: 'Please select a valid image file', type: 'error' });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setToast({ message: 'Image size should be less than 10MB', type: 'error' });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.ingredients.trim()) {
      newErrors.ingredients = 'Ingredients are required';
    }
    if (!formData.steps.trim()) {
      newErrors.steps = 'Steps are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setToast({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Create a Blob from the recipe data and append as 'recipe' part
      const recipeBlob = new Blob([JSON.stringify(formData)], { 
        type: 'application/json' 
      });
      formDataToSend.append('recipe', recipeBlob);
      
      // Append image if exists
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      // Send request
      const data = editRecipeId
        ? await api.updateRecipe(editRecipeId, formDataToSend, token)
        : await api.createRecipe(formDataToSend, token);

      if (data.success) {
        setToast({ 
          message: `Recipe ${editRecipeId ? 'updated' : 'created'} successfully!`, 
          type: 'success' 
        });
        setTimeout(() => onNavigate('my-recipes'), 1500);
      }
    } catch (error) {
      setToast({ 
        message: error.message || 'An error occurred. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingRecipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <button 
          onClick={() => onNavigate('my-recipes')} 
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to My Recipes</span>
        </button>

        <div className="glass rounded-2xl p-8 shadow-xl animate-fade-in">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            {editRecipeId ? 'Edit Recipe' : 'Create New Recipe'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Recipe Title *"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Chocolate Chip Cookies"
              error={errors.title}
            />

            <Textarea
              label="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your delicious recipe..."
              error={errors.description}
              rows={3}
            />

            <Textarea
              label="Ingredients *"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="List ingredients (one per line)&#10;e.g.,&#10;2 cups all-purpose flour&#10;1 cup butter, softened&#10;3/4 cup sugar"
              error={errors.ingredients}
              rows={6}
            />

            <Textarea
              label="Cooking Steps *"
              value={formData.steps}
              onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
              placeholder="Describe the cooking steps...&#10;e.g.,&#10;1. Preheat oven to 350°F (175°C)&#10;2. Mix butter and sugar until creamy&#10;3. Add flour and mix well"
              error={errors.steps}
              rows={8}
            />

            {/* Image Upload */}
            <div className="animate-fade-in">
              <label className="block text-gray-700 font-medium mb-2">Recipe Image</label>
              
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden group">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-3">
                      <label htmlFor="image-upload" className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2">
                        <ImageIcon size={20} />
                        Change
                      </label>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                      >
                        <X size={20} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label 
                  htmlFor="image-upload" 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 cursor-pointer block group"
                >
                  <Upload size={48} className="text-gray-400 group-hover:text-orange-500 mx-auto mb-4 transition-colors duration-300" />
                  <p className="text-gray-600 group-hover:text-orange-500 font-medium transition-colors duration-300">
                    Click to upload recipe image
                  </p>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                </label>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                variant="primary" 
                className="flex-1" 
                loading={loading}
              >
                {editRecipeId ? 'Update Recipe' : 'Create Recipe'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => onNavigate('my-recipes')}
                className="px-8"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipePage;