import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Movies = ({ setIsAuthenticated }) => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/movies`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/signin');
  };

  if (movies.length === 0) {
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
      {movies.length > 8 && (
        <div className="pagination">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Prev
          </button>
          <span>{currentPage}</span>
          <button 
            disabled={movies.length <= currentPage * 8}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Movies;
