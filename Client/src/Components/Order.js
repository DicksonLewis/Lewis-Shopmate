import React from 'react';

function OrderSummary({ order }) {
  return (
    <div>
      <h2>Order Summary</h2>
      <p>Order ID: {order.id}</p>
      <p>Total: ${order.total}</p>
      <p>Status: {order.status}</p>
      <h3>Shipping Details</h3>
      <p>{order.shippingDetails.address}</p>
      <p>{order.shippingDetails.city}</p>
      <p>{order.shippingDetails.postalCode}</p>
      <h3>Items</h3>
      <ul>
        {order.items.map(item => (
          <li key={item.id}>
            <span>{item.name}</span> - <span>{item.quantity} x ${item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderSummary;
