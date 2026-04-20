const API_URL = 'http://localhost:8080/api/products';

export const getProducts = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

export const createProduct = async (product) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: product,
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return response.json();
};


export const deleteProduct = async (id) => {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
};