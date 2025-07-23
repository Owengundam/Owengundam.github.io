import React, { useState, useRef } from 'react';

function ProjectGrid() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const projects = [
    {
      id: 'p1',
      title: 'chatMASS',
      name: 'chatMASS',
      description: 'AI architectural massing ideator',
      thumbnail: '/images/1.gif'
    },
    {
      id: 'p2', 
      title: 'AI Figurative',
      name: '3D Printed AI',
      description: '3D-printed pieces generated with AI',
      thumbnail: '/images/2.gif'
    },
    {
      id: 'p3',
      title: 'AltaSea', 
      name: 'Voxel System',
      description: 'Voxel-based agentic architectural system',
      thumbnail: '/images/3.jpg'
    },
    {
      id: 'p4',
      title: 'Web LLMs',
      name: 'Future Project',
      description: 'Next exploration in computational design',
      thumbnail: '/images/4.gif'
    }
  ];

  const handleProjectClick = (projectId) => {
    // Navigate to project page - placeholder for now
    console.log(`Navigate to project: ${projectId}`);
    // In the future: window.location.href = `/projects/${projectId}`;
  };

  const handleMouseEnter = (projectId) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredProject(projectId);
  };

  const handleMouseLeave = () => {
    // Set a delay before collapsing
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredProject(null);
    }, 300); // 300ms delay
  };

  const handleDropdownClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="project-grid">
      {projects.map((project) => (
        <div
          key={project.id}
          className={`project-button${project.id === 'p1' ? ' p1-highlight' : ''} ${hoveredProject === project.id ? 'expanded' : ''}`}
          onMouseEnter={() => handleMouseEnter(project.id)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleProjectClick(project.id)}
        >
          <div className="project-title">
            {project.title}
          </div>
          
          {/* Regular project preview for non-Web LLMs projects */}
          {hoveredProject === project.id && project.id !== 'p4' && (
            <div className="project-preview">
              <img 
                src={project.thumbnail} 
                alt={project.name}
                className="project-thumbnail"
              />
              <div className="project-info">
                <p>{project.description}</p>
              </div>
            </div>
          )}
          
          {/* Special dropdown for Web LLMs project */}
          {hoveredProject === project.id && project.id === 'p4' && (
            <div className="webllm-dropdown">
              <button 
                className="dropdown-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownClick('https://orbchat.netlify.app/');
                }}
              >
                OrbChat
              </button>
              <button 
                className="dropdown-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownClick('https://designercompass.netlify.app');
                }}
              >
                Designer Compass
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProjectGrid; 