import React, { useState } from 'react';

function CheckoutForm({ onCheckout }) {
  const [shippingDetails, setShippingDetails] = useState({
    address: '',
    city: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  const handleChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCheckout(shippingDetails, paymentMethod);
  };

  const formStyle = {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  };

  const headingStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
  };

  const selectStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={headingStyle}>Shipping Details</h2>
      <input
        type="text"
        name="address"
        value={shippingDetails.address}
        onChange={handleChange}
        placeholder="Address"
        required
        style={inputStyle}
      />
      <input
        type="text"
        name="city"
        value={shippingDetails.city}
        onChange={handleChange}
        placeholder="City"
        required
        style={inputStyle}
      />
      <input
        type="text"
        name="postalCode"
        value={shippingDetails.postalCode}
        onChange={handleChange}
        placeholder="Postal Code"
        required
        style={inputStyle}
      />
      <h2 style={headingStyle}>Payment Method</h2>
      <select
        name="paymentMethod"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        style={selectStyle}
      >
        <option value="creditCard">Credit Card</option>
        <option value="paypal">PayPal</option>
        <option value="mpesa">M-Pesa</option>
      </select>
      <button
        type="submit"
        style={buttonStyle}
        onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
        onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
      >
        Complete Checkout
      </button>
    </form>
  );
}

export default CheckoutForm;
