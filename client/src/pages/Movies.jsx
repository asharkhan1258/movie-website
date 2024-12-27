import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Movies = ({ setIsAuthenticated }) => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, [currentPage]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/movies?page=${currentPage}&limit=8}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMovies(response.data.movies);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (movies.length === 0 && currentPage === 1) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <h2 className="mb-4">Your movie list is empty</h2>
        <Link to="/add-movie">
          <Button variant="primary">Add a new movie</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>My movies</h2>
        <div>
          <Link to="/add-movie" className="me-3">
            <Button variant="primary">Add a new movie</Button>
          </Link>
          <Button variant="link" className="text-white" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="movie-card"
            onClick={() => navigate(`/edit-movie/${movie._id}`)}
            style={{ cursor: 'pointer' }}
          >
            <img src={movie.imageUrl} alt={movie.title} className="movie-image" />
            <div className="movie-info">
              <h5>{movie.title}</h5>
              <p className="text-muted">{movie.publishingYear}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination-container">
        <div className="pagination">
          <button 
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Prev
          </button>
          <span className="pagination-info">
            {currentPage} / {totalPages}
          </span>
          <button 
            className="pagination-button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Movies;
