import React, { useEffect, useState } from 'react';
import Cart from '../Components/Cart';
import { fetchCartItems, removeFromCart, clearCart } from '../api';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const items = await fetchCartItems();
      setCartItems(items);
    };
    fetchData();
  }, []);

  const handleRemove = async (id) => {
    await removeFromCart(id);
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Cart cartItems={cartItems} onRemove={handleRemove} onCheckout={handleCheckout} />
  );
}

export default CartPage;
