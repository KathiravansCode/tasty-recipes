import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChefHat, User, Clock, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Textarea from '../components/ui/Textarea';
import StarRating from '../components/ui/StarRating';
import Toast from '../components/ui/Toast';

const RecipeDetailPage = ({ recipeId, onNavigate }) => {
  const { user, token } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchRecipeAndReviews();
  }, [recipeId]);

  const fetchRecipeAndReviews = async () => {
    try {
      const [recipeRes, reviewsRes] = await Promise.all([
        api.getRecipeById(recipeId),
        api.getReviews(recipeId)
      ]);

      const recipeData = await recipeRes.json();
      const reviewsData = await reviewsRes.json();

      if (recipeData.success) setRecipe(recipeData.data);
      if (reviewsData.success) setReviews(reviewsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      setToast({ message: 'Please login to leave a review', type: 'error' });
      return;
    }

    try {
      const response = await api.createReview(recipeId, reviewForm, token);
      const data = await response.json();

      if (data.success) {
        setToast({ message: 'Review submitted successfully!', type: 'success' });
        setShowReviewModal(false);
        setReviewForm({ rating: 5, comment: '' });
        fetchRecipeAndReviews();
      } else {
        setToast({ message: data.message || 'Failed to submit review', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'An error occurred', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-600">Recipe not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <button onClick={() => onNavigate('recipes')} className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6">
        <ArrowLeft size={20} />
        Back to Recipes
      </button>

      {/* Recipe Image */}
      <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-8">
        {recipe.imageUrl ? (
          <img src={`http://localhost:8080/${recipe.imageUrl}`} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat size={120} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* Recipe Info */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <User size={20} className="text-gray-500" />
            <span className="text-gray-700">By <span className="font-semibold">{recipe.userName}</span></span>
          </div>
          
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(recipe.averageRating || 0)} readonly size={20} />
            <span className="text-gray-700">{recipe.averageRating ? recipe.averageRating.toFixed(1) : '0.0'} ({recipe.reviewCount || 0} reviews)</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={20} className="text-gray-500" />
            <span className="text-gray-700">{new Date(recipe.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed">{recipe.description}</p>
      </div>

      {/* Ingredients */}
      <div className="bg-orange-50 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        <div className="whitespace-pre-wrap text-gray-700">{recipe.ingredients}</div>
      </div>

      {/* Steps */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Instructions</h2>
        <div className="whitespace-pre-wrap text-gray-700">{recipe.steps}</div>
      </div>

      {/* Reviews Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
          {user && (
            <Button onClick={() => setShowReviewModal(true)} variant="primary">
              Write a Review
            </Button>
          )}
          {!user && (
            <Button onClick={() => onNavigate('login')} variant="outline">
              Login to Review
            </Button>
          )}
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold">{review.userName}</div>
                    <StarRating rating={review.rating} readonly size={16} />
                  </div>
                  <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                {review.comment && <p className="text-gray-700">{review.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>

      {/* Review Modal */}
      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Write a Review">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Rating</label>
          <StarRating rating={reviewForm.rating} onRatingChange={(rating) => setReviewForm({ ...reviewForm, rating })} size={32} />
        </div>

        <Textarea
          label="Comment (Optional)"
          value={reviewForm.comment}
          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
          placeholder="Share your thoughts about this recipe..."
          rows={4}
        />

        <div className="flex gap-2">
          <Button onClick={handleSubmitReview} variant="primary" className="flex-1">
            Submit Review
          </Button>
          <Button onClick={() => setShowReviewModal(false)} variant="secondary">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RecipeDetailPage;