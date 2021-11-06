const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { auth, requiredScopes } = require("express-oauth2-bearer");
const jwt_decode = require('jwt-decode');


const {
  checkUrl,
  APP_URL, // Public URL for this app
  ISSUER_BASE_URL, // Auth0 Tenant Url
  ALLOWED_AUDIENCES, // Auth0 API Audience List
  PORT,
} = require("./env-config");

const app = express();

// Used to normalize URL in Vercel
app.use(checkUrl());

app.use(cors());

const expenses = [
  {
    date: new Date(),
    description: "Pizza for a Coding Dojo session.",
    value: 102,
  },
  {
    date: new Date(),
    description: "Coffee for a Coding Dojo session.",
    value: 42,
  }
];

/****************************
 * This method is here to allow a
 * successful response on root requests.
 * This stops content security policy
 * from preventing the user to make
 * requests via the browsers console.
 ****************************/
app.get("/", (req, res) => {
  res.status(200).end("OK");
});

app.post('/get-connections', function(req, res, next) {
  
   var email = req.body.email;
  
  
      var connections = [
      {
        connection_name: "hooli-waad"
      }
    ];
  
   if (email.includes('auth0')) {
     connections = [
        {
          connection_name: "fdgfgdfgdf"
        }
      ];
   }
     else if (email.includes('example')) {
     connections = [
        {
          connection_name: "fdgfgdfgdf"
        },
             {
        connection_name: "hooli-waad"
      }
      ];
   }
  
       else if (email.includes('ping')) {
     connections = [
        {
          connection_name: "ping-fed"
        }
      ];
   }
  
    res.send(connections);


});

app.use(express.urlencoded({
  extended: true
}))

app.post('/login', function(req, res, next) {
  
  //console.log(req.body.credential);
   var jwt = req.body.credential;
   console.log(jwt);
  var decoded = jwt_decode(jwt);
  console.log(decoded);
  var email = decoded.email;
  //var obj = JSON.parse(decoded);

// Accessing individual value from JS object
//var email = obj.email; // Outputs: Peter

 
//var decoded = jwt_decode(jwt);
//console.log(decoded)
 
//console.log(decoded);
    res.redirect(303, 'https://reed-passwordless.herokuapp.com?onetap=true&email='+email);
});






app.post('/logintwo', function(req, res, next) {
  
  //console.log(req.body.credential);
   var jwt = req.body.credential;
   console.log(jwt);
  var decoded = jwt_decode(jwt);
  console.log(decoded);
  var email = decoded.email;
  //var obj = JSON.parse(decoded);

// Accessing individual value from JS object
//var email = obj.email; // Outputs: Peter

 
//var decoded = jwt_decode(jwt);
//console.log(decoded)
 
//console.log(decoded);
    res.redirect(303, 'https://lit-dusk-40286.herokuapp.com/?onetap=true&email='+email);
});
/****************************/

app.get("/total", (req, res) => {
  const total = expenses.reduce((accum, expense) => accum + expense.value, 0);
  res.send({ total, count: expenses.length });
});

app.use(auth());

app.get("/reports", requiredScopes('read:reports'), (req, res) => {
  res.send(expenses);
});

createServer(app).listen(PORT, () => {
  console.log(`API: ${APP_URL}`);
});

