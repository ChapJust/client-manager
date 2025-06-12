import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import "../css/AddClient.css";

function AddClient({ onClientAdded }: { onClientAdded: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "Clients"), {
        Name: name,
        Phone: phone,
        Address: address,
        Notes: notes,
        createdAt: serverTimestamp(),
      });
      setName("");
      setPhone("");
      setAddress("");
      setNotes("");
      setSuccessMessage("Client added successfully!");
      onClientAdded(); // <--- Refresh the list in Home
    } catch (error) {
      console.error("Error adding client:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-client-container">
      <h2>Add New Client</h2>
      <form onSubmit={handleSubmit} className="add-client-form">
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Notes:</label>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
        </div>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="add-client-button" disabled={loading}>
          {loading ? "Adding..." : "Add Client"}
        </button>
      </form>
    </div>
  );
}

export default AddClient;
