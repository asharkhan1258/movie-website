import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Movies from "./pages/Movies";
import AddMovie from "./pages/AddMovie";
import EditMovie from "./pages/EditMovie";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/signin" />;
  };

  return (
    <Router>
      <div className="wave-bg">
        <Routes>
          <Route
            path="/signin"
            element={<Signin setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/signup"
            element={<Signup setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/movies"
            element={
              <PrivateRoute>
                <Movies setIsAuthenticated={setIsAuthenticated} />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-movie"
            element={
              <PrivateRoute>
                <AddMovie />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-movie/:id"
            element={
              <PrivateRoute>
                <EditMovie />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/movies" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
