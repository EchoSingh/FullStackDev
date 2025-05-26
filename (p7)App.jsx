import React, { useState } from "react";

export default function App() {
  const [votes, setVotes] = useState({
    Akash: 0,
    Dhanush: 0,
    Srusthi: 0,
  });

  const [showVotes, setShowVotes] = useState(false);

  const handleVote = (candidate) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [candidate]: prevVotes[candidate] + 1,
    }));
    setShowVotes(false); // Hide votes after each new vote
  };

  const getTotalVotes = () => {
    return Object.values(votes).reduce((acc, val) => acc + val, 0);
  };

  return (
    <div style={styles.container}>
      <h1>Online Voting System</h1>

      {Object.keys(votes).map((candidate) => (
        <div key={candidate} style={styles.card}>
          <h2>{candidate}</h2>
          <p>Votes: {showVotes ? votes[candidate] : "🔒"}</p>
          <button onClick={() => handleVote(candidate)} style={styles.button}>
            Vote
          </button>
        </div>
      ))}

      <button onClick={() => setShowVotes(true)} style={styles.viewButton}>
        View Votes
      </button>

      {showVotes && (
        <p style={styles.totalVotes}>Total Votes: {getTotalVotes()}</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  card: {
    margin: "10px auto",
    padding: "15px",
    border: "1px solid #ccc",
    width: "250px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  },
  button: {
    padding: "6px 12px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "4px",
    border: "1px solid #007BFF",
    backgroundColor: "#007BFF",
    color: "white",
  },
  viewButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  totalVotes: {
    marginTop: "15px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
};
