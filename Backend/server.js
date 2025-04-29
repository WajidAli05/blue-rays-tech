// Importing express
const express = require('express');
const app = express();

// Enable Express to parse incoming JSON data
app.use(express.json());  // This middleware is required to parse JSON in POST requests

// POST route for testing
app.post('/test', (req, res) => {
  const { name, email } = req.body;

  // Respond with the received data
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  res.status(200).json({
    message: 'Data received successfully',
    data: {
      name: name,
      email: email,
    },
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
