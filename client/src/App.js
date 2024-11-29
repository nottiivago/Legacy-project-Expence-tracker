import { BrowserRoutes, Routes, Route, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./hooks/ProtectedRoute";
import Homepage from "./components/homepage";
import Fixed from "./components/fixed";
import Login from "./components/pages/login";
import Register from "./components/pages/register";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fixed"
            element={
              <ProtectedRoute>
                <Fixed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/living"
            element={
              <ProtectedRoute>
                <Fixed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/extra"
            element={
              <ProtectedRoute>
                <Fixed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/income"
            element={
              <ProtectedRoute>
                <Fixed />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
