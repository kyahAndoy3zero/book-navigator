import React, { useState, useEffect } from 'react';

function App() {
  const [userText, setUserText] = useState('');
  const [pastUserTexts, setPastUserTexts] = useState([]);

  useEffect(() => {
    // Load pastUserTexts from localStorage when the component mounts
    const storedTexts = JSON.parse(localStorage.getItem('pastUserTexts')) || [];
    setPastUserTexts(storedTexts);
  }, []);

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setUserText(newText);

    // Update pastUserTexts with the new text
    const updatedTexts = [newText, ...pastUserTexts.slice(0, 4)];
    setPastUserTexts(updatedTexts);

    // Save pastUserTexts to localStorage
    localStorage.setItem('pastUserTexts', JSON.stringify(updatedTexts));
  };

  const [backendResponse, setBackendResponse] = useState(null);

  const handleQueryBackend = async () => {
    try {
      const response = await fetch('http://localhost:3000/process-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: userText }),
      });
      const data = await response.json();
      setBackendResponse(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter User-Editable Text"
        value={userText}
        onChange={handleInputChange}
      />

      <button onClick={handleQueryBackend}>Query Backend</button>
      {backendResponse && (
        <div>
          <h2>Backend Response:</h2>
          <pre>{JSON.stringify(backendResponse, null, 2)}</pre>
        </div>
      )}
      {/* Add other components here */}
    </div>
  );
}

export default App;