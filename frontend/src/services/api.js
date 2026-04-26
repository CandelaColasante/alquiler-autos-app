const API_URL = 'http://localhost:8080';

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
            body: formData
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        
        const product = await response.json();
        return transformImageUrls(product);
    } catch (error) {
        console.error('Error en createProduct:', error);
        throw error;
    }
};

export const updateProduct = async (id, formData) => {
    try {
        const response = await fetch(`${API_URL}/api/products/${id}`, {
            method: 'PUT',
            body: formData
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        
        const product = await response.json();
        return transformImageUrls(product);
    } catch (error) {
        console.error('Error en updateProduct:', error);
        throw error;
    }
};


export const deleteProduct = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/products/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        
        if (response.status !== 204) {
            return await response.json();
        }
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
            headers: { 'Content-Type': 'application/json' },
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
            headers: { 'Content-Type': 'application/json' },
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
            method: 'DELETE'
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Error al crear categoría");
        }
        return await response.json();
    } catch (error) {
        console.error('Error en createCategory:', error);
        throw error;
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await fetch(`${API_URL}/api/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Error al actualizar categoría");
        }
        return await response.json();
    } catch (error) {
        console.error('Error en updateCategory:', error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/categories/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Error al eliminar categoría");
        }
        return await response.json();
    } catch (error) {
        console.error('Error en deleteCategory:', error);
        throw error;
    }
};