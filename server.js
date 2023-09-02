const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Define a function to count 'e' and 'E' characters in a string
const countCharacters = (input) => {
    return input.split('').filter(char => ['e', 'E'].includes(char)).length;
};

// Define a function for descending sorting
const descendingSort = (input) => {
    return input.split('').sort((a, b) => {
        return b.localeCompare(a);
    }).join('');
};

// Define a function to process JSON data
const processData = (jsonData) => {
    if (Array.isArray(jsonData)) {
        return jsonData.map(item => processData(item));
    } else if (typeof jsonData === 'object') {
        const result = {};
        let countE = 0; // Initialize the count of 'e' and 'E' characters
        for (const key in jsonData) {
            const sortedKey = descendingSort(key);
            const value = processData(jsonData[key]);
            result[sortedKey] = value;
            countE += countCharacters(key); // Count characters only in the key
        }
        result['countE'] = countE;
        return result;
    } else if (typeof jsonData === 'string') {
        return descendingSort(jsonData);
    } else {
        return jsonData;
    }
};

// Define a route for processing the URL response
app.post('/process-url', async (req, res) => {
    try {
        const { url } = req.body;

        // Query the URL requested
        const response = await axios.get(url);
        const data = response.data;

        // Process the data
        const processedData = processData(data);

        // Respond to the frontend query with both the original response and processed result
        res.json({ originalResponse: data, processedResponse: processedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the URL response.' });
    }
});

// Start the Express.js server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});