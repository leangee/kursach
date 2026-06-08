import React from 'react';
import { Container, Card } from 'react-bootstrap';

const AdminPanel = () => {
  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="bg-danger text-white">
          <h4 className="mb-0">Админ-панель</h4>
        </Card.Header>
        <Card.Body>
          <p>Здесь будет администрирование</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminPanel;