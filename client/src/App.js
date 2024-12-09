import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/homepage";
import ProtectedRoute from "./hooks/ProtectedRoute";
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
            path="/core"
            element={
              <ProtectedRoute>
                <Fixed category="core" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flow"
            element={
              <ProtectedRoute>
                <Fixed category="flow" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/overflow"
            element={
              <ProtectedRoute>
                <Fixed category="overflow" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/income"
            element={
              <ProtectedRoute>
                <Fixed category="income" />
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