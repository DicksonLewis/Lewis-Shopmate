import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm';
import { createOrder } from '../services/orderService';
import { clearCart } from '../services/cartService';

function CheckoutPage() {
  const navigate = useNavigate();

  const handleCheckout = async (shippingDetails, paymentMethod) => {
    const order = await createOrder(shippingDetails, paymentMethod);
    await clearCart();
    navigate(`/order/${order.id}`);
  };

  return <CheckoutForm onCheckout={handleCheckout} />;
}

export default CheckoutPage;
