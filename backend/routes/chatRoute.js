const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize Gemini with API key from environment
// Make sure to add GEMINI_API_KEY to your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_KEY');

// This is the "Knowledge Base" for your website
// TODO: Replace this with the actual text or video transcripts from your website
const WEBSITE_CONTEXT = `
You are the Aerozone Virtual Assistant, an AI expert strictly focused on the Aerozone website and its contents.
Your sole purpose is to answer user questions based ONLY on the following context.
If a user asks a question that is NOT related to the context below, you must politely decline to answer, stating that you can only answer questions related to Aerozone.

Context Information:
Aerozone is a powerful full-stack web application designed for comprehensive data analysis, supply chain management, and real-time visualization. 

Key Pages and Features:
1. Planner Checker (/planner-checker): A comprehensive dashboard for supply chain planners. It allows users to upload Excel files to update inventory and order data. Features include:
   - Tracking "Raw Materials" (RM) and "Business Operations Index" (BOI) items and suppliers.
   - Donut charts showing "Planned Orders" (completed vs pending) and "Order Status".
   - Filtering data by Project Code, Item Code, Description, and Reference B.
   - Detailed Data Tables and "Item Insights" popups.
   - A Prism data integration showing Differences between RequiredQty and OrderedQty.
2. Main Chart (/main-chart): The primary dashboard for high-level interactive data visualizations using tools like Highcharts and Chart.js.
3. PDF to JSON (/pdf-to-json): A utility page that parses uploaded PDF documents and converts their structured data into JSON format for the system to process.
4. Prism (/prism) & Orbit (/orbit): Advanced analytical views for comparing internal and supplier metrics.
5. Analysis (/analysis): Multiple pages (Aggregated, Analysis 3) for deep-diving into historical trends and predictive charts.
6. Technology Stack: React, Vite, Tailwind CSS (Frontend); Node.js, Express, Firebase Firestore (Backend/Database). Hosted on Netlify.

If you don't know the answer based on the context, say "I'm sorry, I don't have information about that in my current knowledge base."
`;

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in the backend' });
    }

    // Using gemini-2.5-flash as it's fast and cost-effective
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: WEBSITE_CONTEXT,
    });

    // Start a chat session, initializing it with previous history if any
    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({ reply: responseText });
  } catch (error) {
    console.error('Error generating chat response:', error);
    res.status(500).json({ error: 'Failed to generate response. Please try again later.' });
  }
});

module.exports = router;
