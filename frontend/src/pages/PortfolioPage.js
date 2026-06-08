import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form, InputGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSearch, FaCalendarAlt, FaEye, FaCar } from 'react-icons/fa';

const PortfolioPage = () => {
  const { axiosInstance } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchTerm, posts]);

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get('/orders/car-posts/');
      const postsArray = response.data.results || response.data || [];
      setPosts(postsArray);
      setFilteredPosts(postsArray);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    if (!searchTerm.trim()) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  // Функция для получения картинки (приоритет: after_photo, before_photo, заглушка)
  const getPostImage = (post) => {
    if (post.after_photo) return post.after_photo;
    if (post.before_photo) return post.before_photo;
    return null;
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Загрузка портфолио...</p>
      </Container>
    );
  }

  return (
    <div className="bg-light" style={{ minHeight: 'calc(100vh - 56px)' }}>
      {/* Hero секция */}
      <div className="bg-primary text-white py-4 mb-4">
        <Container>
          <h1 className="display-5 fw-bold mb-2">Наши работы</h1>
          <p className="lead mb-0">Примеры выполненных работ по детейлингу автомобилей</p>
        </Container>
      </div>

      <Container className="mb-5">
        {/* Поиск */}
        <Row className="mb-4">
          <Col md={6} className="mx-auto">
            <InputGroup>
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Поиск по названию или описанию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* Результаты */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <p className="text-muted mb-0">Работы не найдены</p>
            {searchTerm && (
              <Button variant="link" onClick={() => setSearchTerm('')}>
                Очистить поиск
              </Button>
            )}
          </div>
        ) : (
          <Row>
            {filteredPosts.map(post => {
              const postImage = getPostImage(post);
              return (
                <Col md={6} lg={4} key={post.id} className="mb-4">
                  <Card className="h-100 shadow-sm border-0 portfolio-card">
                    <div className="position-relative">
                      {postImage ? (
                        <img 
                          src={postImage} 
                          alt={post.title}
                          style={{ 
                            height: '220px', 
                            width: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px 8px 0 0'
                          }}
                        />
                      ) : (
                        <div 
                          style={{ 
                            height: '220px', 
                            background: 'linear-gradient(135deg, #379683 0%, #2d7a6a 100%)',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            borderRadius: '8px 8px 0 0'
                          }}
                        >
                          <FaCar size={48} color="white" />
                        </div>
                      )}
                      <Badge 
                        bg="success" 
                        className="position-absolute top-0 end-0 m-2"
                      >
                        <FaEye className="me-1" /> {post.views || 0}
                      </Badge>
                    </div>
                    <Card.Body>
                      <Card.Title className="fs-5">{post.title}</Card.Title>
                      <Card.Text className="text-muted small">
                        <FaCalendarAlt className="me-1" />
                        {new Date(post.created_at).toLocaleDateString('ru-RU')}
                      </Card.Text>
                      <Card.Text>
                        {post.content?.substring(0, 120)}...
                      </Card.Text>
                      <Button 
                        as={Link} 
                        to={`/portfolio/${post.id}`} 
                        variant="outline-primary"
                        className="w-100"
                      >
                        Подробнее →
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Статистика */}
        {posts.length > 0 && (
          <div className="text-center mt-5 pt-3">
            <hr />
            <p className="text-muted">
              Всего работ в портфолио: <strong>{posts.length}</strong>
            </p>
          </div>
        )}
      </Container>

      <style>{`
        .portfolio-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .portfolio-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default PortfolioPage;