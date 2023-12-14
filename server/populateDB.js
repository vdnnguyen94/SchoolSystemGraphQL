import mongoose from 'mongoose';
import ObjectModel from './models/objectModel.js';

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/SurveyApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Event listener for successful connection
db.once('open', async () => {
  console.log('Connected to the database');

  // Sample data to insert
  const sampleObjects = [
    { name: 'Object 1', description: 'Description for Object 1' },
    { name: 'Object 2', description: 'Description for Object 2' },
    // Add more objects as needed
  ];

  try {
    // Insert the sample data into the database
    await ObjectModel.insertMany(sampleObjects);
    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  } finally {
    // Close the database connection
    db.close();
  }
});