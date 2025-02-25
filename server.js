import config from './config/config.js';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { expressjwt } from "express-jwt";
import schema from './server/graphql/schema.js'; 

// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'SchoolSystem'
})
  .then(() => {
    console.log("Connected to MongoDB:", config.mongoUri);
  })
  .catch(err => {
    console.error("ERROR---- MongoDB connection error:", err);
  });

mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database: ${config.mongoUri}`);
});

// Initialize Express App
const app = express();
app.use(cors());
app.use(express.json());

// JWT Middleware - Protect GraphQL API
app.use(
  expressjwt({
    secret: config.jwtSecret,
    algorithms: ["HS256"],
    credentialsRequired: false // Allow unauthenticated users
  })
);


// Start Apollo Server
const server = new ApolloServer({ schema });
await server.start();

// Apply Apollo GraphQL middleware
app.use('/graphql', expressMiddleware(server));

// Start Express Server
app.listen(config.port, () => {
  console.info(`Server running on http://localhost:${config.port}/graphql`);
});



// import config from './config/config.js' 
// import app from './server/express.js'
// import mongoose from 'mongoose' 
// mongoose.Promise = global.Promise
// mongoose.connect(config.mongoUri, { useNewUrlParser: true,
// //useCreateIndex: true, 
// useUnifiedTopology: true,
// dbName: 'SchoolSystem' } )

//  .then(() => {
// console.log("Connected to the database!");
// console.log(config.mongoUri);
// })

// mongoose.connection.on('error', () => {
// throw new Error(`unable to connect to database: ${config.mongoUri}`) 
// })

// app.listen(config.port, (err) => { 
// if (err) {
// console.log(err) 
// }
// console.info('Server started on port %s.', config.port) 
// })