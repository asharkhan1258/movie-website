import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const EditMovie = () => {
  const [formData, setFormData] = useState({
    title: '',
    publishingYear: '',
    image: null,
    currentImageUrl: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const { title, publishingYear, imageUrl } = response.data;
      setFormData(prev => ({
        ...prev,
        title,
        publishingYear,
        currentImageUrl: imageUrl
      }));
    } catch (error) {
      setError('Error fetching movie details');
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({
        ...formData,
        image: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('publishingYear', formData.publishingYear);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/movies/${id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/movies');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2 className="mb-4">Edit</h2>
      {error && <p className="text-danger mb-3">{error}</p>}
      <div 
        className="dropzone"
        onClick={() => document.querySelector('input[type="file"]').click()}
      >
        {formData.image ? (
          <img 
            src={URL.createObjectURL(formData.image)} 
            alt="Preview" 
            style={{ maxWidth: '100%', maxHeight: '200px' }}
          />
        ) : formData.currentImageUrl ? (
          <img 
            src={formData.currentImageUrl} 
            alt="Current" 
            style={{ maxWidth: '100%', maxHeight: '200px' }}
          />
        ) : (
          <div>
            <i className="fas fa-cloud-upload-alt mb-2"></i>
            <p>Drop other image here</p>
          </div>
        )}
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="number"
            name="publishingYear"
            placeholder="Publishing year"
            value={formData.publishingYear}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Control
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <div className="d-flex gap-2">
          <Link to="/movies" className="w-50">
            <Button variant="secondary" className="w-100">Cancel</Button>
          </Link>
          <Button
            variant="primary"
            type="submit"
            className="w-50"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditMovie;
