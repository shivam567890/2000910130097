// app.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;


app.use(bodyParser.json());


app.post('/register', async (req, res) => {
  try {
  const registrationData ={
      companyName : req.body.companyName,
       ownerName : req.body.ownerName,
       rollNo : req.body.rollNo,
       ownerEmail : req.body.ownerEmail,
       accessCode :req.body.accessCode
  };
    const registrationResponse = await axios.post('http://20.244.56.144/train/register', registrationData);
    const credentials = registrationResponse.data;

    res.status(200).json(credentials);
  } catch (error) {
    res.status(500).json({ message: 'Failed to register the company with John Doe Railway Server' });
  }
});




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
