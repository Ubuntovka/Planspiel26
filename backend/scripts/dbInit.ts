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
      name: 'Sample Diagram',
      nodes: [
        { id: 'n1', type: 'processUnitNode', position: { x: 0, y: 0 }, data: { label: 'Process Unit' } },
        { id: 'n2', type: 'dataProviderNode', position: { x: 150, y: 0 }, data: { label: 'Data Provider' } },
      ],
      edges: [{ id: 'e1', source: 'n1', target: 'n2', type: 'step' }],
      viewport: { x: 0, y: 0, zoom: 1 },
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
