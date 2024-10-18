import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [message, setMessage] = useState('');

  const requestTokens = async () => {
    try {
      const response = await axios.post('http://localhost:3001/request-tokens', { userAddress });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Server error');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Base Network Faucet</h1>
      <input
        type="text"
        placeholder="Enter your wallet address"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
        style={styles.input}
      />
      <button onClick={requestTokens} style={styles.button}>Request Tokens</button>
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  container: { textAlign: 'center', marginTop: '50px' },
  input: { width: '300px', padding: '10px', fontSize: '16px' },
  button: { padding: '10px 20px', fontSize: '16px', marginLeft: '10px' },
};

export default App;
