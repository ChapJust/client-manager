import { useNavigate } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-title" onClick={() => navigate("/")}>
        Client Manager App
      </div>
      <div className="navbar-links">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
