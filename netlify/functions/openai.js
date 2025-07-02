// /.netlify/functions/openai.js
// A Netlify serverless function that uses OpenAI's web search capabilities
// to find design philosophers based on user's compass position and timeline.

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

  // Extract the query from the payload
  const { query } = payload;

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing "query" field in request body' }),
    };
  }

  // Retrieve the OpenAI API key securely from environment variables
  const apiKey = process.env.OPENAI_API_KEY;

  // Debug logging for environment variables
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('API')));
  console.log('OPENAI_API_KEY exists:', !!apiKey);
  console.log('OPENAI_API_KEY length:', apiKey ? apiKey.length : 0);

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OpenAI API key not configured on the server' }),
    };
  }

  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  try {
    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-search-preview',
        web_search_options: {},
        messages: [
          {
            role: 'user',
            content: query
          }
        ]
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('OpenAI API Error:', errorText);
      return {
        statusCode: apiResponse.status,
        body: JSON.stringify({ 
          error: 'OpenAI API Error',
          message: `API returned ${apiResponse.status}: ${errorText}`
        }),
      };
    }

    const result = await apiResponse.json();

    // Extract the content from OpenAI's response format
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      return {
        statusCode: 502,
        body: JSON.stringify({ 
          error: 'Invalid response format',
          message: 'OpenAI API returned unexpected response structure'
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ answer: content }),
    };

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out after 8 seconds');
      return {
        statusCode: 408,
        body: JSON.stringify({ 
          error: 'Request timeout', 
          message: 'The AI service is taking too long to respond. Please try again.' 
        }),
      };
    }
    
    console.error('Error communicating with OpenAI API:', error);
    return {
      statusCode: 502,
      body: JSON.stringify({ 
        error: 'Failed to fetch from OpenAI API',
        message: error.message 
      }),
    };
  }
} 