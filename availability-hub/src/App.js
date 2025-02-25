// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


// frontend/src/App.js

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

function App() {
  const [slots, setSlots] = useState({});
  const [name, setName] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await axios.get(`${API_URL}/slots`);
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching slots", error);
    }
  };

  const handleSignup = async () => {
    if (!name || !selectedSlot) return alert("Please enter your name and select a slot");
    try {
      await axios.post(`${API_URL}/signup`, { slot: selectedSlot, name });
      fetchSlots();
      alert("Signed up successfully!");
    } catch (error) {
      alert(error.response?.data?.error || "Error signing up");
    }
  };

  return (
    <div>
      <h1>Rota Signup</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <h2>Available Slots</h2>
      {Object.entries(slots).map(([slot, users]) => (
        <div key={slot}>
          <input
            type="radio"
            name="slot"
            value={slot}
            onChange={() => setSelectedSlot(slot)}
            disabled={users.length >= 4}
          />
          <label>
            {slot} ({users.length}/4)
          </label>
        </div>
      ))}
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}

export default App;
