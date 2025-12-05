const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Load .env by default

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Error: GEMINI_API_KEY not found in environment variables.');
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // Note: listModels is on the GoogleGenerativeAI instance or via a specific manager depending on SDK version.
        // In @google/generative-ai ^0.24.1, it might be different. 
        // Actually, for the client SDK, we might not have a direct listModels method exposed easily on the main class 
        // in the same way as the server SDK. 
        // Let's check the docs or try a standard approach.
        // The error message said: "Call ListModels to see the list of available models"
        // Usually this is done via a ModelManager or similar if using the server SDK, 
        // but this package is @google/generative-ai.

        // Attempting to use the model manager if it exists, or just a raw fetch if needed.
        // But wait, the error message came from the API itself.

        // Let's try to just instantiate a few common ones and see if they error, 
        // OR use the proper list models endpoint if accessible.
        // The SDK might not expose listModels directly in the simplified client.

        // Actually, let's try to fetch it via REST if the SDK doesn't make it obvious, 
        // but let's try the SDK first. 
        // Looking at recent docs, it might be `genAI.getGenerativeModel({ model: ... })` doesn't list.

        // Let's try a direct fetch to the API endpoint using the key.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${await response.text()}`);
        }
        const data = await response.json();
        console.log('Available Models:');
        if (data.models) {
            data.models.forEach(m => {
                console.log(`- ${m.name} (${m.displayName}) - Supported methods: ${m.supportedGenerationMethods}`);
            });
        } else {
            console.log('No models found in response:', data);
        }

    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
