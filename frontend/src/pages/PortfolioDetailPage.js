import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Breadcrumb } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { FaCalendarAlt, FaEye, FaArrowLeft, FaUser, FaCar } from 'react-icons/fa';

const PortfolioDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axiosInstance, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
    incrementViews();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get(`/orders/car-posts/${id}/`);
      setPost(response.data);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Не удалось загрузить работу');
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      await axiosInstance.post(`/orders/car-posts/${id}/increment_views/`);
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Загрузка...</p>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error || 'Работа не найдена'}</Alert>
        <Button onClick={() => navigate('/portfolio')}>Назад к портфолио</Button>
      </Container>
    );
  }

  return (
    <div className="bg-light" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <Container className="py-4">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Главная</Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/portfolio' }}>Портфолио</Breadcrumb.Item>
          <Breadcrumb.Item active>{post.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Button 
          variant="link" 
          onClick={() => navigate('/portfolio')} 
          className="mb-3 text-decoration-none"
        >
          <FaArrowLeft className="me-1" /> Назад к портфолио
        </Button>

        <Row>
          <Col lg={8}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body className="p-4">
                <h1 className="display-6 fw-bold mb-3">{post.title}</h1>
                
                <div className="d-flex flex-wrap gap-3 mb-4 text-muted">
                  <div><FaCalendarAlt className="me-1" /> {new Date(post.created_at).toLocaleDateString('ru-RU')}</div>
                  <div><FaEye className="me-1" /> {post.views || 0} просмотров</div>
                  {post.author_name && <div><FaUser className="me-1" /> {post.author_name}</div>}
                </div>

                {/* Фото ДО и ПОСЛЕ */}
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="text-center">
                      <div 
                        style={{ 
                          height: '250px', 
                          background: '#2c3e50', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          overflow: 'hidden'
                        }}
                      >
                        {post.before_photo ? (
                          <img 
                            src={post.before_photo} 
                            alt="До" 
                            style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                          />
                        ) : (
                          <div className="text-center text-white">
                            <FaCar size={48} />
                            <p className="mb-0 mt-2">Фото ДО</p>
                          </div>
                        )}
                      </div>
                      <Badge bg="secondary">ДО</Badge>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="text-center">
                      <div 
                        style={{ 
                          height: '250px', 
                          background: '#34495e', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          overflow: 'hidden'
                        }}
                      >
                        {post.after_photo ? (
                          <img 
                            src={post.after_photo} 
                            alt="После" 
                            style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                          />
                        ) : (
                          <div className="text-center text-white">
                            <FaCar size={48} />
                            <p className="mb-0 mt-2">Фото ПОСЛЕ</p>
                          </div>
                        )}
                      </div>
                      <Badge bg="success">ПОСЛЕ</Badge>
                    </div>
                  </Col>
                </Row>

                {/* Описание работ */}
                <h4>Описание работ</h4>
                <p className="lead">{post.content}</p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm border-0 bg-primary text-white">
              <Card.Body className="text-center p-4">
                <h5 className="mb-3">Хотите такой же результат?</h5>
                <p>Запишитесь на детейлинг вашего автомобиля</p>
                <Button 
                  variant="light" 
                  className="w-100"
                  onClick={() => navigate(isAuthenticated ? '/services' : '/login')}
                >
                  {isAuthenticated ? 'Записаться сейчас' : 'Войти для записи'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        @media print {
          .navbar, .btn, .breadcrumb, .bg-primary, .bg-light, [class*="bg-"] {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .card {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PortfolioDetailPage;