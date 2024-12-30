import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AddMovie = () => {
  const [formData, setFormData] = useState({
    title: "",
    publishingYear: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("publishingYear", formData.publishingYear);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/movies`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/movies");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        margin: "0 auto",
      }}
      className="addMovie-main"
    >
      <p className="mb-4 createMovie">Create a new movie</p>
      {error && <p className="text-danger mb-3">{error}</p>}
      <div className="d-flex justify-content-between mt-md-5 mt-4 flex-lg-row flex-column">
        <div
          className="d-lg-flex d-none dropzone"
          onClick={() => document.querySelector('input[type="file"]').click()}
        >
          {formData.image ? (
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Preview"
              style={{ width: "100%", maxHeight: "340px", borderRadius: "6px" }}
            />
          ) : (
            <div>
              <i className="fa-solid fa-download fa-xl mb-4"></i>
              <p className="image-drop">Drop an image here</p>
            </div>
          )}
        </div>
        <Form onSubmit={handleSubmit} className="addMovie-form mt-lg-0 mt-3">
          <Form.Group className="mb-lg-3 mb-4">
            <Form.Control
              type="text"
              name="title"
              placeholder="Title"
              className="movieInput-title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-lg-3 mb-4">
            <Form.Control
              type="number"
              name="publishingYear"
              placeholder="Publishing year"
              className="movieInput-year"
              value={formData.publishingYear}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <div
            className="dropzone d-lg-none d-flex"
            onClick={() => document.querySelector('input[type="file"]').click()}
          >
            {formData.image ? (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "340px",
                  borderRadius: "6px",
                }}
              />
            ) : (
              <div>
                <i className="fa-solid fa-download fa-xl mb-4"></i>
                <p className="image-drop">Drop an image here</p>
              </div>
            )}
          </div>
          <Form.Control
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            required
            style={{ display: "none" }}
          />
          <div className="d-flex gap-3 mt-5 addMovie-buttons">
            <Link to="/movies" className="w-50 cancel-link">
              <Button variant="secondary" className="w-100 h-100 cancel-button">
                Cancel
              </Button>
            </Link>
            <Button
              variant="primary"
              type="submit"
              className="w-50 submit-button"
              disabled={loading}
            >
              {loading ? "Creating..." : "Submit"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddMovie;
