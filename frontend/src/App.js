import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [userText, setUserText] = useState('');
  const [pastUserTexts, setPastUserTexts] = useState([]);

  useEffect(() => {

    const storedTexts = JSON.parse(localStorage.getItem('pastUserTexts')) || [];
    setPastUserTexts(storedTexts);
  }, []);

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setUserText(newText);

    const updatedTexts = [newText, ...pastUserTexts.slice(0, 4)];
    setPastUserTexts(updatedTexts);


    localStorage.setItem('pastUserTexts', JSON.stringify(updatedTexts));
  };

  const [backendResponse, setBackendResponse] = useState(null);

  const handleQueryBackend = async () => {

    console.log(JSON.stringify({ url: userText }))

    if (userText.trim() === '') {
      toast.error('Please enter a valid input before querying the backend.');
      return;
    }

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
      <ToastContainer />
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
        <div className="flex">
          <div className="flex-1 p-4 mt-4 max-w-60">
            <h2 className="text-lg font-semibold">Original Response:</h2>
            <div className="scroll-container">
              <pre className="scrollable-content">
                {JSON.stringify(backendResponse.originalResponse, null, 2)}
              </pre>
            </div>
          </div>

          <div className="flex-1 p-4 mt-4 max-w-60">
            <h2 className="text-lg font-semibold">Processed Response:</h2>
            <div className="scroll-container">
              <pre className="scrollable-content">
                {JSON.stringify(backendResponse.processedResponse, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;