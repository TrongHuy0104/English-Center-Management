const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const dbConnectionString = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(dbConnectionString).then(() => {
  console.log('DB access successful');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, (req, res) => {
  console.log(`Server running at port http://localhost:${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});