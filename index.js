require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());
app.use(express.json());

// Ограничение частоты запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10, // Максимум 10 запросов с одного IP
});
app.use(limiter);

// Параметры подключения к сети Base
const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC_URL);
const privateKey = process.env.PRIVATE_KEY; // Приватный ключ владельца контракта Faucet
const wallet = new ethers.Wallet(privateKey, provider);

// ABI и адрес контракта Faucet
const faucetAbi = [
  "function requestTokens() public",
];
const faucetAddress = process.env.FAUCET_CONTRACT_ADDRESS;
const faucetContract = new ethers.Contract(faucetAddress, faucetAbi, wallet);

app.post('/request-tokens', async (req, res) => {
  const { userAddress } = req.body;

  if (!ethers.utils.isAddress(userAddress)) {
    return res.status(400).send({ message: 'Invalid address' });
  }

  try {
    const tx = await faucetContract.requestTokens();
    await tx.wait();
    res.send({ message: 'Tokens sent successfully', txHash: tx.hash });
  } catch (error) {
    res.status(500).send({ message: 'Error sending tokens', error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
