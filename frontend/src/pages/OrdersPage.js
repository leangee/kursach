import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const statusColors = {
  pending: 'warning',
  confirmed: 'info',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'danger',
};

const statusLabels = {
  pending: 'Новая',
  confirmed: 'Подтверждена',
  in_progress: 'В работе',
  completed: 'Выполнена',
  cancelled: 'Отменена',
};

const OrdersPage = () => {
  const { axiosInstance } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/orders/orders/');
      setOrders(response.data.results || response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      <h1 className="mb-4">Мои заказы</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {orders.length === 0 ? (
        <Alert variant="info">У вас пока нет заказов. Перейдите в раздел <Link to="/services">услуг</Link>, чтобы создать заказ.</Alert>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>№ заказа</th>
              <th>Услуга</th>
              <th>Автомобиль</th>
              <th>Дата записи</th>
              <th>Статус</th>
              <th>Стоимость</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.service_title}</td>
                <td>{order.car_model}</td>
                <td>{new Date(order.scheduled_date).toLocaleDateString()}</td>
                <td>
                  <Badge bg={statusColors[order.status]}>
                    {statusLabels[order.status]}
                  </Badge>
                </td>
                <td>{order.service_price} ₽</td>
                <td>
                  <Button as={Link} to={`/orders/${order.id}`} variant="outline-primary" size="sm">
                    Детали
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrdersPage;