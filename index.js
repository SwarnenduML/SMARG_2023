const express = require("express");
const app = express();
const http = require('http');
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const httpServer = http.createServer(app);
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDIzLTEwLTI3IiwiZXhwIjoiMjAyMy0xMS0yNiIsInVzZXJfaWQiOiIyMyIsInVzZXJfbmFtZSI6ImRlbW8iLCJhZG1pbiI6ZmFsc2UsIm5hbWUiOiIgIiwidXNlcl9hZ2VudCI6IlBvc3RtYW5SdW50aW1lXC83LjM0LjAifQ.73zoUH3dG-gyV1MJ2eqF7KjDWEpd3mnXPPmwS-Cd2Oo";

app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));


httpServer.listen(port, () => {
  console.log('HTTP Server running on port ' + port);
});


async function login(token) {
  let newToken = null;

  await fetch("https://spaas.tecomon.net/API/JSON/", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ "UID": ["FF.3C6105DDB834"], "FCN": [["FU.portal_login"]], "FPL":[[["jwt"]]], "FPD":[[[[[token]]]]] }),
  })
  .then(res => res.json())
  .then(json => {
    if(json.FPD[0][0][0][0][0]!== false) {
      newToken = json.FPD[0][0][0][0][0];
    } else {
      throw new Error("Invalid token");
    }
  });


  return newToken;
}



/* 
  Get device data
  http://localhost:3000/devicedata?uid=FF.8CAAB542E501
*/

app.get("/devicedata", async (req, res) => {

  try {
    // Login to get new token
    token = await login(token);

    await fetch ("https://spaas.tecomon.net/API/JSON/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ "UID": [req.query.uid], "FCN": [["FU.effi_data"]], "FPL":[[["limit"]]], "FPD":[[[[[req.query.count]]]]] })
    })
    .then(res => res.json())
    .then(json => {

      res.status(200).json(json);
      console.log(json);
    });

    
  } catch(err) {

    res.status(500).end();
    console.log(err);
  }
});



app.get("/", async (req, res) => {
  res.status(200).send("This is the Arena 2036 service 👋");
});
