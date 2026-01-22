import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChefHat, User, Clock, Star as StarIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';

const StarRating = ({ rating, onRatingChange, readonly = false, size = 24 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-all duration-200`}
        >
          <StarIcon
            size={size}
            className={`${(hover || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} transition-colors duration-200`}
          />
        </button>
      ))}
    </div>
  );
};

const RecipeDetailPage = ({ recipeId, onNavigate }) => {
  const { user, token } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [toast, setToast] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchRecipeAndReviews();
  }, [recipeId]);

  const fetchRecipeAndReviews = async () => {
    try {
      const [recipeData, reviewsData] = await Promise.all([
        api.getRecipeById(recipeId),
        api.getReviews(recipeId)
      ]);

      if (recipeData.success) setRecipe(recipeData.data);
      if (reviewsData.success) setReviews(reviewsData.data);
    } catch (error) {
      setToast({ message: error.message || 'Failed to load recipe', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      setToast({ message: 'Please login to leave a review', type: 'error' });
      return;
    }

    if (!reviewForm.comment.trim()) {
      setToast({ message: 'Please add a comment', type: 'error' });
      return;
    }

    try {
      const data = await api.createReview(recipeId, reviewForm, token);

      if (data.success) {
        setToast({ message: 'Review submitted successfully!', type: 'success' });
        setShowReviewModal(false);
        setReviewForm({ rating: 5, comment: '' });
        fetchRecipeAndReviews();
      }
    } catch (error) {
      setToast({ message: error.message || 'Failed to submit review', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-96 bg-gray-200 rounded-2xl skeleton"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <ChefHat size={64} className="text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-600">Recipe not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <button 
          onClick={() => onNavigate('recipes')} 
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Recipes</span>
        </button>

        {/* Recipe Image */}
        <div className="relative h-96 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl overflow-hidden mb-8 shadow-xl animate-fade-in">
          {recipe.imageUrl && !imageError ? (
            <img 
              src={`http://localhost:8080/${recipe.imageUrl}`} 
              alt={recipe.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChefHat size={120} className="text-orange-300 animate-float" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
        </div>

        {/* Recipe Info */}
        <div className="glass rounded-2xl p-8 mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            {recipe.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl">
              <User size={20} className="text-orange-500" />
              <span className="font-semibold">{recipe.userName}</span>
            </div>
            
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl">
              <StarRating rating={Math.round(recipe.averageRating || 0)} readonly size={20} />
              <span className="font-semibold">
                {recipe.averageRating ? recipe.averageRating.toFixed(1) : '0.0'} ({recipe.reviewCount || 0} reviews)
              </span>
            </div>

            <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl">
              <Clock size={20} className="text-green-500" />
              <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">{recipe.description}</p>
        </div>

        {/* Ingredients */}
        <div className="glass rounded-2xl p-8 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl">
              🥘
            </span>
            Ingredients
          </h2>
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-white bg-opacity-50 p-6 rounded-xl">
            {recipe.ingredients}
          </div>
        </div>

        {/* Steps */}
        <div className="glass rounded-2xl p-8 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl">
              📝
            </span>
            Instructions
          </h2>
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-white bg-opacity-50 p-6 rounded-xl">
            {recipe.steps}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="glass rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Reviews ({reviews.length})</h2>
            {user ? (
              <Button onClick={() => setShowReviewModal(true)} variant="primary">
                Write a Review
              </Button>
            ) : (
              <Button onClick={() => onNavigate('login')} variant="outline">
                Login to Review
              </Button>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white bg-opacity-60 rounded-xl p-6 hover:bg-opacity-80 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-lg text-gray-800">{review.userName}</div>
                      <StarRating rating={review.rating} readonly size={16} />
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && <p className="text-gray-700 leading-relaxed">{review.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white bg-opacity-50 rounded-xl">
              <StarIcon size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>

        {/* Review Modal */}
        <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Write a Review">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-3">Rating</label>
              <StarRating 
                rating={reviewForm.rating} 
                onRatingChange={(rating) => setReviewForm({ ...reviewForm, rating })} 
                size={40} 
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Comment</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Share your thoughts about this recipe..."
                rows={5}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSubmitReview} variant="primary" className="flex-1">
                Submit Review
              </Button>
              <Button onClick={() => setShowReviewModal(false)} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default RecipeDetailPage;