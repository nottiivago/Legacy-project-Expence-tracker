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
          <Route path="/Fixed" element={<Fixed />} />
          <Route path="/Living" element={<Fixed />} />
          <Route path="/Extra" element={<Fixed />} />
        </Routes>
      </BrowserRouter>
    </div>  
  );
}

export default App;
