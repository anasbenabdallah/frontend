import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [newEntry, setNewEntry] = useState({
    phon: "",
    orth: "",
    pos: [],
    def: "",
  });
  const [editEntry, setEditEntry] = useState(null);
  const [editDef, setEditDef] = useState("");

  const fetchEntries = () => {
    fetch("http://localhost:5000/bdd")
      .then((res) => res.json())
      .then((data) => setEntries(data.bdd.entry || []))
      .catch((err) => console.error("Error fetching dictionary", err));
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleAddEntry = () => {
    fetch("http://localhost:5000/bddsave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    })
      .then((res) => res.json())
      .then(() => {
        setNewEntry({ phon: "", orth: "", pos: [], def: "" });
        fetchEntries();
      })
      .catch((err) => console.error("Error saving entry", err));
  };

  const handleEditEntry = (phon, orth) => {
    fetch("http://localhost:5000/bddupdate", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phon, orth, newDef: editDef }),
    })
      .then((res) => res.json())
      .then(() => {
        setEditEntry(null);
        setEditDef("");
        fetchEntries();
      })
      .catch((err) => console.error("Error updating entry", err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <input
        type="text"
        placeholder="Rechercher un mot..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "10px", width: "100%", marginBottom: "20px" }}
      />
      <div>
        {entries
          .filter((entry) => entry.lemma?.[1]?._?.includes(search))
          .map((entry, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h3 style={{ color: "green", fontWeight: "bold" }}>
                {entry.lemma?.[1]?._ || "N/A"}
              </h3>
              <p>
                <strong>Phonétique:</strong> {entry.lemma?.[0]?._ || "N/A"}
              </p>
              <p>
                <strong>Définition:</strong> {entry.def?.[0] || "N/A"}
              </p>
              {editEntry === index ? (
                <div>
                  <input
                    type="text"
                    value={editDef}
                    onChange={(e) => setEditDef(e.target.value)}
                    style={{
                      marginBottom: "10px",
                      padding: "5px",
                      width: "100%",
                    }}
                  />
                  <button
                    onClick={() =>
                      handleEditEntry(entry.lemma[0]._, entry.lemma[1]._)
                    }
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Modifier
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditEntry(index);
                    setEditDef(entry.def?.[0] || "");
                  }}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "orange",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Éditer
                </button>
              )}
            </div>
          ))}
      </div>
      <div>
        <h3>Ajouter une entrée</h3>
        <input
          type="text"
          placeholder="Phonétique"
          value={newEntry.phon}
          onChange={(e) => setNewEntry({ ...newEntry, phon: e.target.value })}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "10px",
            width: "100%",
          }}
        />
        <input
          type="text"
          placeholder="Orthographe"
          value={newEntry.orth}
          onChange={(e) => setNewEntry({ ...newEntry, orth: e.target.value })}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "10px",
            width: "100%",
          }}
        />
        <input
          type="text"
          placeholder="Définition"
          value={newEntry.def}
          onChange={(e) => setNewEntry({ ...newEntry, def: e.target.value })}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "10px",
            width: "100%",
          }}
        />
        <button
          onClick={handleAddEntry}
          style={{
            padding: "10px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}
