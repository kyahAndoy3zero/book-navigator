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
    <div class="flex flex-col items-center justify-center h-screen">
      <div class="flex mb-4">
        <input
          class="mr-4 p-2 border rounded-lg w-96"
          type="text"
          placeholder="Enter User-Editable Text"
          value={userText}
          onChange={handleInputChange}
        />

        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          onClick={handleQueryBackend}
        >
          Query Backend
        </button>
      </div>

      {backendResponse && (
        <div class="justify-center">
          <div class="mt-4 p-4 bg-gray-200 rounded-lg overflow-x-auto max-h-60 w-1/2">
            <h2 class="text-lg font-semibold">Original Response:</h2>
            <pre>
              {JSON.stringify(backendResponse.originalResponse, null, 2)}
            </pre>
          </div>

          <div class="mt-4 p-4 bg-gray-200 rounded-lg overflow-x-auto max-h-60 w-1/2">
            <h2 class="text-lg font-semibold">Processed Response:</h2>
            <pre>
              {JSON.stringify(backendResponse.processedResponse, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;