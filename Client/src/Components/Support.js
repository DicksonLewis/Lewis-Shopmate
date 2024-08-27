import React, { useState, useEffect } from 'react';

const Support = () => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    const shopmateSupportMessages = [
        {
            header: '24/7 Support',
            text: 'Our support team is available 24/7 to assist you with any issues or inquiries you may have. Whether it’s a question about an order or technical support, we’re here to help.'
        },
        {
            header: 'Easy Returns',
            text: 'Not satisfied with your purchase? Shopmate offers a hassle-free return policy. Contact us within 30 days to initiate a return or exchange.'
        },
        {
            header: 'Order Tracking',
            text: 'Track your orders in real-time. Receive updates on your shipment and know exactly when your package will arrive.'
        },
        {
            header: 'Customer Feedback',
            text: 'Your feedback is valuable to us. Let us know how we can improve your shopping experience at Shopmate.'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prevIndex) =>
                prevIndex < shopmateSupportMessages.length - 1 ? prevIndex + 1 : 0
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [shopmateSupportMessages.length]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic here
        alert('Form submitted!');
    };

    return (
        <div className="support-container">
            <div className="message-form-container">
                <div className="message-container">
                    {shopmateSupportMessages.map((message, index) => (
                        index === currentMessageIndex && (
                            <div key={index} className="message">
                                <h2>{message.header}</h2>
                                <p>{message.text}</p>
                            </div>
                        )
                    ))}
                    <div className="additional-info">
                        <h3>About Shopmate</h3>
                        <p>At Shopmate, we are dedicated to providing the best shopping experience with top-notch customer service. Explore our wide range of products and enjoy seamless online shopping.</p>
                    </div>
                </div>
                <div className="form-container">
                    <h2>Contact Us</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="issue">Issue</label>
                            <input type="text" id="issue" className="form-control" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact">Preferred Contact Method</label>
                            <select id="contact" className="form-control" required>
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Your Email</label>
                            <input type="email" id="email" className="form-control" required />
                        </div>
                        <button type="submit" className="submit-btn">Submit</button>
                    </form>
                    <div className="additional-info">
                        <p>We appreciate your trust in us and look forward to serving you better.</p>
                        <button className="shop-now-btn">Shop Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
