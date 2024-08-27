import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Order from '../Components/Order';
import { fetchOrder } from '../services/orderService';

function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchOrder(id);
      setOrder(data);
    };
    fetchData();
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return <Order order={order} />;
}

export default OrderPage;
