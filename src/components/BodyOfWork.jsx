import React from 'react';

const projectItems = [
  {
    id: 1,
    image: '/images/original_253036431b75f71e2c963208cdabad35.jpg',
    title: 'Computational Design',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.'
  },
  {
    id: 2,
    image: '/images/original_36fac7ca4b9ec3b9e611e8af47a6432b.gif',
    title: 'Interactive Architecture',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.'
  },
  {
    id: 3,
    image: '/images/original_fa6307f4e5d8decec46751893453a8fc.gif',
    title: 'AI-Driven Design',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.'
  },
  {
    id: 4,
    image: '/images/original_025070e5d893cecc740d90dfec23cf93.gif',
    title: 'Generative Systems',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.'
  },
  {
    id: 5,
    image: '/images/original_253036431b75f71e2c963208cdabad35.jpg',
    title: 'Data Visualization',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.'
  },
  {
    id: 6,
    image: '/images/original_36fac7ca4b9ec3b9e611e8af47a6432b.gif',
    title: 'Digital Fabrication',
    description: 'Body text for whatever you\'d like to say. Add main takeaway points, quotes, anecdotes, or even a very short story.'
  }
];

function BodyOfWork() {
  return (
    <section id="body-of-work">
      <h2>Projects</h2>
      <div className="project-grid">
        {projectItems.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-image">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="project-content">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BodyOfWork; 