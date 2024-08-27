import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                setProducts(response.data);
                setFilteredProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const filterProducts = (filters) => {
        let filtered = products;

        if (filters.category) {
            filtered = filtered.filter(product => product.category === filters.category);
        }

        if (filters.priceRange) {
            filtered = filtered.filter(product => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]);
        }

        setFilteredProducts(filtered);
    };

    return (
        <ProductContext.Provider value={{ products: filteredProducts, loading, filterProducts }}>
            {children}
        </ProductContext.Provider>
    );
};
