const express = require('express');
const https = require('https');
const {apikey, server} = require('./configFile');
const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', (req,res) => res.sendFile(__dirname + "/pages/signup.html" ));

app.post('/', (req,res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

  const url = `https://${server}.api.mailchimp.com/3.0/lists/98460fdc65`;
  const options= {
    method: "POST",
    auth: `kramer:${apikey}`
  };

  const theRequest = https.request(url, options, (response) => {

    if(res.statusCode === 200){
      res.sendFile(__dirname + '/pages/success.html');
      response.on('data', data => console.log(JSON.parse(data)));
    }
    else{
      res.sendFile(__dirname + '/pages/failure.html');
    }

  });

  theRequest.write(jsonData);
  theRequest.end();
})

app.post('/failure', (req, res) => res.redirect("/"));

app.listen(port, () => console.log('Server running in port: ', port));