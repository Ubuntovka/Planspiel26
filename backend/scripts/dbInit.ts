import mongoose from 'mongoose';
import config from '../config/config';
import User from '../models/User';
import Diagram from '../models/Diagram';

// -------------------------------
// Database setup script (seed)
// -------------------------------
async function setupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Clean previous data (optional)
    await User.deleteMany({});
    await Diagram.deleteMany({});

    // Create a sample user
    const user = await User.create({
      username: 'student123',
      firstName: 'Maria',
      lastName: 'Ivanova',
      email: 'maria@example.com',
      password: 'SuperSecurePass1',
      pictureUrl: 'https://example.com/pic.jpg',
      preferredLanguage: 'en',
      isDeleted: false,
    });

    // Create a sample diagram linked to that user
    await Diagram.create({
      userId: user._id,
      objects: [
        { key: 'Key 1', value: 'Value 1' },
        { key: 'Key 2', value: 'Value 2' },
      ],
      connections: [{ key: 'StartToEnd', value: 'Connection between nodes' }],
    });

    console.log('Collections created and sample data inserted!');
  } catch (err) {
    console.error('Setup failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected. Setup complete.');
  }
}

setupDatabase();
