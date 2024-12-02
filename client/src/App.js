import { useState, useEffect } from "react";
import { BrowserRoutes, Routes, Route, BrowserRouter } from "react-router-dom";
import axios from "axios";
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
                <Fixed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flow"
            element={
              <ProtectedRoute>
                <Fixed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/overflow"
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
