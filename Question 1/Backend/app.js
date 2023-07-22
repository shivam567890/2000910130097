// app.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;


app.use(bodyParser.json());

function filterAndSortTrains(trainsData) {
    const currentTime = Date.now();
  
         const twelvehrsfromnow = currentTime + 12 * 60 * 60 * 1000;
  
   
    const filteredTrains = trainsData.filter((train) => {
      const departTime = new Date(train.departureTime).getTime();
      return departTime >= currentTime && departTime <= twelvehrsfromnow;
    });
    const ignoredTrains = filteredTrains.filter((train) => {
      const departTime = new Date(train.departureTime).getTime();
      return departTime > currentTime + 30 * 60 * 1000;
    });
    const sortedTrains = ignoredTrains.sort((a, b) => {
   
      if (a.price.AC !== b.price.AC) {
        return a.price.AC - b.price.AC;
      } else if (a.price.sleeper !== b.price.sleeper) {
        return a.price.sleeper - b.price.sleeper;
      }
  
    
      const totalTicketsA = a.seatsAvailable.AC + a.seatsAvailable.sleeper;
      const totalTicketsB = b.seatsAvailable.AC + b.seatsAvailable.sleeper;
      return totalTicketsB - totalTicketsA;
    });
    const sortedAndDelayedTrains = sortedTrains.sort((a, b) => {
      const departTimeA = new Date(a.departureTime).getTime() + a.delayedBy * 60 * 1000;
      const dv = new Date(b.departureTime).getTime() + b.delayedBy * 60 * 1000;
      return dv - departTimeA;
    });
  
    return sortedAndDelayedTrains;
  }
  

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


app.post('/auth', async (req, res) => {
    try {
      const credentials = req.body;
  
     
      const authResponse = await axios.post('http://20.244.56.144/train/auth', credentials);
      const authToken = authResponse.data.access_token;
  
      res.status(200).json({ token: authToken });
    } catch (error) {
      res.status(401).json({ message: 'Invalid credentials or failed to obtain the authorization token' });
    }
  });
  
  app.get('/trains', async (req, res) => {
    try {
      const authToken = req.headers.authorization;

      const trainsResponse = await axios.get('http://20.244.56.144/train/trains', {
        headers: {
            access_token: authToken,
        },
      });
      const trainsData = trainsResponse.data;
  
      const filteredAndSortedTrains = filterAndSortTrains(trainsData);
  
      res.status(200).json(filteredAndSortedTrains);
    } catch (error) {
      res.status(401).json({ message: 'Failed to fetch train schedules' });
    }
  });



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
