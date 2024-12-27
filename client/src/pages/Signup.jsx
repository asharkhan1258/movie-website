import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, formData);
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      navigate('/movies');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="auth-container">
      <h2 className="mb-4">Sign up</h2>
      {error && <p className="text-danger mb-3">{error}</p>}
      <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100 mb-3">
          Sign up
        </Button>
        <p className="text-center text-white">
          Already have an account? <Link to="/signin" className="text-primary">Sign in</Link>
        </p>
      </Form>
    </div>
  );
};

export default Signup;
