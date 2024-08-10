import React from "react";
import { Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Product from "./pages/Product";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/create-product" element={<Product />} />
      </Routes>
    </div>
  );
}

export default App;
