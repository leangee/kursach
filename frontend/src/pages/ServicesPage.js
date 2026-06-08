import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form, InputGroup, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSearch, FaClock, FaRubleSign, FaCar } from 'react-icons/fa';

const ServicesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, axiosInstance } = useAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        axiosInstance.get('/services/'),
        axiosInstance.get('/services/categories/')
      ]);
      
      const servicesData = servicesRes.data.results || servicesRes.data || [];
      const categoriesData = categoriesRes.data.results || categoriesRes.data || [];
      
      console.log('Services:', servicesData);
      console.log('Categories:', categoriesData);
      
      setServices(servicesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (serviceId) => {
    navigate('/create-order', { state: { serviceId: serviceId } });
  };

  // Фильтрация
  const filteredServices = services.filter(service => {
    // Проверка по категории (используем category или category_id)
    const serviceCatId = service.category_id || service.category;
    const matchesCategory = !selectedCategory || String(serviceCatId) === String(selectedCategory);
    
    // Проверка по поиску
    const matchesSearch = !searchTerm || 
      service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <div className="bg-light" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div className="bg-primary text-white py-4 mb-4">
        <Container>
          <h1 className="display-5 fw-bold mb-2">Наши услуги</h1>
          <p className="lead mb-0">Профессиональный детейлинг для вашего автомобиля</p>
        </Container>
      </div>

      <Container className="mb-5">
        <Row className="mb-4">
          <Col md={7}>
            <InputGroup>
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Поиск услуг..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={5}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Все категории</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* Отладка */}
        <div className="text-muted small mb-3">
          Найдено услуг: {filteredServices.length}
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <p className="text-muted mb-0">Услуги не найдены</p>
            {(selectedCategory || searchTerm) && (
              <Button variant="link" onClick={() => {
                setSelectedCategory('');
                setSearchTerm('');
              }}>
                Сбросить фильтры
              </Button>
            )}
          </div>
        ) : (
          <Row>
            {filteredServices.map(service => (
              <Col md={6} lg={4} key={service.id} className="mb-4">
                <Card className="h-100 shadow-sm border-0">
                  <div style={{ 
                    height: '200px', 
                    overflow: 'hidden',
                    borderRadius: '8px 8px 0 0'
                  }}>
                    {service.image ? (
                      <img 
                        src={service.image} 
                        alt={service.title}
                        style={{ 
                          height: '100%', 
                          width: '100%', 
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{ 
                        height: '100%', 
                        background: 'linear-gradient(135deg, #379683 0%, #2d7a6a 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaCar size={48} color="white" />
                      </div>
                    )}
                  </div>
                  <Card.Body>
                    <Card.Title>{service.title}</Card.Title>
                    <Card.Text className="text-muted small">
                      {service.category_title || 'Услуга'}
                    </Card.Text>
                    <Card.Text>
                      {service.description?.substring(0, 100)}...
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <Badge bg="primary" className="me-2">
                          <FaRubleSign className="me-1" /> {service.price}
                        </Badge>
                        <Badge bg="secondary">
                          <FaClock className="me-1" /> {service.duration_minutes} мин
                        </Badge>
                      </div>
                      {isAuthenticated ? (
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleOrderClick(service.id)}
                        >
                          Записаться
                        </Button>
                      ) : (
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => navigate('/login')}
                        >
                          Войти
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ServicesPage;