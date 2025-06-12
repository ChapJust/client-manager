import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../css/EditIntervention.css";
import { FaEdit } from "react-icons/fa";

interface EditInterventionProps {
  clientId: string;
  intervention: any;
  onInterventionUpdated: () => void;
}

function EditIntervention({ clientId, intervention, onInterventionUpdated }: EditInterventionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [serviceType, setServiceType] = useState(intervention.serviceType);
  const [notes, setNotes] = useState(intervention.notes);
  const [amount, setAmount] = useState<number | "">(intervention.amount);

  const handleUpdateIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "Clients", clientId, "Interventions", intervention.id);
      await updateDoc(docRef, {
        serviceType,
        notes,
        amount: Number(amount),
      });
      alert("Intervention updated!");
      setIsEditing(false);
      onInterventionUpdated();
    } catch (error) {
      console.error("Error updating intervention:", error);
    }
  };

  return (
    <div className="edit-intervention-container">
      {isEditing ? (
        <form onSubmit={handleUpdateIntervention} className="edit-intervention-form">
          <input type="text" value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="Service Type" required />
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Amount" />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button className="icon-button edit-icon-button" onClick={() => setIsEditing(true)} title="Edit Intervention">
          <FaEdit />
        </button>
      )}
    </div>
  );
}

export default EditIntervention;
