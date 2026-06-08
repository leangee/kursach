import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { axiosInstance } = useAuth();
  const serviceId = location.state?.serviceId;
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    car_model: '',
    car_license_plate: '',
    scheduled_date: '',
    notes: '',
  });

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      const response = await axiosInstance.get(`/services/${serviceId}/`);
      setService(response.data);
    } catch (err) {
      console.error('Error fetching service:', err);
      setError('Не удалось загрузить информацию об услуге');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    if (!formData.car_model) {
      setError('Введите марку и модель автомобиля');
      setSubmitting(false);
      return;
    }
    
    if (!formData.scheduled_date) {
      setError('Выберите дату и время');
      setSubmitting(false);
      return;
    }
    
    try {
      const data = {
        service: parseInt(serviceId),
        car_model: formData.car_model,
        car_license_plate: formData.car_license_plate,
        scheduled_date: new Date(formData.scheduled_date).toISOString(),
        notes: formData.notes,
      };
      
      console.log('Sending order:', data);
      
      const response = await axiosInstance.post('/orders/orders/', data);
      console.log('Order created:', response.data);
      
      setSuccess('Заказ успешно создан! Перенаправление...');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      console.error('Error creating order:', err.response?.data || err);
      setError(err.response?.data?.message || 'Ошибка создания заказа');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!service) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Услуга не найдена</Alert>
        <Button onClick={() => navigate('/services')}>Назад к услугам</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Оформление заказа</h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Alert variant="info">
                <strong>Выбранная услуга:</strong> {service.title}<br />
                <strong>Стоимость:</strong> {service.price} ₽<br />
                <strong>Длительность:</strong> {service.duration_minutes} минут
              </Alert>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Марка и модель автомобиля *</Form.Label>
                  <Form.Control
                    type="text"
                    name="car_model"
                    value={formData.car_model}
                    onChange={handleChange}
                    placeholder="Например: BMW X5 2020"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Государственный номер</Form.Label>
                  <Form.Control
                    type="text"
                    name="car_license_plate"
                    value={formData.car_license_plate}
                    onChange={handleChange}
                    placeholder="А123ВС 777"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Желаемая дата и время *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Выберите удобную дату и время для записи
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Комментарий к заказу</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Дополнительные пожелания..."
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => navigate('/services')}>
                    Назад к услугам
                  </Button>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Оформление...' : 'Оформить заказ'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateOrderPage;