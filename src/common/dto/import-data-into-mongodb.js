const fs = require('fs');
const { MongoClient } = require('mongodb');

// MongoDB connection URI (use your MongoDB connection string)
const mongoUri = process.env.MONGODB_URI;
const dbName = 'golden-owl-internship-testing'; // Database name
const collectionName = 'scores'; // Collection name

// Path to the JSON file
const jsonFilePath = './output.json'; // Replace with your actual path

async function importJsonToMongo() {
  const client = new MongoClient(mongoUri);

  try {
    // Read the JSON file
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const data = JSON.parse(jsonData); // Parse JSON data into an array

    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Get the database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert data into the collection
    const result = await collection.insertMany(data);
    console.log(`Inserted ${result.insertedCount} documents into the collection`);

  } catch (err) {
    console.error('Error importing JSON into MongoDB:', err);
  } finally {
    // Close the MongoDB client connection
    await client.close();
  }
}

// Call the function to import the JSON into MongoDB
importJsonToMongo();
