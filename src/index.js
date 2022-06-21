import express from 'express';
import 'dotenv/config';
import AuthRoutes from './routes';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = new express();
const hostname = process.env.HOSTNAME;
const port = process.env.PORT || 3000;

const uri = process.env.URI;

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  // handle OPTIONS method
  if ('OPTIONS' == req.method) {
    return res.sendStatus(200);
  } else {
    next();
  }
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

try {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
} catch (error) {
  console.log('Error: ' + error);
}

app.get('/', (req, res) => {
  res.send('OK!');
});

AuthRoutes(app);

app.listen(port, () =>
  console.log(`The server running http://${hostname}:${port}`)
);
