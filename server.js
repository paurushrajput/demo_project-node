const express = require('express');
const app = express();
var cors = require('cors')
const mongoose = require('mongoose');
app.use(cors())
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(`mongodb://127.0.0.1:27017/DemoProject`, { useNewUrlParser: true }, (err, result) => {
  if (err) {
    console.log("Error in connecting with database")
  }
  else {
    console.log('Mongoose connecting is setup successfully')
  }
});
const userRoute = require('./userRoutes/userRoutes')
app.use('/api/v1/user', userRoute)


//==========================Request Console=======================//
app.all("*", (req, resp, next) => {
  let obj = {
    Host: req.headers.host,
    ContentType: req.headers['content-type'],
    Url: req.originalUrl,
    Method: req.method,
    Query: req.query,
    Body: req.body,
    Parmas: req.params[0]
  }
  console.log("Common Request is===========>", [obj])
  next();
});

const port=3001
app.listen(port, () => {
  console.log(`Your Project is  listening on port ${port}`);
})
