import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [pointsInput, setPointsInput] = useState({});
  const [showFullPointsTable, setShowFullPointsTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API_URL}/teams`);
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName) return;
    try {
      await axios.post(`${API_URL}/teams`, { name: newTeamName });
      setNewTeamName("");
      fetchTeams();
    } catch (error) {
      console.error("Error adding team:", error);
      alert(error.response.data.message);
    }
  };

  const handleDeleteTeam = async (id) => {
    try {
      await axios.delete(`${API_URL}/teams/${id}`);
      fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const handlePointsChange = (teamId, value) => {
    setPointsInput({ ...pointsInput, [teamId]: value });
  };

  const handleUpdatePoints = async (teamId) => {
    const points = parseInt(pointsInput[teamId]);
    if (isNaN(points)) return;

    try {
      await axios.patch(`${API_URL}/teams/${teamId}/points`, { points });
      setPointsInput({ ...pointsInput, [teamId]: "" });
      fetchTeams();
    } catch (error) {
      console.error("Error updating points:", error);
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Brain Bawl Admin Dashboard</h1>
        <button
          onClick={() => setShowFullPointsTable(!showFullPointsTable)}
          className="toggle-view-btn"
        >
          {showFullPointsTable
            ? "Show Admin Dashboard"
            : "Show Full Points Table"}
        </button>
      </header>
      <main>
        {!showFullPointsTable ? (
          <>
            <section className="team-management">
              <h2>Team Management</h2>
              <form onSubmit={handleAddTeam} className="add-team-form">
                <input
                  type="text"
                  placeholder="New Team Name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  required
                />
                <button type="submit">Add Team</button>
              </form>
              <div className="team-list">
                {teams.map((team) => (
                  <div key={team._id} className="team-item">
                    <span>{team.name}</span>
                    <button
                      onClick={() => handleDeleteTeam(team._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="points-entry">
              <h2>Points Entry</h2>
              <input
                type="text"
                placeholder="Search Team by Name"
                className="team-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="points-entry-grid">
                {filteredTeams.map((team) => (
                  <div key={team._id} className="points-entry-item">
                    <span>{team.name}</span>
                    <input
                      type="number"
                      placeholder="e.g., +10 or -5"
                      value={pointsInput[team._id] || ""}
                      onChange={(e) =>
                        handlePointsChange(team._id, e.target.value)
                      }
                    />
                    <button onClick={() => handleUpdatePoints(team._id)}>
                      Update Points
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="points-table">
              <h2>Points Table (Admin View)</h2>
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team Name</th>
                    <th>Total Points</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, index) => (
                    <tr key={team._id}>
                      <td>{index + 1}</td>
                      <td>{team.name}</td>
                      <td>{team.totalPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        ) : (
          <section className="full-points-table">
            <h2>Brain Bawl Points Table</h2>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team Name</th>
                  <th>Total Points</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <tr key={team._id}>
                    <td>{index + 1}</td>
                    <td>{team.name}</td>
                    <td>{team.totalPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
