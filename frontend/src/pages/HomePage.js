import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaShieldAlt, FaClock, FaAward, FaArrowRight } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, axiosInstance } = useAuth();
  const [featuredWorks, setFeaturedWorks] = useState([]);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await axiosInstance.get('/orders/car-posts/');
      const posts = response.data.results || response.data || [];
      setFeaturedWorks(posts.slice(0, 3));
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setFeaturedWorks([]);
    }
  };

  const handleOrderClick = () => {
    if (isAuthenticated) {
      navigate('/services');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <div className="bg-dark text-white" style={{ background: 'linear-gradient(135deg, #404B62 0%, #2d3546 100%)' }}>
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-3">
                Профессиональный детейлинг 
                <span className="text-primary"> в Ставрополе</span>
              </h1>
              <p className="lead mb-4">
                Ваш автомобиль заслуживает лучшего ухода. Профессиональная полировка, 
                защитные покрытия и химчистка салона с гарантией качества.
              </p>
              <div className="d-flex gap-3">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleOrderClick}
                >
                  {isAuthenticated ? 'Записаться сейчас' : 'Зарегистрироваться'}
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg"
                  onClick={() => navigate('/portfolio')}
                >
                  Наши работы
                </Button>
              </div>
            </Col>
            <Col lg={6} className="mt-4 mt-lg-0">
              <div className="rounded-3 shadow" style={{ backgroundColor: '#fff', padding: '4px' }}>
                <Carousel interval={4000} pause={false} indicators={false} controls={true}>
                  <Carousel.Item>
                    <div style={{ 
                      height: '320px', 
                      backgroundImage: 'url(/images/slide1.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '10px',
                      position: 'relative'
                    }}>
                      <div style={{ 
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(135deg, rgba(64,75,98,0.9) 0%, rgba(45,53,70,0.9) 100%)',
                        padding: '15px',
                        borderRadius: '0 0 10px 10px',
                        textAlign: 'center'
                      }}>
                        <h3 className="mb-0">Полировка кузова</h3>
                        <p className="mb-0 text-white-50">Восстановление блеска автомобиля</p>
                      </div>
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <div style={{ 
                      height: '320px', 
                      backgroundImage: 'url(/images/slide2.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '10px',
                      position: 'relative'
                    }}>
                      <div style={{ 
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(135deg, rgba(64,75,98,0.9) 0%, rgba(45,53,70,0.9) 100%)',
                        padding: '15px',
                        borderRadius: '0 0 10px 10px',
                        textAlign: 'center'
                      }}>
                        <h3 className="mb-0">Химчистка салона</h3>
                        <p className="mb-0 text-white-50">Идеальная чистота интерьера</p>
                      </div>
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <div style={{ 
                      height: '320px', 
                      backgroundImage: 'url(/images/slide3.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '10px',
                      position: 'relative'
                    }}>
                      <div style={{ 
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(135deg, rgba(64,75,98,0.9) 0%, rgba(45,53,70,0.9) 100%)',
                        padding: '15px',
                        borderRadius: '0 0 10px 10px',
                        textAlign: 'center'
                      }}>
                        <h3 className="mb-0">Керамическое покрытие</h3>
                        <p className="mb-0 text-white-50">Защита кузова на годы</p>
                      </div>
                    </div>
                  </Carousel.Item>
                </Carousel>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <h2 className="text-center mb-5">Почему выбирают нас</h2>
        <Row>
          <Col md={4}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body>
                <FaShieldAlt size={48} className="text-primary mb-3" />
                <Card.Title>Профессиональные материалы</Card.Title>
                <Card.Text>
                  Используем только сертифицированные материалы от ведущих мировых производителей.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body>
                <FaClock size={48} className="text-primary mb-3" />
                <Card.Title>Точное соблюдение сроков</Card.Title>
                <Card.Text>
                  Выполняем работы точно в оговоренные сроки с гарантией качества.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body>
                <FaAward size={48} className="text-primary mb-3" />
                <Card.Title>Гарантия на работы</Card.Title>
                <Card.Text>
                  Предоставляем гарантию до 12 месяцев на все виды работ.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-5">Что говорят наши клиенты</h2>
          <Row>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="mb-3 text-warning">
                    {'★'.repeat(5)}{'☆'.repeat(0)}
                  </div>
                  <Card.Text>
                    "Отличный сервис! Сделали полировку кузова, результат превзошёл ожидания. 
                    Машина как новая. Рекомендую!"
                  </Card.Text>
                  <div className="mt-3">
                    <strong>Алексей</strong>
                    <div className="text-muted small">BMW X5</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="mb-3 text-warning">
                    {'★'.repeat(5)}{'☆'.repeat(0)}
                  </div>
                  <Card.Text>
                    "Делал химчистку салона. Ребята профессионалы, всё быстро и качественно. 
                    Приятные цены. Обязательно приеду ещё!"
                  </Card.Text>
                  <div className="mt-3">
                    <strong>Екатерина</strong>
                    <div className="text-muted small">Mercedes GLC</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="mb-3 text-warning">
                    {'★'.repeat(5)}{'☆'.repeat(0)}
                  </div>
                  <Card.Text>
                    "Лучший детейлинг в городе! Покрыли керамикой, эффект потрясающий. 
                    Отдельное спасибо за внимательное отношение."
                  </Card.Text>
                  <div className="mt-3">
                    <strong>Дмитрий</strong>
                    <div className="text-muted small">Porsche Cayenne</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5 text-center">
        <h3>Готовы преобразить ваш автомобиль?</h3>
        <p className="lead mb-4">Оставьте заявку прямо сейчас и получите консультацию специалиста</p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleOrderClick}
          >
            {isAuthenticated ? 'Записаться на услугу' : 'Зарегистрироваться'}
          </Button>
          <Button 
            variant="outline-secondary" 
            size="lg"
            onClick={() => navigate('/services')}
          >
            Смотреть услуги
          </Button>
        </div>
      </Container>
    </>
  );
};

export default HomePage;