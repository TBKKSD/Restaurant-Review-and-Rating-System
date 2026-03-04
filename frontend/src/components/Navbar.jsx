import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link to="/" style={styles.link}>
          🍽 RRRS
        </Link>
      </div>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/restaurants" style={styles.link}>Restaurants</Link>

        {token ? (
          <>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    backgroundColor: "#1e1e2f",
    color: "white",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  links: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#ff4d4d",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
  },
};