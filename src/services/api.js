const API_BASE_URL = 'http://localhost:8080/api';

// Helper function for error handling
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to create headers with auth
const createHeaders = (token, contentType = 'application/json') => {
  const headers = {};
  
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const api = {
  // Auth endpoints
  register: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: createHeaders(null),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  login: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: createHeaders(null),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  deleteAccount: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
        method: 'DELETE',
        headers: createHeaders(token)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  },

  // Recipe endpoints
  getRecipes: async (page = 0, size = 12, sortBy = 'createdAt', direction = 'desc') => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Get recipes error:', error);
      throw error;
    }
  },
  
  searchRecipes: async (keyword, page = 0, size = 12) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Search recipes error:', error);
      throw error;
    }
  },
  
  getRecipeById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Get recipe by ID error:', error);
      throw error;
    }
  },
  
  createRecipe: async (formData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData // Don't set Content-Type for FormData
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Create recipe error:', error);
      throw error;
    }
  },
  
  updateRecipe: async (id, formData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData // Don't set Content-Type for FormData
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update recipe error:', error);
      throw error;
    }
  },
  
  deleteRecipe: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'DELETE',
        headers: createHeaders(token)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Delete recipe error:', error);
      throw error;
    }
  },

  // Review endpoints
  getReviews: async (recipeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/reviews`);
      return handleResponse(response);
    } catch (error) {
      console.error('Get reviews error:', error);
      throw error;
    }
  },
  
  createReview: async (recipeId, data, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/reviews`, {
        method: 'POST',
        headers: createHeaders(token),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Create review error:', error);
      throw error;
    }
  },
  
  updateReview: async (recipeId, reviewId, data, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: createHeaders(token),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update review error:', error);
      throw error;
    }
  },
  
  deleteReview: async (recipeId, reviewId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: createHeaders(token)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Delete review error:', error);
      throw error;
    }
  },

  // User endpoints
  getProfile: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: createHeaders(token)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
  
  getUserById: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  },
  
  updateProfile: async (data, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: createHeaders(token),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  changePassword: async (data, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: 'PUT',
        headers: createHeaders(token),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },
  
  getUserRecipes: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/recipes`, {
        headers: createHeaders(token)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get user recipes error:', error);
      throw error;
    }
  },
  
  getUserRecipesById: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/recipes`);
      return handleResponse(response);
    } catch (error) {
      console.error('Get user recipes by ID error:', error);
      throw error;
    }
  },
  
  getUserReviews: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/reviews`, {
        headers: createHeaders(token)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get user reviews error:', error);
      throw error;
    }
  }
};