import React, { useState } from 'react';
function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  function handleClick() {
    if (name.trim() !== "") {
      setMessage("Welcome, " + name + "!");
    } else {
      setMessage("Please enter your name");
    }
  }
  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto"
           style={{ maxWidth: "500px" }}>
        <h2 className="text-center text-primary mb-4">
          React Event Handling
        </h2>
        <label className="form-label">
          Enter Your Name:
        </label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="btn btn-primary w-100"
          onClick={handleClick}
        >
          Submit
        </button>

        <p className="text-success text-center mt-3">
          {message}
        </p>
      </div>
    </div>
  );
}

export default App;