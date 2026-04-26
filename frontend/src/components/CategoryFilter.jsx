import { useState, useEffect } from 'react';
import { getCategories } from '../services/api';

const API_URL = 'http://localhost:8080';

function CategoryFilter({ selectedCategories, onCategoryChange }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    const handleCategoryClick = (categoryId) => {
        if (selectedCategories.includes(categoryId)) {
            onCategoryChange(selectedCategories.filter(id => id !== categoryId));
        } else {
            onCategoryChange([...selectedCategories, categoryId]);
        }
    };

    const clearFilters = () => {
        onCategoryChange([]);
    };

    if (loading) {
        return (
            <div className="category-filter">
                <p className="filter-loading">Cargando categorías...</p>
            </div>
        );
    }

    return (
        <div className="category-filter-container">
            <div className="category-filter-header">
                <h3>Filtrar por categoría</h3>
                {selectedCategories.length > 0 && (
                    <button className="clear-filters-btn" onClick={clearFilters}>
                        Limpiar filtros
                    </button>
                )}
            </div>
            <div className="category-filter-buttons">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`filter-category-btn ${selectedCategories.includes(cat.id) ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(cat.id)}>
                        <span>{cat.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CategoryFilter;