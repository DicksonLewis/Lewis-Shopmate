import React, { useEffect, useState } from 'react';
import axios from 'axios';


function ProductCatalog() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [inStock, setInStock] = useState(false);
    const [sortBy, setSortBy] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, [name, category, minPrice, maxPrice, inStock, sortBy, page]);

    const fetchProducts = async () => {
        const response = await axios.get('/products', {
            params: {
                name,
                category,
                min_price: minPrice,
                max_price: maxPrice,
                in_stock: inStock ? '1' : '',
                sort_by: sortBy,
                page
            }
        });
        setProducts(response.data.products);
        setTotalPages(response.data.total_pages);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <select onChange={(e) => setCategory(e.target.value)} value={category}>
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home</option>
                    {/* Add more categories as needed */}
                </select>

                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />

                <label>
                    <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                    />
                    In Stock Only
                </label>

                <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
                    <option value="">Sort By</option>
                    <option value="price">Price</option>
                    <option value="popularity">Popularity</option>
                </select>
            </div>

            <div className="product-list">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <img src={product.image_url} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>${product.price}</p>
                        <p>{product.availability ? 'In Stock' : 'Out of Stock'}</p>
                    </div>
                ))}
            </div>

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        disabled={page === index + 1}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ProductCatalog;
