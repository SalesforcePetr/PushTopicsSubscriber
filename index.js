require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => console.log(`url-shortener listening on port ${port}!`));

const jsforce = require('jsforce');

const conn = new jsforce.Connection();
conn.login(process.env.SFDC_USERNAME, `${process.env.SFDC_PASSWORD}${process.env.SFDC_SECURITY_TOKEN}`, function(err, res) {
  if (err) { 
      return console.error(err);
  }

  console.log('Authenticated');
  
  conn.streaming.topic(process.env.PUSH_TOPIC_CHANNEL).subscribe(function(message) {
    console.log('------------------------------------------------');
    console.log('%cEvent Type: ' + `%c${message.event.type} at ${message.event.createdDate}`, 'font-weight: bold;', 'font-weight: normal;');
    //console.log('Object Id : ' + message.sobject.Id);
    //console.log('Event : ' + JSON.stringify(message));
    console.log(`%cReceived new address for Customer ID ${message.sobject.FinServ__CustomerID__c}:` + `%c\n${message.sobject.BillingStreet}\n${message.sobject.BillingPostalCode} ${message.sobject.BillingCity}\n${message.sobject.BillingCountry}`, 'font-weight: bold;', 'font-weight: bold;');
    console.log('%cPayload: ' + `%c${JSON.stringify(message)}`, 'font-weight: bold;', 'font-weight: bold;');
    console.table(message.sobject);
  });
});
