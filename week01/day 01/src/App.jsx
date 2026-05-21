import "./App.css";
import { useState } from "react";

function App() {
  const [mood, setMood] = useState("Happy");
  const [energy, setEnergy] = useState("Medium");
  const [focus, setFocus] = useState("Good");

  return (
    <div className="app">
  <h1>Daily Pulse Board</h1>
  <p className="subtitle">Track your mood, energy, and focus.</p>

  <div className="controls">
    <div className="field">
      <label>Mood: </label>
      <select value={mood} onChange={(e) => setMood(e.target.value)}>
        <option>Happy</option>
        <option>Calm</option>
        <option>Tired</option>
        <option>Stressed</option>
      </select>
    </div>

    <div className="field">
      <label>Energy: </label>
      <select value={energy} onChange={(e) => setEnergy(e.target.value)}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>

    <div className="field">
      <label>Focus: </label>
      <select value={focus} onChange={(e) => setFocus(e.target.value)}>
        <option>Poor</option>
        <option>Good</option>
        <option>Excellent</option>
      </select>
    </div>
  </div>

  <div className="summary">
    <h2>Today’s Pulse</h2>
    <p>Mood: {mood}</p>
    <p>Energy: {energy}</p>
    <p>Focus: {focus}</p>

    <p className="pulse-line">
      Sequence: {mood} → {energy} energy → {focus} focus
    </p>
  </div>
</div>
  );
}

export default App;