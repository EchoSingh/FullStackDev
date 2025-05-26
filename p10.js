// Backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

let users = [];
let results = [];

const quiz = [
  { q: "2 + 2", a: ["3", "4", "5"], correct: "4" },
  { q: "What does RAM stand for?", a: ["Random Access Monitor", "Random Access Memory", "Read-Only Memory"], correct: "Random Access Memory" },
  { q: "What do you call the \u201cbrain\u201d of the computer?", a: ["CPU", "RAM", "Hard Drive"], correct: "CPU" },
  { q: "Which of this is a leap year?", a: ["2020", "2021", "2022"], correct: "2020" },
  { q: "Who wrote 'Romeo and Juliet'?", a: ["Charles Dickens", "William Shakespeare", "Mark Twain"], correct: "William Shakespeare" },
];

app.use(cors());
app.use(bodyParser.json());

// Routes
app.post('/register', (req, res) => {
  const { username, password, isAdmin } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).send("User already exists");
  }
  users.push({ username, password, isAdmin });
  res.send("Registered successfully");
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).send("Invalid credentials");
  res.json({ username: user.username, isAdmin: user.isAdmin });
});

app.get('/quiz', (req, res) => res.json(quiz));

app.post('/submit', (req, res) => {
  const { username, answers } = req.body;
  const score = quiz.reduce((total, question, index) => total + (question.correct === answers[index] ? 1 : 0), 0);
  results.push({ username, score });
  res.send("Quiz submitted");
});

app.get('/results', (req, res) => res.json(results));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

// Frontend/App.js
import React, { useState } from 'react';
import './App.css';

const URL = 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState([]);
  const [showLogin, setShowLogin] = useState(true);

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    if (type === 'login') {
      const res = await fetch(`${URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setUser(await res.json());
      else alert('Login failed');
    } else {
      await fetch(`${URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      alert('Registered! Now log in.');
      setShowLogin(true);
    }
  };

  const fetchQuiz = async () => {
    const res = await fetch(`${URL}/quiz`);
    const data = await res.json();
    setQuiz(data);
    setAnswers(Array(data.length).fill(''));
  };

  const handleQuizSubmit = async () => {
    await fetch(`${URL}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, answers }),
    });
    alert('Quiz submitted!');
    setQuiz([]);
  };

  const fetchResults = async () => {
    const res = await fetch(`${URL}/results`);
    setResults(await res.json());
  };

  if (!user) {
    return (
      <div className="container">
        <h2>{showLogin ? 'Login' : 'Register'}</h2>
        <form className="form" onSubmit={(e) => handleSubmit(e, showLogin ? 'login' : 'register')}>
          <input name="username" placeholder="Username" required />
          <input name="password" type="password" placeholder="Password" required />
          {!showLogin && (
            <label className="checkbox">
              <input type="checkbox" name="isAdmin" /> Register as Admin
            </label>
          )}
          <button type="submit">{showLogin ? 'Login' : 'Register'}</button>
          <p className="toggle-text">
            {showLogin ? 'Don\'t have an account?' : 'Already have an account?'}{' '}
            <span className="link" onClick={() => setShowLogin(!showLogin)}>
              {showLogin ? 'Register here' : 'Login here'}
            </span>
          </p>
        </form>
      </div>
    );
  }

  if (user.isAdmin) {
    return (
      <div className="container">
        <h1>Admin Dashboard</h1>
        <p><strong>Logged in as:</strong> {user.username}</p>
        <button className="load-btn" onClick={fetchResults}>Load Results</button>
        <ul>
          {results.map((r, i) => (
            <li key={i}><strong>{r.username}</strong>: {r.score}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Welcome, {user.username}</h1>
      {!quiz.length ? (
        <button className="primary-btn" onClick={fetchQuiz}>Take Quiz</button>
      ) : (
        <div className="quiz">
          {quiz.map((q, i) => (
            <div key={i} className="question">
              <p>{i + 1}. {q.q}</p>
              {q.a.map((opt, j) => (
                <label key={j}>
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={opt}
                    checked={answers[i] === opt}
                    onChange={() => {
                      const newAns = [...answers];
                      newAns[i] = opt;
                      setAnswers(newAns);
                    }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button className="submit-btn" onClick={handleQuizSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default App;