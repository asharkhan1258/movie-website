import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/movies?page=${currentPage}&limit=8}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMovies(response.data.movies);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/signin");
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (movies.length === 0 && currentPage === 1) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "80vh" }}
      >
        <p className="mb-4 empty-title">Your movie list is empty</p>
        <Link to="/add-movie">
          <Button variant="primary" className="addMovie">
            Add a new movie
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <p className="myMovie mb-0" style={{ marginRight: "20px" }}>
            My movies
          </p>
          <Link to="/add-movie" className="me-3 addMovie-home">
            <i class="fa-solid fa-plus fa-lg" style={{ color: "#fff" }}></i>
          </Link>
        </div>
        <div>
          <Button
            variant="link"
            className="text-white d-flex align-items-center logout"
            onClick={handleLogout}
          >
            <p className="mb-0 d-lg-block d-none">Logout</p>
            <i
              class="fa-solid fa-arrow-right-from-bracket fa-xl"
              style={{ marginLeft: "18px" }}
            ></i>
          </Button>
        </div>
      </div>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="movie-card"
            onClick={() => navigate(`/edit-movie/${movie._id}`)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={movie.imageUrl}
              alt={movie.title}
              className="movie-image"
            />
            <div className="movie-info">
              <h5>{movie.title}</h5>
              <p className="text-white">{movie.publishingYear}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination-container">
        <div className="pagination">
          <span
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </span>
          <span className="pagination-info">
            {currentPage} / {totalPages}
          </span>
          <span
            className="pagination-button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </span>
        </div>
      </div>
    </div>
  );
};

export default Movies;
