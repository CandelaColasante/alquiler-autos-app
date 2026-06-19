const API_URL = 'http://localhost:8080';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const transformImageUrls = (product) => {
  if (product && product.images && Array.isArray(product.images)) {
    product.images = product.images.map(img => {

      if (img.startsWith('http')) return img;
  
      if (img.startsWith('/uploads')) return `${API_URL}${img}`;
   
      return `${API_URL}/${img}`;
    });
  }
  return product;
};

const transformProductsList = (products) => {
  if (Array.isArray(products)) {
    return products.map(product => transformImageUrls(product));
  }
  return products;
};

export const getProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) {
            throw new Error('Error al obtener productos');
        }
        const products = await response.json();
  
        return transformProductsList(products);
    } catch (error) {
        console.error('Error en getProducts:', error);
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/products/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener el producto');
        }
        const product = await response.json();

        return transformImageUrls(product);
    } catch (error) {
        console.error('Error en getProductById:', error);
        throw error;
    }
};

export const createProduct = async (formData) => {
    try {
        const response = await fetch(`${API_URL}/api/products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en createProduct:', error);
        throw error;
    }
};

export const updateProduct = async (id, formData) => {
    try {
        const response = await fetch(`${API_URL}/api/products/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: formData
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en updateProduct:', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        if (response.status !== 204) return await response.json();
        return { message: 'Producto eliminado correctamente' };
    } catch (error) {
        console.error('Error en deleteProduct:', error);
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/api/categories`);
        if (!response.ok) {
            throw new Error('Error al obtener categorías');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getCategories:', error);
        throw error;
    }
};

export const getCategoryById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/categories/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener la categoría');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getCategoryById:', error);
        throw error;
    }
};

export const getFeatures = async () => {
    try {
        const response = await fetch(`${API_URL}/api/features`);
        if (!response.ok) throw new Error('Error al obtener características');
        return await response.json();
    } catch (error) {
        console.error('Error en getFeatures:', error);
        throw error;
    }
};

export const createFeature = async (featureData) => {
    try {
        const response = await fetch(`${API_URL}/api/features`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(featureData)
        });
        if (!response.ok) throw new Error('Error al crear característica');
        return await response.json();
    } catch (error) {
        console.error('Error en createFeature:', error);
        throw error;
    }
};

export const updateFeature = async (id, featureData) => {
    try {
        const response = await fetch(`${API_URL}/api/features/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(featureData)
        });
        if (!response.ok) throw new Error('Error al actualizar característica');
        return await response.json();
    } catch (error) {
        console.error('Error en updateFeature:', error);
        throw error;
    }
};

export const deleteFeature = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/features/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Error al eliminar característica');
        return await response.json();
    } catch (error) {
        console.error('Error en deleteFeature:', error);
        throw error;
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await fetch(`${API_URL}/api/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(categoryData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || data.error || "Error al crear categoría");
        return data;
    } catch (error) {
        console.error('Error en createCategory:', error);
        throw error;
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await fetch(`${API_URL}/api/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(categoryData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || data.error || "Error al actualizar categoría");
        return data;
    } catch (error) {
        console.error('Error en updateCategory:', error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/categories/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || data.error || "Error al eliminar categoría");
        return data;
    } catch (error) {
        console.error('Error en deleteCategory:', error);
        throw error;
    }
};

export const addFavorite = async (userId, productId) => {
    try {
        const response = await fetch(`${API_URL}/api/favorites/${productId}?userId=${userId}`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Error al agregar a favoritos");
        }
        return await response.json();
    } catch (error) {
        console.error('Error en addFavorite:', error);
        throw error;
    }
};

export const removeFavorite = async (userId, productId) => {
    try {
        const response = await fetch(`${API_URL}/api/favorites/${productId}?userId=${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Error al remover de favoritos");
        }
        return await response.json();
    } catch (error) {
        console.error('Error en removeFavorite:', error);
        throw error;
    }
};

export const checkFavorite = async (userId, productId) => {
    try {
        const response = await fetch(`${API_URL}/api/favorites/check/${productId}?userId=${userId}`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error("Error al verificar favorito");
        const data = await response.json();
        return data.isFavorite;
    } catch (error) {
        console.error('Error en checkFavorite:', error);
        return false;
    }
};

export const getUserFavorites = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/api/favorites?userId=${userId}`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error("Error al obtener favoritos");
        return await response.json();
    } catch (error) {
        console.error('Error en getUserFavorites:', error);
        throw error;
    }
};

export const getProductReviews = async (productId) => {
    try {
        const response = await fetch(`${API_URL}/api/products/${productId}/reviews`);
        if (!response.ok) throw new Error('Error al obtener reseñas');
        return await response.json();
    } catch (error) {
        console.error('Error en getProductReviews:', error);
        throw error;
    }
};

export const getReviewStats = async (productId) => {
    try {
        const response = await fetch(`${API_URL}/api/products/${productId}/reviews/stats`);
        if (!response.ok) throw new Error('Error al obtener estadísticas de reseñas');
        return await response.json();
    } catch (error) {
        console.error('Error en getReviewStats:', error);
        throw error;
    }
};

export const canUserReview = async (productId, userId) => {
    try {
        const response = await fetch(`${API_URL}/api/products/${productId}/reviews/can-review?userId=${userId}`);
        if (!response.ok) throw new Error('Error al verificar permisos de reseña');
        const data = await response.json();
        return data.canReview;
    } catch (error) {
        console.error('Error en canUserReview:', error);
        return false;
    }
};

export const createReview = async (productId, reviewData) => {
    try {
        const response = await fetch(`${API_URL}/api/products/${productId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(reviewData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al crear la reseña');
        return data;
    } catch (error) {
        console.error('Error en createReview:', error);
        throw error;
    }
};