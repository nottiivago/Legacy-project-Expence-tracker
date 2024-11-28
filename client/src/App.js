import { useState, useEffect } from "react";
import { BrowserRoutes, Routes, Route, BrowserRouter } from "react-router-dom";
import axios from "axios";
import Homepage from "./components/homepage";
import Fixed from "./components/fixed";

function App() {
 

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/fixed" element={<Fixed />} />
          <Route path="/living" element={<Fixed />} />
          <Route path="/extra" element={<Fixed />} />
        </Routes>
      </BrowserRouter>
    </div>  
  );
}

export default App;
