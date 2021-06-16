const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { auth, requiredScopes } = require("express-oauth2-bearer");

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
  },
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

app.post('/login', function(req, res, next) {
    res.redirect(303, 'https://dev-huv4lcmy.eu.auth0.com/authorize?client_id=Gxp1SrCkmKyzQ463pVV9IeXj2xYQ01Qd&redirect_uri=https%3A%2F%2Fsingle-page-app-git-master-davidwestonauth0.vercel.app&audience=https%3A%2F%2Fexpenses-api&scope=openid%20profile%20email%20read%3Areports&response_type=code&response_mode=query&code_challenge=S_T2RJb08wEst6eicPoUdTRPwqiF_FEDnkcU8exE_KA&code_challenge_method=S256&auth0Client=eyJuYW1lIjoiYXV0aDAtc3BhLWpzIiwidmVyc2lvbiI6IjEuMTMuNSJ9&login_hint=davidweston.uk@googlemail.com&connection=google-oauth2') // Notice the 303 parameter
})
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
