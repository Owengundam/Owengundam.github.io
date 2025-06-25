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
    setIsDragging(true);
    updatePosition(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updatePosition(e);
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

  const handleTimelineMouseMove = (e) => {
    if (!isTimelineDragging) return;
    updateTimeline(e);
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
    const systemicToIntuitive = 100 - position.y; // 0 = Systemic, 100 = Intuitive
    
    return {
      horizontal: formalistToContextualist > 50 ? 'Contextualist' : 'Formalist',
      vertical: systemicToIntuitive > 50 ? 'Intuitive' : 'Systemic',
      horizontalStrength: Math.abs(formalistToContextualist - 50) * 2,
      verticalStrength: Math.abs(systemicToIntuitive - 50) * 2
    };
  };

  // Simulate LLM API call (you'll replace this with actual API)
  const findDesignerQuote = async () => {
    setLoading(true);
    setQuote(null);
    
    const philosophy = getPhilosophyPosition();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response - you'll replace this with actual LLM API call
    const mockQuotes = {
      'Formalist-Systemic': {
        designer: 'Louis Kahn',
        quote: 'Architecture is the thoughtful making of spaces. The continual renewal of architecture comes from changing concepts of space.',
        context: 'Known for systematic formal explorations'
      },
      'Formalist-Intuitive': {
        designer: 'Peter Zumthor',
        quote: 'Architecture is exposed to life. If it is good, it can improve life.',
        context: 'Emphasizes sensory and emotional experience'
      },
      'Contextualist-Systemic': {
        designer: 'Christopher Alexander',
        quote: 'A pattern language gives each person who uses it the power to create an infinite variety of new and unique buildings.',
        context: 'Systematic approach to contextual design'
      },
      'Contextualist-Intuitive': {
        designer: 'Hassan Fathy',
        quote: 'The poor deserve architecture, not poor architecture.',
        context: 'Context-sensitive, community-focused approach'
      }
    };
    
    const key = `${philosophy.horizontal}-${philosophy.vertical}`;
    const selectedQuote = mockQuotes[key] || mockQuotes['Formalist-Systemic'];
    
    setQuote(selectedQuote);
    setLoading(false);
  };

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  React.useEffect(() => {
    if (isTimelineDragging) {
      document.addEventListener('mousemove', handleTimelineMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleTimelineMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
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
        Standing on the shoulders of giants - drag the point to discover the design thinkers who shaped your perspective.
      </p>
      
      <div className="compass-container">
        <div className="compass-and-timeline">
          <div 
            className="compass-grid"
            ref={compassRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
          {/* Axis Labels */}
          <div className="axis-label axis-top">Systemic</div>
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
          </div>
          
          {/* Timeline Component */}
          <div className="timeline-container">
            {/* Triangle Pointer */}
            <div 
              className="timeline-pointer"
              style={{ top: `${currentTimelinePosition}%` }}
            >
              ▶
            </div>
            
            {/* Timeline Track */}
            <div 
              className="timeline-track"
              ref={timelineRef}
              onMouseDown={handleTimelineMouseDown}
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
          <blockquote>
            "{quote.quote}"
          </blockquote>
          <cite>— {quote.designer}</cite>
          <p className="quote-context">{quote.context}</p>
        </div>
      )}
    </section>
  );
}

export default PhilosophyCompass; 