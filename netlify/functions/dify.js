// /.netlify/functions/dify.js
// A Netlify serverless function that proxies requests to the Dify API.
// This keeps the Dify API key securely on the server and prevents it from
// being exposed in the client-side bundle.

exports.handler = async function (event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // Parse the request body
  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON payload' }),
    };
  }

  // The prompt and additional fields are passed through from the client
  const { inputs = {}, query, response_mode = 'blocking', user = 'philosophy-compass-user' } = payload;

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing "query" field in request body' }),
    };
  }

  // Retrieve the API key securely from environment variables (NOT exposed to the client)
  const apiKey = process.env.DIFY_API_KEY || process.env.VITE_DIFY_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured on the server' }),
    };
  }

  const apiUrl = 'https://api.dify.ai/v1/chat-messages';

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs, query, response_mode, user }),
    });

    const text = await apiResponse.text();

    return {
      statusCode: apiResponse.status,
      headers: {
        'Content-Type': 'application/json',
        // Allow CORS for same-origin requests
        'Access-Control-Allow-Origin': '*',
      },
      body: text,
    };
  } catch (error) {
    console.error('Error communicating with Dify API:', error);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Failed to fetch from Dify API' }),
    };
  }
} 