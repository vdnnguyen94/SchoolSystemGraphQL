import config from './config/config.js';
import mongoose from 'mongoose';
import configureExpress from './server/express.js';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { expressjwt } from "express-jwt";
import schema from './server/graphql/schema.js'; 

// Connect to MongoDB
mongoose.connect(config.mongoUri, { dbName: 'SchoolSystem' })
  .then(() => {
    console.log("SUCCESS Connected to MongoDB:", config.mongoUri);
    console.log("Using Database:", mongoose.connection.db.databaseName); // Logs the database name
  })
  .catch(err => {
    console.error("ERROR MongoDB connection error:", err);
  });

mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database: ${config.mongoUri}`);
});

// Initialize Express App
const app = configureExpress();


// Add a middleware for checking JWT and making user info available in the context
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      req.user = jwt.verify(token, config.jwtSecret);
    } catch (e) {
      req.user = null; // Invalid token
    }
  }
  next();
});


// Start Apollo Server
const server = new ApolloServer({
  schema, 
  introspection: true, 
  context: ({ req }) => ({ user: req.user }) // Pass user info to GraphQL context
});
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