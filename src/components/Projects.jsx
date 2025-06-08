import React, { useState } from 'react';

const projectItems = [
  {
    type: 'image',
    src: '/images/original_253036431b75f71e2c963208cdabad35.jpg',
    alt: 'Project Image 1'
  },
  {
    type: 'image',
    src: '/images/original_36fac7ca4b9ec3b9e611e8af47a6432b.gif',
    alt: 'Project Image 2'
  },
  {
    type: 'image',
    src: '/images/original_fa6307f4e5d8decec46751893453a8fc.gif',
    alt: 'Project Image 3'
  },
  {
    type: 'image',
    src: '/images/original_025070e5d893cecc740d90dfec23cf93.gif',
    alt: 'Project Image 4'
  },
  {
    type: 'video',
    src: '/videos/Screen Recording.mp4',
    alt: 'Project Video'
  }
];

function Projects() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const moveSlide = (direction) => {
    const totalSlides = projectItems.length;
    let newSlide = currentSlide + direction;
    
    if (newSlide >= totalSlides) {
      newSlide = 0;
    }
    if (newSlide < 0) {
      newSlide = totalSlides - 1;
    }
    
    setCurrentSlide(newSlide);
  };

  return (
    <section id="projects">
      <h2>Projects Showcase</h2>
      <div className="carousel-container">
        <div className="carousel-slide" style={{
          transform: `translateX(-${currentSlide * 100}%)`
        }}>
          {projectItems.map((item, index) => (
            <div key={index} className="carousel-item">
              {item.type === 'image' ? (
                <img src={item.src} alt={item.alt} />
              ) : (
                <video controls loop muted>
                  <source src={item.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </div>
        <div className="carousel-nav">
          <button className="prev" onClick={() => moveSlide(-1)}>&#10094;</button>
          <button className="next" onClick={() => moveSlide(1)}>&#10095;</button>
        </div>
      </div>
    </section>
  );
}

export default Projects; 