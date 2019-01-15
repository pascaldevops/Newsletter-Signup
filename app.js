//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

// serves static files in the public folder
app.use(express.static('public'));

// To parse the HTML form
app.use(bodyParser.urlencoded({extended: true}));

// home page
app.get('/', function(req, res) {
  res.sendFile(`${__dirname}/signup.html`);
})

// process data from client
app.post('/', function(req, res) {
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const options = {
    url: 'https://us20.api.mailchimp.com/3.0/lists/3ad22fa6e3',
    method: 'POST',
    headers: {
      'Authorization':'tipizo c3bc3704edb9036a53fa8ce85c288124-us20'
    },
    body: jsonData
  };

  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(`${__dirname}/failure.html`);
    } else {
      if (response.statusCode === 200) {
        res.sendFile(`${__dirname}/success.html`);
      } else {
        res.sendFile(`${__dirname}/failure.html`);
      }
    }
  });
});

app.post('/failure', function(req, res) {
  res.redirect('/');
});

// App is listening on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log('App is listening on port 3000');
})