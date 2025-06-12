import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import "../css/Home.css";
import AddClient from "../components/AddClient";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "Clients"), orderBy("createdAt", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const clientsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(clientsData);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return (
    <div className="home-container">
      <Navbar />
      <h1>Welcome to Client Manager App</h1>
      <p>Your personal IT client manager 🚀</p>

      <AddClient onClientAdded={fetchClients} />

      <div className="dashboard-section">
        <h2>Latest Clients</h2>
        {loading ? (
          <p>Loading clients...</p>
        ) : clients.length === 0 ? (
          <p>No clients found.</p>
        ) : (
          <ul className="client-list">
            {clients.map((client) => (
              <li key={client.id} className="client-item" onClick={() => navigate(`/clients/${client.id}`)} style={{ cursor: "pointer" }}>
                <h3>{client.Name}</h3>
                <p>📞 {client.Phone}</p>
                <p>🏠 {client.Address}</p>
                <p>📝 {client.Notes}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;
