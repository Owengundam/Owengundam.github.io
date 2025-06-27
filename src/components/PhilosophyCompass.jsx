import React, { useState, useRef } from 'react';

function PhilosophyCompass() {
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Center position (0-100%)
  const [timeline, setTimeline] = useState(1970); // Current year
  const [isDragging, setIsDragging] = useState(false);
  const [isTimelineDragging, setIsTimelineDragging] = useState(false);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const compassRef = useRef(null);
  const timelineRef = useRef(null);

  // Handle mouse/touch events for dragging
  const handleMouseDown = (e) => {
    // If the click is on the timeline, ignore it and let the timeline handlers take over.
    if (e.target.closest('.timeline-container')) {
      return;
    }
    setIsDragging(true);
    updatePosition(e);
  };

  const handleTouchStart = (e) => {
    // If the touch is on the timeline, ignore it and let the timeline handlers take over.
    if (e.target.closest('.timeline-container')) {
      return;
    }
    setIsDragging(true);
    updatePosition(e.touches[0]);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updatePosition(e);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent scrolling while dragging
    updatePosition(e.touches[0]);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsTimelineDragging(false);
  };

  const updatePosition = (e) => {
    if (!compassRef.current) return;
    
    const rect = compassRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    
    setPosition({ x, y });
  };

  // Timeline dragging handlers
  const handleTimelineMouseDown = (e) => {
    setIsTimelineDragging(true);
    updateTimeline(e);
  };

  const handleTimelineTouchStart = (e) => {
    setIsTimelineDragging(true);
    updateTimeline(e.touches[0]);
  };

  const handleTimelineMouseMove = (e) => {
    if (!isTimelineDragging) return;
    updateTimeline(e);
  };

  const handleTimelineTouchMove = (e) => {
    if (!isTimelineDragging) return;
    e.preventDefault(); // Prevent scrolling while dragging
    updateTimeline(e.touches[0]);
  };

  const updateTimeline = (e) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    
    // Convert to year (1900-2020 range)
    const year = Math.round(1900 + (100 - y) * 1.2); // Invert Y and scale to 120 years
    setTimeline(Math.max(1900, Math.min(2020, year)));
  };

  // Convert position to design philosophy coordinates
  const getPhilosophyPosition = () => {
    const formalistToContextualist = position.x; // 0 = Formalist, 100 = Contextualist
    const systematicToIntuitive = 100 - position.y; // 0 = systematic, 100 = Intuitive
    
    return {
      horizontal: formalistToContextualist > 50 ? 'Contextualist' : 'Formalist',
      vertical: systematicToIntuitive < 50 ? 'Intuitive' : 'systematic',
      horizontalStrength: Math.abs(formalistToContextualist - 50) * 2,
      verticalStrength: Math.abs(systematicToIntuitive - 50) * 2
    };
  };

  // Simulate LLM API call (you'll replace this with actual API)
  const findDesignerQuote = async () => {
    setLoading(true);
    setQuote(null);

    const philosophy = getPhilosophyPosition();
    const decade = Math.floor(timeline / 10) * 10;

    // TODO: Move API Key to a secure environment variable (e.g., .env file)
    const apiKey = import.meta.env.VITE_DIFY_API_KEY;
    const apiUrl = 'https://api.dify.ai/v1/chat-messages';

    // Debug logging
    console.log('API Key:', apiKey ? 'Present' : 'Missing');
    console.log('Philosophy:', philosophy);
    console.log('Decade:', decade);

    if (!apiKey) {
      setQuote({
        designer: 'Configuration Error',
        quote: 'API key is missing. Please check your .env.local file.',
        context: 'Make sure VITE_DIFY_API_KEY is set in your .env.local file and restart the dev server.',
      });
      setLoading(false);
      return;
    }

    // Calculate the target birth year range for the LLM
    const birthYearEnd = decade - 30;
    const birthYearStart = decade - 65;

    const prompt = `
You are an expert on design philosophy. Your task is to find a prominent designer (e.g., architect, product designer or UI/web designer) who fits a specific profile and was active in a specific era.

**CRITICAL INSTRUCTIONS:**
1.  **Philosophical Profile:** The person must embody "${philosophy.horizontal}" and "${philosophy.vertical}" thinking.
2.  **Active Period:** The person must have been between 30 and 65 years old during the ${decade}s. This means their birth year must be strictly between ${birthYearStart} and ${birthYearEnd}.
3.  **Output Format:** You MUST provide the answer as a single, raw JSON object. Do not include any text, markdown, or explanations before or after the JSON.

The JSON object must have these exact keys:
- "designer": The full name of the person.
- "quote": A short, impactful quote from them related to their design philosophy.
- "context": A brief description. Start the sentence with "Born in [year]," and then provide a one-sentence explanation of how they fit the specified philosophical profile.
    `;

    console.log('Making API request to:', apiUrl);
    console.log('Request payload:', {
      inputs: {},
      query: prompt,
      response_mode: 'blocking',
      user: 'philosophy-compass-user',
    });

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {},
          query: prompt,
          response_mode: 'blocking', // 'blocking' for a single response, 'streaming' for chunks
          user: 'philosophy-compass-user', // A unique identifier for the end-user
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      const content = result.answer;

      // The LLM should return a JSON string. We need to parse it.
      try {
        const parsedContent = JSON.parse(content);
        setQuote(parsedContent);
      } catch (e) {
        console.error("Failed to parse LLM response JSON:", e);
        console.log("Raw content:", content);
        // Fallback for when the LLM doesn't return perfect JSON
        setQuote({
          designer: "Response Error",
          quote: "The model returned a response that was not valid JSON. Please check the console.",
          context: content, // Show the raw response for debugging
        });
      }

    } catch (error) {
      console.error('Error fetching from Dify API:', error);
      setQuote({
        designer: 'API Error',
        quote: 'Could not fetch data from the design philosopher oracle.',
        context: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Add global listeners for dragging events
  React.useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging) return;
      // Use the correct event data for mouse vs. touch
      const moveEvent = e.touches ? e.touches[0] : e;
      updatePosition(moveEvent);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      handleMove(e);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  React.useEffect(() => {
    const handleTimelineMove = (e) => {
      if (!isTimelineDragging) return;
      const moveEvent = e.touches ? e.touches[0] : e;
      updateTimeline(moveEvent);
    };

    const handleTimelineTouchMove = (e) => {
      if (!isTimelineDragging) return;
      e.preventDefault();
      handleTimelineMove(e);
    };

    if (isTimelineDragging) {
      document.addEventListener('mousemove', handleTimelineMove);
      document.addEventListener('touchmove', handleTimelineTouchMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleTimelineMove);
      document.removeEventListener('touchmove', handleTimelineTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isTimelineDragging]);

  // Generate timeline decade markers
  const generateTimelineMarkers = () => {
    const markers = [];
    for (let year = 1900; year <= 2020; year += 10) {
      const position = ((year - 1900) / 120) * 100; // 120 years total
      markers.push({
        year,
        position: 100 - position // Invert for top-to-bottom
      });
    }
    return markers;
  };

  const timelineMarkers = generateTimelineMarkers();
  const currentTimelinePosition = 100 - ((timeline - 1900) / 120) * 100;

  // Convert timeline year to decade display
  const getDecadeDisplay = (year) => {
    const decade = Math.floor(year / 10) * 10;
    return `${decade}s`;
  };

  const philosophy = getPhilosophyPosition();

  return (
    <section id="philosophy-compass">
      <h2>Design Philosophy Compass</h2>
      <p className="compass-description">
        Standing on the shoulders of giants - drag the point to discover the design thinkers who shaped our world.
      </p>
      
      <div className="compass-container">
        <div className="compass-and-timeline">
          <div 
            className="compass-grid"
            ref={compassRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleMouseUp}
          >
            {/* Axis Labels */}
            <div className="axis-label axis-top">systematic</div>
            <div className="axis-label axis-bottom">Intuitive</div>
            <div className="axis-label axis-left">Formalist</div>
            <div className="axis-label axis-right">Contextualist</div>
            
            {/* Grid Lines */}
            <div className="grid-lines">
              <div className="grid-line horizontal" style={{ top: '50%' }}></div>
              <div className="grid-line vertical" style={{ left: '50%' }}></div>
            </div>
            
            {/* Draggable Point */}
            <div 
              className="compass-point"
              style={{ 
                left: `${position.x}%`, 
                top: `${position.y}%`,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              <div className="point-inner"></div>
            </div>

            {/* Timeline Component - MOVED BACK INSIDE */}
            <div className="timeline-container">
              {/* Triangle Pointer */}
              <div 
                className="timeline-pointer"
                style={{ top: `${currentTimelinePosition}%` }}
              >
                <div className="triangle-icon"></div>
              </div>
              
              {/* Timeline Track */}
              <div 
                className="timeline-track"
                ref={timelineRef}
                onMouseDown={handleTimelineMouseDown}
                onTouchStart={handleTimelineTouchStart}
              >
                {/* Timeline Markers */}
                {timelineMarkers.map((marker) => (
                  <div 
                    key={marker.year}
                    className="timeline-marker"
                    style={{ top: `${marker.position}%` }}
                  >
                    <div className="marker-tick"></div>
                    <div className="marker-label">{marker.year}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Current Position Display */}
        <div className="position-display">
          <p>
            <strong>Current Position:</strong> {Math.round(philosophy.horizontalStrength)}% {philosophy.horizontal}, {Math.round(philosophy.verticalStrength)}% {philosophy.vertical}
          </p>
          <p>
            <strong>Timeline:</strong> {getDecadeDisplay(timeline)}
          </p>
          <button 
            className="find-quote-btn"
            onClick={findDesignerQuote}
            disabled={loading}
          >
            {loading ? 'Searching for Giants...' : 'Find Your Giant'}
          </button>
        </div>
      </div>
      
      {/* Quote Display */}
      {quote && (
        <div className="quote-display">
          <div className="quote-content">
            <blockquote>
              "{quote.quote}"
            </blockquote>
            <cite>— {quote.designer}</cite>
            <p className="quote-context">{quote.context}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default PhilosophyCompass; 