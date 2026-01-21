import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Toast from '../components/ui/Toast';

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
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editRecipeId) {
      fetchRecipe();
    }
  }, [editRecipeId]);

  const fetchRecipe = async () => {
    try {
      const response = await api.getRecipeById(editRecipeId);
      const data = await response.json();
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
      console.error('Error fetching recipe:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formDataToSend = new FormData();
    
    const recipeBlob = new Blob([JSON.stringify(formData)], { type: 'application/json' });
    formDataToSend.append('recipe', recipeBlob);
    
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      const response = editRecipeId
        ? await api.updateRecipe(editRecipeId, formDataToSend, token)
        : await api.createRecipe(formDataToSend, token);
      
      const data = await response.json();

      if (data.success) {
        setToast({ message: `Recipe ${editRecipeId ? 'updated' : 'created'} successfully!`, type: 'success' });
        setTimeout(() => onNavigate('my-recipes'), 1500);
      } else {
        setToast({ message: data.message || 'Operation failed', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'An error occurred', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <button onClick={() => onNavigate('my-recipes')} className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6">
        <ArrowLeft size={20} />
        Back to My Recipes
      </button>

      <h1 className="text-4xl font-bold mb-8">{editRecipeId ? 'Edit Recipe' : 'Create New Recipe'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Recipe Title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter recipe title"
          error={errors.title}
          required
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your recipe..."
          error={errors.description}
          rows={3}
          required
        />

        <Textarea
          label="Ingredients"
          value={formData.ingredients}
          onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
          placeholder="List ingredients (one per line)&#10;e.g.&#10;2 cups flour&#10;1 cup sugar&#10;3 eggs"
          error={errors.ingredients}
          rows={6}
          required
        />

        <Textarea
          label="Cooking Steps"
          value={formData.steps}
          onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
          placeholder="Describe the cooking steps...&#10;e.g.&#10;1. Preheat oven to 350°F&#10;2. Mix dry ingredients&#10;3. Add wet ingredients"
          error={errors.steps}
          rows={8}
          required
        />

        <div>
          <label className="block text-gray-700 font-medium mb-2">Recipe Image</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                  <p className="mt-4 text-gray-600">Click to change image</p>
                </div>
              ) : (
                <div>
                  <Upload size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click to upload recipe image</p>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
            {loading ? 'Saving...' : editRecipeId ? 'Update Recipe' : 'Create Recipe'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => onNavigate('my-recipes')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipePage;