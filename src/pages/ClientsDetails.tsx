import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, serverTimestamp, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../css/ClientsDetails.css";
import Navbar from "../components/Navbar";
import EditIntervention from "../components/EditIntervention";
import { FaTrashAlt } from "react-icons/fa";

function ClientDetails() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [serviceType, setServiceType] = useState("");
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState<number | "">("");

  const [isEditingClient, setIsEditingClient] = useState(false);
  const [isAddingIntervention, setIsAddingIntervention] = useState(false);

  const fetchClient = async () => {
    try {
      const docRef = doc(db, "Clients", clientId!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setClient(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching client:", error);
    }
  };

  const fetchInterventions = async () => {
    try {
      setLoading(true);
      const interventionsRef = collection(db, "Clients", clientId!, "Interventions");
      const snapshot = await getDocs(interventionsRef);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInterventions(data);
    } catch (error) {
      console.error("Error fetching interventions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
    fetchInterventions();
  }, [clientId]);

  const handleAddIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "Clients", clientId!, "Interventions"), {
        serviceType,
        notes,
        amount: Number(amount),
        date: serverTimestamp(),
      });
      setServiceType("");
      setNotes("");
      setAmount("");
      fetchInterventions();
      setIsAddingIntervention(false);
    } catch (error) {
      console.error("Error adding intervention:", error);
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "Clients", clientId!);
      await updateDoc(docRef, {
        Name: client.Name,
        Phone: client.Phone,
        Address: client.Address,
        Notes: client.Notes,
      });
      alert("Client updated!");
      setIsEditingClient(false);
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  const handleDeleteClient = async () => {
    if (window.confirm("Are you sure you want to delete this client and all its interventions?")) {
      try {
        const docRef = doc(db, "Clients", clientId!);
        await deleteDoc(docRef);
        alert("Client deleted!");
        navigate("/");
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleDeleteIntervention = async (interventionId: string) => {
    if (window.confirm("Are you sure you want to delete this intervention?")) {
      try {
        const docRef = doc(db, "Clients", clientId!, "Interventions", interventionId);
        await deleteDoc(docRef);
        fetchInterventions();
      } catch (error) {
        console.error("Error deleting intervention:", error);
      }
    }
  };

  return (
    <div className="client-details-container">
      <Navbar />
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      {client && (
        <div className="client-info card">
          <h3>Client Info:</h3>
          <p>
            <strong>Name:</strong> {client.Name}
          </p>
          <p>
            <strong>Phone:</strong> {client.Phone}
          </p>
          <p>
            <strong>Address:</strong> {client.Address}
          </p>
          <p>
            <strong>Notes:</strong> {client.Notes}
          </p>

          <button onClick={() => setIsEditingClient(!isEditingClient)}>{isEditingClient ? "Cancel Edit" : "Edit Client Info"}</button>
          <button className="delete-button" onClick={handleDeleteClient}>
            Delete Client
          </button>

          {isEditingClient && (
            <form onSubmit={handleUpdateClient} className="edit-client-form">
              <input type="text" value={client.Name} onChange={(e) => setClient({ ...client, Name: e.target.value })} />
              <input type="text" value={client.Phone} onChange={(e) => setClient({ ...client, Phone: e.target.value })} />
              <input type="text" value={client.Address} onChange={(e) => setClient({ ...client, Address: e.target.value })} />
              <input type="text" value={client.Notes} onChange={(e) => setClient({ ...client, Notes: e.target.value })} />
              <button type="submit">Save Changes</button>
            </form>
          )}
        </div>
      )}

      <div className="add-intervention-section card">
        <button onClick={() => setIsAddingIntervention(!isAddingIntervention)}>{isAddingIntervention ? "Cancel" : "+ Add New Intervention"}</button>

        {isAddingIntervention && (
          <form onSubmit={handleAddIntervention} className="add-intervention-form">
            <input type="text" value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="Service Type" required />
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Amount" />
            <button type="submit">Add Intervention</button>
          </form>
        )}
      </div>

      <h3>Existing Interventions:</h3>
      {loading ? (
        <p>Loading interventions...</p>
      ) : interventions.length === 0 ? (
        <p>No interventions found.</p>
      ) : (
        <ul className="intervention-list">
          {interventions.map((intervention) => (
            <li key={intervention.id} className="intervention-item card">
              <div className="intervention-content">
                <div className="intervention-text">
                  <p>
                    <strong>Service:</strong> {intervention.serviceType}
                  </p>
                  <p>
                    <strong>Notes:</strong> {intervention.notes}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${intervention.amount}
                  </p>
                </div>
                <div className="intervention-actions">
                  <button className="icon-button delete-button" onClick={() => handleDeleteIntervention(intervention.id)} title="Delete Intervention">
                    <FaTrashAlt />
                  </button>
                  <EditIntervention clientId={clientId!} intervention={intervention} onInterventionUpdated={fetchInterventions} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ClientDetails;
