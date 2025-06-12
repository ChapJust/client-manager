import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login"; // <--- Add this import
import ClientDetails from "./pages/ClientsDetails";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clients/:clientId" element={<ClientDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
