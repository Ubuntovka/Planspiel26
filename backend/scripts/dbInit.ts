import mongoose, { Document, Schema } from "mongoose";
import config from "../config/config";


// -------------------------------
// 1. User schema
// -------------------------------
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^.+@.+\..+$/
    },
    pictureUrl: { type: String, default: null },
    lastLoginDate: { type: Date, default: null },
    createdDate: { type: Date, default: Date.now },
    preferredLanguage: { type: String, default: "en" },
    isDeleted: { type: Boolean, default: false },

    // --- Two-Factor Authentication Fields ---
    isTwoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, default: null }, // store TOTP secret
    twoFactorVerified: { type: Boolean, default: false }
});

const User = mongoose.model("User", userSchema);

// -------------------------------
// 2. Diagram schema
// -------------------------------

export interface IDiagram extends Document {
    userId: mongoose.Types.ObjectId;
    objects: any[];
    connections: any[];
}

const diagramSchema = new Schema<IDiagram>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    objects: [{ type: Schema.Types.Mixed }],      // allows any JSON
    connections: [{ type: Schema.Types.Mixed }]   // allows any JSON
});

export const Diagram = mongoose.model<IDiagram>("Diagram", diagramSchema);

// -------------------------------
// 3. Database setup script
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
            username: "student123",
            firstName: "Maria",
            lastName: "Ivanova",
            email: "maria@example.com",
            pictureUrl: "https://example.com/pic.jpg",
            preferredLanguage: "en",
            isDeleted: false
        });

        // Create a sample diagram linked to that user
        await Diagram.create({
            userId: user._id,
            objects: [
                { key: "Key 1", value: "Value 1" },
                { key: "Key 1", value: "Value 1" }
            ],
            connections: [
                { key: "StartToEnd", value: "Connection between nodes" }
            ]
        });

        console.log("Collections created and sample data inserted!");
    } catch (err) {
        console.error("Setup failed:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected. Setup complete.");
    }
}

setupDatabase();
