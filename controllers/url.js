const shortid = require("shortid"); // Correctly import shortid
const URL = require('../models/url'); // Your Mongoose model

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    
    // Check if URL is provided
    if (!body.url) return res.status(400).json({ error: 'URL is required' });

    // Generate a new short ID
    const shortId = shortid.generate(); // Use shortid.generate() to create a unique ID

    // Create a new URL entry in the database
    await URL.create({
        shortId: shortId, // Store the generated shortId
        redirectURL: body.url,
        visitedHistory: [],
    });

    // Return the short URL ID as a response
    return res.json({ id: shortId });
}

module.exports = {
    handleGenerateNewShortURL,
};
