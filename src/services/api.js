const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  // Auth endpoints
  register: (data) => fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  
  login: (data) => fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  
  deleteAccount: (token) => fetch(`${API_BASE_URL}/auth/delete-account`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }),

  // Recipe endpoints
  getRecipes: (page = 0, size = 12, sortBy = 'createdAt', direction = 'desc') => 
    fetch(`${API_BASE_URL}/recipes?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`),
  
  searchRecipes: (keyword, page = 0, size = 12) => 
    fetch(`${API_BASE_URL}/recipes/search?keyword=${keyword}&page=${page}&size=${size}`),
  
  getRecipeById: (id) => fetch(`${API_BASE_URL}/recipes/${id}`),
  
  createRecipe: (formData, token) => fetch(`${API_BASE_URL}/recipes`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  }),
  
  updateRecipe: (id, formData, token) => fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  }),
  
  deleteRecipe: (id, token) => fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }),

  // Review endpoints
  getReviews: (recipeId) => fetch(`${API_BASE_URL}/recipes/${recipeId}/reviews`),
  
  createReview: (recipeId, data, token) => fetch(`${API_BASE_URL}/recipes/${recipeId}/reviews`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  }),
  
  updateReview: (recipeId, reviewId, data, token) => fetch(`${API_BASE_URL}/recipes/${recipeId}/reviews/${reviewId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  }),
  
  deleteReview: (recipeId, reviewId, token) => fetch(`${API_BASE_URL}/recipes/${recipeId}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }),

  // User endpoints
  getProfile: (token) => fetch(`${API_BASE_URL}/users/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  
  getUserById: (userId) => fetch(`${API_BASE_URL}/users/${userId}`),
  
  updateProfile: (data, token) => fetch(`${API_BASE_URL}/users/profile`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  }),
  
  changePassword: (data, token) => fetch(`${API_BASE_URL}/users/change-password`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  }),
  
  getUserRecipes: (token) => fetch(`${API_BASE_URL}/users/recipes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  
  getUserRecipesById: (userId) => fetch(`${API_BASE_URL}/users/${userId}/recipes`),
  
  getUserReviews: (token) => fetch(`${API_BASE_URL}/users/reviews`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
};