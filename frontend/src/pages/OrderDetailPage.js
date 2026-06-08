import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';

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

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, axiosInstance } = useAuth();
  const { isConnected, notifications } = useWebSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (notifications.length > 0) {
      const lastNotification = notifications[0];
      if (lastNotification.message?.includes(`заказ #${id}`)) {
        fetchOrder();
      }
    }
  }, [notifications]);

  const fetchOrder = async () => {
    try {
      const response = await axiosInstance.get(`/orders/orders/${id}/`);
      setOrder(response.data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Не удалось загрузить данные заказа');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await axiosInstance.patch(`/orders/orders/${id}/`, { status: newStatus });
      fetchOrder();
    } catch (err) {
      setError('Ошибка обновления статуса');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Вы уверены, что хотите отменить заказ?')) {
      setUpdating(true);
      try {
        await axiosInstance.post(`/orders/orders/${id}/cancel/`);
        fetchOrder();
      } catch (err) {
        setError('Ошибка отмены заказа');
      } finally {
        setUpdating(false);
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error || 'Заказ не найдена'}</Alert>
        <Button onClick={() => navigate('/orders')}>Вернуться к списку</Button>
      </Container>
    );
  }

  const canEditStatus = user?.role === 'master' || user?.role === 'admin';
  const canCancel = order.status === 'pending' && (user?.role === 'client' || user?.role === 'admin');

  return (
    <Container className="mt-4 mb-5">
      <Button variant="link" onClick={() => navigate('/orders')} className="mb-3">
        ← Назад к заказам
      </Button>
      
      {isConnected && (
        <Alert variant="success" className="mb-3">
          🔌 Real-time уведомления активны. Статус заказа будет обновляться автоматически.
        </Alert>
      )}
      
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Заказ #{order.id}</h4>
              <Badge bg={statusColors[order.status]} pill>
                {statusLabels[order.status]}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h5>Информация об услуге</h5>
                  <p><strong>Услуга:</strong> {order.service_title}</p>
                  <p><strong>Стоимость:</strong> {order.service_price} ₽</p>
                  <p><strong>Запланировано на:</strong> {new Date(order.scheduled_date).toLocaleString()}</p>
                </Col>
                <Col md={6}>
                  <h5>Информация об авто</h5>
                  <p><strong>Марка/модель:</strong> {order.car_model}</p>
                  <p><strong>Госномер:</strong> {order.car_license_plate || 'не указан'}</p>
                </Col>
              </Row>
              
              {order.notes && (
                <>
                  <hr />
                  <h5>Комментарий к заказу</h5>
                  <p>{order.notes}</p>
                </>
              )}
            </Card.Body>
            <Card.Footer>
              <div className="d-flex gap-2">
                {canEditStatus && (
                  <>
                    {order.status === 'pending' && (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => handleStatusChange('confirmed')}
                        disabled={updating}
                      >
                        Подтвердить
                      </Button>
                    )}
                    {order.status === 'confirmed' && (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => handleStatusChange('in_progress')}
                        disabled={updating}
                      >
                        Начать выполнение
                      </Button>
                    )}
                    {order.status === 'in_progress' && (
                      <Button 
                        variant="success" 
                        size="sm" 
                        onClick={() => handleStatusChange('completed')}
                        disabled={updating}
                      >
                        Завершить
                      </Button>
                    )}
                  </>
                )}
                {canCancel && (
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={handleCancelOrder}
                    disabled={updating}
                  >
                    Отменить заказ
                  </Button>
                )}
              </div>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Информация</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Дата создания:</strong> {new Date(order.created_at).toLocaleString()}</p>
              <p><strong>Последнее обновление:</strong> {new Date(order.updated_at).toLocaleString()}</p>
              <p><strong>Клиент:</strong> {order.client_name}</p>
              {order.master_name && <p><strong>Мастер:</strong> {order.master_name}</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetailPage;
