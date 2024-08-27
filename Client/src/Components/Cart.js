import React from 'react';
import { useNavigate } from 'react-router-dom';

function Cart({ cartItems, onRemove, onCheckout }) {
  const navigate = useNavigate();

  const handleRemove = (id) => {
    onRemove(id);
  };

  const handleCheckout = () => {
    onCheckout();
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            <img src={item.imageUrl} alt={item.name} width="50" />
            <span>{item.name}</span>
            <span>{item.price} x {item.quantity}</span>
            <button onClick={() => handleRemove(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <h3>Total: ${getTotal()}</h3>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}

export default Cart;
