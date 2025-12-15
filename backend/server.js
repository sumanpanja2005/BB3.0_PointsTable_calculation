
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (using the provided connection string directly)
mongoose.connect('mongodb+srv://sumanpanja2005:0tny7k4aPdkdQwiW@cluster.zhcrczt.mongodb.net/?appName=Cluster', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Team Schema
const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  pointHistory: [
    {
      points: Number,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

const Team = mongoose.model('Team', teamSchema);

// API Endpoints

// Add a new team
app.post('/api/teams', async (req, res) => {
  const { name } = req.body;
  try {
    const newTeam = new Team({ name });
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all teams, sorted by totalPoints (highest first)
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await Team.find().sort({ totalPoints: -1 });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a team
app.delete('/api/teams/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    await team.deleteOne();
    res.json({ message: 'Team deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update team points
app.patch('/api/teams/:id/points', async (req, res) => {
  const { points } = req.body;
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    team.totalPoints += points;
    team.pointHistory.push({ points });

    await team.save();
    res.json(team);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

