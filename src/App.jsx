import React from 'react';
import Header from './components/Header';
import Bio from './components/Bio';
import Projects from './components/Projects';
import InterestsTools from './components/InterestsTools';
import Footer from './components/Footer';

function App() {
  return (
    <div className="container">
      <Header />
      <Bio />
      <Projects />
      <InterestsTools />
      <Footer />
    </div>
  );
}

export default App; 