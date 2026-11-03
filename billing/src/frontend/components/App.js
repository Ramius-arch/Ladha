import React from 'react';
import axios from 'axios';

function App() {
    const getData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/test');
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Frontend App</h1>
            <button onClick={getData}>Fetch Data</button>
        </div>
    );
}

export default App;