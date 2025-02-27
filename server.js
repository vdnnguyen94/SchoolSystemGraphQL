import config from './config/config.js';
import mongoose from 'mongoose';
import configureExpress from './server/express.js';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { expressjwt } from "express-jwt";
import schema from './server/graphql/schema.js'; 
import jwt from "jsonwebtoken";
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
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));

// Add a middleware for checking JWT and making user info available in the context
app.use((req, res, next) => {
  // console.log("Debug: Cookies received:", req.cookies); 
  // console.log("Debug: Cookies School System:", req.cookies.SchoolSystem); 
  const token = req.cookies[config.jwtSecret];
  if (token) {
    // console.log("Secret: ", config.jwtSecret);
    try {
      req.user = jwt.verify(token, config.jwtSecret);
      // console.log("Debug: Token is valid, user:", req.user);
    } catch (e) {
      req.user = null; // Invalid token
      //console.log("Debug: Invalid token");
    }
  }else {
    //console.log("Debug: No token found in cookies");
  }
  next();
});


// Start Apollo Server
const server = new ApolloServer({
  schema, 
  introspection: true, 
  context: ({ req, res }) => ({ req, res, user: req.user  }) // Pass user info to GraphQL context
});
await server.start();

// Apply Apollo GraphQL middleware
app.use(
  '/graphql',
  cors({
    origin: ['http://localhost:5173', 'http://www.localhost:5173'], // Allow both variations
    credentials: true,
  }),

  expressMiddleware(server, { 
    context: async ({ req, res }) => ({ req, res, user: req.user || null })
  })
);

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