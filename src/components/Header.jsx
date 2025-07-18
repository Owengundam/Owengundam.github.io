import React, { useState } from 'react';

function Header() {
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const aboutText = "Haiming Wang is a computational designer based in Los Angeles, operating in the realms of artificial intelligence, art, and architecture. His work includes chatMASS, an AI architectural massing ideator and exporter built in a game engine to empower architects to iterate on massing fast and intelligently; 3‑D‑printed pieces generated with AI and refined through down‑support techniques; a voxel‑based agentic architectural system written in JavaScript; and more. But the point isn't the technology or the technical details—it's just interesting to step into the uncharted and unearth the next nice thing.";

  return (
    <header className="main-header">
      <div className="header-left">
        <h1 className="site-title">W. Haiming</h1>
      </div>
      
      <div className="header-right">
        <div 
          className="nav-item"
          onMouseEnter={() => setShowAbout(true)}
          onMouseLeave={() => setShowAbout(false)}
        >
          <button className="nav-button">About</button>
          {showAbout && (
            <div className="popup about-popup">
              <p>{aboutText}</p>
            </div>
          )}
        </div>

        <div 
          className="nav-item"
          onMouseEnter={() => setShowContact(true)}
          onMouseLeave={() => setShowContact(false)}
        >
          <button className="nav-button">Contact</button>
          {showContact && (
            <div className="popup contact-popup">
              <p>Get in touch: <a href="mailto:owewhm@gmail.com">owewhm@gmail.com</a></p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header; 