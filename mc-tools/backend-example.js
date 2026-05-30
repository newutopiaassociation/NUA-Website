/**
 * backend-example.js
 * 
 * Example of how to verify Firebase Authentication tokens on a Node.js backend using Express.
 * 
 * Pre-requisites:
 * 1. npm install express cors firebase-admin
 * 2. Generate a Service Account Key from Firebase Console (Project Settings -> Service Accounts -> Generate new private key).
 * 3. Save the JSON file as `serviceAccountKey.json` in the same directory as this file.
 */

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors()); // Allow cross-origin requests
app.use(express.json());

/**
 * Middleware to verify Firebase JWT Token
 */
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        // Verify the ID token using the Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        
        // Attach the decoded token (user info) to the request object for use in downstream routes
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
    }
};

/**
 * Protected Route Example
 * Only accessible if verifyToken middleware succeeds.
 */
app.get('/api/protected-data', verifyToken, (req, res) => {
    // req.user contains { uid, email, name, picture, ... }
    res.json({
        message: 'This is protected data!',
        user: {
            uid: req.user.uid,
            email: req.user.email
        }
    });
});

/**
 * Start the Server
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
